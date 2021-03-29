#!/usr/bin/env python3
# entrypoint.py
#
# #### PARAMETERS ####
# Input parameters:
# GITHUB_PAGES_DIRECTORY - the directory to write the rendered website files to
# GITHUB_PAGES_REPO - repo containing documentation to be deployed to GitHub Pages
# GITHUB_PAGES_PULL_BRANCH - the branch of the repo which contains the documentation
# GITHUB_PAGES_PUSH_BRANCH - the branch of the repo which GitHub Pages will deploy to
# CONTENT - comma-separated list of directories in the top level of the repo that contains documentation
# HUGO_URL - URL of the Hugo site after deployment
# HUGO_PUBLISH_DIR - directory in the repo that GitHub Pages will deploy to
# HUGO_REPO - CloudPosse repository containing Hugo infrastructure
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
from git import Repo
from shutil import copy2, copytree, rmtree

def main():
    read_in_env_vars()
    checkout_repos()

    # Create a separate build folder, ${STAGING_DIR}, and populate it with the essential files from HUGO_REPO
    # (The rest of this script assumes HUGO_REPO=https://github.com/cloudposse/docs.)
    os.mkdir(STAGING_DIR)
    copy_dirs = ["tasks", "themes", "static", "layouts", "content"]
    for copy_dir in copy_dirs:
        copytree( os.path.join(GITHUB_PAGES_HUGO_PATH, copy_dir), os.path.join(STAGING_DIR, copy_dir) )
    for copy_file in [".gitignore", ".htmltest.yml", "config.yaml", "Dockerfile", "Makefile"]:
        copy2( os.path.join(GITHUB_PAGES_HUGO_PATH, copy_file), STAGING_DIR )

    # Collate all local documentation inside the build folder
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
                    insert_frontmatter(origin_path, weight=weight)
                    os.renames( origin_path, destination_path )
                    weight = weight + 1

def read_in_env_vars():

    # GITHUB_PAGES_DIRECTORY - the directory to write the rendered website files to
    global GITHUB_PAGES_DIRECTORY
    GITHUB_PAGES_DIRECTORY = os.environ["GITHUB_PAGES_DIRECTORY"]
    GITHUB_PAGES_DIRECTORY = GITHUB_PAGES_DIRECTORY.rstrip("/")
    
    # GITHUB_PAGES_REPO - repo containing documentation to be deployed to GitHub Pages
    global GITHUB_PAGES_REPO
    GITHUB_PAGES_REPO = os.environ["GITHUB_PAGES_REPO"]
    
    # GITHUB_PAGES_PULL_BRANCH - the branch of the repo which contains the documentation
    global GITHUB_PAGES_PULL_BRANCH
    GITHUB_PAGES_PULL_BRANCH = os.environ["GITHUB_PAGES_PULL_BRANCH"]
    
    # GITHUB_PAGES_PUSH_BRANCH - the branch of the repo which GitHub Pages will deploy from
    global GITHUB_PAGES_PUSH_BRANCH
    GITHUB_PAGES_PUSH_BRANCH = os.environ["GITHUB_PAGES_PUSH_BRANCH"]
    
    # CONTENT - comma-separated list of directories in the top level of the repo that contain documentation
    global CONTENT
    CONTENT = os.environ["CONTENT"]
    
    # HUGO_URL - URL of the Hugo site after deployment
    global HUGO_URL
    HUGO_URL = os.environ["HUGO_URL"]
    
    # HUGO_PUBLISH_DIR - directory in the repo that GitHub Pages will deploy from
    global HUGO_PUBLISH_DIR
    HUGO_PUBLISH_DIR = os.environ["HUGO_PUBLISH_DIR"]
    
    # HUGO_REPO - CloudPosse repository containing Hugo infrastructure
    global HUGO_REPO
    HUGO_REPO = os.getenv("HUGO_REPO", "https://github.com/cloudposse/docs")
    
    # HUGO_CONFIG - location of to-be-written Hugo config file (actual location not important)
    global HUGO_CONFIG
    HUGO_CONFIG = os.environ["HUGO_CONFIG"]
    
    # HTMLTEST_CONFIG - location of to-be-written htmltest config file (actual location not important)
    global HTMLTEST_CONFIG
    HTMLTEST_CONFIG = os.environ["HTMLTEST_CONFIG"]
    
    # This will contain the master branch of GITHUB_PAGES_REPO.
    global GITHUB_PAGES_PULL_PATH
    GITHUB_PAGES_PULL_PATH = "/tmp/pull/"
    GITHUB_PAGES_PULL_PATH = GITHUB_PAGES_PULL_PATH.rstrip("/")
    
    # This will contain the generic infrastructure needed to build the GitHub Pages site. 
    global GITHUB_PAGES_HUGO_PATH 
    GITHUB_PAGES_HUGO_PATH = "/tmp/hugo/" 
    GITHUB_PAGES_HUGO_PATH = GITHUB_PAGES_HUGO_PATH.rstrip("/")
    
    # This will contain the GitHub Pages deployment branch of GITHUB_PAGES_REPO.
    global GITHUB_PAGES_PUSH_PATH
    GITHUB_PAGES_PUSH_PATH = os.path.join( os.getcwd(), GITHUB_PAGES_DIRECTORY)
    GITHUB_PAGES_PUSH_PATH = GITHUB_PAGES_PUSH_PATH.rstrip("/")
    
    # Staging directory used for preparing files before hugo generation
    global STAGING_DIR
    STAGING_DIR = os.environ["STAGING_DIR"]
    STAGING_DIR = STAGING_DIR.rstrip("/")

