import os

from AbstractFetcher import AbstractFetcher, MissingReadmeYamlException

DOCS_DIR = "docs"
ACTIONS_DIR = "actions"
README_YAML = "README.yaml"
README_MD = "README.md"
ACTION_YAML = "action.yml"


class GitHubActionFetcher(AbstractFetcher):
    def __init__(self, github_provider, download_dir):
        super().__init__(github_provider, download_dir)

    def fetch(self, repo):
        repo_download_dir = os.path.join(self.download_dir, repo.name)

        remote_files = self.github_provider.list_repo_dir(repo, "", False)
        remote_files = set(remote_files)

        if README_YAML not in remote_files:
            raise MissingReadmeYamlException()

        self._fetch_readme_yaml(repo, repo_download_dir)

        self._fetch_action_yaml(repo, repo_download_dir)

        self._fetch_atmos_yaml(repo, repo_download_dir)

        if DOCS_DIR in remote_files:
            self._fetch_docs(repo, repo_download_dir)

        if ACTIONS_DIR in remote_files:
            self.__fetch_sub_actions(repo, repo_download_dir)

    def _fetch_action_yaml(self, repo, module_download_dir):
        self.github_provider.fetch_file(repo, ACTION_YAML, module_download_dir)

    def __fetch_sub_actions(self, repo, module_download_dir):
        remote_files = self.github_provider.list_repo_dir(repo, ACTIONS_DIR)

        for remote_file in remote_files:
            if os.path.basename(remote_file) != README_MD:
                continue

            self.github_provider.fetch_file(repo, remote_file, module_download_dir)
