import os

from AbstractFetcher import AbstractFetcher, MissingReadmeYamlException

DOCS_DIR = "docs"
IMAGES_DIR = "images"
TERRAFORM_DIR = "src"
README_YAML = "README.yaml"
README_MD = "README.md"


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
