import glob
import os

from ComponentRepositorySingle import ComponentRepositorySingle
from ComponentRepositoryMultiple import ComponentRepositoryMultiple

DOCS_DIR = "docs"
IMAGES_DIR = "images"
TERRAFORM_DIR = "src"
README_YAML = "README.yaml"
README_MD = "README.md"
SUBMODULES_DIR = "modules"


class ComponentRepositoryFactory:
    @staticmethod
    def produce(repo, module_download_dir):
        terraform_files = glob.glob(os.path.join(module_download_dir, 'src', '*.tf'))
        if len(terraform_files) == 0:
            return ComponentRepositoryMultiple(repo, module_download_dir)
        else:
            return ComponentRepositorySingle(repo, module_download_dir)
