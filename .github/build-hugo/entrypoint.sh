#!/usr/bin/env bash

set +e -x
make lint
make release
make real-clean hugo/build
