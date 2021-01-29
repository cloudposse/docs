#!/usr/bin/env bash

export HUGO_EDIT_BRANCH=$(pwd)
make real-clean smoketest || true
