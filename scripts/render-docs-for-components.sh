#!/usr/bin/env bash

set -e

GITHUB_ORG=${GITHUB_ORG:-"cloudposse"}
GITHUB_REPO=${GITHUB_REPO:-"terraform-aws-components"}
GIT_BRANCH=${GIT_BRANCH:-"main"}
TMP_CLONE_DIR="${TMP_CLONE_DIR:-tmp/components/${GITHUB_REPO}}"
RENDERED_DOCS_DIR="${RENDERED_DOCS_DIR:-docs/generated/components/library}"

echo "Cloning repo '${GITHUB_ORG}/${GITHUB_REPO}'"
git clone --depth 1 --branch "${GIT_BRANCH}" https://github.com/${GITHUB_ORG}/${GITHUB_REPO}.git "${TMP_CLONE_DIR}" || true

python scripts/docs-collator/render_docs_for_components.py \
	--input-dir "${TMP_CLONE_DIR}" \
	--output-dir "${RENDERED_DOCS_DIR}"
