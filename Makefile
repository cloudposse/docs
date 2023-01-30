SHELL := /bin/bash

export COMPONENTS_DIR ?= content/components
export DOCUSAURUS_PORT ?= 3000

export DOCKER_ORG ?= cloudposse
export DOCKER_IMAGE ?= $(DOCKER_ORG)/docs
export DOCKER_TAG ?= latest
export DOCKER_IMAGE_NAME ?= $(DOCKER_IMAGE):$(DOCKER_TAG)
export DOCKER_BUILD_FLAGS =
export DOCKER_RUN_FLAGS ?= --rm
export DOCKER_RUN ?= docker run $(DOCKER_RUN_FLAGS) -v $(CURDIR):/src -p $(DOCUSAURUS_PORT):$(DOCUSAURUS_PORT) $(DOCKER_IMAGE_NAME)

-include $(shell curl -sSL -o .build-harness "https://cloudposse.tools/build-harness"; echo .build-harness)

.DEFAULT_GOAL := all

all: real-clean build
	@exit 0

deps: docker/build
	$(DOCKER_RUN) npm install

deps-production: docker/build
	$(DOCKER_RUN) npm install --only=production

.PHONY: build

build: deps
	$(DOCKER_RUN) npm run build

start:
	npm start

real-clean:
	rm -fr .docusaurus && \
    rm -fr build && \
    rm -fr node_modules
