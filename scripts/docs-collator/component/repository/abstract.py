
class ComponentRepositoryAbstract:
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
        raise NotImplementedError()
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
