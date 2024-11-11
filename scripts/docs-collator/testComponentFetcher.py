import unittest
from GitHubProvider import GitHubProvider
from ComponentFetcher import ComponentFetcher
from ComponentRepositorySingle import ComponentRepositorySingle
from ComponentRepositoryMultiple import ComponentRepositoryMultiple
from ComponentRendererFactory import ComponentRendererFactory
from ComponentRenderer import ComponentRenderer
import os
from unittest.mock import Mock


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

    def test_multiple(self):
        fetcher = ComponentFetcher(self.github_provider, self.download_dir)

        repo = self.github_provider.github.get_repo("cloudposse-terraform-components/aws-dns")
        self.assertEqual(repo.name, "aws-dns")
        component_repo = fetcher.fetch(repo)
        self.assertIsInstance(component_repo, ComponentRepositoryMultiple)
        renderers = ComponentRendererFactory.produce(component_repo)
        self.assertEqual(len(renderers), 2)
        for renderer in renderers:
            renderer.render(self.output_dir)

    def test_multiple_main_page(self):
        fetcher = ComponentFetcher(self.github_provider, self.download_dir)

        repo = self.github_provider.github.get_repo("cloudposse-terraform-components/aws-spacelift")
        self.assertEqual(repo.name, "aws-spacelift")
        component_repo = fetcher.fetch(repo)
        self.assertIsInstance(component_repo, ComponentRepositoryMultiple)
        renderers = ComponentRendererFactory.produce(component_repo)
        self.assertEqual(len(renderers), 4)
        for renderer in renderers:
            renderer.render(self.output_dir)


