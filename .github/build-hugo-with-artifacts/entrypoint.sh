#!/usr/bin/env bash

set +e -x
pwd
ls -rhtal .
make lint
make release
make real-clean hugo/build
