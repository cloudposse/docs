import os

from .abstract import ComponentRepositoryAbstract
from ..component import Component
from utils import io

TERRAFORM_DIR = "src"

# Multiple components in a single repository is not used at the moment
# Leaving this here for future use
class ComponentRepositoryMultiple(ComponentRepositoryAbstract):
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

        files = io.get_filenames_in_dir(os.path.join(self._module_download_dir, TERRAFORM_DIR), "*.tf", True)
        components_dirs = {}

        for file in files:
            dir_name = os.path.dirname(file)
            name = os.path.basename(os.path.dirname(file))

            rel_dir = os.path.relpath(dir_name, os.path.join(self._module_download_dir, TERRAFORM_DIR))
            if rel_dir not in components_dirs:
                components_dirs[rel_dir] = name
        for component_dir in components_dirs.keys():
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
