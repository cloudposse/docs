import glob
import os
import shutil
import re
import click
import jinja2
from jinja2 import FileSystemLoader

README_FILE_GLOB_PATTERN = '**/README.md'
CATEGORY_JSON_FILE = '_category_.json'
README_FILE_NAME = 'README.md'


def get_files(input_dir, recursive=False):
    glob_pattern = f'**/{README_FILE_NAME}' if recursive else README_FILE_NAME
    return glob.glob(os.path.join(input_dir, glob_pattern), recursive=recursive)


def create_output_dirs(output_dir, subdirs):
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    if len(subdirs) == 0:
        # nothing to create
        return

    final_dir = os.path.join(*([output_dir] + subdirs))

    if not os.path.exists(final_dir):
        os.makedirs(final_dir)


def render_index_category(index_category_template, output_dir, subdirs):
    if len(subdirs) <= 1:
        # nothing to create
        return

    middle_dirs = subdirs[:-1]  # need to skip last dir

    current_path = output_dir

    for subdir in middle_dirs:
        new_path = os.path.join(current_path, subdir)
        json_path = os.path.join(new_path, CATEGORY_JSON_FILE)
        current_path = new_path

        if not os.path.exists(json_path):
            with open(json_path, 'w') as f:
                f.write(index_category_template.render(label=subdir,
                                                       title=subdir,
                                                       description=subdir))


def render_leaf_category(leaf_category_template, output_dir, subdirs):
    final_dir = os.path.join(*([output_dir] + subdirs))
    json_path = os.path.join(final_dir, CATEGORY_JSON_FILE)
    subdir = subdirs[-1]

    with open(json_path, 'w') as f:
        f.write(leaf_category_template.render(label=subdir,
                                              title=subdir,
                                              description=subdir))


def clean_output_dir(output_dir):
    shutil.rmtree(output_dir, ignore_errors=True)


def fix_self_non_closing_br_tags(content):
    regex = re.compile(re.escape('<br>'), re.IGNORECASE)
    return regex.sub('<br/>', content)


def fix_custom_non_self_closing_tags_in_pre(content):
    lines = content.splitlines()
    tag_regex = re.compile('(<)([0-9a-zA-Z._-]+)(>)', re.IGNORECASE)
    fixed_lines = []

    for line in lines:
        if not line.startswith('|'):
            fixed_lines.append(line)
            continue

        groups = re.findall(r'<pre>(.*?)</pre>', line)

        for group in groups:
            before = group
            after = tag_regex.sub(r"&lt;\2&gt;", group)
            line = line.replace(f'<pre>{before}</pre>', f'<pre>{after}</pre>')

        fixed_lines.append(line)

    return '\n'.join(fixed_lines)


def render_doc(doc_template, component_name, source_file, output_dir, subdirs):
    content = read_file_to_string(source_file)
    content = fix_self_non_closing_br_tags(content)
    content = fix_custom_non_self_closing_tags_in_pre(content)
    final_dir = os.path.join(*([output_dir] + subdirs))
    result_path = os.path.join(final_dir, README_FILE_NAME)

    with open(result_path, 'w') as f:
        f.write(doc_template.render(label=component_name,
                                    title=component_name,
                                    description=component_name,
                                    content=content))


def read_file_to_string(source_file):
    with open(source_file, 'r') as f:
        content = f.read()

    return content


def init_templating():
    return jinja2.Environment(loader=FileSystemLoader("templates/"))


def main(input_dir, output_dir, component_name, recursive):
    clean_output_dir(output_dir)

    files = get_files(input_dir, recursive)

    jenv = init_templating()
    index_category_template = jenv.get_template('index_category.json')
    doc_template = jenv.get_template('doc.md')

    for file in files:
        items = file.split(os.sep)
        items = items[len(input_dir.split(os.sep)):]  # remove input dir
        subdirs = items[:-1]  # get all dir

        create_output_dirs(output_dir, subdirs)
        render_index_category(index_category_template, output_dir, subdirs)

        doc_name = component_name

        if len(subdirs) != 0:
            doc_name = subdirs[0]

        render_doc(doc_template, doc_name, file, output_dir, subdirs)


@click.command()
@click.option('--input', required=True, help="Path to input directory")
@click.option('--output', required=True, help="Path to output directory")
@click.option('--component-name', required=True, help="Component name")
@click.option('--recursive', default=False, required=False, help="Recursive lookup in sub folders of README.md files")
def cli_main(input, output, component_name, recursive=False):
    main(input, output, component_name, recursive)


if __name__ == "__main__":
    cli_main()
