import base64
import logging
import os
import re

from github import Github, GithubException

from utils import io

GITHUB_ORG = "cloudposse"
TERRAFORM_MODULE_NAME_PATTERN = re.compile(
    "^terraform-[a-zA-Z0-9]+-.*"
)  # convention is terraform-<PROVIDER>-<NAME>
GITHUB_ACTION_NAME_PATTERN = re.compile(
    "^github-action-.*"
)  # convention is github-action-<NAME>


class GitHubProvider:
    def __init__(self, github_api_token):
        self.github = Github(github_api_token)

    def get_terraform_repos(self, includes_csv, excludes_csv):
        return self.__get_repos(
            includes_csv, excludes_csv, TERRAFORM_MODULE_NAME_PATTERN
        )

    def get_github_actions_repos(self, includes_csv, excludes_csv):
        return self.__get_repos(includes_csv, excludes_csv, GITHUB_ACTION_NAME_PATTERN)

    def __get_repos(self, includes_csv, excludes_csv, pattern):
        repos = []

        excludes = self.__csv_to_set(excludes_csv)
        includes = self.__csv_to_set(includes_csv)

        if len(includes) > 0:
            for include in includes:
                repo = self.github.get_organization(GITHUB_ORG).get_repo(include)

                if not self.__is_valid(repo, pattern):
                    continue

                repos.append(repo)
        else:
            for repo in self.github.get_organization(GITHUB_ORG).get_repos():
                if not self.__is_valid(repo, pattern):
                    continue

                if repo.name in excludes:
                    continue

                repos.append(repo)

        return repos

    def list_repo_dir(self, repo, remote_dir, recursive=True):
        result = []

        try:
            remote_files = repo.get_contents(remote_dir)

            if recursive:
                while remote_files:
                    remote_file = remote_files.pop(0)

                    if remote_file.type == "dir":
                        remote_files.extend(repo.get_contents(remote_file.path))
                    else:
                        result.append(remote_file.path)
            else:
                result.extend([remote_file.path for remote_file in remote_files])
        except GithubException as e:
            logging.error(e.data)

        return result

    def fetch_file(self, repo, remote_file, output_dir):
        io.create_dirs(os.path.join(output_dir, os.path.dirname(remote_file)))
        content_encoded = repo.get_contents(
            remote_file, ref=repo.default_branch
        ).content
        content = base64.b64decode(content_encoded)
        output_file = os.path.join(output_dir, remote_file)
        io.save_to_file(output_file, content)
        logging.info(f"Fetched file: {remote_file}")

    def __csv_to_set(self, csv):
        if not csv:
            return set()

        return set([csv.strip() for csv in csv.split(",")])

    def __is_valid(self, repo, pattern):
        if repo.private:  # skip private repos
            return False

        if not pattern.match(repo.name):
            return False

        return True
