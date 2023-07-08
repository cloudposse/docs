import logging
import os

from utils import io
from utils import rendering

README_YAML = 'README.yaml'
DOCS_DIR = 'docs'


class TerraformDocsRenderingError(Exception):
    def __init__(self, message):
        self.message = message
        super().__init__(f"Failed to render README.md. {message}")


class AbstractRenderer:
    def _pre_rendering_fixes(self, repo, module_download_dir):
        readme_yaml_file = os.path.join(module_download_dir, README_YAML)
        content = io.read_file_to_string(readme_yaml_file)
        content = rendering.remove_targets_md(content)
        content = rendering.rename_name(repo, content)
        content = rendering.replace_relative_links_with_github_links(repo, content)
        io.save_string_to_file(readme_yaml_file, content)

    def _post_rendering_fixes(self, repo, readme_md_file):
        content = io.read_file_to_string(readme_md_file)
        content = rendering.fix_self_non_closing_br_tags(content)
        content = rendering.fix_custom_non_self_closing_tags_in_pre(content)
        content = rendering.fix_github_edit_url(content, repo)
        content = rendering.fix_sidebar_label(content, repo)
        io.save_string_to_file(readme_md_file, content)

    def _copy_extra_resources_for_docs(self, module_download_dir, module_docs_dir):
        extra_resources_dir = os.path.join(module_download_dir, DOCS_DIR)
        files = io.get_filenames_in_dir(extra_resources_dir, '*', True)

        for file in files:
            if os.path.basename(file).lower().endswith('.md') or os.path.isdir(file):
                continue

            dest_file = os.path.join(module_docs_dir, DOCS_DIR, os.path.relpath(file, extra_resources_dir))
            io.copy_file(file, dest_file)

            logging.info(f"Copied extra file: {dest_file}")
