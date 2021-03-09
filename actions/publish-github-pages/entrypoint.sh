#!/bin/bash
set -e
#
# entrypoint.sh
#
# #### PARAMETERS ####
# Input parameters:
# GITHUB_PAGES_REPO - customer's repo containing documentation to be deployed to GitHub Pages
# GITHUB_PAGES_BRANCH - the branch of the customer's repo which GitHub Pages will deploy from
# CONTENT - comma-separated list of directories in the top level of the customer's repo that contain documentation
# HUGO_URL - URL of the Hugo site after deployment
# HUGO_PUBLISH_DIR - directory in the customer's repo that GitHub Pages will deploy from
# HUGO_REPO - CloudPosse repository containing Hugo infrastructure
# HUGO_CONFIG - location of to-be-written Hugo config file (actual location not important)
# HTMLTEST_CONFIG - location of to-be-written htmltest config file (actual location not important)

# Example parameter values:
# GITHUB_PAGES_REPO=https://github.com/cloudposse/docs # or for customer github.com/customer/infrastructure.git
# GITHUB_PAGES_BRANCH=production # or for customer, it will be docs
# CONTENT=docs,content
# HUGO_URL=cloudposse.github.io/docs
# HUGO_PUBLISH_DIR=public
# HUGO_REPO=https://github.com/cloudposse/docs
# HUGO_CONFIG=hugo.config.new
# HTMLTEST_CONFIG=.htmltest.config.new

