import base64
import logging
import os
import subprocess

import click
from github import Github

from utils import io, rendering, terraform, templating

DOWNLOAD_TMP_DIR = 'tmp/modules'
OUTPUT_DOC_DIR = 'content/modules/catalog'
REPOS_SKIP_LIST = {'terraform-aws-components'}
INDEX_CATEGORY_JSON = '_category_.json'

README_YAML = 'README.yaml'
README_MD = 'README.md'
TMP_MODULES_DIR = 'modules'
DOCS_DIR = 'docs'
IMAGES_DIR = 'images'
SUBMODULES_DIR = 'modules'
TARGETS_MD = 'targets.md'
MODULES_README_TEMPLATE = 'module.readme.md'

SCRIPT_DIR = os.path.dirname(os.path.realpath(__file__))
jenv = templating.init_templating(os.path.join(SCRIPT_DIR, 'templates'))
PROVIDER_INDEX_CATEGORY_TEMPLATE = jenv.get_template('provider_index_category.json')
SUBMODULE_TEMPLATE = jenv.get_template('component.readme.md')


def get_repos(github, skip_repos):
    repos = []

    logging.info("Fetching list of available repos ...")

    for repo in github.get_user().get_repos():
        # if repo.name != 'terraform-aws-ecs-cluster':
        #     continue

        if not terraform.is_valid_module_name(repo.name):
            logging.debug("Module doesn't match terraform matching pattern. Skipping.")
            continue

        if repo.name in skip_repos:
            logging.info(f"Repository '{repo.name}' in skip list. Skipping.")
            continue

        repos.append(repo)

    logging.info(f"Found {len(repos)} valid repositories")

    return repos


def fetch_file(repo, remote_file, output_dir):
    io.create_dirs(os.path.join(output_dir, os.path.dirname(remote_file)))
    content_encoded = repo.get_contents(remote_file, ref=repo.default_branch).content
    content = base64.b64decode(content_encoded)
    output_file = os.path.join(output_dir, remote_file)
    io.save_to_file(output_file, content)
    logging.info(f"Fetched file: {remote_file}")


def fetch_readme_yaml(repo, module_download_dir):
    fetch_file(repo, README_YAML, module_download_dir)


def list_remote_files(repo, remote_dir):
    remote_files = repo.get_contents(remote_dir)

    result = []

    while remote_files:
        remote_file = remote_files.pop(0)

        if remote_file.type == "dir":
            remote_files.extend(repo.get_contents(remote_file.path))
        else:
            result.append(remote_file.path)

    return result


def fetch_docs(repo, module_download_dir):
    remote_files = list_remote_files(repo, DOCS_DIR)

    for remote_file in remote_files:
        if os.path.basename(remote_file) == TARGETS_MD:  # skip targets.md
            continue

        fetch_file(repo, remote_file, module_download_dir)


def fetch_images(repo, module_download_dir):
    remote_files = list_remote_files(repo, IMAGES_DIR)

    for remote_file in remote_files:
        fetch_file(repo, remote_file, module_download_dir)


def fetch_modules(repo, module_download_dir):
    remote_files = list_remote_files(repo, SUBMODULES_DIR)

    for remote_file in remote_files:
        if os.path.basename(remote_file) != README_MD:
            continue

        fetch_file(repo, remote_file, module_download_dir)


def fetch_module(repo, download_dir):
    logging.info(f"Fetching files for: {repo.full_name}")

    module_download_dir = os.path.join(download_dir, repo.name)

    remote_files = set([item.path for item in repo.get_contents("")])

    if README_YAML not in remote_files:
        logging.warning(f"{README_YAML} is missing. Skipping...")
        return False

    fetch_readme_yaml(repo, module_download_dir)

    if DOCS_DIR in remote_files:
        fetch_docs(repo, module_download_dir)

    if IMAGES_DIR in remote_files:
        fetch_images(repo, module_download_dir)

    if SUBMODULES_DIR in remote_files:
        fetch_modules(repo, module_download_dir)

    return True


def render_readme(module_download_dir, module_docs_dir):
    readme_yaml_file = os.path.join(module_download_dir, README_YAML)
    readme_md_file = os.path.join(module_docs_dir, README_MD)
    readme_tmpl_file = os.path.join(SCRIPT_DIR, 'templates', MODULES_README_TEMPLATE)

    io.create_dirs(module_docs_dir)

    subprocess.run(["make", "readme",
                    f"README_TEMPLATE_FILE={readme_tmpl_file}",
                    f"README_FILE={readme_md_file}",
                    f"README_YAML={readme_yaml_file}",
                    f"README_TEMPLATE_YAML={readme_yaml_file}",
                    f"README_INCLUDES={module_download_dir}"])

    logging.info(f"Rendered: {readme_md_file}")


def render_module(repo, download_dir, docs_dir):
    logging.info(f"Rendering doc for: {repo.full_name}")
    module_download_dir = os.path.join(download_dir, repo.name)

    pre_rendering_fixes(repo, module_download_dir)

    provider, module_name = terraform.parse_repo_name(repo.name)
    module_docs_dir = os.path.join(docs_dir, provider, module_name)

    render_readme(module_download_dir, module_docs_dir)

    readme_md_file = os.path.join(module_docs_dir, README_MD)
    post_rendering_fixes(repo, readme_md_file)

    copy_extra_resources_for_docs(module_download_dir, module_docs_dir)
    copy_extra_resources_for_images(module_download_dir, module_docs_dir)
    copy_extra_resources_for_submodules(repo, module_download_dir, module_docs_dir)


