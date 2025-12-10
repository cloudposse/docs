#!/usr/bin/env bash

set -e

usage() {
	echo "Required environment variable '$1' is missing"
	exit 1
}

[ -z "${PUBLIC_REPO_ACCESS_TOKEN}" ] && usage "PUBLIC_REPO_ACCESS_TOKEN"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

RENDERED_DOCS_DIR="${RENDERED_DOCS_DIR:-${REPO_ROOT}/docs/modules/library/}"
DOWNLOAD_TMP_DIR="${DOWNLOAD_TMP_DIR:-${REPO_ROOT}/tmp/modules}"

cd "${SCRIPT_DIR}/docs-collator"

python render_docs_for_modules.py \
	--download-dir "${DOWNLOAD_TMP_DIR}" \
	--output-dir "${RENDERED_DOCS_DIR}" \
	--excludes "terraform-aws-components"
