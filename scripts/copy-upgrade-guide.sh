#!/bin/bash

set -e

GITHUB_REPO=${GITHUB_REPO:-"terraform-aws-components"}
TMP_CLONE_DIR="${TMP_CLONE_DIR:-tmp/components/${GITHUB_REPO}}"
INPUT_UPGRADE_GUIDE_FILE="${INPUT_UPGRADE_GUIDE_FILE:-${TMP_CLONE_DIR}/docs/upgrade-guide.md}"
OUTPUT_UPGRADE_GUIDE_FILE="content/components/library/upgrade-guide.md"
FRONT_MATTER=$(cat <<EOF
---
title: Upgrade Guide
sidebar_label: Upgrade Guide
description: Upgrade Guide
sidebar_position: 10
---
EOF
)

echo "${FRONT_MATTER}" > "${OUTPUT_UPGRADE_GUIDE_FILE}"
cat "${INPUT_UPGRADE_GUIDE_FILE}" >> "${OUTPUT_UPGRADE_GUIDE_FILE}"