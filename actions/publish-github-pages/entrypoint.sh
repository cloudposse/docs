#!/bin/bash
set -e
#
# entrypoint.sh
#

export STAGING_DIR=${STAGING_DIR:-/tmp/staging}
export GITHUB_PAGES_PUSH_PATH=$(pwd)/${GITHUB_PAGES_DIRECTORY}
pip install GitPython pyyaml
python ${PYTHON_SCRIPT_LOCATION}/collate.py

# These variables need to be defined manually when GitHub Actions variables are passed in using
# with: instead of env: in order for the next steps to work.
export HUGO_CONFIG=${HUGO_CONFIG:-$INPUT_HUGO_CONFIG}
export HTMLTEST_CONFIG=${HTMLTEST_CONFIG:-$INPUT_HTMLTEST_CONFIG}
export HUGO_PUBLISH_DIR=${HUGO_PUBLISH_DIR:-$INPUT_HUGO_PUBLISH_DIR}
cd $STAGING_DIR
docker build -t cloudposse/docs .
make release
make real-clean hugo/build
cp -r ${STAGING_DIR}/${HUGO_PUBLISH_DIR} ${GITHUB_PAGES_PUSH_PATH}
