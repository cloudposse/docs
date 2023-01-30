import base64
import logging
import os
import subprocess
from shutil import copytree, ignore_patterns

import click
from github import Github

from utils import io, rendering

DOWNLOAD_TMP_DIR = 'tmp/modules'
OUTPUT_DOC_DIR = 'content/components'
REPOS_SKIP_LIST = {'terraform-aws-components'}

REPOS_FILTER_PREFIX = 'terraform-'
README_YAML = 'README.yaml'
README_MD = 'README.md'
EXTRA_FOLDERS = {'docs', 'images'}
TMP_MODULES_DIR = 'modules'


def get_repos(github, skip_repos):
    repos = []

    logging.info("Fetching list of available repos ...")

    for repo in github.get_user().get_repos():
        # if repo.name != 'terraform-aws-ecs-cluster':
        #     continue

        if not repo.name.startswith(REPOS_FILTER_PREFIX):
            continue

        if repo.name in skip_repos:
            logging.info(f"Repository '{repo.name}' in skip list")

        repos.append(repo)

    logging.info(f"Found {len(repos)} valid repositories")

    return repos


def fetch_module(repo, download_dir):
    logging.info(f"Fetching files for: '{repo.full_name}'")

    available_files = set([item.path for item in repo.get_contents("")])

    if README_YAML not in available_files:
        logging.warning(f"{README_YAML} is missing. Skipping... '{repo.full_name}'")
        return False

    module_dir = os.path.join(download_dir, repo.name)

    io.create_dirs(module_dir)

    content_encoded = repo.get_contents(README_YAML, ref=repo.default_branch).content
    content = base64.b64decode(content_encoded).decode('utf-8')
    io.save_string_to_file(os.path.join(module_dir, README_YAML), content)

    for extra_folder in EXTRA_FOLDERS:
        if extra_folder not in available_files:
            continue

        contents = repo.get_contents(extra_folder)

        while contents:
            file_content = contents.pop(0)

            if file_content.type == "dir":
                contents.extend(repo.get_contents(file_content.path))
            else:
                final_dir = os.path.join(module_dir, os.path.dirname(file_content.path))
                io.create_dirs(final_dir)

                content_encoded = file_content.content
                content = base64.b64decode(content_encoded)
                io.save_to_file(os.path.join(module_dir, file_content.path), content)

    return True


def render_module(repo, download_dir, output_dir):
    logging.info(f"Rendering doc for {repo.full_name}")

    script_dir = os.path.dirname(os.path.realpath(__file__))
    component_dir = os.path.join(output_dir, rendering.remove_prefix(repo.name, 'terraform-'))
    module_dir = os.path.join(download_dir, repo.name)
    result_file = os.path.join(component_dir, README_MD)

    io.create_dirs(component_dir)

    subprocess.run(["make", "readme",
                    f"README_TEMPLATE_FILE={script_dir}/templates/{README_MD}",
                    f"README_FILE={result_file}",
                    f"README_YAML={module_dir}/{README_YAML}",
                    f"README_TEMPLATE_YAML={module_dir}/{README_YAML}",
                    f"README_INCLUDES={module_dir}"])

    for extra_folder in EXTRA_FOLDERS:
        copy_extra_static_files(module_dir, component_dir, extra_folder)

    post_rendering_fixes(repo, result_file)


def post_rendering_fixes(repo, file):
    content = io.read_file_to_string(file)
    content = rendering.fix_self_non_closing_br_tags(content)
    content = rendering.fix_sidebar_label(content, repo)
    content = rendering.fix_github_edit_url(content, repo)
    io.save_string_to_file(file, content)


def copy_extra_static_files(module_dir, component_dir, extra_folder):
    source = os.path.join(module_dir, extra_folder)

    if not os.path.exists(source):
        return

    destination = os.path.join(component_dir, extra_folder)

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
@click.option('--github-api-token', envvar='GITHUB_API_TOKEN', required=True, help="Github API token")
@click.option('--output-dir', default=OUTPUT_DOC_DIR, required=False, help="Rendered component output dir")
@click.option('--download-dir', default=DOWNLOAD_TMP_DIR, required=False, help="Temporary output dir")
@click.option('--repos-to-skip', default='terraform-aws-components', required=False, help="CSV list of repos to skip")
@click.option('--log-level', default='INFO', required=False, help="Log level. Available options")
def cli_main(github_api_token, output_dir, download_dir, repos_to_skip, log_level):
    logging.basicConfig(format='[%(asctime)s] %(levelname)s %(message)s',
                        datefmt='%d-%m-%Y %H:%M:%S',
                        level=logging.getLevelName(log_level))

    logging.info(f"Tmp dir: {download_dir}, components dir: {output_dir}")

    main(github_api_token, output_dir, download_dir, repos_to_skip)


if __name__ == "__main__":
    cli_main()
