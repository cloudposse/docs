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
    name = remove_prefix(repo.name, 'terraform-')
    return regex.sub(f'sidebar_label: {name}', content)


def fix_github_edit_url(content, repo):
    regex = re.compile('custom_edit_url: .*', re.IGNORECASE)
    github_edit_url = f"custom_edit_url: https://github.com/{repo.full_name}/edit/{repo.default_branch}/README.md"
    return regex.sub(github_edit_url, content)


def remove_prefix(string, prefix):
    if string.startswith(prefix):
        return string[len(prefix):]
