import glob
import os

from .single import ComponentRepositorySingle
from .multiple import ComponentRepositoryMultiple

TERRAFORM_DIR = "src"


class ComponentRepositoryFactory:
    @staticmethod
    def produce(repo, module_download_dir):
        terraform_files = glob.glob(os.path.join(module_download_dir, TERRAFORM_DIR, '*.tf'))
        if len(terraform_files) == 0:
            return ComponentRepositoryMultiple(repo, module_download_dir)
        else:
            return ComponentRepositorySingle(repo, module_download_dir)
