import os

from .abstract import ComponentRepositoryAbstract
from ..component import Component
from utils import io

TERRAFORM_DIR = "src"


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
