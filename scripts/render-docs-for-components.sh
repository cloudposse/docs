#!/usr/bin/env bash

set -e

GITHUB_ORG=${GITHUB_ORG:-"cloudposse"}
GITHUB_REPO=${GITHUB_REPO:-"terraform-aws-components"}
GIT_BRANCH=${GIT_BRANCH:-"main"}
RENDERED_DOCS_DIR="${RENDERED_DOCS_DIR:-docs/components/library/aws/}"
DOWNLOAD_TMP_DIR="${DOWNLOAD_TMP_DIR:-tmp/components}"

python scripts/docs-collator/render_docs_for_components.py \
	--download-dir "${DOWNLOAD_TMP_DIR}" \
	--output-dir "${RENDERED_DOCS_DIR}"
