import base64
import logging
import os

from utils import io

DOCS_DIR = 'docs'
IMAGES_DIR = 'images'
SUBMODULES_DIR = 'modules'
TARGETS_MD = 'targets.md'
README_YAML = 'README.yaml'
README_MD = 'README.md'


class MissingReadmeYamlException(Exception):
    def __init__(self):
        self.message = "README.yaml is missing"
        super().__init__(self.message)


class ModuleFetcher:
    def __init__(self, download_dir):
        self.download_dir = download_dir

    def fetch(self, repo):
        module_download_dir = os.path.join(self.download_dir, repo.name)

        remote_files = set([item.path for item in repo.get_contents("")])

        if README_YAML not in remote_files:
            raise MissingReadmeYamlException()

        self.__fetch_readme_yaml(repo, module_download_dir)

        if DOCS_DIR in remote_files:
            self.__fetch_docs(repo, module_download_dir)

        if IMAGES_DIR in remote_files:
            self.__fetch_images(repo, module_download_dir)

        if SUBMODULES_DIR in remote_files:
            self.__fetch_submodules(repo, module_download_dir)

    def __fetch_file(self, repo, remote_file, output_dir):
        io.create_dirs(os.path.join(output_dir, os.path.dirname(remote_file)))
        content_encoded = repo.get_contents(remote_file, ref=repo.default_branch).content
        content = base64.b64decode(content_encoded)
        output_file = os.path.join(output_dir, remote_file)
        io.save_to_file(output_file, content)
        logging.info(f"Fetched file: {remote_file}")

    def __fetch_readme_yaml(self, repo, module_download_dir):
        self.__fetch_file(repo, README_YAML, module_download_dir)

    def __fetch_docs(self, repo, module_download_dir):
        remote_files = self.__list_remote_files(repo, DOCS_DIR)

        for remote_file in remote_files:
            if os.path.basename(remote_file) == TARGETS_MD:  # skip targets.md
                continue

            self.__fetch_file(repo, remote_file, module_download_dir)

    def __fetch_images(self, repo, module_download_dir):
        remote_files = self.__list_remote_files(repo, IMAGES_DIR)

        for remote_file in remote_files:
            self.__fetch_file(repo, remote_file, module_download_dir)

    def __fetch_submodules(self, repo, module_download_dir):
        remote_files = self.__list_remote_files(repo, SUBMODULES_DIR)

        for remote_file in remote_files:
            if os.path.basename(remote_file) != README_MD:
                continue

            self.__fetch_file(repo, remote_file, module_download_dir)

    def __list_remote_files(self, repo, remote_dir):
        remote_files = repo.get_contents(remote_dir)

        result = []

        while remote_files:
            remote_file = remote_files.pop(0)

            if remote_file.type == "dir":
                remote_files.extend(repo.get_contents(remote_file.path))
            else:
                result.append(remote_file.path)

        return result
