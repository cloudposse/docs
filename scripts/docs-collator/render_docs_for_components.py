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


def render_index_category(index_category_template, output_dir, subdirs):
    if len(subdirs) <= 1:
        return  # nothing to create

    middle_dirs = subdirs[:-1]  # need to skip last dir

    current_path = output_dir

    for subdir in middle_dirs:
        new_path = os.path.join(current_path, subdir)
        json_path = os.path.join(new_path, CATEGORY_JSON_FILE)
        current_path = new_path

        if not os.path.exists(json_path):
            json_content = index_category_template.render(label=subdir,
                                                          title=subdir,
                                                          description=subdir)
            io.save_string_to_file(json_path, json_content)


def render_doc(doc_template, module, source_file, output_dir, subdirs, github_repository):
    content = io.read_file_to_string(source_file)
    content = rendering.fix_self_non_closing_br_tags(content)
    content = rendering.fix_custom_non_self_closing_tags_in_pre(content)
    content = rendering.remove_logo_from_the_bottom(content)
    final_dir = os.path.join(*([output_dir] + subdirs))
    result_path = os.path.join(final_dir, README_FILE_NAME)
    tags = ['terraform'] + module.split("-")

    doc_content = doc_template.render(label=module,
                                      title=module,
                                      description=module,
                                      content=content,
                                      github_repository=github_repository,
                                      module=module,
                                      tags=tags)

    io.save_string_to_file(result_path, doc_content)


def process_module(module, input_dir, output_dir, github_repository):
    logging.info(f"Processing module: {module}")

    output_component_dir = os.path.join(output_dir, module)
    module_dir = os.path.join(input_dir, module)

    io.remove_dir(output_component_dir)

    files = io.get_filenames_in_dir(module_dir, README_FILE_NAME, True)

    jenv = templating.init_templating(os.path.join(os.path.dirname(os.path.realpath(__file__)), 'templates'))
    index_category_template = jenv.get_template(INDEX_CATEGORY_TEMPLATE_FILE)
    doc_template = jenv.get_template(COMPONENT_README_TEMPLATE_FILE)

    # create subdirs
    for file in files:
        subdir = os.path.dirname(file)
        doc_dir = os.path.join(output_dir, subdir[len(input_dir) + 1:])
        io.create_dirs(doc_dir)

    for file in files:
        items = file.split(os.sep)
        items = items[len(input_dir.split(os.sep)):]  # remove input dir
        subdirs = items[:-1]  # get all dir

        render_index_category(index_category_template, output_dir, subdirs)

        doc_name = module

        if len(subdirs) != 0:
            doc_name = subdirs[-1]

        render_doc(doc_template, doc_name, file, output_dir, subdirs, github_repository)


def main(input_dir, output_dir, github_repo, modules_to_skip):
    modules_dir = os.path.join(input_dir, 'modules')

    logging.info(f"Looking for modules in: {modules_dir}")

    modules = io.get_subfolders(modules_dir)

    logging.info(f"Found {len(modules)} modules")

    skip_modules = set([skip.strip() for skip in modules_to_skip.split(",")])

    for module in modules:
        if module in skip_modules:
            logging.info(f"Module '{module}' in skip list")
            continue

        process_module(module, modules_dir, output_dir, github_repo)


@click.command()
@click.option('--input-dir', default=CLONED_REPO_DIR, required=True, help="Path to cloned repo")
@click.option('--output-dir', default=OUTPUT_DOC_DIR, required=False, help="Rendered component output dir")
@click.option('--github-org', default=GITHUB_ORG, required=True, help="Github org name")
@click.option('--modules-to-skip', default='', required=False, help="CSV list of modules to skip")
@click.option('--log-level', default=False, required=False, help="Recursive lookup in sub folders of README.md files")
def cli_main(input_dir, output_dir, github_org, modules_to_skip, log_level):
    logging.basicConfig(format='[%(asctime)s] %(levelname)s %(message)s',
                        datefmt='%d-%m-%Y %H:%M:%S',
                        level=logging.getLevelName(log_level))

    main(input_dir, output_dir, f"{github_org}/{GITHUB_REPO}", modules_to_skip)


if __name__ == "__main__":
    cli_main()
