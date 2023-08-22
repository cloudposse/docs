import re

TAG_REGEX = re.compile('(<)([0-9a-zA-Z._-]+)(>)', re.IGNORECASE)
BR_REGEX = re.compile(re.escape('<br>'), re.IGNORECASE)
SIDEBAR_LABEL_REGEX = re.compile('sidebar_label: .*', re.IGNORECASE)
CUSTOM_EDIT_URL_REGEX = re.compile('custom_edit_url: .*', re.IGNORECASE)
NAME_REGEX = re.compile('name: .*', re.IGNORECASE)
RELATIVE_LINK_PATTERN = r"\]\((?!http[s]?://)([^)\s]+)\)"


def fix_self_non_closing_br_tags(content):
    return BR_REGEX.sub('<br/>', content)


def fix_custom_non_self_closing_tags_in_pre(content):
    lines = content.splitlines()
    fixed_lines = []

    for line in lines:
        if not line.startswith('|'):
            fixed_lines.append(line)
            continue

        groups = re.findall(r'<pre>(.*?)</pre>', line)

        for group in groups:
            before = group
            after = TAG_REGEX.sub(r"&lt;\2&gt;", group)
            line = line.replace(f'<pre>{before}</pre>', f'<pre>{after}</pre>')

        fixed_lines.append(line)

    return '\n'.join(fixed_lines)


def shift_headings(content):
    lines = content.splitlines()
    fixed_lines = []
    shift_by = 0

    # figuring out how much to shift headings to the right so the biggest heading is H3
    for line in lines:
        if re.match(r'^#\s+', line):  # we have to shift all headings by 2
            shift_by = 2
            break

        if re.match(r'^##\s+', line):  # we have to shift all headings by 1
            shift_by = 1
            break

    if shift_by == 0:
        return content

    for line in lines:
        if not line.startswith('#'):  # not a heading
            fixed_lines.append(line)
            continue

        if shift_by == 1:
            fixed_lines.append(f"#{line}")
        elif shift_by == 2:
            fixed_lines.append(f"##{line}")

    return '\n'.join(fixed_lines)


def fix_sidebar_label(content, repo):
    provider, module_name = parse_terraform_repo_name(repo.name)
    return SIDEBAR_LABEL_REGEX.sub(f'sidebar_label: {module_name}', content)


def fix_github_edit_url(content, repo):
    github_edit_url = f"custom_edit_url: https://github.com/{repo.full_name}/blob/{repo.default_branch}/README.yaml"
    return CUSTOM_EDIT_URL_REGEX.sub(github_edit_url, content)


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
    return NAME_REGEX.sub(f'name: {repo.name}', content)


def parse_terraform_repo_name(name):
    name_items = name.split('-')
    provider = name_items[1]
    module_name = '-'.join(name_items[2:])

    return provider, module_name


def parse_github_action_repo_name(name):
    name_items = name.split('-')
    action_name = '-'.join(name_items[2:])

    return action_name


def replace_relative_links_with_github_links(repo, content, relative_path=None):
    links = re.findall(RELATIVE_LINK_PATTERN, content)

    for link in links:
        # ignore links to images, anchors and emails
        if link.startswith('images/') or link.startswith('#') or link.startswith('mailto:'):
            continue

        updated_link = link

        # remove leading './' or '/'
        if link.startswith('./'):
            updated_link = updated_link.replace('./', '', 1)
        elif link.startswith('/'):
            updated_link = updated_link.replace('/', '', 1)

        if relative_path:
            updated_link = f"{relative_path}/{updated_link}"

        content = content.replace(f"]({link})", f"](https://github.com/{repo.full_name}/tree/{repo.default_branch}/{updated_link})")

    return content
