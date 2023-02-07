import os

DOCS_DIR = 'docs'
TARGETS_MD = 'targets.md'
README_YAML = 'README.yaml'


class MissingReadmeYamlException(Exception):
    def __init__(self):
        self.message = "README.yaml is missing"
        super().__init__(self.message)


class AbstractFetcher:
    def __init__(self, github_provider, download_dir):
        self.download_dir = download_dir
        self.github_provider = github_provider

    def _fetch_readme_yaml(self, repo, module_download_dir):
        self.github_provider.fetch_file(repo, README_YAML, module_download_dir)

    def _fetch_docs(self, repo, module_download_dir):
        remote_files = self.github_provider.list_repo_dir(repo, DOCS_DIR)

        for remote_file in remote_files:
            if os.path.basename(remote_file) == TARGETS_MD:  # skip targets.md
                continue

            self.github_provider.fetch_file(repo, remote_file, module_download_dir)
