import re


def fix_self_non_closing_br_tags(content):
    regex = re.compile(re.escape('<br>'), re.IGNORECASE)
    return regex.sub('<br/>', content)


def fix_custom_non_self_closing_tags_in_pre(content):
    lines = content.splitlines()
    tag_regex = re.compile('(<)([0-9a-zA-Z._-]+)(>)', re.IGNORECASE)
    fixed_lines = []

    for line in lines:
        if not line.startswith('|'):
            fixed_lines.append(line)
            continue

        groups = re.findall(r'<pre>(.*?)</pre>', line)

        for group in groups:
            before = group
            after = tag_regex.sub(r"&lt;\2&gt;", group)
            line = line.replace(f'<pre>{before}</pre>', f'<pre>{after}</pre>')

        fixed_lines.append(line)

    return '\n'.join(fixed_lines)


def fix_sidebar_label(content, repo):
    regex = re.compile('sidebar_label: .*', re.IGNORECASE)
    provider, module_name = parse_terraform_repo_name(repo.name)
    return regex.sub(f'sidebar_label: {module_name}', content)


def fix_github_edit_url(content, repo):
    regex = re.compile('custom_edit_url: .*', re.IGNORECASE)
    github_edit_url = f"custom_edit_url: https://github.com/{repo.full_name}/blob/{repo.default_branch}/README.yaml"
    return regex.sub(github_edit_url, content)


def remove_logo_from_the_bottom(content):
    return content.replace(
        '[<img src="https://cloudposse.com/logo-300x69.svg" height="32" align="right"/>](https://cpco.io/component)',
        '')


def remove_targets_md(content):
    return re.sub("(.*?)docs/targets.md(.*?)\n", "", content)


def remove_prefix(string, prefix):
    if string.startswith(prefix):
        return string[len(prefix):]


def rename_name(repo, content):
    regex = re.compile('name: .*', re.IGNORECASE)
    return regex.sub(f'name: {repo.name}', content)


def parse_terraform_repo_name(name):
    name_items = name.split('-')
    provider = name_items[1]
    module_name = '-'.join(name_items[2:])

    return provider, module_name


def parse_github_action_repo_name(name):
    name_items = name.split('-')
    action_name = '-'.join(name_items[2:])

    return action_name
