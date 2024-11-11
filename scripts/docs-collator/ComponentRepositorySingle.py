import os

from ComponentRepositoryAbstract import ComponentRepositoryAbstract
from utils import io

DOCS_DIR = "docs"
IMAGES_DIR = "images"
TERRAFORM_DIR = "src"
README_YAML = "README.yaml"
README_MD = "README.md"
SUBMODULES_DIR = "modules"


class Component:
    _terraform_dir = None
    _name = None
    _provider = None
    _module_download_dir = None
    _repo = None
    _subdirs = []

    def __init__(self, repo, module_download_dir, terraform_dir, name, subdirs=[]):
        self._repo = repo
        self._module_download_dir = module_download_dir
        self._terraform_dir = terraform_dir
        self._name = name
        self._subdirs = subdirs

    @property
    def name(self):
        return self._name

    @property
    def dir(self):
        return self._module_download_dir

    def has_readme_yaml(self):
        return os.path.exists(os.path.join(self._module_download_dir, README_YAML))

    @property
    def provider(self):
        return self._repo.provider

    @property
    def subdirs(self):
        return self._subdirs

    @property
    def repo(self):
        return self._repo

    def modules(self):
        extra_resources_dir = os.path.join(self._terraform_dir, SUBMODULES_DIR)
        files = io.get_filenames_in_dir(extra_resources_dir, "*", True)
        readme_files = {}

        for file in files:
            base_name = os.path.basename(file)
            dir_name = os.path.dirname(file)
            name = os.path.basename(os.path.dirname(file))

            rel_dir = os.path.relpath(dir_name, self._terraform_dir).split("/")[:-1]

            subdirs = self._subdirs.copy()
            subdirs.append(self.name)
            subdirs.extend(rel_dir)

            if base_name == README_YAML:
                readme_files[dir_name] = Component(
                    repo=self._repo,
                    module_download_dir=dir_name,
                    terraform_dir=dir_name,
                    name=name,
                    subdirs=subdirs
                )
            elif base_name == README_MD and dir_name not in readme_files:
                readme_files[dir_name] = Component(
                    repo=self._repo,
                    module_download_dir=dir_name,
                    terraform_dir=dir_name,
                    name=name,
                    subdirs=subdirs
                )

        return readme_files.values()


class ComponentRepositorySingle(ComponentRepositoryAbstract):
    _full_name = None
    _name = None
    _default_branch = None
    _module_download_dir = None

    def __init__(self, repo, module_download_dir):
        self._full_name = repo.full_name
        self._name = repo.name
        self._module_download_dir = module_download_dir
        self._default_branch = repo.default_branch

    @property
    def components(self):
        return [Component(
            repo=self,
            module_download_dir=self._module_download_dir,
            terraform_dir=os.path.join(self._module_download_dir, TERRAFORM_DIR),
            name=self.module_name,
            subdirs=self.subdirs
        )]

    @property
    def full_name(self):
        return self._full_name

    @property
    def name(self):
        return self._name

    @property
    def dir(self):
        return self._module_download_dir

    @property
    def default_branch(self):
        return self._default_branch

    @property
    def provider(self):
        return self._parse_terraform_repo_name()[0]

    @property
    def subdirs(self):
        return self._parse_terraform_repo_name()[1]

    @property
    def module_name(self):
        return self._parse_terraform_repo_name()[2]

    def _parse_terraform_repo_name(self):
        name_items = self._name.split("-")
        provider = name_items[0]
        module_name = "-".join(name_items[1:])
        subdirs = []
        if module_name == "":
            provider = "null"
            module_name = self._name
        elif module_name.startswith("eks-"):
            subdirs = ["eks"]
            module_name = module_name[len("eks-"):]
        elif module_name.startswith("spacelift"):
            subdirs = ["spacelift"]
            module_name = module_name
        elif module_name == "sso":
            module_name = "aws-sso"
        elif module_name == "saml":
            module_name = "aws-saml"
        elif module_name == "backup":
            module_name = "aws-backup"
        elif module_name == "ssosync":
            module_name = "aws-ssosync"
        elif module_name == "config":
            module_name = "aws-config"
        elif module_name == "config":
            module_name = "aws-config"
        elif module_name == "argocd":
            subdirs = ["eks"]
        elif module_name == "datadog":
            module_name = "datadog-configuration"
        elif module_name == "tgw":
            subdirs = ["tgw"]
        return provider, subdirs, module_name
