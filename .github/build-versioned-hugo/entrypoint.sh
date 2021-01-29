#!/usr/bin/env bash

set +e -x
make git/show
make git/export | tee -a $(pwd)/env_vars_to_export
make semver/show
make semver/export | tee -a $(pwd)/env_vars_to_export
if "${SEMVERSION_TAG}" != ''; then
  export HUGO_URL=${HUGO_URL}release/${SEMVERSION_TAG}
  export HUGO_PUBLISH_DIR=public/release/${SEMVERSION_TAG}
  make lint
  make release
  make real-clean hugo/build
fi
