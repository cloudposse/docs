import base64
import logging
import os
import re
import pickle
from github import Github, GithubException
from functools import lru_cache
from utils import io

TERRAFORM_MODULE_NAME_PATTERN = re.compile(
    "^terraform-[a-zA-Z0-9]+-.*"
)  # convention is terraform-<PROVIDER>-<NAME>
COMPONENTS_NAME_PATTERN = re.compile(
    "^[a-zA-Z0-9]+.*"
)  # convention is terraform-<PROVIDER>-<NAME>
GITHUB_ACTION_NAME_PATTERN = re.compile(
    "^github-action-.*"
)  # convention is github-action-<NAME>

CACHE_DIR = ".cache"
CACHE_FILE = os.path.join(CACHE_DIR, "file_contents_cache.pkl")
REPOS_CACHE_FILE = os.path.join(CACHE_DIR, "repos_cache.pkl")


class GitHubProvider:
    def __init__(self, github_api_token):
        self.github = Github(github_api_token)
        self.cache = self.load_cache(CACHE_FILE)
        self.repos_cache = self.load_cache(REPOS_CACHE_FILE)

    def get_terraform_repos(self, github_org, includes_csv, excludes_csv):
        key = (includes_csv, excludes_csv)
        if key in self.repos_cache:
            return self.repos_cache[key]
        repos = self.__get_repos(
            github_org, includes_csv, excludes_csv, TERRAFORM_MODULE_NAME_PATTERN
        )
        self.repos_cache[key] = repos
        self.save_cache(REPOS_CACHE_FILE, self.repos_cache)
        return repos

    def get_components_repos(self, github_org, includes_csv, excludes_csv):
        key = (includes_csv, excludes_csv)
        if key in self.repos_cache:
            return self.repos_cache[key]
        repos = self.__get_repos(
            github_org, includes_csv, excludes_csv, COMPONENTS_NAME_PATTERN
        )
        self.repos_cache[key] = repos
        self.save_cache(REPOS_CACHE_FILE, self.repos_cache)
        return repos

    def get_github_actions_repos(self, github_org, includes_csv, excludes_csv):
        return self.__get_repos(github_org, includes_csv, excludes_csv, GITHUB_ACTION_NAME_PATTERN)

    def __get_repos(self, github_org, includes_csv, excludes_csv, pattern):
        repos = []

        excludes = self.__csv_to_set(excludes_csv)
        includes = self.__csv_to_set(includes_csv)

        if len(includes) > 0:
            for include in includes:
                repo = self.github.get_organization(github_org).get_repo(include)

                if not self.__is_valid(repo, pattern):
                    continue

                repos.append(repo)
        else:
            for repo in self.github.get_organization(github_org).get_repos():
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

    def get_file_content(self, repo, remote_file):
        """
        Fetches the content of a file from a GitHub repository AND cache the result
        """
        key = (repo.full_name, remote_file)
        if key in self.cache:
            return self.cache[key]
        content_encoded = repo.get_contents(
            remote_file, ref=repo.default_branch
        ).content
        content = base64.b64decode(content_encoded)
        self.cache[key] = content
        self.save_cache(CACHE_FILE, self.cache)
        return content

    def fetch_file(self, repo, remote_file, output_dir):
        io.create_dirs(os.path.join(output_dir, os.path.dirname(remote_file)))

        # fetch file content, supported by caching
        content = self.get_file_content(repo, remote_file)

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

    def load_cache(self, file_path):
        if os.path.exists(file_path):
            with open(file_path, "rb") as f:
                return pickle.load(f)
        return {}

    def save_cache(self, file_path, cache):
        os.makedirs(CACHE_DIR, exist_ok=True)
        with open(file_path, "wb") as f:
            pickle.dump(cache, f)
