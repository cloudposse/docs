import logging
import os
import subprocess

from AbstractRenderer import AbstractRenderer, TerraformDocsRenderingError
from utils import io
from utils import rendering, templating

DOCS_DIR = "docs"
IMAGES_DIR = "images"
TARGETS_MD = "targets.md"
README_YAML = "README.yaml"
README_MD = "README.md"
INDEX_CATEGORY_JSON = "_category_.json"
MODULES_README_TEMPLATE = "readme.md"

SCRIPT_DIR = os.path.dirname(os.path.realpath(__file__))
TEMPLATES_DIR = os.path.join(SCRIPT_DIR, "templates/components")

jenv = templating.init_templating(TEMPLATES_DIR)
INDEX_CATEGORY_TEMPLATE = jenv.get_template("index_category.json")


class ComponentRenderer(AbstractRenderer):
    def __init__(self, download_dir, docs_dir):
        self.download_dir = download_dir
        self.docs_dir = docs_dir

    def render(self, repo):
        logging.info(f"Rendering doc for: {repo.full_name}")
        module_download_dir = os.path.join(self.download_dir, repo.name)

        self._pre_rendering_fixes(repo, module_download_dir)

        def parse_terraform_repo_name(name):
            name_items = name.split("-")
            provider = name_items[0]
            module_name = "-".join(name_items[1:])
            return provider, module_name

        provider, module_name = parse_terraform_repo_name(repo.name)
        logging.debug(f"Provider: {provider}, Module: {module_name}")

        module_docs_dir = os.path.join(self.docs_dir, provider, module_name)
        logging.debug(f"Module docs dir: {module_docs_dir}")

        self.__render_readme(module_download_dir, module_docs_dir)

        readme_md_file = os.path.join(module_download_dir, README_MD)
        io.copy_file(readme_md_file, os.path.join(module_docs_dir, README_MD))

        readme_md_file = os.path.join(module_docs_dir, README_MD)
        self._post_rendering_fixes(repo, readme_md_file)

        self._copy_extra_resources_for_docs(module_download_dir, module_docs_dir)
        self.__copy_extra_resources_for_images(module_download_dir, module_docs_dir)

        # Disable category.json for now
        # self.__create_index_for_provider(repo)
        # self.__create_indexes_for_subfolders(repo)

    def __render_readme(self, module_download_dir, module_docs_dir):
        readme_yaml_file = os.path.join(module_download_dir, README_YAML)
        readme_md_file = os.path.join(module_download_dir, README_MD)
        readme_tmpl_file = os.path.join(TEMPLATES_DIR, MODULES_README_TEMPLATE)

        io.create_dirs(module_docs_dir)

        # Re-render terraform docs with this repo's terraform-docs template for modules.
        # This replaces docs/terraform.md for the given module in place
        logging.debug(f"Rendering terraform docs for: {module_download_dir}")
        rendering.render_terraform_docs(
            module_download_dir, os.path.join(TEMPLATES_DIR, "terraform-docs.yml")
        )

        # Run the make readme command in the module directory to compile README.md
        logging.debug(f"Rendering README.md for: {module_download_dir}")
        logging.debug(f"make readme")
        logging.debug(f"README_TEMPLATE_FILE: {readme_tmpl_file}")
        logging.debug(f"README_FILE: {readme_md_file}")
        logging.debug(f"README_YAML: {readme_yaml_file}")
        logging.debug(f"README_TEMPLATE_YAML: {readme_yaml_file}")
        logging.debug(f"README_INCLUDES: {module_download_dir}")
        response = subprocess.run(
            [
                "make",
                "readme",
                f"README_TEMPLATE_FILE={readme_tmpl_file}",
                f"README_FILE={readme_md_file}",
                f"README_YAML={readme_yaml_file}",
                f"README_TEMPLATE_YAML={readme_yaml_file}",
                f"README_INCLUDES={module_download_dir}",
            ],
            capture_output=True,
        )

        if response.returncode != 0:
            error_message = response.stderr.decode("utf-8")
            raise TerraformDocsRenderingError(error_message)

        logging.info(f"Rendered: {readme_md_file}")

    def __copy_extra_resources_for_images(self, module_download_dir, module_docs_dir):
        extra_resources_dir = os.path.join(module_download_dir, IMAGES_DIR)
        files = io.get_filenames_in_dir(extra_resources_dir, "*", True)

        for file in files:
            if os.path.isdir(file):
                continue

            dest_file = os.path.join(
                module_docs_dir, IMAGES_DIR, os.path.relpath(file, extra_resources_dir)
            )
            io.copy_file(file, dest_file)
            logging.info(f"Copied extra file: {dest_file}")

    def __render_category_index(self, dir):
        name = os.path.basename(dir)

        content = INDEX_CATEGORY_TEMPLATE.render(label=name, title=name)

        io.save_string_to_file(os.path.join(dir, INDEX_CATEGORY_JSON), content)

    def _post_rendering_fixes(self, repo, readme_md_file, submodule_dir=""):
        content = io.read_file_to_string(readme_md_file)
        content = rendering.fix_self_non_closing_br_tags(content)
        content = rendering.fix_custom_non_self_closing_tags_in_pre(content)
        content = rendering.fix_github_edit_url(content, repo, submodule_dir)
        content = rendering.replace_relative_links_with_github_links(
            repo, content, submodule_dir
        )
        content = rendering.fix_mdx_format(content)
        content = rendering.reformat_admonitions(content)
        io.save_string_to_file(readme_md_file, content)
