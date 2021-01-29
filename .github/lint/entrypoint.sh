#!/usr/bin/env bash

set +e -x
export HUGO_EDIT_BRANCH=$(pwd)
make lint