def copy_extra_resources_for_docs(module_download_dir, module_docs_dir):
    extra_resources_dir = os.path.join(module_download_dir, DOCS_DIR)
    files = io.get_filenames_in_dir(extra_resources_dir, '*', True)

    for file in files:
        if os.path.basename(file).lower().endswith('.md') or os.path.isdir(file):
            continue

        dest_file = os.path.join(module_docs_dir, DOCS_DIR, os.path.relpath(file, extra_resources_dir))
        io.copy_file(file, dest_file)

        logging.info(f"Copied extra file: {dest_file}")


def copy_extra_resources_for_images(module_download_dir, module_docs_dir):
    extra_resources_dir = os.path.join(module_download_dir, IMAGES_DIR)
    files = io.get_filenames_in_dir(extra_resources_dir, '*', True)

    for file in files:
        if os.path.isdir(file):
            continue

        dest_file = os.path.join(module_docs_dir, IMAGES_DIR, os.path.relpath(file, extra_resources_dir))
        io.copy_file(file, dest_file)
        logging.info(f"Copied extra file: {dest_file}")


def copy_extra_resources_for_submodules(repo, module_download_dir, module_docs_dir):
    extra_resources_dir = os.path.join(module_download_dir, SUBMODULES_DIR)
    files = io.get_filenames_in_dir(extra_resources_dir, '*', True)

    for file in files:
        if not os.path.basename(file).endswith(README_MD):
            continue

        rel_path = os.path.relpath(file, module_download_dir)
        dest_file = os.path.join(module_docs_dir, rel_path)
        submodule_name = os.path.basename(os.path.dirname(dest_file))

        content = SUBMODULE_TEMPLATE.render(label=submodule_name,
                                            title=submodule_name,
                                            description=submodule_name,
                                            github_edit_url=f"https://github.com/{repo.full_name}/edit/{repo.default_branch}/{rel_path}",
                                            content=io.read_file_to_string(file))
        io.create_dirs(os.path.dirname(dest_file))
        io.save_string_to_file(dest_file, content)

        post_rendering_fixes_for_submodule(dest_file)

        logging.info(f"Copied extra file: {dest_file}")


def create_index_for_provider(repo, output_dir):
    provider, module_name = terraform.parse_repo_name(repo.name)
    json_file = os.path.join(output_dir, provider, INDEX_CATEGORY_JSON)

    if not os.path.exists(json_file):
        content = PROVIDER_INDEX_CATEGORY_TEMPLATE.render(label=provider,
                                                          title=provider,
                                                          description=provider)
        io.save_string_to_file(json_file, content)


def pre_rendering_fixes(repo, module_download_dir):
    readme_yaml_file = os.path.join(module_download_dir, README_YAML)
    content = io.read_file_to_string(readme_yaml_file)
    content = rendering.remove_targets_md(content)
    content = rendering.rename_name(repo, content)
    io.save_string_to_file(readme_yaml_file, content)


def post_rendering_fixes(repo, readme_md_file):
    content = io.read_file_to_string(readme_md_file)
    content = rendering.fix_self_non_closing_br_tags(content)
    content = rendering.fix_custom_non_self_closing_tags_in_pre(content)
    content = rendering.fix_github_edit_url(content, repo)
    content = rendering.fix_sidebar_label(content, repo)
    io.save_string_to_file(readme_md_file, content)


def post_rendering_fixes_for_submodule(readme_md_file):
    content = io.read_file_to_string(readme_md_file)
    content = rendering.fix_self_non_closing_br_tags(content)
    content = rendering.fix_custom_non_self_closing_tags_in_pre(content)
    io.save_string_to_file(readme_md_file, content)


def init_github_client(github_api_token):
    return Github(github_api_token)


def main(github_api_token, output_dir, download_dir, repos_to_skip):
    github = init_github_client(github_api_token)
    skip_repos = set([skip.strip() for skip in repos_to_skip.split(",")])
    repos = get_repos(github, skip_repos)

    for repo in repos:
        fetched = fetch_module(repo, download_dir)
        if fetched:
            render_module(repo, download_dir, output_dir)
            create_index_for_provider(repo, output_dir)


@click.command()
@click.option('--github-api-token', envvar='PUBLIC_REPO_ACCESS_TOKEN', required=True, help="Github API token")
@click.option('--output-dir', default=OUTPUT_DOC_DIR, required=False, help="Rendered component output dir")
@click.option('--download-dir', default=DOWNLOAD_TMP_DIR, required=False, help="Temporary output dir")
@click.option('--repos-to-skip', default='terraform-aws-components', required=False,
              help="CSV list of repos to skip")
@click.option('--log-level', default='INFO', required=False, help="Log level. Available options")
def cli_main(github_api_token, output_dir, download_dir, repos_to_skip, log_level):
    logging.basicConfig(format='[%(asctime)s] %(levelname)s %(message)s',
                        datefmt='%d-%m-%Y %H:%M:%S',
                        level=logging.getLevelName(log_level))

    logging.info(f"Tmp dir: {download_dir}, components dir: {output_dir}")

    main(github_api_token, output_dir, download_dir, repos_to_skip)


if __name__ == "__main__":
    cli_main()
