def parse_repo_name(name):
    name_items = name.split('-')
    provider = name_items[1]
    module_name = '-'.join(name_items[2:])

    return provider, module_name
