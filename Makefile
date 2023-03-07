SHELL := /bin/bash

-include $(shell curl -sSL -o .build-harness "https://cloudposse.tools/build-harness"; echo .build-harness)

.DEFAULT_GOAL := all

all: real-clean build
	@exit 0

deps: docker/build
	npm install

deps-production: docker/build
	npm install --only=production

.PHONY: build

build: deps
	npm run build

start:
	npm start

real-clean:
	rm -fr .docusaurus && \
    rm -fr build && \
    rm -fr node_modules