def checkout_repos():
    # Check out:
    # 1) Essential Hugo build tools
    Repo.clone_from(HUGO_REPO, GITHUB_PAGES_HUGO_PATH)

    # 2) Site-specific documentation
    Repo.clone_from(GITHUB_PAGES_REPO, GITHUB_PAGES_PULL_PATH, branch=GITHUB_PAGES_PULL_BRANCH)

    # 3) The GitHub Pages deployment branch for this site
    Repo.clone_from(GITHUB_PAGES_REPO, GITHUB_PAGES_PUSH_PATH, branch=GITHUB_PAGES_PUSH_BRANCH)

def rearrange_files(content_base_path):
    # rename all `README.md` to `_index.md` (hugo convention)
    for root, dirs, files in os.walk(content_base_path):
        for local_file in files:
            if local_file=="README.md":
                os.rename( os.path.join(root, local_file), os.path.join(root, "_index.md") )
    # folders with no subfolders, and only a single md file (usually `_index.md`): `mv foobar/_index.md foobar.md`
    hierarchy_modified = True # init value
    while hierarchy_modified:
        hierarchy_modified = False
        for root, dirs, files in os.walk(content_base_path):
            if root != content_base_path:
                if not len(dirs):
                    markdown_files = [potential_md_file for potential_md_file in files if ".md" in potential_md_file]
                    if len(markdown_files) == 1:
                        os.rename( os.path.join(root, markdown_files[0]), \
                                   os.path.join(root.rsplit('/',1)[0], root.rsplit('/',1)[1] + ".md") )
                        rmtree(root)
                        hierarchy_modified = True
                    elif len(markdown_files) == 0:
                        rmtree(root)
                        hierarchy_modified = True

def insert_frontmatter(file_path, weight=1):
    # check for frontmatter
    frontmatter_flag = True
    with open(file_path, "r") as markdown_file:
        line = markdown_file.readline()
        if not re.match("^---", line):
            frontmatter_flag = False
    # if it's not found, create it by finding the markdown header as frontmatter
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
            front_matter_string = "---\n" + \
                                  f"title: \"{title}\"\n" + \
                                  "description: \"No description available.\"\n" + \
                                  f"weight: {weight}\n" + \
                                  "---\n\n"
            markdown_file.write(front_matter_string)
            markdown_file.write(input_file)

def promote_markdown_file(markdown_file):
    # create a folder for the markdown file
    markdown_basename = os.path.splitext(markdown_file)[0]
    os.mkdir( os.path.join(STAGING_DIR, "content", markdown_basename) )
    # move the markdown file into the folder
    origin_path = os.path.join(root, markdown_file)
    destination_path = os.path.join(STAGING_DIR, "content", markdown_basename, markdown_file)
    insert_frontmatter(origin_path)
    os.renames( origin_path, destination_path )
    # create _index.md file for the folder
    index_string = "---\n" + \
                   f"title: \"{markdown_basename.capitalize()}\"\n" + \
                   "description: \"\"\n" + \
                   "icon: \"fa fa-brain\"\n" + \
                   "weight: 1\n" + \
                   "---"
    index_path = os.path.join(STAGING_DIR, "content", markdown_basename, "_index.md")
    with open(index_path, "w")as index_file:
        index_file.write(index_string)

def print_file_tree(rootDir):
    list_dirs = os.walk(rootDir)
    for root, dirs, files in list_dirs:
        print(f"root: {root}")
        for d in dirs:
            print(os.path.join(root, d))
        for f in files:
            print(os.path.join(root, f))

if __name__=="__main__":
    main()
