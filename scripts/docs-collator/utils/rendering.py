import re
import subprocess
import yaml

TAG_REGEX = re.compile("(<)([0-9a-zA-Z._-]+)(>)", re.IGNORECASE)
BR_REGEX = re.compile(re.escape("<br>"), re.IGNORECASE)
SIDEBAR_LABEL_REGEX = re.compile("sidebar_label: .*", re.IGNORECASE)
CUSTOM_EDIT_URL_REGEX = re.compile("custom_edit_url: .*", re.IGNORECASE)
NAME_REGEX = re.compile("name: .*", re.IGNORECASE)
RELATIVE_LINK_PATTERN = r"\]\((?!http[s]?://)([^)\s]+)\)"


def fix_self_non_closing_br_tags(content):
    return BR_REGEX.sub("<br/>", content)


def fix_custom_non_self_closing_tags_in_pre(content):
    lines = content.splitlines()
    fixed_lines = []

    for line in lines:
        if not line.startswith("|"):
            fixed_lines.append(line)
            continue

        groups = re.findall(r"<pre>(.*?)</pre>", line)

        for group in groups:
            before = group
            after = TAG_REGEX.sub(r"&lt;\2&gt;", group)
            line = line.replace(f"<pre>{before}</pre>", f"<pre>{after}</pre>")

        fixed_lines.append(line)

    return "\n".join(fixed_lines)


def shift_headings(content):
    lines = content.splitlines()
    fixed_lines = []
    shift_by = 0

    # figuring out how much to shift headings to the right so the biggest heading is H3
    for line in lines:
        if re.match(r"^#\s+", line):  # we have to shift all headings by 2
            shift_by = 2
            break

        if re.match(r"^##\s+", line):  # we have to shift all headings by 1
            shift_by = 1
            break

    if shift_by == 0:
        return content

    for line in lines:
        if not line.startswith("#"):  # not a heading
            fixed_lines.append(line)
            continue

        if shift_by == 1:
            fixed_lines.append(f"#{line}")
        elif shift_by == 2:
            fixed_lines.append(f"##{line}")

    return "\n".join(fixed_lines)


def fix_sidebar_label(content, repo, submodule_name=""):
    module_name = submodule_name
    if not module_name:
        provider, module_name = parse_terraform_repo_name(repo.name)
    return SIDEBAR_LABEL_REGEX.sub(f"sidebar_label: {module_name}", content)


def fix_github_edit_url(content, repo, submodule_dir=""):
    subdir = f"/{submodule_dir}" if submodule_dir else ""
    github_edit_url = f"custom_edit_url: https://github.com/{repo.full_name}/blob/{repo.default_branch}{subdir}/README.yaml"
    return CUSTOM_EDIT_URL_REGEX.sub(github_edit_url, content)


def fix_mdx_format(content):
    """
    1. Replace all special characters outside code blocks for MDX support
    2. Fix the formatting for <details><summary> html tags
    3. Remove < and > from URLs
    4. Replace <= - docs/modules/library/aws/elasticache-redis/README.md

    Even after we re-render all terraform-docs, there are still some issues in our markdown files.
    This function cleans up the remaining issues.
    """
    replacements = {
        r"{": r"\{",  # Replace curly braces with literal
        r"}": r"\}",
        r"<details><summary>": r"<details>\n<summary>",  # Fix <details><summary> formatting
        r"<(https?://[^>]+)>": r"\1",  # Remove < and > from URLs
        r"<=": r"\<=",
    }

    in_code_block = False
    lines = content.splitlines()
    result = []
    for line in lines:
        # Check if the line starts or ends a code block
        if line.strip().startswith("```"):
            in_code_block = not in_code_block
            result.append(line)
            continue

        # Perform replacements only if not in a code block
        if not in_code_block:
            # Split the line by inline code blocks (single backticks)
            parts = re.split(r"(`[^`]*`)", line)
            for i, part in enumerate(parts):
                # Only perform replacements on parts that are not inline code blocks
                if not part.startswith("`") and not part.endswith("`"):
                    for pattern, replacement in replacements.items():
                        part = re.sub(pattern, replacement, part)
                parts[i] = part
            line = "".join(parts)

        result.append(line)

    return "\n".join(result)


def render_terraform_docs(terraform_module_path, terraform_docs_configuration):
    """
    Renders Terraform module documentation using terraform-docs with a provided configuration.
    """

    try:
        # Command to run terraform-docs
        command = [
            "mkdir",
            "-p",
            "./docs"
        ]

        # Run the command and capture the output
        return subprocess.run(command, check=True, capture_output=True, text=True)

    except subprocess.CalledProcessError as e:
        print(f"An error occurred while running creating docs dir: {e.stderr}")

    try:
        # Command to run terraform-docs
        command = [
            "terraform-docs",
            "markdown",
            terraform_module_path,
            "--config",
            terraform_docs_configuration,
        ]

        # Run the command and capture the output
        return subprocess.run(command, check=True, capture_output=True, text=True)

    except subprocess.CalledProcessError as e:
        print(f"An error occurred while running terraform-docs: {e.stderr}")


def remove_logo_from_the_bottom(content):
    return content.replace(
        '[<img src="https://cloudposse.com/logo-300x69.svg" height="32" align="right"/>](https://cpco.io/component)',
        "",
    )


