import re

TERRAFORM_MODULE_NAME_PATTERN = re.compile("^terraform-[a-zA-Z0-9]+-.*")  # convention is terraform-<PROVIDER>-<NAME>


def is_valid_module_name(name):
    return TERRAFORM_MODULE_NAME_PATTERN.match(name)


def parse_repo_name(name):
    name_items = name.split('-')
    provider = name_items[1]
    module_name = '-'.join(name_items[2:])

    return provider, module_name
