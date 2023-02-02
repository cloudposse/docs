#!/usr/bin/env bash

set -e

usage() {
	echo "Required env var '$1' is missing"
	exit 1
}

[ -z "${PUBLIC_REPO_ACCESS_TOKEN}" ] && usage "PUBLIC_REPO_ACCESS_TOKEN"

RENDERED_DOCS_DIR="${RENDERED_DOCS_DIR:-content/modules/catalog}"
DOWNLOAD_TMP_DIR="${DOWNLOAD_TMP_DIR:-tmp/modules}"

python scripts/docs-collator/render_docs_for_modules.py \
	--download-dir "${DOWNLOAD_TMP_DIR}" \
	--output-dir "${RENDERED_DOCS_DIR}" \
	--repos-to-skip "terraform-aws-components"
