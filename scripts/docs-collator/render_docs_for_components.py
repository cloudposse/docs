import logging
import os

import click

from ComponentRenderer import ComponentRenderer
from utils import io

OUTPUT_DOC_DIR = 'content/components/catalog/aws'
CLONED_REPO_DIR = 'tmp/components/terraform-aws-components'


def main(input_dir, output_dir):
    modules_dir = os.path.join(input_dir, 'modules')

    logging.info(f"Looking for modules in: {modules_dir}")

    components = io.get_subfolders(modules_dir)

    logging.info(f"Found {len(components)} components")

    renderer = ComponentRenderer(input_dir, output_dir)

    for component in components:
        logging.info(f"Processing component: {component}")
        renderer.render(component)


@click.command()
@click.option('--input-dir', default=CLONED_REPO_DIR, required=True, help="Path to cloned repository")
@click.option('--output-dir', default=OUTPUT_DOC_DIR, required=False, help="Rendered documentation output directory")
@click.option('--log-level', default=False, required=False, help="Recursive lookup in sub folders of README.md files")
def cli_main(input_dir, output_dir, log_level):
    logging.basicConfig(format='[%(asctime)s] %(levelname)s %(message)s',
                        datefmt='%d-%m-%Y %H:%M:%S',
                        level=logging.getLevelName(log_level))

    main(input_dir, output_dir)


if __name__ == "__main__":
    cli_main()
