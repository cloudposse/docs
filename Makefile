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
	
docker/build:
	docker build . -t cloudposse/docs
	docker build scripts -t cloudposse/docs:scripts

docker/render: containers
	docker run --rm -v -it $(PWD):/app -w /app cloudposse/docs:scripts scripts/render-docs-for-components.sh
	docker run --rm -v -it $(PWD):/app -w /app -e PUBLIC_REPO_ACCESS_TOKEN="$$(gh auth token)" cloudposse/docs:scripts scripts/render-docs-for-modules.sh
	docker run --rm -v -it $(PWD):/app -w /app -e PUBLIC_REPO_ACCESS_TOKEN="$$(gh auth token)" cloudposse/docs:scripts scripts/render-docs-for-github-actions.sh

build-library: containers
	docker run --rm -v $(PWD):/app -w /app cloudposse/docs npm run build

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
