#!/usr/bin/env bash

set -e

CLONE_DIR="${CLONE_DIR:-tmp/modules/terraform-aws-components}"
RENDERED_DOCS_DIR="${RENDERED_DOCS_DIR:-content/components}"
SKIP_CLONING=${SKIP_CLONING:-"false"}
GITHUB_ORG=${GITHUB_ORG:-"cloudposse"}
GITHUB_REPO=${GITHUB_REPO:-"terraform-aws-components"}
GIT_BRANCH=${GIT_BRANCH:-"master"}

if [ "${SKIP_CLONING}" == "false" ]; then
	echo "Cloning repo '${GITHUB_ORG}/${GITHUB_REPO}'"
	git clone --depth 1 --branch "${GIT_BRANCH}" https://github.com/${GITHUB_ORG}/${GITHUB_REPO}.git "${CLONE_DIR}" || true
else
	echo "Skipping repo cloning ..."
fi

python scripts/docs-collator/collator_for_terraform_aws_components.py \
	--input-dir "${CLONE_DIR}" \
	--output-dir "${RENDERED_DOCS_DIR}"
