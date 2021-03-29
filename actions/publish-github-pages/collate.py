#!/usr/bin/env python3
# entrypoint.py
#
# #### PARAMETERS ####
# Input parameters:
# GITHUB_PAGES_DIRECTORY - the directory to write the rendered website files to (should not be an absolute path)
# GITHUB_PAGES_REPO - repo containing documentation to be deployed to GitHub Pages
# GITHUB_PAGES_PULL_BRANCH - the branch of the repo which contains the documentation
# GITHUB_PAGES_PUSH_BRANCH - the branch of the repo which GitHub Pages will deploy to
# CONTENT - comma-separated list of directories in the top level of the repo that contains documentation
# HUGO_URL - URL of the Hugo site after deployment
# HUGO_PUBLISH_DIR - directory in the repo that GitHub Pages will deploy to
# HUGO_REPO - Cloud Posse repository containing Hugo scaffolding
# HUGO_CONFIG - location of to-be-written Hugo config file (actual location not important)
# HTMLTEST_CONFIG - location of to-be-written htmltest config file (actual location not important)
#
# Example parameter values:
# GITHUB_PAGES_DIRECTORY=github_pages
# GITHUB_PAGES_REPO=https://github.com/cloudposse/docs # or, e.g., github.com/project/infrastructure.git
# GITHUB_PAGES_PULL_BRANCH=master # or current-docs-feature-branch
# GITHUB_PAGES_PUSH_BRANCH=production # or, e.g., docs
# CONTENT=docs,content
# HUGO_URL=cloudposse.github.io/docs
# HUGO_PUBLISH_DIR=public
# HUGO_REPO=https://github.com/cloudposse/docs
# HUGO_CONFIG=hugo.config.new
# HTMLTEST_CONFIG=.htmltest.config.new

import os
import re
import subprocess
import yaml
from git import Repo
from shutil import copy2, copytree, rmtree

def main():
    # Read in necessary globals from env vars.
    read_in_env_vars()

    # Checkout out all repos needed for this action.
    checkout_repos()

    # Create a separate build folder, STAGING_DIR, and populate it with the essential Hugo build
    # files.
    stage_hugo_build_files()

    # Collate all local documentation inside the build folder, renaming and rearranging as needed.
    collate_docs_files()

def read_in_env_vars():
    # Read env vars into Python globals.
    # (All globals can be defined by passing in an env var with that name and with an optional
    # "INPUT_" prefix. The "INPUT_" prefix is supported for compatibility with the GitHub Actions
    # `with:` syntax.)

    # Syntax: (varaible_name, default value [if any], whether to strip parentheses from the end of the variable)
    global_vars = [("GITHUB_PAGES_DIRECTORY", None, True),
                   ("GITHUB_PAGES_REPO", None, False),
                   ("GITHUB_PAGES_PULL_BRANCH", None, False),
                   ("GITHUB_PAGES_PUSH_BRANCH", None, False),
                   ("CONTENT", None, False),
                   ("HUGO_URL", None, False),
                   ("HUGO_PUBLISH_DIR", None, False),
                   ("HUGO_REPO", "https://github.com/cloudposse/docs", False),
                   ("HUGO_CONFIG", None, False),
                   ("HTMLTEST_CONFIG", None, False),
                   ("GITHUB_PAGES_PULL_PATH", "/tmp/pull/", True),
                   ("GITHUB_PAGES_HUGO_PATH", "/tmp/hugo/", True),
                   ("GITHUB_PAGES_PUSH_PATH", os.path.join( os.getcwd(), GITHUB_PAGES_DIRECTORY.lstrip('/')), True),
                   ("STAGING_DIR", None, True)]
    for global_var in global_vars:
        create_global(*global_var)

def create_global(global_name, default=None, rstrip_slash=False):
    # Define a global variable and optionally declare a default value for it and trim slashes off
    # the right end of it.
    globals()[global_name] = os.environ.get(global_name) \
                             or os.environ.get("INPUT_" + global_name) \
                             or default
    if rstrip_slash:
        eval(global_name + ".rstrip('/')")

def checkout_repos():

    # Check out:
    # 1) Essential Hugo build tools
    Repo.clone_from(HUGO_REPO, GITHUB_PAGES_HUGO_PATH)

    # 2) Site-specific documentation
    Repo.clone_from(GITHUB_PAGES_REPO, GITHUB_PAGES_PULL_PATH, branch=GITHUB_PAGES_PULL_BRANCH)

    # 3) The GitHub Pages deployment branch for this site
    Repo.clone_from(GITHUB_PAGES_REPO, GITHUB_PAGES_PUSH_PATH, branch=GITHUB_PAGES_PUSH_BRANCH)

def stage_hugo_build_files():
    # This function assumes that the repo pointed to by HUGO_REPO has a structure that is similar
    # to https://github.com/cloudposse/docs. If that is not the case, some of the below copy
    # commands may fail.
    os.mkdir(STAGING_DIR)
    copy_dirs = ["tasks", "themes", "static", "layouts", "content"]
    for copy_dir in copy_dirs:
        copytree( os.path.join(GITHUB_PAGES_HUGO_PATH, copy_dir), os.path.join(STAGING_DIR, copy_dir) )
    copy_files = [".gitignore", ".htmltest.yml", "config.yaml", "Dockerfile", "Makefile"]
    for copy_file in copy_files:
        copy2( os.path.join(GITHUB_PAGES_HUGO_PATH, copy_file), STAGING_DIR )

