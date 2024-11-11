import logging
import os
import subprocess
import glob

from AbstractRenderer import AbstractRenderer, TerraformDocsRenderingError
from ComponentRepositorySingle import ComponentRepositorySingle
from ComponentRepositoryMultiple import ComponentRepositoryMultiple
from utils import io
from utils import rendering, templating


DOCS_DIR = "docs"
IMAGES_DIR = "images"
TARGETS_MD = "targets.md"
README_YAML = "README.yaml"
README_MD = "README.md"
CHANGELOG_MD = "CHANGELOG.md"
INDEX_CATEGORY_JSON = "_category_.json"
MODULES_README_TEMPLATE = "readme.md"

SCRIPT_DIR = os.path.dirname(os.path.realpath(__file__))


class ComponentRenderer(AbstractRenderer):
    def __init__(self, download_dir, docs_dir):
        self.download_dir = download_dir
        self.docs_dir = docs_dir
        self.templates_dir = os.path.join(SCRIPT_DIR, "templates/components/single")
        self.index_category_template = None

    def render(self, repo):
        logging.info(f"Rendering doc for: {repo.full_name}")
        module_download_dir = os.path.join(self.download_dir, repo.name)

        if isinstance(repo, ComponentRepositoryMultiple):
            self.templates_dir = os.path.join(SCRIPT_DIR, "templates/components/multiple")
            components = [
                f for f in os.listdir(os.path.join(module_download_dir, 'src')) if os.path.isdir(os.path.join(module_download_dir, 'src', f))
            ]
            for component in components:
                logging.info(f"Rendering component: {component}")
                self.render_multiple(repo, component)

            provider, subdirs, module_name = self.parse_terraform_repo_name(repo.name)
            if subdirs and subdirs == module_name:
                self.templates_dir = os.path.join(SCRIPT_DIR, "templates/components/single")
                self.render_single(repo, ignore_subdirs=True)
        elif isinstance(repo, ComponentRepositorySingle):
            self.templates_dir = os.path.join(SCRIPT_DIR, "templates/components/single")
            self.render_single(repo)

    def parse_terraform_repo_name(self, name):
        name_items = name.split("-")
        provider = name_items[0]
        module_name = "-".join(name_items[1:])
        subdirs = None
        if module_name == "":
            provider = "null"
            module_name = name
        elif module_name.startswith("eks-"):
            subdirs = "eks"
            module_name = module_name[len("eks-"):]
        elif module_name.startswith("spacelift"):
            subdirs = "spacelift"
            module_name = module_name
        elif module_name == "sso":
            module_name = "aws-sso"
        elif module_name == "saml":
            module_name = "aws-saml"
        elif module_name == "backup":
            module_name = "aws-backup"
        elif module_name == "ssosync":
            module_name = "aws-ssosync"
        elif module_name == "config":
            module_name = "aws-config"
        elif module_name == "config":
            module_name = "aws-config"
        elif module_name == "argocd":
            subdirs = "eks"
        elif module_name == "datadog":
            module_name = "datadog-configuration"
        elif module_name == "tgw":
            subdirs = "tgw"
        return provider, subdirs, module_name

    # def render_single(self, repo, ignore_subdirs=False):
    #     logging.info(f"Rendering doc for: {repo.full_name}")
    #     module_download_dir = repo.dir
    #
    #     logging.info(f"Provider: {repo.provider}, Module: {repo.module_name}")
    #
    #     if repo.subdirs and not ignore_subdirs:
    #         module_docs_dir = os.path.join(self.docs_dir, repo.provider, repo.subdirs, repo.module_name)
    #     else:
    #         module_docs_dir = os.path.join(self.docs_dir, repo.provider, repo.module_name)
    #     logging.info(f"Module docs dir: {module_docs_dir}")
    #
    #     self._pre_rendering_fixes(repo, module_download_dir)
    #     readme_md_file = self.__render_readme(module_download_dir, module_docs_dir)
    #     self._post_rendering_fixes(repo, readme_md_file)


        # Disable category.json for now
        # self.__create_index_for_provider(repo)
        # self.__create_indexes_for_subfolders(repo)

    def render_multiple(self, repo, component):
        logging.info(f"Rendering doc for: {repo.full_name}/src/{component}")
        module_download_dir = os.path.join(self.download_dir, repo.name, 'src', component)

        self.templates_dir = os.path.join(SCRIPT_DIR, "templates/components/multiple")
        files = io.get_filenames_in_dir(module_download_dir, "*.md", False)

        images = io.get_filenames_in_dir(module_download_dir, "*.png", True)

        jenv = templating.init_templating(self.templates_dir)
        self.doc_template = jenv.get_template("readme.md")
        for file in files:
            # if file.endswith(CHANGELOG_MD):
            #     continue
            self.__render_doc(repo, component, file)

        for image in images:
            io.copy_file(
                image,
                os.path.join(
                    self.docs_dir,
                    component,
                    os.path.relpath(image, module_download_dir),
                ),
            )
        # Disable category.json for now
        # self.__create_index_for_provider(repo)
        # self.__create_indexes_for_subfolders(repo)

    def _post_rendering_fixes(self, repo, readme_md_file, submodule_dir=""):
        content = io.read_file_to_string(readme_md_file)
        content = rendering.fix_self_non_closing_br_tags(content)
        content = rendering.fix_custom_non_self_closing_tags_in_pre(content)
        content = rendering.fix_github_edit_url(content, repo, submodule_dir)
        provider, subdirs, module_name = self.parse_terraform_repo_name(repo.name)
        if os.path.basename(submodule_dir):
            content = rendering.fix_sidebar_label(
                content, module_name, os.path.basename(submodule_dir)
            )
        else:
            content = rendering.fix_sidebar_label(
                content, module_name, module_name
            )
        content = rendering.replace_relative_links_with_github_links(
            repo, content, submodule_dir
        )
        content = rendering.fix_mdx_format(content)
        content = rendering.reformat_admonitions(content)
        io.save_string_to_file(readme_md_file, content)


    def __render_doc(self, repo, component, file):
        module_download_dir = os.path.join(self.download_dir, repo.name, 'src')

        # Render Terraform docs using template for website doc format
        # This will update the given README in place
        module_path = os.path.join(module_download_dir, component)
        rendering.render_terraform_docs(
            module_path, os.path.join(self.templates_dir, "terraform-docs.yml")
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

        change_log_file = os.path.join(os.path.dirname(file), CHANGELOG_MD)
        change_log_content = (
            io.read_file_to_string(change_log_file)
            if os.path.exists(change_log_file)
            else ""
        )
        change_log_content = rendering.reformat_admonitions(change_log_content)
        change_log_content = rendering.shift_headings(change_log_content)

        provider, subdirs, _ = self.parse_terraform_repo_name(repo.name)

        if subdirs:
            module_docs_dir = os.path.join(self.docs_dir, provider, subdirs)
        else:
            module_docs_dir = os.path.join(self.docs_dir, provider)
        relative_path = module_docs_dir
        result_file = os.path.join(
            module_docs_dir, os.path.relpath(file, module_download_dir)
        )  # <module-name>/README.md

        name = (
            component
            if os.path.basename(file) == "README.md"
            else os.path.basename(file).replace(".md", "")
        )
        label = name
        title = name
        github_edit_url = (
            f"https://github.com/{repo.full_name}/blob/main/src/{relative_path}"
        )

        if (
            len(relative_path.split("/")) > 2 and relative_path.split("/")[1] != "docs"
        ):  # this is submodule
            submodule_name = os.path.basename(os.path.dirname(result_file))

            label = submodule_name
            title = submodule_name

            # renaming final file <module-name>/<module-name>.mdx
            result_file = os.path.join(
                os.path.dirname(result_file), f"{submodule_name}.mdx"
            )
        else:
            # renaming final file <module-name>/README.mdx
            result_file = os.path.join(os.path.dirname(result_file), f"{name}.mdx")

        logging.info(f"Result: {result_file}")

        io.create_dirs(os.path.dirname(result_file))

        doc_content = self.doc_template.render(
            label=label,
            title=title,
            content=content,
            change_log_content=change_log_content,
            github_repository=repo.full_name,
            github_edit_url=github_edit_url,
            tags=tags,
        )
        io.save_string_to_file(result_file, doc_content)

        # Breaking builds, not sure why and not adding value. Disabling.
        # self.__create_indexes_for_subfolder(component)


    def __render_category_index(self, dir):
        name = os.path.basename(dir)

        content = self.index_category_template.render(label=name, title=name)

        io.save_string_to_file(os.path.join(dir, INDEX_CATEGORY_JSON), content)

    def __post_rendering_fixes(self, repo, readme_md_file, submodule_dir=""):
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