def remove_targets_md(content):
    return re.sub("(.*?)docs/targets.md(.*?)\n", "", content)


def remove_prefix(string, prefix):
    if string.startswith(prefix):
        return string[len(prefix) :]


def rename_name(name, content):
    return NAME_REGEX.sub(f"name: {name}", content)


def parse_terraform_repo_name(name):
    name_items = name.split("-")
    provider = name_items[1]
    module_name = "-".join(name_items[2:])

    return provider, module_name


def parse_github_action_repo_name(name):
    name_items = name.split("-")
    action_name = "-".join(name_items[2:])

    return action_name


def replace_relative_links_with_github_links(repo, content, relative_path=None):
    links = re.findall(RELATIVE_LINK_PATTERN, content)

    for link in links:
        # ignore links to images, anchors and emails
        if (
            link.startswith("images/")
            or link.startswith("#")
            or link.startswith("mailto:")
        ):
            continue

        updated_link = link

        # remove leading './' or '/'
        if link.startswith("/"):
            updated_link = updated_link.replace("/", "", 1)
        else:
            if link.startswith("./"):
                updated_link = updated_link.replace("./", "", 1)
            if relative_path:
                updated_link = f"{relative_path}/{updated_link}"

        content = content.replace(
            f"]({link})",
            f"](https://github.com/{repo.full_name}/tree/{repo.default_branch}/{updated_link})",
        )

    return content


def get_tags_from_frontmatter(frontmatter):
    """
    Given a string of YAML frontmatter, return the tags.
    """
    # if empty, return empty
    if not frontmatter.strip():
        return []

    # Parse the YAML
    parsed_yaml = yaml.safe_load(frontmatter)
    # Get the tags
    tags = parsed_yaml.get("tags", [])

    return tags


def strip_frontmatter(content):
    """
    1. Strip the front matter from the content.
    2. Return the content and the front matter.
    """
    lines = content.splitlines()
    frontmatter = []
    content_lines = []
    in_frontmatter = False

    for index, line in enumerate(lines):
        if index == 0 and line.startswith("---"):
            in_frontmatter = True
            continue
        if in_frontmatter and line.startswith("---"):
            in_frontmatter = False
            continue

        if in_frontmatter:
            frontmatter.append(line)
        else:
            content_lines.append(line)

    # In case the frontmatter is at the beginning but not enclosed correctly
    if in_frontmatter:
        content_lines = frontmatter + content_lines
        frontmatter = []

    return "\n".join(content_lines), "\n".join(frontmatter)

def reformat_admonitions(content):
    """
    Reformat admonitions to be compatible with Docusaurus.
    """

    admonition_map = {
        "NOTE": "note",
        "TIP": "tip",
        "IMPORTANT": "important",
        "WARNING": "warning",
        "CAUTION": "danger",
    }

    # Split the content into lines for processing
    lines = content.split('\n')
    result = []  # Initialize a list to hold the result
    in_admonition = False  # Flag to indicate if we're inside an admonition block
    admonition_type = ""  # Variable to store the current admonition type

    for line in lines:
        # Check if the line marks the start of an admonition
        admonition_start = re.match(r'> \[\!(TIP|WARNING|NOTE|IMPORTANT|CAUTION|DANGER)\]', line)

        if admonition_start:
            # Set the flag to indicate we're inside an admonition
            in_admonition = True
            # Get the type of admonition, convert to lowercase, and store it
            original_admonition_type = admonition_start.group(1)
            admonition_type = admonition_map.get(original_admonition_type, original_admonition_type.lower())
            # Add the opening Docusaurus admonition tag with a newline
            result.append(f":::{admonition_type}")
            continue

        if in_admonition:
            # Process lines that are part of the admonition content
            if line.startswith('>'):
                # Remove the '>' prefix and add the line to the result
                # (But keep the second '>' in the case of '> >' for nested blockquotes)
                result.append(line[1:].strip())
            else:
                # Add the closing Docusaurus admonition tag and reset the flag
                result.append("\n:::")
                result.append(line)
                in_admonition = False
        else:
            # Add lines outside admonition blocks as they are
            result.append(line)

    return '\n'.join(result)

def remove_https_cloudposse_docs(content):
    """
    In component readmes, we have links to the cloudposse docs,
    but in docusaurus, we want to link to the relative path.

    Replace all instances of https://docs.cloudposse.com/ with /
    """
    return content.replace("https://docs.cloudposse.com/", "/")

def strip_title(content):
    """
    The title is created with frontmatter.
    Remove the title from the content.
    """
    return re.sub(r"# Component:(.*)", "", content).strip()

def replace_broken_links(content):
    """
    Replace broken links in content.
    Some components have broken links or local file references
    """
    broken_links = {
        "/LICENSE": "/reference/license/", # aws-ssosync/dist
        "addons.tf": "/components/library/aws/eks/cluster/#using-addons", # eks/cluster
        "additional-addon-support.tf": "/components/library/aws/eks/cluster/#adding-and-configuring-a-new-eks-addon", # eks/cluster
        "/modules/vpc": "/components/library/aws/vpc/" # eks/karpenter
    }
    for old_link, new_link in broken_links.items():
        content = content.replace(old_link, new_link)
    return content
