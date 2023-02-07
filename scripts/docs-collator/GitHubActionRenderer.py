import logging
import os
import subprocess

from Renderer import Renderer, TerraformDocsRenderingError
from utils import io
from utils import rendering, templating

TARGETS_MD = 'targets.md'
README_YAML = 'README.yaml'
README_MD = 'README.md'
INDEX_CATEGORY_JSON = '_category_.json'
README_TEMPLATE = 'readme.md'
DOC_SUBFOLDER = 'actions'

SCRIPT_DIR = os.path.dirname(os.path.realpath(__file__))
TEMPLATES_DIR = os.path.join(SCRIPT_DIR, 'templates/github-actions')

jenv = templating.init_templating(TEMPLATES_DIR)
INDEX_CATEGORY_TEMPLATE = jenv.get_template('index_category.json')


class GitHubActionRenderer(Renderer):
    def __init__(self, download_dir, docs_dir):
        self.download_dir = download_dir
        self.docs_dir = docs_dir

    def render(self, repo):
        logging.info(f"Rendering doc for: {repo.full_name}")
        repo_download_dir = os.path.join(self.download_dir, repo.name)

        self._pre_rendering_fixes(repo, repo_download_dir)

        action_name = rendering.parse_github_action_repo_name(repo.name)
        module_docs_dir = os.path.join(self.docs_dir, DOC_SUBFOLDER, action_name)

        self.__render_readme(repo_download_dir, module_docs_dir)

        readme_md_file = os.path.join(repo_download_dir, README_MD)
        io.copy_file(readme_md_file, os.path.join(module_docs_dir, README_MD))

        readme_md_file = os.path.join(module_docs_dir, README_MD)
        self._post_rendering_fixes(repo, readme_md_file)

        self._copy_extra_resources_for_docs(repo_download_dir, module_docs_dir)

    def __render_readme(self, module_download_dir, module_docs_dir):
        readme_yaml_file = os.path.join(module_download_dir, README_YAML)
        readme_md_file = os.path.join(module_download_dir, README_MD)
        readme_tmpl_file = os.path.join(TEMPLATES_DIR, README_TEMPLATE)

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
