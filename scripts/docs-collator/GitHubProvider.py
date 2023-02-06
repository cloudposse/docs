import re

from github import Github

GITHUB_ORG = 'cloudposse'
TERRAFORM_MODULE_NAME_PATTERN = re.compile("^terraform-[a-zA-Z0-9]+-.*")  # convention is terraform-<PROVIDER>-<NAME>


class GitHubProvider:
    def __init__(self, github_api_token):
        self.github = Github(github_api_token)

    def get_repos(self, includes_csv, excludes_csv):
        repos = []

        excludes = self.__csv_to_set(excludes_csv)
        includes = self.__csv_to_set(includes_csv)

        if len(includes) > 0:
            for include in includes:
                repo = self.github.get_organization(GITHUB_ORG).get_repo(include)

                if not self.__is_valid(repo):
                    continue

                repos.append(repo)
        else:
            for repo in self.github.get_organization(GITHUB_ORG).get_repos():
                if not self.__is_valid(repo):
                    continue

                if repo.name in excludes:
                    continue

                repos.append(repo)

        return repos

    def __csv_to_set(self, csv):
        if not csv:
            return set()

        return set([csv.strip() for csv in csv.split(",")])

    def __is_valid(self, repo):
        if repo.private:  # skip private repos
            return False

        if not self.__does_name_match_terraform_module(repo.name):
            return False

        return True

    def __does_name_match_terraform_module(self, name):
        return TERRAFORM_MODULE_NAME_PATTERN.match(name)