def collate_docs_files():
    content_folders = CONTENT.split(",")
    for content_folder in content_folders:
        content_base_path = os.path.join(GITHUB_PAGES_PULL_PATH, content_folder)

        # Rename and rearrange content files as needed.
        rearrange_files(content_base_path)

        # Now that all .md files have been renamed and rearranged appropriately,
        # collate the docs (.md pages) inside the STAGING_DIR.
        for root, dirs, files in os.walk( content_base_path, topdown=False ):

            # If this is a top-level dir (i.e., it is listed directly in CONTENT) and it has no subdirs,
            # every .md file in this folder becomes the basis for a top-level object.
            if root == content_base_path and not len(dirs):
                markdown_files = [potential_md_file for potential_md_file in files if ".md" in potential_md_file]
                for markdown_file in markdown_files:
                    promote_markdown_file(markdown_file, root)

            # Otherwise, we're gonna copy everything over and preserve the existing file heirarchy.
            else:
                markdown_files = [potential_md_file for potential_md_file in files if ".md" in potential_md_file]
                staging_root = root.replace(GITHUB_PAGES_PULL_PATH, "").lstrip('/')
                weight = 1
                for markdown_file in markdown_files:
                    origin_path = os.path.join(root, markdown_file)
                    destination_path = os.path.join(STAGING_DIR, "content", staging_root, markdown_file)
                    inject_frontmatter(origin_path, weight=weight)
                    os.renames( origin_path, destination_path )
                    weight = weight + 1

def rearrange_files(content_base_path):

    # rename all `README.md` to `_index.md` (hugo convention)
    for root, dirs, files in os.walk(content_base_path):
        for local_file in files:
            if local_file=="README.md":
                os.rename( os.path.join(root, local_file), os.path.join(root, "_index.md") )

    # Now, loop over all subfolders of the current top-level folder ("content_base_path")
    # and, if a given folder 1) contains no subfolders, and 2) has only a single md file
    # (which should be `_index.md` by this point), then promote that .md file one level and rename
    # it after its containing folder. E.g., `mv foobar/_index.md foobar.md`.
    #
    # After promoting the .md file, delete its original folder.
    #
    # Since, in some cases, we will need to flatten multiple nested layers of a file hierarchy this
    # way, this loop will continue running until it can traverse the entire remaining directory
    # structure one time without needing to make any more changes.
    hierarchy_modified = True # init value
    while hierarchy_modified:
        hierarchy_modified = False
        for root, dirs, files in os.walk(content_base_path):
            # os.walk loops over all folders in a directory tree, include the base directory.
            # In our case, we want to ignore the base directory (we don't want to delete the base
            # directory, even if it only has 1 .md file and no subfolders), so we're adding this if
            # check.
            if root != content_base_path:
                # If there are no subfolders of this folder
                if not len(dirs):
                    markdown_files = [potential_md_file for potential_md_file in files if ".md" in potential_md_file]
                    # And if there is only 1 markdown file in this folder
                    if len(markdown_files) == 1:
                        # Move the only markdown file in this folder (markdown_files[0]) from its
                        # from its current folder (root). Take it up one level
                        # (root.rsplit('/',1)[0]) and name it after its erstwhile parent directory
                        # (root.rsplit('/',1)[1] ".md").
                        os.rename(os.path.join(root, markdown_files[0]),
                                  os.path.join(root.rsplit('/',1)[0], root.rsplit('/',1)[1] + ".md") )
                        rmtree(root)
                        hierarchy_modified = True
                    elif len(markdown_files) == 0:
                        rmtree(root)
                        hierarchy_modified = True

def inject_frontmatter(file_path, weight=1):

    # check for frontmatter in this file
    frontmatter_flag = True
    with open(file_path, "r") as markdown_file:
        line = markdown_file.readline()
        if not re.match("^---", line):
            frontmatter_flag = False

    # if the frontmatter wasn't found, create it by finding the markdown header
    # and using it as the core of the frontmatter
    if not frontmatter_flag:
        title = ""
        with open(file_path, "r") as markdown_file:
            for line in markdown_file:
                match_results = re.match("^\s*#+\s*(.*)$", line)
                if match_results:
                    title = match_results.group(1)
                    break

        # write out file with frontmatter
        with open(file_path, "r") as markdown_file:
            input_file = markdown_file.read()
        with open(file_path, "w") as markdown_file:
            if not title:
                title="default_title"
            yaml_dict = {
                            "title": title,
                            "description": "",
                            "weight": weight
                        }
            yaml_string = yaml.dump(yaml_dict)
            front_matter_string = "---\n" + yaml_string + "---\n\n"
            markdown_file.write(front_matter_string)
            markdown_file.write(input_file)

def promote_markdown_file(markdown_file, root):

    # create a folder for the markdown file
    markdown_basename = os.path.splitext(markdown_file)[0]
    os.mkdir( os.path.join(STAGING_DIR, "content", markdown_basename) )

    # move the markdown file into the folder
    origin_path = os.path.join(root, markdown_file)
    destination_path = os.path.join(STAGING_DIR, "content", markdown_basename, markdown_file)
    inject_frontmatter(origin_path)
    os.renames( origin_path, destination_path )

    # create _index.md file for the folder
    yaml_dict = {
                    "title": markdown_basename.capitalize(),
                    "description": "",
                    "icon": "fa fa-brain",
                    "weight": 1
                }
    yaml_string = yaml.dump(yaml_dict)
    index_string = "---\n" + yaml_string + "---\n\n"
    index_path = os.path.join(STAGING_DIR, "content", markdown_basename, "_index.md")
    with open(index_path, "w")as index_file:
        index_file.write(index_string)

if __name__=="__main__":
    main()
