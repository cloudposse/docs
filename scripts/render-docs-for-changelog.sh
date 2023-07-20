#!/bin/bash

set -e

CHANGELOG_DIR="changelog"
AGGREGATED_CHANGELOG_FILE="content/components/library/upgrade-guide.md"
FRONT_MATTER=$(cat <<EOF
---
title: Upgrade Guide
sidebar_label: Upgrade Guide
description: Upgrade Guide
sidebar_position: 10
---
EOF
)

changelog_files=$(find ${CHANGELOG_DIR} -name "*.md" | sort -r)

echo "${FRONT_MATTER}" > "${AGGREGATED_CHANGELOG_FILE}"

for file in $changelog_files; do
    echo "Processing $file..."
    cat "$file" >> "${AGGREGATED_CHANGELOG_FILE}"
    echo "" >> "${AGGREGATED_CHANGELOG_FILE}"
    echo "" >> "${AGGREGATED_CHANGELOG_FILE}"
done

echo "Done"