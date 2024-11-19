import logging
import os

from utils import io
from utils import rendering

README_YAML = "README.yaml"
DOCS_DIR = "docs"
CHANGELOG_MD = "CHANGELOG.md"

class TerraformDocsRenderingError(Exception):
    def __init__(self, message):
        self.message = message
        super().__init__(f"Failed to render README.md. {message}")


class AbstractRenderer:

    def render(self):
        raise NotImplementedError

    def _pre_rendering_fixes(self, repo, module_download_dir, submodule_dir=""):
        readme_yaml_file = os.path.join(module_download_dir, submodule_dir, README_YAML)
        content = io.read_file_to_string(readme_yaml_file)
        content = rendering.remove_targets_md(content)
        if submodule_dir == "":
            content = rendering.rename_name(repo.name, content)
        else:
            content = rendering.rename_name(
                "pre-fix-" + os.path.basename(submodule_dir), content
            )
        io.save_string_to_file(readme_yaml_file, content)

        if os.path.exists(os.path.join(module_download_dir, submodule_dir, CHANGELOG_MD)):
            import yaml

            with open(readme_yaml_file, 'r') as file:
                readme_yaml = yaml.safe_load(file)
                if "include" not in readme_yaml:
                    readme_yaml["include"] = []
                readme_yaml["include"].append(CHANGELOG_MD)
            with open(readme_yaml_file, 'w') as file:
                yaml.dump(readme_yaml, file)

            change_md_file = os.path.join(module_download_dir, submodule_dir, CHANGELOG_MD)
            content = io.read_file_to_string(change_md_file)
            content = rendering.shift_headings(content)
            lines = content.splitlines()
            lines.insert(0, "## Changelog")
            content = "\n".join(lines)
            io.save_string_to_file(change_md_file, content)

    def _post_rendering_fixes(self, repo, readme_md_file, submodule_dir=""):
        content = io.read_file_to_string(readme_md_file)
        content = rendering.fix_self_non_closing_br_tags(content)
        content = rendering.fix_custom_non_self_closing_tags_in_pre(content)
        content = rendering.fix_github_edit_url(content, repo, submodule_dir)
        content = rendering.fix_sidebar_label(
            content, repo, os.path.basename(submodule_dir)
        )
        content = rendering.replace_relative_links_with_github_links(
            repo, content, submodule_dir
        )
        content = rendering.fix_mdx_format(content)
        content = rendering.reformat_admonitions(content)
        io.save_string_to_file(readme_md_file, content)

    def _copy_extra_resources_for_docs(self, module_download_dir, module_docs_dir):
        extra_resources_dir = os.path.join(module_download_dir, DOCS_DIR)
        files = io.get_filenames_in_dir(extra_resources_dir, "*", True)

        for file in files:
            if os.path.basename(file).lower().endswith(".md") or os.path.isdir(file):
                continue

            dest_file = os.path.join(
                module_docs_dir, DOCS_DIR, os.path.relpath(file, extra_resources_dir)
            )
            io.copy_file(file, dest_file)

            logging.info(f"Copied extra file: {dest_file}")
