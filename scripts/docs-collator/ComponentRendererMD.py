import os
import subprocess
import logging

from utils import io
from utils import rendering, templating
from AbstractRenderer import AbstractRenderer, TerraformDocsRenderingError
from ComponentRepositorySingle import Component

SCRIPT_DIR = os.path.dirname(os.path.realpath(__file__))
README_YAML = "README.yaml"
README_MD = "README.md"
IMAGES_DIR = "images"
MODULES_README_TEMPLATE = "readme.md"


class ComponentRendererMD(AbstractRenderer):
    def __init__(self, component: Component):
        self.templates_dir = os.path.join(SCRIPT_DIR, "templates/components/multiple")
        self.component = component

    def render(self, docs_dir):
        logging.info(f"Rendering doc for: {self.component.repo.full_name}")
        module_download_dir = self.component.dir

        logging.info(f"Provider: {self.component.provider}, Module: {self.component.name}")

        path_components = [docs_dir, self.component.provider]
        path_components.extend(self.component.subdirs)
        path_components.append(self.component.name)
        module_docs_dir = os.path.join(*path_components)
        logging.info(f"Module docs dir: {module_docs_dir}")

        # self._pre_rendering_fixes(self.component, module_download_dir)
        self.__render_doc()
        content = io.read_file_to_string(os.path.join(module_download_dir, README_MD))
        # content = (
        #     rendering.replace_relative_links_with_github_links(
        #         repo, submodule_readme_content, rel_dir
        #     )
        # )
        rel_dir = "Test"
        jenv = templating.init_templating(self.templates_dir)
        self.doc_template = jenv.get_template("readme.md")

        content = self.doc_template.render(
            label=self.component.name,
            title=self.component.name,
            description=self.component.name,
            github_edit_url=f"https://github.com/{self.component.repo.full_name}/blob/{self.component.repo.default_branch}/{rel_dir}",
            content=content,
        )

        dest_file = os.path.join(module_docs_dir, README_MD)
        io.create_dirs(os.path.dirname(dest_file))
        io.save_string_to_file(dest_file, content)

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

        # # change_log_file = os.path.join(os.path.dirname(file), CHANGELOG_MD)
        # # change_log_content = (
        # #     io.read_file_to_string(change_log_file)
        # #     if os.path.exists(change_log_file)
        # #     else ""
        # # )
        # # change_log_content = rendering.reformat_admonitions(change_log_content)
        # # change_log_content = rendering.shift_headings(change_log_content)
        #
        # provider, subdirs, _ = self.parse_terraform_repo_name(repo.name)
        #
        # if subdirs:
        #     module_docs_dir = os.path.join(self.docs_dir, provider, subdirs)
        # else:
        #     module_docs_dir = os.path.join(self.docs_dir, provider)
        # relative_path = module_docs_dir
        # result_file = os.path.join(
        #     module_docs_dir, os.path.relpath(file, module_download_dir)
        # )  # <module-name>/README.md
        #
        # name = (
        #     component
        #     if os.path.basename(file) == "README.md"
        #     else os.path.basename(file).replace(".md", "")
        # )
        # label = name
        # title = name
        # github_edit_url = (
        #     f"https://github.com/{repo.full_name}/blob/main/src/{relative_path}"
        # )
        #
        # if (
        #     len(relative_path.split("/")) > 2 and relative_path.split("/")[1] != "docs"
        # ):  # this is submodule
        #     submodule_name = os.path.basename(os.path.dirname(result_file))
        #
        #     label = submodule_name
        #     title = submodule_name
        #
        #     # renaming final file <module-name>/<module-name>.mdx
        #     result_file = os.path.join(
        #         os.path.dirname(result_file), f"{submodule_name}.mdx"
        #     )
        # else:
        #     # renaming final file <module-name>/README.mdx
        #     result_file = os.path.join(os.path.dirname(result_file), f"{name}.mdx")
        #
        # logging.info(f"Result: {result_file}")
        #
        # io.create_dirs(os.path.dirname(result_file))
        #
        # doc_content = self.doc_template.render(
        #     label=label,
        #     title=title,
        #     content=content,
        #     change_log_content=change_log_content,
        #     github_repository=repo.full_name,
        #     github_edit_url=github_edit_url,
        #     tags=tags,
        # )
        io.save_string_to_file(file, content)

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
