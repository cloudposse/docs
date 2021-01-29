#!/usr/bin/env bash

set +e -x
make git/show
make git/export | tee -a $(pwd)/env_vars_to_export
make semver/show
make semver/export | tee -a $(pwd)/env_vars_to_export
if "${SEMVERSION_TAG}" != ''; do
  make reindex
fi
