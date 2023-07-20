import logging
import os
import subprocess

from AbstractRenderer import AbstractRenderer, TerraformDocsRenderingError
from utils import io
from utils import rendering, templating

DOCS_DIR = 'docs'
IMAGES_DIR = 'images'
SUBMODULES_DIR = 'modules'
TARGETS_MD = 'targets.md'
README_YAML = 'README.yaml'
README_MD = 'README.md'
INDEX_CATEGORY_JSON = '_category_.json'
MODULES_README_TEMPLATE = 'readme.md'

SCRIPT_DIR = os.path.dirname(os.path.realpath(__file__))
TEMPLATES_DIR = os.path.join(SCRIPT_DIR, 'templates/modules')

jenv = templating.init_templating(TEMPLATES_DIR)
PROVIDER_INDEX_CATEGORY_TEMPLATE = jenv.get_template('provider_index_category.json')
INDEX_CATEGORY_TEMPLATE = jenv.get_template('index_category.json')
SUBMODULE_TEMPLATE = jenv.get_template('submodule.readme.md')


class ModuleRenderer(AbstractRenderer):
    def __init__(self, download_dir, docs_dir):
        self.download_dir = download_dir
        self.docs_dir = docs_dir

    def render(self, repo):
        logging.info(f"Rendering doc for: {repo.full_name}")
        module_download_dir = os.path.join(self.download_dir, repo.name)

        self._pre_rendering_fixes(repo, module_download_dir)

        provider, module_name = rendering.parse_terraform_repo_name(repo.name)
        module_docs_dir = os.path.join(self.docs_dir, provider, module_name)

        self.__render_readme(module_download_dir, module_docs_dir)

        readme_md_file = os.path.join(module_download_dir, README_MD)
        io.copy_file(readme_md_file, os.path.join(module_docs_dir, README_MD))

        readme_md_file = os.path.join(module_docs_dir, README_MD)
        self._post_rendering_fixes(repo, readme_md_file)

        self._copy_extra_resources_for_docs(module_download_dir, module_docs_dir)
        self.__copy_extra_resources_for_images(module_download_dir, module_docs_dir)
        self.__copy_extra_resources_for_submodules(repo, module_download_dir, module_docs_dir)

        self.__create_index_for_provider(repo)
        self.__create_indexes_for_subfolders(repo)

    def __render_readme(self, module_download_dir, module_docs_dir):
        readme_yaml_file = os.path.join(module_download_dir, README_YAML)
        readme_md_file = os.path.join(module_download_dir, README_MD)
        readme_tmpl_file = os.path.join(TEMPLATES_DIR, MODULES_README_TEMPLATE)

        io.create_dirs(module_docs_dir)

        response = subprocess.run(["make", "readme",
                                   f"README_TEMPLATE_FILE={readme_tmpl_file}",
                                   f"README_FILE={readme_md_file}",
                                   f"README_YAML={readme_yaml_file}",
                                   f"README_TEMPLATE_YAML={readme_yaml_file}",
                                   f"README_INCLUDES={module_download_dir}"], capture_output=True)

        if response.returncode != 0:
            error_message = response.stderr.decode("utf-8")
            raise TerraformDocsRenderingError(error_message)

        logging.info(f"Rendered: {readme_md_file}")

    def __copy_extra_resources_for_images(self, module_download_dir, module_docs_dir):
        extra_resources_dir = os.path.join(module_download_dir, IMAGES_DIR)
        files = io.get_filenames_in_dir(extra_resources_dir, '*', True)

        for file in files:
            if os.path.isdir(file):
                continue

            dest_file = os.path.join(module_docs_dir, IMAGES_DIR, os.path.relpath(file, extra_resources_dir))
            io.copy_file(file, dest_file)
            logging.info(f"Copied extra file: {dest_file}")

    def __copy_extra_resources_for_submodules(self, repo, module_download_dir, module_docs_dir):
        extra_resources_dir = os.path.join(module_download_dir, SUBMODULES_DIR)
        files = io.get_filenames_in_dir(extra_resources_dir, '*', True)

        for file in files:
            if not os.path.basename(file).endswith(README_MD):
                continue

            rel_path = os.path.relpath(file, module_download_dir)
            dest_file = os.path.join(module_docs_dir, rel_path)
            submodule_name = os.path.basename(os.path.dirname(dest_file))
            submodule_readme_content = io.read_file_to_string(file)
            submodule_readme_content = rendering.replace_relative_links_with_github_links(repo, submodule_readme_content, os.path.dirname(rel_path))

            content = SUBMODULE_TEMPLATE.render(label=submodule_name,
                                                title=submodule_name,
                                                description=submodule_name,
                                                github_edit_url=f"https://github.com/{repo.full_name}/blob/{repo.default_branch}/{rel_path}",
                                                content=submodule_readme_content)
            io.create_dirs(os.path.dirname(dest_file))
            io.save_string_to_file(dest_file, content)

            self.__post_rendering_fixes_for_submodule(dest_file)

            logging.info(f"Copied extra file: {dest_file}")

    def __create_index_for_provider(self, repo):
        provider, module_name = rendering.parse_terraform_repo_name(repo.name)
        json_file = os.path.join(self.docs_dir, provider, INDEX_CATEGORY_JSON)

        if not os.path.exists(json_file):
            content = PROVIDER_INDEX_CATEGORY_TEMPLATE.render(label=provider,
                                                              title=provider,
                                                              description=provider)
            io.save_string_to_file(json_file, content)

    def __create_indexes_for_subfolders(self, repo):
        # create category index files for dirs that doesn't have files because of docusaurus sidebar rendering issues
        provider, module_name = rendering.parse_terraform_repo_name(repo.name)
        files = io.get_filenames_in_dir(os.path.join(self.docs_dir, provider, module_name), '*', True)
        for file in files:
            if os.path.isfile(file) or io.has_files(file):
                continue

            self.__render_category_index(file)

    def __render_category_index(self, dir):
        name = os.path.basename(dir)

        content = INDEX_CATEGORY_TEMPLATE.render(label=name,
                                                 title=name)

        io.save_string_to_file(os.path.join(dir, INDEX_CATEGORY_JSON), content)

    def __post_rendering_fixes_for_submodule(self, readme_md_file):
        content = io.read_file_to_string(readme_md_file)
        content = rendering.fix_self_non_closing_br_tags(content)
        content = rendering.fix_custom_non_self_closing_tags_in_pre(content)
        io.save_string_to_file(readme_md_file, content)
