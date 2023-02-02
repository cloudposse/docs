import base64
import logging
import os
import re
import subprocess
from shutil import copytree, ignore_patterns

import click
from github import Github

from utils import io, rendering

DOWNLOAD_TMP_DIR = 'tmp/modules'
OUTPUT_DOC_DIR = 'content/modules/catalog'
REPOS_SKIP_LIST = {'terraform-aws-components'}

README_YAML = 'README.yaml'
README_MD = 'README.md'
EXTRA_FOLDERS = {'docs', 'images', 'modules'}
TMP_MODULES_DIR = 'modules'
TERRAFORM_MODULE_NAME_PATTERN = re.compile("^terraform-[a-zA-Z0-9]+-.*")  # convention is terraform-<PROVIDER>-<NAME>


def get_repos(github, skip_repos):
    repos = []

    logging.info("Fetching list of available repos ...")

    for repo in github.get_user().get_repos():
        # if repo.name != 'terraform-aws-api-gateway':
        #     continue

        if not is_valid_module_name(repo.name):
            logging.debug("Module doesn't match terraform matching pattern. Skipping.")
            continue

        if repo.name in skip_repos:
            logging.info(f"Repository '{repo.name}' in skip list. Skipping.")

        repos.append(repo)

    logging.info(f"Found {len(repos)} valid repositories")

    return repos


def is_valid_module_name(name):
    return TERRAFORM_MODULE_NAME_PATTERN.match(name)


def download_file(repo, filename, output_dir):
    io.create_dirs(os.path.join(output_dir, os.path.dirname(filename)))
    content_encoded = repo.get_contents(filename, ref=repo.default_branch).content
    content = base64.b64decode(content_encoded)
    output_file = os.path.join(output_dir, filename)
    io.save_to_file(output_file, content)


def fetch_module(repo, download_dir):
    logging.info(f"Fetching files for: '{repo.full_name}'")

    available_files = set([item.path for item in repo.get_contents("")])

    if README_YAML not in available_files:
        logging.warning(f"{README_YAML} is missing. Skipping... '{repo.full_name}'")
        return False

    module_dir = os.path.join(download_dir, repo.name)

    download_file(repo, README_YAML, module_dir)

    for extra_folder in EXTRA_FOLDERS:
        if extra_folder not in available_files:
            continue

        extra_files = repo.get_contents(extra_folder)

        while extra_files:
            extra_repo_file = extra_files.pop(0)

            if extra_repo_file.type == "dir":
                extra_files.extend(repo.get_contents(extra_repo_file.path))
            else:
                if extra_repo_file.path.endswith('targets.md'):  # we ignore 'targets.md'
                    continue

                if extra_repo_file.path.startswith('modules'):
                    if extra_repo_file.path.endswith('README.md'):
                        download_file(repo, extra_repo_file.path, module_dir)
                else:
                    logging.info(f"{extra_repo_file.path} | {module_dir}")
                    download_file(repo, extra_repo_file.path, module_dir)

    return True


def parse_repo_name(repo):
    name_items = repo.name.split('-')
    provider = name_items[1]
    module_name = '-'.join(name_items[2:])
    return provider, module_name


def render_module(repo, download_dir, output_dir):
    logging.info(f"Rendering doc for {repo.full_name}")

    script_dir = os.path.dirname(os.path.realpath(__file__))

    provider, module_name = parse_repo_name(repo)
    component_dir = os.path.join(output_dir, provider, module_name)
    module_dir = os.path.join(download_dir, repo.name)
    readme_yaml_file = f"{module_dir}/{README_YAML}"
    readme_md_file = os.path.join(component_dir, README_MD)

    io.create_dirs(component_dir)

    # TODO: IMPLEMENT THIS
    create_index_for_provider(component_dir, provider)

    pre_rendering_fixes(repo, readme_yaml_file)

    subprocess.run(["make", "readme",
                    f"README_TEMPLATE_FILE={script_dir}/templates/{README_MD}",
                    f"README_FILE={readme_md_file}",
                    f"README_YAML={module_dir}/{README_YAML}",
                    f"README_TEMPLATE_YAML={module_dir}/{README_YAML}",
                    f"README_INCLUDES={module_dir}"])

    for extra_folder in EXTRA_FOLDERS:
        copy_extra_static_files(module_dir, component_dir, extra_folder)

    post_rendering_fixes(repo, readme_md_file)


def create_index_for_provider(module_dir, provider):
    # TODO: FIX ME
    pass


def pre_rendering_fixes(repo, readme_yaml_file):
    content = io.read_file_to_string(readme_yaml_file)
    content = rendering.remove_targets_md(content)
    io.save_string_to_file(readme_yaml_file, content)


def post_rendering_fixes(repo, file):
    content = io.read_file_to_string(file)
    content = rendering.fix_self_non_closing_br_tags(content)
    content = rendering.fix_github_edit_url(content, repo)
    io.save_string_to_file(file, content)


def copy_extra_static_files(module_dir, component_dir, extra_folder):
    source = os.path.join(module_dir, extra_folder)

    if not os.path.exists(source):
        return

    destination = os.path.join(component_dir, extra_folder)

    if extra_folder == 'modules':
        copytree(source, destination, ignore=ignore_patterns('*.tf'), dirs_exist_ok=True)
    else:
        copytree(source, destination, ignore=ignore_patterns('*.md'), dirs_exist_ok=True)


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
