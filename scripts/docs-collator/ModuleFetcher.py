import os

from AbstractFetcher import AbstractFetcher, MissingReadmeYamlException
import logging

DOCS_DIR = "docs"
IMAGES_DIR = "images"
SUBMODULES_DIR = "modules"
README_YAML = "README.yaml"
README_MD = "README.md"


class ModuleFetcher(AbstractFetcher):
    def __init__(self, github_provider, download_dir):
        super().__init__(github_provider, download_dir)

    def fetch(self, repo):
        module_download_dir = os.path.join(self.download_dir, repo.name)

        remote_files = set(self.github_provider.list_repo_dir(repo, "", False))

        if README_YAML not in remote_files:
            raise MissingReadmeYamlException()

        self._fetch_readme_yaml(repo, module_download_dir)

        if DOCS_DIR in remote_files:
            self._fetch_docs(repo, module_download_dir)

        if IMAGES_DIR in remote_files:
            self.__fetch_images(repo, module_download_dir)

        if SUBMODULES_DIR in remote_files:
            self.__fetch_submodules(repo, module_download_dir)

        self.__fetch_terraform_files(repo, module_download_dir, remote_files)

    def __fetch_images(self, repo, module_download_dir):
        remote_files = self.github_provider.list_repo_dir(repo, IMAGES_DIR)

        for remote_file in remote_files:
            self.github_provider.fetch_file(repo, remote_file, module_download_dir)

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
                logging.info(f"Fetching submodule docs for: {os.path.dirname(readme_file)}")
                self._fetch_docs(
                    repo,
                    module_download_dir,
                    submodule_dir=os.path.dirname(readme_file),
                )

        self.__fetch_terraform_files(repo, module_download_dir, remote_files)

    def __fetch_terraform_files(self, repo, module_download_dir, remote_files):
        for remote_file in remote_files:
            # We only need variables and output files to render terraform-docs.
            # _Hopefully_ the module follows the convention of having these files with all varialbes and outputs,
            # but that is an assumption we're making here for the sake of deployment speed.
            # if remote_file in ["variables.tf", "outputs.tf"]:
            if remote_file.endswith(".tf"):
                self.github_provider.fetch_file(repo, remote_file, module_download_dir)
