import os

from utils import io, rendering, templating

README_MD = "README.md"
CHANGELOG_MD = "CHANGELOG.md"
GITHUB_REPO = "cloudposse/terraform-aws-components"
INDEX_CATEGORY_JSON = "_category_.json"

SCRIPT_DIR = os.path.dirname(os.path.realpath(__file__))
TEMPLATES_DIR = os.path.join(SCRIPT_DIR, "templates/components")

jenv = templating.init_templating(TEMPLATES_DIR)
DOC_TEMPLATE = jenv.get_template("readme.md")
INDEX_CATEGORY_TEMPLATE = jenv.get_template("index_category.json")


class ComponentRenderer:
    def __init__(self, download_dir, docs_dir):
        self.download_dir = download_dir
        self.docs_dir = docs_dir

    def render(self, component):
        module_download_dir = os.path.join(self.download_dir, "modules", component)

        files = io.get_filenames_in_dir(module_download_dir, README_MD, True)
        files += io.get_filenames_in_dir(module_download_dir, "*.md", True)

        images = io.get_filenames_in_dir(module_download_dir, "*.png", True)

        for file in files:
            if file.endswith(CHANGELOG_MD):
                continue
            self.__render_doc(component, file)

        for image in images:
            io.copy_file(
                image,
                os.path.join(
                    self.docs_dir,
                    component,
                    os.path.relpath(image, module_download_dir),
                ),
            )

    def __render_doc(self, component, file):
        module_download_dir = os.path.join(self.download_dir, "modules")

        # Render Terraform docs using template for website doc format
        # This will update the given README in place
        module_path = os.path.join(module_download_dir, component)
        rendering.render_terraform_docs(
            module_path, os.path.join(TEMPLATES_DIR, "terraform-docs.yml")
        )

        # Static replacement and corrections for docusaurus
        content = io.read_file_to_string(file)
        content = rendering.fix_self_non_closing_br_tags(content)
        content = rendering.fix_custom_non_self_closing_tags_in_pre(content)
        content = rendering.remove_logo_from_the_bottom(content)
        content = rendering.fix_mdx_format(content)

        change_log_file = os.path.join(os.path.dirname(file), CHANGELOG_MD)
        change_log_content = (
            io.read_file_to_string(change_log_file)
            if os.path.exists(change_log_file)
            else ""
        )
        change_log_content = rendering.shift_headings(change_log_content)

        relative_path = os.path.relpath(file, module_download_dir)
        result_file = os.path.join(
            self.docs_dir, os.path.relpath(file, module_download_dir)
        )  # <module-name>/README.md

        name = (
            component
            if os.path.basename(file) == "README.md"
            else os.path.basename(file).replace(".md", "")
        )
        label = name
        title = name
        github_edit_url = (
            f"https://github.com/{GITHUB_REPO}/blob/main/modules/{relative_path}"
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

        io.create_dirs(os.path.dirname(result_file))

        tags = ["terraform", "aws", component]

        doc_content = DOC_TEMPLATE.render(
            label=label,
            title=title,
            content=content,
            change_log_content=change_log_content,
            github_repository=GITHUB_REPO,
            github_edit_url=github_edit_url,
            tags=tags,
        )

        io.save_string_to_file(result_file, doc_content)

        self.__create_indexes_for_subfolder(component)

    def __create_indexes_for_subfolder(self, component):
        for root, dirs, files in os.walk(os.path.join(self.docs_dir, component)):
            if not files and all(os.path.isdir(os.path.join(root, d)) for d in dirs):
                self.__render_category_index(root)

    def __render_category_index(self, dir):
        name = os.path.basename(dir)

        content = INDEX_CATEGORY_TEMPLATE.render(label=name, title=name)

        io.save_string_to_file(os.path.join(dir, INDEX_CATEGORY_JSON), content)
