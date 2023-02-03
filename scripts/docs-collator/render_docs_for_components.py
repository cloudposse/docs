import logging
import os

import click

from utils import io, rendering, templating

README_FILE_GLOB_PATTERN = '**/README.md'
CATEGORY_JSON_FILE = '_category_.json'
INDEX_CATEGORY_TEMPLATE_FILE = 'index_category.json'
COMPONENT_README_TEMPLATE_FILE = 'component.readme.md'
README_FILE_NAME = 'README.md'
OUTPUT_DOC_DIR = 'content/components/catalog/aws'
CLONED_REPO_DIR = 'tmp/components/terraform-aws-components'
GITHUB_ORG = 'cloudposse'
GITHUB_REPO = 'terraform-aws-components'
SCRIPT_DIR = os.path.dirname(os.path.realpath(__file__))

jenv = templating.init_templating(os.path.join(SCRIPT_DIR, 'templates'))
DOC_TEMPLATE = jenv.get_template(COMPONENT_README_TEMPLATE_FILE)


def render_doc(module, file, module_download_dir, docs_dir, github_repository):
    content = io.read_file_to_string(file)
    content = rendering.fix_self_non_closing_br_tags(content)
    content = rendering.fix_custom_non_self_closing_tags_in_pre(content)
    content = rendering.remove_logo_from_the_bottom(content)
    relative_path = os.path.relpath(file, module_download_dir)
    result_file = os.path.join(docs_dir, os.path.relpath(file, module_download_dir))  # <module-name>/README.md

    label = module
    title = module
    description = module
    github_edit_url = f"https://github.com/{github_repository}/edit/master/modules/{relative_path}"

    if len(relative_path.split('/')) > 2:  # this is submodule
        submodule_name = os.path.basename(os.path.dirname(result_file))

        label = submodule_name
        title = submodule_name
        description = submodule_name

        # renaming final file <module-name>/<module-name>.md
        result_file = os.path.join(os.path.dirname(result_file), f"{submodule_name}.md")

    io.create_dirs(os.path.dirname(result_file))

    tags = ['terraform', 'aws', module]

    doc_content = DOC_TEMPLATE.render(label=label,
                                      title=title,
                                      description=description,
                                      content=content,
                                      github_repository=github_repository,
                                      github_edit_url=github_edit_url,
                                      tags=tags)

    io.save_string_to_file(result_file, doc_content)


def process_module(module, download_dir, docs_dir, github_repository):
    logging.info(f"Processing module: {module}")

    module_download_dir = os.path.join(download_dir, module)

    files = io.get_filenames_in_dir(module_download_dir, README_FILE_NAME, True)

    for file in files:
        render_doc(module, file, download_dir, docs_dir, github_repository)


def main(input_dir, output_dir, github_repo):
    modules_dir = os.path.join(input_dir, 'modules')

    logging.info(f"Looking for modules in: {modules_dir}")

    modules = io.get_subfolders(modules_dir)

    logging.info(f"Found {len(modules)} modules")

    for module in modules:
        process_module(module, modules_dir, output_dir, github_repo)


@click.command()
@click.option('--input-dir', default=CLONED_REPO_DIR, required=True, help="Path to cloned repo")
@click.option('--output-dir', default=OUTPUT_DOC_DIR, required=False, help="Rendered component output dir")
@click.option('--log-level', default=False, required=False, help="Recursive lookup in sub folders of README.md files")
def cli_main(input_dir, output_dir, log_level):
    logging.basicConfig(format='[%(asctime)s] %(levelname)s %(message)s',
                        datefmt='%d-%m-%Y %H:%M:%S',
                        level=logging.getLevelName(log_level))

    main(input_dir, output_dir, f"{GITHUB_ORG}/{GITHUB_REPO}")


if __name__ == "__main__":
    cli_main()
