#!/usr/bin/env bash

set -e

usage() {
	echo "Required env var '$1' is missing"
	exit 1
}

[ -z "${GITHUB_API_TOKEN}" ] && usage "GITHUB_API_TOKEN"

RENDERED_DOCS_DIR="${RENDERED_DOCS_DIR:-content/components}"
DOWNLOAD_TMP_DIR="${DOWNLOAD_TMP_DIR:-tmp/modules}"

python scripts/docs-collator/collator_for_terraform_projects.py \
	--output-dir "${RENDERED_DOCS_DIR}" \
	--download-dir "${DOWNLOAD_TMP_DIR}" \
	--repos-to-skip "terraform-aws-components"
