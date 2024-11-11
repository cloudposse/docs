import os

from AbstractRenderer  import AbstractRenderer
from .yml import ComponentRendererYaml
from .md import ComponentRendererMD
from component.repository.abstract import ComponentRepositoryAbstract


class ComponentRendererFactory:

    @staticmethod
    def produce(repo: ComponentRepositoryAbstract) -> list[AbstractRenderer]:
        result = []
        for component in repo.components:
            if component.has_readme_yaml():
                result.append(ComponentRendererYaml(component))
            else:
                result.append(ComponentRendererMD(component))
            for module in component.modules():
                result.append(ComponentRendererMD(module))
        return result
