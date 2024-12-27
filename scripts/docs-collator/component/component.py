import os

from utils import io

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

    @property
    def terraform_dir(self):
        return self._terraform_dir

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
