import os
import subprocess
import logging

from utils import io, rendering, templating
from AbstractRenderer import AbstractRenderer, TerraformDocsRenderingError
from component.component import Component

SCRIPT_DIR = os.path.dirname(os.path.realpath(__file__))
README_YAML = "README.yaml"
README_MD = "README.md"

IMAGES_DIR = "images"
MODULES_README_TEMPLATE = "readme.md"


class ComponentRendererYaml(AbstractRenderer):
    def __init__(self, component: Component):
        self.templates_dir = os.path.join(SCRIPT_DIR, "templates/components/yml")
        self.component = component

    def render(self, docs_dir):
        logging.info(f"Rendering doc for: {self.component.repo.full_name}")
        logging.info(f"Provider: {self.component.provider}, Module: {self.component.name}")

        path_components = [docs_dir, self.component.provider]
        path_components.extend(self.component.subdirs)
        path_components.append(self.component.name)
        module_docs_dir = os.path.join(*path_components)
        logging.info(f"Module docs dir: {module_docs_dir}")

        self._pre_rendering_fixes(self.component, self.component.dir)
        readme_md_file = self.__render_readme(module_docs_dir)
        self._post_rendering_fixes(readme_md_file)

        self._copy_extra_resources_for_docs(self.component.dir, module_docs_dir)
        self.__copy_extra_resources_for_images(module_docs_dir)

    def __render_readme(self, module_docs_dir):
        readme_yaml_file = os.path.join(self.component.dir, README_YAML)
        readme_md_file = os.path.join(self.component.dir, README_MD)

        readme_tmpl_file = os.path.join(self.templates_dir, MODULES_README_TEMPLATE)

        io.create_dirs(module_docs_dir)
        # Run the make readme command in the module directory to compile README.md
        logging.debug(f"Rendering README.md for: {self.component.dir}")
        logging.debug(f"make readme")
        logging.debug(f"README_TEMPLATE_FILE: {readme_tmpl_file}")
        logging.debug(f"README_FILE: {readme_md_file}")
        logging.debug(f"README_YAML: {readme_yaml_file}")
        logging.debug(f"README_TEMPLATE_YAML: {readme_yaml_file}")
        logging.debug(f"README_INCLUDES: {self.component.dir}")
        response = subprocess.run(
            [
                "make",
                "readme",
                f"README_TEMPLATE_FILE={os.path.abspath(readme_tmpl_file)}",
                f"README_FILE={os.path.abspath(readme_md_file)}",
                f"README_YAML={os.path.abspath(readme_yaml_file)}",
                f"README_TEMPLATE_YAML={os.path.abspath(readme_yaml_file)}",
                f"README_INCLUDES={os.path.abspath(self.component.dir)}/",
            ],
            capture_output=True,
            cwd=os.path.join(SCRIPT_DIR, "templates", "make"),
        )

        if response.returncode != 0:
            error_message = response.stderr.decode("utf-8")
            raise TerraformDocsRenderingError(error_message)

        logging.info(f"Rendered: {readme_md_file}")

        # Re-render terraform docs with this repo's terraform-docs template for modules.
        # This replaces docs/terraform.md for the given module in place
        logging.debug(f"Rendering terraform docs for: {self.component.dir}")
        rendering.render_terraform_docs(
            self.component.terraform_dir, os.path.join(self.templates_dir, "terraform-docs.yml")
        )

        readme_md_file = os.path.join(self.component.dir, README_MD)
        io.copy_file(readme_md_file, os.path.join(module_docs_dir, README_MD))
        return os.path.join(module_docs_dir, README_MD)

    def _post_rendering_fixes(self, readme_md_file, submodule_dir=""):
        content = io.read_file_to_string(readme_md_file)
        content = rendering.fix_self_non_closing_br_tags(content)
        content = rendering.fix_custom_non_self_closing_tags_in_pre(content)
        content = rendering.fix_github_edit_url(content, self.component.repo, submodule_dir)
        content = rendering.fix_sidebar_label(
            content, self.component.repo, self.component.name
        )
        content = rendering.replace_relative_links_with_github_links(
            self.component.repo, content, self.component.name
        )
        content = rendering.fix_mdx_format(content)
        content = rendering.reformat_admonitions(content)
        io.save_string_to_file(readme_md_file, content)

    def __copy_extra_resources_for_images(self, module_docs_dir):
        extra_resources_dir = os.path.join(self.component.dir, IMAGES_DIR)
        files = io.get_filenames_in_dir(extra_resources_dir, "*", True)

        for file in files:
            if os.path.isdir(file):
                continue

            dest_file = os.path.join(
                module_docs_dir, IMAGES_DIR, os.path.relpath(file, extra_resources_dir)
            )
            io.copy_file(file, dest_file)
            logging.info(f"Copied extra file: {dest_file}")
