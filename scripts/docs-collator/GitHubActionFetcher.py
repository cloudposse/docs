import base64
import logging
import os

from utils import io

DOCS_DIR = 'docs'
ACTIONS_DIR = 'actions'
TARGETS_MD = 'targets.md'
README_YAML = 'README.yaml'
README_MD = 'README.md'


class MissingReadmeYamlException(Exception):
    def __init__(self):
        self.message = "README.yaml is missing"
        super().__init__(self.message)


class GitHubActionFetcher:
    def __init__(self, github_provider, download_dir):
        self.download_dir = download_dir
        self.github_provider = github_provider

    def fetch(self, repo):
        repo_download_dir = os.path.join(self.download_dir, repo.name)

        remote_files = self.github_provider.list_repo_dir(repo, "", False)
        remote_files = set(remote_files)

        if README_YAML not in remote_files:
            raise MissingReadmeYamlException()

        self.__fetch_readme_yaml(repo, repo_download_dir)

        if DOCS_DIR in remote_files:
            self.__fetch_docs(repo, repo_download_dir)

        if ACTIONS_DIR in remote_files:
            self.__fetch_actions(repo, repo_download_dir)

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
        remote_files = self.github_provider.list_repo_dir(repo, DOCS_DIR)

        for remote_file in remote_files:
            if os.path.basename(remote_file) == TARGETS_MD:  # skip targets.md
                continue

            self.__fetch_file(repo, remote_file, module_download_dir)

    def __fetch_actions(self, repo, module_download_dir):
        remote_files = self.github_provider.list_repo_dir(repo, ACTIONS_DIR)

        for remote_file in remote_files:
            if os.path.basename(remote_file) != README_MD:
                continue

            self.__fetch_file(repo, remote_file, module_download_dir)
