import os

from AbstractFetcher import AbstractFetcher, MissingReadmeYamlException
from .repository.factory import ComponentRepositoryFactory

DOCS_DIR = "docs"
IMAGES_DIR = "images"
TERRAFORM_DIR = "src"
README_YAML = "README.yaml"
README_MD = "README.md"
SUBMODULES_DIR = "modules"


class ComponentFetcher(AbstractFetcher):
    def __init__(self, github_provider, download_dir):
        super().__init__(github_provider, download_dir)

    def fetch(self, repo):
        module_download_dir = os.path.join(self.download_dir, repo.name)

        remote_files = set(self.github_provider.list_repo_dir(repo, "", False))

        if README_YAML not in remote_files:
            raise MissingReadmeYamlException()

        self._fetch_readme_yaml(repo, module_download_dir)
        self._fetch_readme_md(repo, module_download_dir)

        if DOCS_DIR in remote_files:
            self._fetch_docs(repo, module_download_dir)

        if IMAGES_DIR in remote_files:
            self.__fetch_images(repo, module_download_dir)

        if TERRAFORM_DIR in remote_files:
            self.__fetch_terraform_files(repo, module_download_dir)

        if SUBMODULES_DIR in remote_files:
            self.__fetch_submodules(repo, module_download_dir)

        return ComponentRepositoryFactory.produce(repo, module_download_dir=module_download_dir)

    def __fetch_images(self, repo, module_download_dir):
        remote_files = self.github_provider.list_repo_dir(repo, IMAGES_DIR)

        for remote_file in remote_files:
            self.github_provider.fetch_file(repo, remote_file, module_download_dir)

    def __fetch_terraform_files(self, repo, module_download_dir):
        remote_files = self.github_provider.list_repo_dir(repo, TERRAFORM_DIR)
        for remote_file in remote_files:
            self.github_provider.fetch_file(repo, remote_file, module_download_dir)

    def _fetch_readme_md(self, repo, module_download_dir):
        self.github_provider.fetch_file(repo, README_MD, module_download_dir)

    def __fetch_submodules(self, repo, module_download_dir):
        remote_files = self.github_provider.list_repo_dir(repo, SUBMODULES_DIR)
        readme_files = {}

        for remote_file in remote_files:
            base_name = os.path.basename(remote_file)
            dir_name = os.path.dirname(remote_file)

            if base_name == README_YAML:
                readme_files[dir_name] = remote_file
            elif base_name == README_MD and dir_name not in readme_files:
                readme_files[dir_name] = remote_file

        for readme_file in readme_files.values():
            self.github_provider.fetch_file(repo, readme_file, module_download_dir)
            if os.path.basename(readme_file) == README_YAML:
                self._fetch_docs(
                    repo,
                    module_download_dir,
                    submodule_dir=os.path.dirname(readme_file),
                )
