#
# entrypoint.sh
#
#### PARAMETERS ####
# Input parameters:
# GITHUB_PAGES_REPO - customer's repo containing documentation and setup to deploy to GitHub Pages
# GITHUB_PAGES_BRANCH - the branch of the customer's repo which GitHub Pages will deploy from
# HUGO_PUBLISH_DIR - directory in the customer's repo that GitHub Pages will deploy from
# CONTENT - comma-separated list of directories in the top level of the customer's repo that contain documentation
# HUGO_REPO - CloudPosse repository containing Hugo infrastructure
# HUGO_CONFIG - location of to-be-written Hugo config file (actual location not important)
# HTMLTEST_CONFIG - location of to-be-written htmltest config file (actual location not important)

# Example parameter values:
# GITHUB_PAGES_REPO=https://github.com/cloudposse/docs # or for customer github.com/customer/infrastructure.git
# GITHUB_PAGES_BRANCH=production # or for customer, it will be docs
# HUGO_PUBLISH_DIR=public
# CONTENT=docs,content
# HUGO_REPO=https://github.com/cloudposse/docs
# HUGO_CONFIG=hugo.config.new
# HTMLTEST_CONFIG=.htmltest.config.new

# Hardcoded parameters:
GITHUB_PAGES_PATH=/tmp/$GITHUB_PAGES_BRANCH/
HUGO_REPO=https://github.com/cloudposse/docs

# Overwritten parameter
HUGO_PUBLISH_DIR=${GITHUB_PAGES_PATH}${HUGO_PUBLISH_DIR}

#### PROGRAM LOGIC ####
main() {
    # Checkout the cloudposse/docs as the "Reference docs"
    git clone $HUGO_REPO hugo/
    git clone --branch $GITHUB_PAGES_BRANCH $GITHUB_PAGES_REPO $GITHUB_PAGES_PATH
    
    # create a separate build folder like cloudposse/docs
    # The rest of the program basically assumes HUGO_REPO=https://github.com/cloudposse/docs.
    mkdir customer-docs
    cp -r ./hugo/tasks/ ./customer-docs/
    cp -r ./hugo/themes/ ./customer-docs/
    cp -r ./hugo/static/ ./customer-docs/
    cp -r ./hugo/layouts/ ./customer-docs/
    cp -r ./hugo/content/ ./customer-docs/
    cp -r ./hugo/Dockerfile ./customer-docs/
    cp -r ./hugo/.gitignore ./customer-docs/
    cp ./hugo/config.yaml ./customer-docs/
    cp ./hugo/.htmltest.yml ./customer-docs/
    cp ./hugo/Makefile ./customer-docs/
    sed -i 's/yq eval/yq -M eval/' ./customer-docs/Makefile # this can be removed once this branch is merged into master
    sed -i 's/^export DOCKER_RUN_FLAGS ?= -it --rm$/export DOCKER_RUN_FLAGS ?= --rm/' ./customer-docs/Makefile # this can be removed once this branch is merged into master
    cat ./customer-docs/Makefile
    
    # copy all customer documentation into the build folder
    IFS="," read -r -a CONTENT_ARRAY <<< "$CONTENT"
    for content in "${CONTENT_ARRAY[@]}"; do
        # clear files needed for storing intermediate variables
        rm file_origins.txt file_destinations.txt
        # rename all `README.md` to `_index.md`
        find ${GITHUB_PAGES_PATH}${content} -type f -name README.md -print0 | xargs --null -I{} bash -c 'mv {} $(dirname {})/_index.md'
        # categories with no subfolders, and only a single `_index.md`: `mv foobar/_index.md foobar.md`
        find ${GITHUB_PAGES_PATH}${content} -type f -name _index.md -print0 | xargs --null -I{} bash -c 'if [ "$(ls -1q $(dirname {}) | wc -l)" == "1" ]; then echo "$(dirname {})"; mv {} $(dirname $(dirname {}))/$(basename $(dirname {})).md; rm -r $(dirname {}); ls $(dirname $(dirname {})); fi'
        # install the customer docs (.md pages) to the content folder
        find ${GITHUB_PAGES_PATH}${content} -type f -name "*.md" >> file_origins.txt
        find ${GITHUB_PAGES_PATH}${content} -type f -name "*.md" -print0 | xargs --null -I{} bash -c 'echo "./customer-docs/content/{}"' | sed -e "s|$GITHUB_PAGES_PATH||" >> file_destinations.txt
        readarray -t FILE_ORIGINS < file_origins.txt
        readarray -t FILE_DESTINATIONS < file_destinations.txt
        for i in "${!FILE_ORIGINS[@]}"; do
            echo "Copying ${FILE_ORIGINS[i]} to ${FILE_DESTINATIONS[i]}."
            mkdir -p ${FILE_DESTINATIONS[i]} && cp ${FILE_ORIGINS[i]} ${FILE_DESTINATIONS[i]}
        done
    done
    
    # publish the Hugo-generated HTML to $GITHUB_PAGES_PATH
    cd ./customer-docs
    make release
    make real-clean hugo/build
    
    # commit the newly-generated customer docs website to the customer docs repo
    git config --global user.email "github-actions-runner@cloudposse.com"
    git config --global user.name "github-actions-runner"
    git -C $GITHUB_PAGES_PATH add -A
    git -C $GITHUB_PAGES_PATH commit -a --message 'Updating content to $GIT_REF'
    #git -C $GITHUB_PAGES_PATH push
}

main
