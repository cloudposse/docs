SHELL := /bin/bash

-include $(shell curl -sSL -o .build-harness "https://cloudposse.tools/build-harness"; echo .build-harness)

.DEFAULT_GOAL := all

all: real-clean build
	@exit 0

deps:
	npm install --only=production

.PHONY: build

build: deps
	npm run build

build-production: deps
	npm run build

start:
	npm start

start-production:
	npm run serve

real-clean:
	rm -fr .docusaurus && \
    rm -fr build && \
    rm -fr node_modules
