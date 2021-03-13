#!/usr/bin/env python3
# entrypoint.py
#
# #### PARAMETERS ####
# Input parameters:
# GITHUB_PAGES_DIRECTORY - the directory to write the rendered website files to
# GITHUB_PAGES_REPO - customer's repo containing documentation to be deployed to GitHub Pages
# GITHUB_PAGES_BRANCH - the branch of the customer's repo which GitHub Pages will deploy from
# CONTENT - comma-separated list of directories in the top level of the customer's repo that contain documentation
# HUGO_URL - URL of the Hugo site after deployment
# HUGO_PUBLISH_DIR - directory in the customer's repo that GitHub Pages will deploy from
# HUGO_REPO - CloudPosse repository containing Hugo infrastructure
# HUGO_CONFIG - location of to-be-written Hugo config file (actual location not important)
# HTMLTEST_CONFIG - location of to-be-written htmltest config file (actual location not important)

# Example parameter values:
# GITHUB_PAGES_DIRECTORY=github_pages
# GITHUB_PAGES_REPO=https://github.com/cloudposse/docs # or for customer github.com/customer/infrastructure.git
# GITHUB_PAGES_BRANCH=production # or for customer, it will be docs
# CONTENT=docs,content
# HUGO_URL=cloudposse.github.io/docs
# HUGO_PUBLISH_DIR=public
# HUGO_REPO=https://github.com/cloudposse/docs
# HUGO_CONFIG=hugo.config.new
# HTMLTEST_CONFIG=.htmltest.config.new

import os
import subprocess
from git import Repo
from shutil import copy2, copytree

def read_in_env_vars():
    # GITHUB_PAGES_DIRECTORY - the directory to write the rendered website files to
    global GITHUB_PAGES_DIRECTORY
    GITHUB_PAGES_DIRECTORY = os.environ["GITHUB_PAGES_DIRECTORY"]
    GITHUB_PAGES_DIRECTORY = GITHUB_PAGES_DIRECTORY.rstrip("/")
    # GITHUB_PAGES_REPO - customer's repo containing documentation to be deployed to GitHub Pages
    global GITHUB_PAGES_REPO
    GITHUB_PAGES_REPO = os.environ["GITHUB_PAGES_REPO"]
    # GITHUB_PAGES_BRANCH - the branch of the customer's repo which GitHub Pages will deploy from
    global GITHUB_PAGES_BRANCH
    GITHUB_PAGES_BRANCH = os.environ["GITHUB_PAGES_BRANCH"]
    # CONTENT - comma-separated list of directories in the top level of the customer's repo that contain documentation
    global CONTENT
    CONTENT = os.environ["CONTENT"]
    # HUGO_URL - URL of the Hugo site after deployment
    global HUGO_URL
    HUGO_URL = os.environ["HUGO_URL"]
    # HUGO_PUBLISH_DIR - directory in the customer's repo that GitHub Pages will deploy from
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
    GITHUB_PAGES_PULL_PATH = "/tmp/master/"
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
    STAGING_DIR = "/tmp/staging/"
    STAGING_DIR = STAGING_DIR.rstrip("/")
    # Debug mode flag
    global DEBUG
    DEBUG = False

def main():
    read_in_env_vars()

    # Check out:
    # 1) Essential Hugo build tools
    hugo_repo = Repo.clone_from(HUGO_REPO, GITHUB_PAGES_HUGO_PATH)
    # 2) Site-specific documentation
    docs_repo = Repo.clone_from(GITHUB_PAGES_REPO, GITHUB_PAGES_PULL_PATH)
    # 3) The GitHub Pages deployment branch for this site
    directory_cleaning_command = f'rm -r {GITHUB_PAGES_PUSH_PATH} || true'
    print(directory_cleaning_command)
    subprocess.run(directory_cleaning_command, shell=True, check=True)
    gh_pages_repo = Repo.clone_from(GITHUB_PAGES_REPO, GITHUB_PAGES_PUSH_PATH)
    gh_pages_repo.git.checkout(GITHUB_PAGES_BRANCH)

    if DEBUG:
        pass
#        echo "Repo: ${HUGO_REPO}"
#        echo "Branch: master"
#        echo "${GITHUB_PAGES_HUGO_PATH}"
#        ls -lhat ${GITHUB_PAGES_HUGO_PATH}
#        echo "Repo: ${GITHUB_PAGES_REPO}"
#        echo "Branch: master"
#        echo "${GITHUB_PAGES_PULL_PATH}"
#        ls -lhat ${GITHUB_PAGES_PULL_PATH}
#        echo "Repo: ${GITHUB_PAGES_REPO}"
#        echo "Branch: ${GITHUB_PAGES_BRANCH}"
#        echo "${GITHUB_PAGES_PUSH_PATH}"
#        ls -lhat ${GITHUB_PAGES_PUSH_PATH}
#        echo "${GITHUB_PAGES_PUSH_PATH}/${HUGO_PUBLISH_DIR}"
#        ls -lhat ${GITHUB_PAGES_PUSH_PATH}/${HUGO_PUBLISH_DIR}
    
    # Create a separate build folder, ${STAGING_DIR}, and populate it with the essential files from HUGO_REPO
    # (The rest of this script assumes HUGO_REPO=https://github.com/cloudposse/docs.)
    os.mkdir(STAGING_DIR)
    copy_dirs = ["tasks", "themes", "static", "layouts", "content"]
    for copy_dir in copy_dirs:
        copytree( os.path.join(GITHUB_PAGES_HUGO_PATH, copy_dir), os.path.join(STAGING_DIR, copy_dir) )
    copy2( os.path.join(GITHUB_PAGES_HUGO_PATH + "/Dockerfile"), STAGING_DIR )
    copy2( os.path.join(GITHUB_PAGES_HUGO_PATH + "/.gitignore"), STAGING_DIR )
    copy2( os.path.join(GITHUB_PAGES_HUGO_PATH + "/config.yaml"), STAGING_DIR )
    copy2( os.path.join(GITHUB_PAGES_HUGO_PATH + "/.htmltest.yml"), STAGING_DIR )
    copy2( os.path.join(GITHUB_PAGES_HUGO_PATH + "/Makefile"), STAGING_DIR )
    
    if DEBUG:
        pass
