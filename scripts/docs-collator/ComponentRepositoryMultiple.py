import os

from AbstractFetcher import AbstractFetcher, MissingReadmeYamlException
from ComponentRepositoryAbstract import ComponentRepositoryAbstract
from ComponentRepositorySingle import Component
from utils import io

DOCS_DIR = "docs"
IMAGES_DIR = "images"
TERRAFORM_DIR = "src"
README_YAML = "README.yaml"
README_MD = "README.md"
SUBMODULES_DIR = "modules"


class ComponentRepositoryMultiple(ComponentRepositoryAbstract):
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
        result = []
        if self.subdirs and len(self.subdirs) == 1 and self.subdirs[0] == self.module_name:
            result.append(
                Component(
                    repo=self,
                    module_download_dir=self._module_download_dir,
                    terraform_dir=self._module_download_dir,
                    name=self.module_name,
                    subdirs=[]
                )
            )

        components_dir = io.get_subfolders(os.path.join(self._module_download_dir, TERRAFORM_DIR))
        for component_dir in components_dir:
            path = os.path.join(self._module_download_dir, TERRAFORM_DIR, component_dir)
            result.append(
                Component(
                    repo=self,
                    module_download_dir=path,
                    terraform_dir=path,
                    name=component_dir,
                    subdirs=self.subdirs
                )
            )
        return result

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

