SHELL := /bin/bash

-include $(shell curl -sSL -o .build-harness "https://cloudposse.tools/build-harness"; echo .build-harness)

.DEFAULT_GOAL := all

all: real-clean build
	@exit 0

deps:
	npm install

.PHONY: init build

render:
	./scripts/render-docs-for-components.sh
	./scripts/render-docs-for-modules.sh
	./scripts/render-docs-for-github-actions.sh

build: deps
	npm run build

clean::
	npm run clear

build-production: build
	@exit 0

up: start
start:
	npm start

start-production:
	npm run serve

real-clean:
	rm -fr .docusaurus && \
    rm -fr build && \
    rm -fr node_modules

lint:
	npx docusaurus-mdx-checker --cwd docs

readme/build:
	@atmos docs generate readme

readme:
	@atmos docs generate readme