#        echo "${STAGING_DIR}"
#        ls -laht ${STAGING_DIR}
#        echo "${STAGING_DIR}/content"
#        ls -laht ${STAGING_DIR}/content
#        echo "${STAGING_DIR}/content/reference"
#        ls -laht ${STAGING_DIR}/content/reference

    # copy all customer documentation into the build folder
    print(f"CONTENT: {CONTENT}")
    content_folders = CONTENT.split(",")
    print(f'content_folders: {content_folders}')
    for content_folder in content_folders:
        print(f"content_folder: {content_folder}")
        # Rename and rearrange content files as needed.
        for root, dirs, files in os.walk( os.path.join(GITHUB_PAGES_PULL_PATH, content_folder), topdown=False ):
            # rename all `README.md` to `_index.md`
            for local_file in files:
                if local_file=="README.md":
                    os.rename( os.path.join(root, local_file), os.path.join(root, "_index.md") )
            # categories with no subfolders, and only a single `_index.md`: `mv foobar/_index.md foobar.md`
            if not len(dirs):
                markdown_files = [potential_md_file for potential_md_file in files if ".md" in potential_md_file]
                if len(markdown_files) == 1:
                    os.rename( os.path.join(root, markdown_files[0]), root + ".md")
        # Now that all .md files have been renamed and rearranged appropriately,
        # collate the customer docs (.md pages) inside the STAGING_DIR.
        for root, dirs, files in os.walk( os.path.join(GITHUB_PAGES_PULL_PATH, content_folder), topdown=False ):
            # If this is a top-level dir (i.e., it is listed directly in CONTENT) and it has no subdirs,
            # every .md file in this folder becomes a top-level object.
            if root == os.path.join(GITHUB_PAGES_PULL_PATH, content_folder) and not len(dirs):
                markdown_files = [potential_md_file for potential_md_file in files if ".md" in potential_md_file]
                for markdown_file in markdown_files:
                    os.rename( os.path.join(root, markdown_file), os.path.join(STAGING_DIR, "content", markdown_file) )
            # Otherwise, we're gonna preserve the existing file heirarchy.
            else:
                markdown_files = [potential_md_file for potential_md_file in files if ".md" in potential_md_file]
                staging_root = root.replace(GITHUB_PAGES_PULL_PATH, STAGING_DIR)
                for markdown_file in markdown_files:
                    os.rename( os.path.join(root, markdown_file), os.path.join(staging_root, markdown_file) )

    if DEBUG:
        pass
#        echo "${STAGING_DIR}"
#        ls -laht ${STAGING_DIR}
#        echo "${STAGING_DIR}/content"
#        ls -laht ${STAGING_DIR}/content
#        echo "${STAGING_DIR}/content/reference"
#        ls -laht ${STAGING_DIR}/content/reference

    # Build Docker image needed to build the Hugo site
    docker_build_command = f'cd {STAGING_DIR}; docker build -t cloudposse/docs .'
    subprocess.run(docker_build_command, shell=True, check=True)

    # publish the Hugo-generated HTML to $GITHUB_PAGES_PUSH_PATH
    make_command = f'cd {STAGING_DIR}; make release; make real-clean hugo/build'
    print(make_command)
    subprocess.run(make_command, shell=True, check=True)
    directory_cleaning_command = 'rm -r {GITHUB_PAGES_PUSH_PATH} || true'
    print(directory_cleaning_command)
    subprocess.run(directory_cleaning_command, shell=True, check=True)
    copytree( HUGO_PUBLISH_DIR, GITHUB_PAGES_PUSH_PATH )
    
    if DEBUG:
        pass
#        echo "Repo: ${HUGO_REPO}"
#        echo "Branch: master"
#        echo "${GITHUB_PAGES_HUGO_PATH}"
#        ls -lhat ${GITHUB_PAGES_HUGO_PATH}
#        echo "Repo: ${GITHUB_PAGES_REPO}"
#        echo "Branch: master"
#        echo "${GITHUB_PAGES_PULL_PATH}"
#        ls -lhat ${GITHUB_PAGES_PULL_PATH}
#        echo "Repo: ${GITHUB_PAGES_REPO}"
#        echo "Branch: ${GITHUB_PAGES_BRANCH}"
#        echo "${GITHUB_PAGES_PUSH_PATH}"
#        ls -lhat ${GITHUB_PAGES_PUSH_PATH}
#        echo "${GITHUB_PAGES_PUSH_PATH}/${HUGO_PUBLISH_DIR}"
#        ls -lhat ${GITHUB_PAGES_PUSH_PATH}/${HUGO_PUBLISH_DIR}
#        echo "${GITHUB_PAGES_PUSH_PATH}/${HUGO_PUBLISH_DIR}/reference"
#        ls -lhat ${GITHUB_PAGES_PUSH_PATH}/${HUGO_PUBLISH_DIR}/reference

if __name__=="__main__":
    main()
