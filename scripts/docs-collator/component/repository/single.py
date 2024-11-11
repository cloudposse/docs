import os

from .abstract import ComponentRepositoryAbstract
from ..component import Component

TERRAFORM_DIR = "src"


class ComponentRepositorySingle(ComponentRepositoryAbstract):

    @property
    def components(self):
        return [Component(
            repo=self,
            module_download_dir=self._module_download_dir,
            terraform_dir=os.path.join(self._module_download_dir, TERRAFORM_DIR),
            name=self.module_name,
            subdirs=self.subdirs
        )]
