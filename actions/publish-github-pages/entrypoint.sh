#!/bin/bash
set -e
#
# entrypoint.sh
#
echo "Entered entrypoint.sh."
export STAGING_DIR=${STAGING_DIR:-/tmp/staging}
export GITHUB_PAGES_PUSH_PATH=$(pwd)/${GITHUB_PAGES_DIRECTORY}
echo "Set env vars in entrypoint.sh."
pip install GitPython pyyaml
echo "Installed pip packages"
echo "Entering Python script."
python ${PYTHON_SCRIPT_LOCATION}/collate.py
cd $STAGING_DIR
docker build -t cloudposse/docs .
make release
make real-clean hugo/build
cp -r ${STAGING_DIR}/${HUGO_PUBLISH_DIR} ${GITHUB_PAGES_PUSH_PATH}
