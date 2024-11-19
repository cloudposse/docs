import os
import logging

from utils import io, rendering, templating
from AbstractRenderer import AbstractRenderer
from component.component import Component

SCRIPT_DIR = os.path.dirname(os.path.realpath(__file__))
README_YAML = "README.yaml"
README_MD = "README.md"
IMAGES_DIR = "images"
MODULES_README_TEMPLATE = "readme.md"
CHANGELOG_MD = "CHANGELOG.md"


class ComponentRendererMD(AbstractRenderer):
    def __init__(self, component: Component):
        self.templates_dir = os.path.join(SCRIPT_DIR, "templates/components/md")
        self.component = component

    def render(self, docs_dir):
        logging.info(f"Rendering doc for: {self.component.repo.full_name}")
        logging.info(f"Provider: {self.component.provider}, Module: {self.component.name}")

        path_components = [docs_dir, self.component.provider]
        path_components.extend(self.component.subdirs)
        path_components.append(self.component.name)
        module_docs_dir = os.path.join(*path_components)
        logging.info(f"Module docs dir: {module_docs_dir}")

        self.__render_doc()
        content = io.read_file_to_string(os.path.join(self.component.dir, README_MD))

        change_log_content = None
        if os.path.exists(os.path.join(self.component.dir, CHANGELOG_MD)):
            change_md_file = os.path.join(self.component.dir, CHANGELOG_MD)
            content = io.read_file_to_string(change_md_file)
            content = rendering.shift_headings(content)
            lines = content.splitlines()
            lines.insert(0, "## Changelog")
            content = "\n".join(lines)
            io.save_string_to_file(change_md_file, content)

            change_log_content = io.read_file_to_string(change_md_file)
            change_log_content = rendering.reformat_admonitions(change_log_content)
            change_log_content = rendering.shift_headings(change_log_content)

        rel_dir = os.path.relpath(self.component.terraform_dir, self.component.repo.dir)

        jenv = templating.init_templating(self.templates_dir)
        self.doc_template = jenv.get_template("readme.md")

        content = self.doc_template.render(
            label=self.component.name,
            title=self.component.name,
            description=self.component.name,
            github_edit_url=f"https://github.com/{self.component.repo.full_name}/blob/{self.component.repo.default_branch}/{rel_dir}/README.md",
            content=content,
            change_log_content=change_log_content
        )

        dest_file = os.path.join(module_docs_dir, README_MD)
        io.create_dirs(os.path.dirname(dest_file))
        io.save_string_to_file(dest_file, content)

        self._copy_extra_resources_for_docs(self.component.dir, module_docs_dir)
        self.__copy_extra_resources_for_images(module_docs_dir)

        # self.__post_rendering_fixes_for_submodule(dest_file)

    def __render_doc(self):
        file = os.path.join(self.component.dir, README_MD)
        # Render Terraform docs using template for website doc format
        # This will update the given README in place
        rendering.render_terraform_docs(
            self.component.terraform_dir, os.path.join(self.templates_dir, "terraform-docs.yml")
        )

        content = io.read_file_to_string(file)

        # Previously we set tags to this short list.
        # However now we instead use the tags from the given component's frontmatter
        # tags = ["terraform", "aws", component]
        content, frontmatter = rendering.strip_frontmatter(content)
        tags = rendering.get_tags_from_frontmatter(frontmatter)

        # Static replacement and corrections for docusaurus
        content = rendering.strip_title(content)
        content = rendering.fix_self_non_closing_br_tags(content)
        content = rendering.fix_custom_non_self_closing_tags_in_pre(content)
        content = rendering.remove_logo_from_the_bottom(content)
        content = rendering.reformat_admonitions(content)
        content = rendering.remove_https_cloudposse_docs(content)
        content = rendering.replace_broken_links(content)
        content = rendering.fix_mdx_format(content)

        io.save_string_to_file(file, content)

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