# Parameter with default:
HUGO_REPO=${HUGO_REPO:-https://github.com/cloudposse/docs}

# Hardcoded parameters:
GITHUB_PAGES_PULL_PATH=/tmp/master/ # This will contain the master branch of GITHUB_PAGES_REPO.
GITHUB_PAGES_HUGO_PATH=/tmp/hugo/ # This will contain the generic infrastructure needed to build the GitHub Pages site. 
GITHUB_PAGES_PUSH_PATH=$(pwd)/${GITHUB_PAGES_DIRECTORY}/ # This will contain the GitHub Pages deployment branch of GITHUB_PAGES_REPO.
GIT_USER_EMAIL=github-actions-runner@cloudposse.com
GIT_USER_NAME=github-actions-runner
STAGING_DIR=/tmp/staging/ # Staging directory used for preparing files before hugo generation

# #### PROGRAM LOGIC ####
main() {
    # Check out
    # 1) Essential Hugo build tools
    git clone $HUGO_REPO $GITHUB_PAGES_HUGO_PATH
    # 2) Site-specific documentation
    git clone $GITHUB_PAGES_REPO $GITHUB_PAGES_PULL_PATH
    # 3) The GitHub Pages deployment branch for this site
    git clone --branch $GITHUB_PAGES_BRANCH $GITHUB_PAGES_REPO $GITHUB_PAGES_PUSH_PATH

    if [[ -n $DEBUG ]]; then
        echo "Repo: ${HUGO_REPO}" # debug
        echo "Branch: master" # debug
        echo "${GITHUB_PAGES_HUGO_PATH}" # debug
        ls -lhat ${GITHUB_PAGES_HUGO_PATH} # debug
        echo "Repo: ${GITHUB_PAGES_REPO}" # debug
        echo "Branch: master" # debug
        echo "${GITHUB_PAGES_PULL_PATH}" # debug
        ls -lhat ${GITHUB_PAGES_PULL_PATH} # debug
        echo "Repo: ${GITHUB_PAGES_REPO}" # debug
        echo "Branch: ${GITHUB_PAGES_BRANCH}" # debug
        echo "${GITHUB_PAGES_PUSH_PATH}" # debug
        ls -lhat ${GITHUB_PAGES_PUSH_PATH} # debug
        echo "${GITHUB_PAGES_PUSH_PATH}/${HUGO_PUBLISH_DIR}" # debug
        ls -lhat ${GITHUB_PAGES_PUSH_PATH}/${HUGO_PUBLISH_DIR} # debug
    fi
    
    # Create a separate build folder, ${STAGING_DIR}, and populate it with the essential files from HUGO_REPO
    # (The rest of this script assumes HUGO_REPO=https://github.com/cloudposse/docs.)
    mkdir ${STAGING_DIR}
    cp -r ${GITHUB_PAGES_HUGO_PATH}/tasks/ ${STAGING_DIR}
    cp -r ${GITHUB_PAGES_HUGO_PATH}/themes/ ${STAGING_DIR}
    cp -r ${GITHUB_PAGES_HUGO_PATH}/static/ ${STAGING_DIR}
    cp -r ${GITHUB_PAGES_HUGO_PATH}/layouts/ ${STAGING_DIR}
    cp -r ${GITHUB_PAGES_HUGO_PATH}/content/ ${STAGING_DIR}
    cp -r ${GITHUB_PAGES_HUGO_PATH}/Dockerfile ${STAGING_DIR}
    cp -r ${GITHUB_PAGES_HUGO_PATH}/.gitignore ${STAGING_DIR}
    cp ${GITHUB_PAGES_HUGO_PATH}/config.yaml ${STAGING_DIR}
    cp ${GITHUB_PAGES_HUGO_PATH}/.htmltest.yml ${STAGING_DIR}
    cp ${GITHUB_PAGES_HUGO_PATH}/Makefile ${STAGING_DIR}
    # The following two lines can be removed once this branch is merged into master
    sed -i 's/yq eval/yq -M eval/' ${STAGING_DIR}Makefile # this can be removed once this branch is merged into master
    sed -i 's/^export DOCKER_RUN_FLAGS ?= -it --rm$/export DOCKER_RUN_FLAGS ?= --rm/' ${STAGING_DIR}Makefile
    
    # copy all customer documentation into the build folder
    echo "${STAGING_DIR}" # debug
    ls -laht ${STAGING_DIR} # debug
    echo "${STAGING_DIR}/content" # debug
    ls -laht ${STAGING_DIR}/content # debug
    echo "${STAGING_DIR}/content/reference" # debug
    ls -laht ${STAGING_DIR}/content/reference # debug
    IFS="," read -r -a CONTENT_ARRAY <<< "$CONTENT"
    for content in "${CONTENT_ARRAY[@]}"; do
        # clear files needed for storing intermediate variables
        rm -f file_origins.txt file_destinations.txt
        # rename all `README.md` to `_index.md`
        find ${GITHUB_PAGES_PULL_PATH}${content} -type f -name README.md -print0 | xargs --null -I{} bash -c 'mv {} $(dirname {})/_index.md'
        # categories with no subfolders, and only a single `_index.md`: `mv foobar/_index.md foobar.md`
        if [[ -n $DEBUG ]]; then
            ls -R ${GITHUB_PAGES_PULL_PATH}${content}
        fi
        find ${GITHUB_PAGES_PULL_PATH}${content} -type f -name _index.md > files.txt
        readarray -t FILES < files.txt
        for i in "${!FILES[@]}"; do
            dirname_result=$(dirname ${FILES[i]})
            echo "dirname_result: $dirname_result"
            test_condition=$(ls -1q ${dirname_result}/*.md | wc -l)
            echo "test_condition: $test_condition"
            if [ "$test_condition" == "1" ]; then
                echo "$(dirname ${FILES[i]})"
                mv ${FILES[i]} $(dirname ${dirname_result})/$(basename ${dirname_result}).md
                rm -r ${dirname_result}
                ls $(dirname ${dirname_result})
            fi
        done
        if [[ -n $DEBUG ]]; then
            ls -R ${GITHUB_PAGES_PULL_PATH}${content}
        fi
        # install the customer docs (.md pages) to the content folder
        find ${GITHUB_PAGES_PULL_PATH}${content} -type f -name "*.md" >> file_origins.txt
        readarray -t FILE_ORIGINS < file_origins.txt
        presence_of_subdirs=$(find ${GITHUB_PAGES_PULL_PATH}${content} -type d | wc -l)
        if [[ "${presence_of_subdirs}" == "1" ]]; then
            # there are no subdirs, so every .md file in this folder becomes a top-level object
            for i in "${!FILE_ORIGINS[@]}"; do
                echo "${STAGING_DIR}content/$(basename ${FILE_ORIGINS[i]})" | sed -e "s|$GITHUB_PAGES_PULL_PATH||" >> file_destinations.txt
            done
        else
            # there are subdirs, so we're gonna preserve the file heirarchy
            for i in "${!FILE_ORIGINS[@]}"; do
                echo "${STAGING_DIR}content/${FILE_ORIGINS[i]}" | sed -e "s|$GITHUB_PAGES_PULL_PATH||" >> file_destinations.txt
            done
        fi
        readarray -t FILE_DESTINATIONS < file_destinations.txt
        for i in "${!FILE_ORIGINS[@]}"; do
            echo "Copying ${FILE_ORIGINS[i]} to ${FILE_DESTINATIONS[i]}."
            mkdir -p ${FILE_DESTINATIONS[i]} && cp ${FILE_ORIGINS[i]} ${FILE_DESTINATIONS[i]}
        done
    done

    if [[ -n $DEBUG ]]; then
        echo "${STAGING_DIR}" # debug
        ls -laht ${STAGING_DIR} # debug
        echo "${STAGING_DIR}/content" # debug
        ls -laht ${STAGING_DIR}/content # debug
        echo "${STAGING_DIR}/content/reference" # debug
        ls -laht ${STAGING_DIR}/content/reference # debug
    fi

    # Build Docker image needed to build the Hugo site
    cd ${STAGING_DIR}
    docker build -t cloudposse/docs .

    # publish the Hugo-generated HTML to $GITHUB_PAGES_PUSH_PATH
    make release
    make real-clean hugo/build
    cp -r ${HUGO_PUBLISH_DIR} ${GITHUB_PAGES_PUSH_PATH}
    
    if [[ -n $DEBUG ]]; then
        echo "Repo: ${HUGO_REPO}" # debug
        echo "Branch: master" # debug
        echo "${GITHUB_PAGES_HUGO_PATH}" # debug
        ls -lhat ${GITHUB_PAGES_HUGO_PATH} # debug
        echo "Repo: ${GITHUB_PAGES_REPO}" # debug
        echo "Branch: master" # debug
        echo "${GITHUB_PAGES_PULL_PATH}" # debug
        ls -lhat ${GITHUB_PAGES_PULL_PATH} # debug
        echo "Repo: ${GITHUB_PAGES_REPO}" # debug
        echo "Branch: ${GITHUB_PAGES_BRANCH}" # debug
        echo "${GITHUB_PAGES_PUSH_PATH}" # debug
        ls -lhat ${GITHUB_PAGES_PUSH_PATH} # debug
        echo "${GITHUB_PAGES_PUSH_PATH}/${HUGO_PUBLISH_DIR}" # debug
        ls -lhat ${GITHUB_PAGES_PUSH_PATH}/${HUGO_PUBLISH_DIR} # debug
        echo "${GITHUB_PAGES_PUSH_PATH}/${HUGO_PUBLISH_DIR}/reference" # debug
        ls -lhat ${GITHUB_PAGES_PUSH_PATH}/${HUGO_PUBLISH_DIR}/reference # debug
    fi

    # commit the newly-generated customer docs website to the customer docs repo
    #git config --global user.email "${GIT_USER_EMAIL}"
    #git config --global user.name "${GIT_USER_NAME}"
    #git -C $GITHUB_PAGES_PUSH_PATH add -A
    #git -C $GITHUB_PAGES_PUSH_PATH commit -a --message 'Updating content to $GIT_REF'
    #git -C $GITHUB_PAGES_PUSH_PATH push https://${GITHUB_ACTOR}:${GITHUB_TOKEN}@$(sed "s/https\?:\/\///" <<< ${GITHUB_PAGES_REPO}).git
}

main
