#!/bin/bash
set -e
#
# entrypoint.sh
#
export STAGING_DIR=${STAGING_DIR:-/tmp/staging}
export GITHUB_PAGES_PUSH_PATH=$(pwd)/${GITHUB_PAGES_DIRECTORY}
pip install GitPython pyyaml
python collate.py
cd $STAGING_DIR
docker build -t cloudposse/docs .
make release
make real-clean hugo/build
cp -r ${STAGING_DIR}/${HUGO_PUBLISH_DIR} ${GITHUB_PAGES_PUSH_PATH}
