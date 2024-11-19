import os
import unittest

from GitHubProvider import GitHubProvider
from component.fetcher import ComponentFetcher
from component.repository.single import ComponentRepositorySingle
from component.repository.multiple import ComponentRepositoryMultiple
from component.renderer.factory import ComponentRendererFactory


class TestComponentFetcher(unittest.TestCase):
    github_provider = None
    def setUp(self):
        token = None
        if os.environ['PUBLIC_REPO_ACCESS_TOKEN']:
            token = os.environ['PUBLIC_REPO_ACCESS_TOKEN']
        self.github_provider = GitHubProvider(github_api_token=token)
        self.download_dir = "tmp/test/components"
        self.output_dir = "tmp/test/docs"

    def test_single_with_modules(self):
        fetcher = ComponentFetcher(self.github_provider, self.download_dir)

        repo = self.github_provider.github.get_repo("cloudposse-terraform-components/aws-account-map")
        self.assertEqual(repo.name, "aws-account-map")
        component_repo = fetcher.fetch(repo)
        self.assertIsInstance(component_repo, ComponentRepositorySingle)
        renderers = ComponentRendererFactory.produce(component_repo)
        self.assertEqual(len(renderers), 4)
        for renderer in renderers:
            renderer.render(self.output_dir)

    def test_single_with_changlelog(self):
        fetcher = ComponentFetcher(self.github_provider, self.download_dir)

        repo = self.github_provider.github.get_repo("cloudposse-terraform-components/aws-argocd-github-repo")
        self.assertEqual(repo.name, "aws-argocd-github-repo")
        component_repo = fetcher.fetch(repo)
        self.assertIsInstance(component_repo, ComponentRepositorySingle)
        renderers = ComponentRendererFactory.produce(component_repo)
        self.assertEqual(len(renderers), 1)
        for renderer in renderers:
            renderer.render(self.output_dir)


