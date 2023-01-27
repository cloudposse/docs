SHELL := /bin/bash

# List of targets the `readme` target should call before generating the readme
export README_DEPS ?= docs/targets.md

-include $(shell curl -sSL -o .build-harness "https://cloudposse.tools/build-harness"; echo .build-harness)

.DEFAULT_GOAL := all

all: real-clean deps build
	@exit 0

deps:
	npm install

deps-production:
	npm install --only=production

.PHONY: build

build:
	npm run build

start:
	npm start

real-clean:
	rm -fr .docusaurus && \
    rm -fr build && \
    rm -fr node_modules
