#!/usr/bin/env bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

GITHUB_ORG=${GITHUB_ORG:-"cloudposse"}
GITHUB_REPO=${GITHUB_REPO:-"terraform-aws-components"}
GIT_BRANCH=${GIT_BRANCH:-"main"}
RENDERED_DOCS_DIR="${RENDERED_DOCS_DIR:-${REPO_ROOT}/docs/components/library}"
DOWNLOAD_TMP_DIR="${DOWNLOAD_TMP_DIR:-${REPO_ROOT}/tmp/components}"

cd "${SCRIPT_DIR}/docs-collator"

python render_docs_for_components.py \
	--download-dir "${DOWNLOAD_TMP_DIR}" \
	--output-dir "${RENDERED_DOCS_DIR}" \
	--excludes "vpc,template,mixins" \
	--log-level DEBUG
