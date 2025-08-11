export DOCKER_ORG ?= acme
export DOCKER_TAG ?= latest
export ECR_IMAGE ?= infrastructure
export DOCKER_IMAGE ?= $(DOCKER_ORG)/$(ECR_IMAGE)
export DOCKER_IMAGE_NAME ?= $(DOCKER_IMAGE):$(DOCKER_TAG)

# Name for app (used in banner and name of wrapper script)
export APP_NAME ?= acme

# Default install path, if lacking permissions, ~/.local/bin will be used instead
export INSTALL_PATH ?= /usr/local/bin

export TARGET_DOCKER_AWS_ACCOUNT_ID ?= 111111111111

export TARGET_DOCKER_AWS_REGION ?= us-east-1
export TARGET_DOCKER_REGISTRY := $(TARGET_DOCKER_AWS_ACCOUNT_ID).dkr.ecr.$(TARGET_DOCKER_AWS_REGION).amazonaws.com
export TARGET_DOCKER_REPO := $(TARGET_DOCKER_REGISTRY)/$(DOCKER_IMAGE)
export TARGET_VERSION ?= $(DOCKER_TAG)
export TARGET_IMAGE_NAME := $(TARGET_DOCKER_REPO):$(TARGET_VERSION)
export TARGET_DOCKER_PUSH_PROFILE ?= acme-core-gbl-artifacts-admin

export ADR_DOCS_DIR = docs/adr
export ADR_DOCS_README = $(ADR_DOCS_DIR)/README.md

-include $(shell curl -sSL -o .build-harness "https://cloudposse.tools/build-harness"; echo .build-harness)

.DEFAULT_GOAL := all

.PHONY: all build build-clean install run run/new run/check push


all: init deps build install run/new
	@exit 0

## Install dependencies (if any)
deps: init
	@exit 0

## Build docker image
build: export DOCKER_FILE=Dockerfile
build:
	@$(MAKE) --no-print-directory docker/build

## Build docker image with no cache
build-clean: export DOCKER_BUILD_FLAGS=--no-cache
build-clean: build
	@exit 0

## Push docker image to registry
push:
	@docker tag $(DOCKER_IMAGE_NAME) $(TARGET_IMAGE_NAME)
	@docker push $(TARGET_IMAGE_NAME)

## Install wrapper script from geodesic container
install:
	@docker run --rm \
	  --env APP_NAME=$(APP_NAME) \
	  --env DOCKER_IMAGE=$(DOCKER_IMAGE) \
	  --env DOCKER_TAG=$(DOCKER_TAG) \
	  --env INSTALL_PATH=$(INSTALL_PATH) \
	  $(DOCKER_IMAGE_NAME) | bash -s $(DOCKER_TAG)

## Start the geodesic shell by calling wrapper script
run:
	@$(APP_NAME)

run/check:
	@if [[ -n "$$(docker ps --format {{ '{{ .Names }}' }} --filter name="^/$(APP_NAME)\$$")" ]]; then \
		printf "**************************************************************************\n" ; \
		printf "Not launching new container because old container is still running.\n"; \
		printf "Exit all running container shells gracefully or kill the container with\n\n"; \
		printf "  docker kill %s\n\n" "$(APP_NAME)" ; \
		printf "**************************************************************************\n" ; \
		exit 9 ; \
	fi

run/new: run/check run
	@exit 0

.PHONY: terraform-rm-lockfiles rebuild-adr-docs rebuild-aws-config rebuild-docs ecr-auth

## Remove all lock files
terraform-rm-lockfiles:
	$(shell find . -name ".terraform.lock.hcl" -exec rm -v {} \;)

## Rebuild README for all Terraform components
rebuild-docs: packages/install/terraform-docs
	@pre-commit run --all-files terraform_docs

## Rebuild README TOC for all ADRs
rebuild-adr-docs:
	adr generate toc > $(ADR_DOCS_README);

rebuild-aws-config:
	@printf "\nTo rebuild the AWS configuration files, from within the Geodesic shell ($(APP_NAME)), run:\n\n" >&2
	@printf "  atmos workflow update-aws-config -f identity\n\n" >&2
	exit 1

## Authenticate with ECR repository
ecr-auth:
	@AWS_PROFILE=$(TARGET_DOCKER_PUSH_PROFILE) aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin $(TARGET_DOCKER_REPO)
