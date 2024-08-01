import logging
import sys

import click

from AbstractRenderer import TerraformDocsRenderingError
from GitHubProvider import GitHubProvider
from ModuleFetcher import ModuleFetcher, MissingReadmeYamlException
from ModuleRenderer import ModuleRenderer

DOWNLOAD_TMP_DIR = "tmp/modules"
OUTPUT_DOC_DIR = "content/modules/library"


def main(
    github_api_token,
    output_dir,
    download_dir,
    includes_csv,
    excludes_csv,
    fail_on_rendering_error,
):
    github_provider = GitHubProvider(github_api_token)
    fetcher = ModuleFetcher(github_provider, download_dir)
    renderer = ModuleRenderer(download_dir, output_dir)

    logging.info(f"Fetching repositories ...")

    repos = github_provider.get_terraform_repos(includes_csv, excludes_csv)

    logging.info(f"Found {len(repos)} repositories to process")

    for repo in repos:
        # TODO
        logging.info(f"Debugging module: {repo.full_name}")
        if repo.full_name != "cloudposse/terraform-aws-ec2-ami-backup":
            logging.info(f"skipping...")
            continue

        try:
            logging.info(f"Fetching files for: {repo.full_name}")
            fetcher.fetch(repo)
        except MissingReadmeYamlException as e:
            logging.warning(e.message)
            continue

        try:
            renderer.render(repo)
        except TerraformDocsRenderingError as e:
            if fail_on_rendering_error:
                logging.error(e.message)
                sys.exit(1)
            else:
                logging.warning(e.message)
                continue


@click.command()
@click.option(
    "--github-api-token",
    envvar="PUBLIC_REPO_ACCESS_TOKEN",
    required=True,
    help="GitHub API token",
)
@click.option(
    "--output-dir",
    default=OUTPUT_DOC_DIR,
    required=True,
    help="Rendered documentation output directory",
)
@click.option(
    "--download-dir",
    default=DOWNLOAD_TMP_DIR,
    required=True,
    help="Temporary download directory",
)
@click.option(
    "--includes",
    required=False,
    help="Comma separated list of repos to include. Conflicts with --excludes. Example: 'terraform-aws-s3-log-storage,terraform-aws-network-firewall'",
)
@click.option(
    "--excludes",
    required=False,
    help="Comma separated list of repos to exclude. Conflicts with --includes. Example: 'terraform-aws-s3-log-storage,terraform-aws-network-firewall'",
)
@click.option(
    "--fail-on-rendering-error",
    is_flag=True,
    show_default=True,
    default=False,
    required=False,
    help="Fail on rendering error",
)
@click.option(
    "--log-level", default="INFO", required=False, help="Log level. Available options"
)
def cli_main(
    github_api_token,
    output_dir,
    download_dir,
    includes,
    excludes,
    fail_on_rendering_error,
    log_level,
):
    logging.basicConfig(
        format="[%(asctime)s] %(levelname)s %(message)s",
        datefmt="%d-%m-%Y %H:%M:%S",
        level=logging.getLevelName(log_level),
    )

    logging.info(
        f"Download directory: {download_dir}, documentation output directory: {output_dir}"
    )

    main(
        github_api_token,
        output_dir,
        download_dir,
        includes,
        excludes,
        fail_on_rendering_error,
    )


if __name__ == "__main__":
    cli_main()
