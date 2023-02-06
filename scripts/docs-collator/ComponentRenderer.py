import os

from utils import io, rendering, templating

README_MD = 'README.md'
GITHUB_REPO = 'cloudposse/terraform-aws-components'
COMPONENT_README_TEMPLATE_FILE = 'component.readme.md'

SCRIPT_DIR = os.path.dirname(os.path.realpath(__file__))

jenv = templating.init_templating(os.path.join(SCRIPT_DIR, 'templates'))
DOC_TEMPLATE = jenv.get_template(COMPONENT_README_TEMPLATE_FILE)


class ComponentRenderer:
    def __init__(self, download_dir, docs_dir):
        self.download_dir = download_dir
        self.docs_dir = docs_dir

    def render(self, component):
        module_download_dir = os.path.join(self.download_dir, component)

        files = io.get_filenames_in_dir(module_download_dir, README_MD, True)

        for file in files:
            self.__render_doc(component, file)

    def __render_doc(self, component, file):
        module_download_dir = os.path.join(self.download_dir, component)
        content = io.read_file_to_string(file)
        content = rendering.fix_self_non_closing_br_tags(content)
        content = rendering.fix_custom_non_self_closing_tags_in_pre(content)
        content = rendering.remove_logo_from_the_bottom(content)
        relative_path = os.path.relpath(file, module_download_dir)
        result_file = os.path.join(self.docs_dir, os.path.relpath(file, module_download_dir))  # <module-name>/README.md

        label = component
        title = component
        description = component
        github_edit_url = f"https://github.com/{GITHUB_REPO}/edit/master/modules/{relative_path}"

        if len(relative_path.split('/')) > 2:  # this is submodule
            submodule_name = os.path.basename(os.path.dirname(result_file))

            label = submodule_name
            title = submodule_name
            description = submodule_name

            # renaming final file <module-name>/<module-name>.md
            result_file = os.path.join(os.path.dirname(result_file), f"{submodule_name}.md")

        io.create_dirs(os.path.dirname(result_file))

        tags = ['terraform', 'aws', component]

        doc_content = DOC_TEMPLATE.render(label=label,
                                          title=title,
                                          description=description,
                                          content=content,
                                          github_repository=GITHUB_REPO,
                                          github_edit_url=github_edit_url,
                                          tags=tags)

        io.save_string_to_file(result_file, doc_content)
