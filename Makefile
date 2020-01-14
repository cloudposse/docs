
export OS ?= $(shell uname -s | tr '[:upper:]' '[:lower:]')

export HUGO ?= hugo
export HUGO_PORT ?= 1313
export HUGO_URL ?= http://localhost.cloudposse.com:$(HUGO_PORT)/
export HUGO_EDIT_BRANCH ?= $(GIT_BRANCH)
export HUGO_EDIT_URL ?= https://github.com/cloudposse/docs/blob/$(HUGO_EDIT_BRANCH)
export HUGO_ARGS ?= --bind 0.0.0.0 --port $(HUGO_PORT) --watch --buildDrafts
export HUGO_CONFIG ?= config.toml
export HUGO_PUBLISH_DIR ?= public
export PACKAGES_VERSION ?= 0.93.0
export HTMLTEST_LOG_LEVEL ?= 2
export HTMLTEST_CONFIG ?= .htmltest.yml

export ALGOLIA_INDEX_FILE ?= $(HUGO_PUBLISH_DIR)/index.algolia.json
export ALGOLIA_INDEX_NAME ?= dev
export ALGOLIA_APP_ID ?= docs
export ALGOLIA_ADMIN_KEY ?=

export ASCIINEMA_VERSION ?= 2.6.1

export DOCKER_ORG ?= cloudposse
export DOCKER_IMAGE ?= $(DOCKER_ORG)/docs
export DOCKER_TAG ?= latest
export DOCKER_IMAGE_NAME ?= $(DOCKER_IMAGE):$(DOCKER_TAG)
export DOCKER_BUILD_FLAGS =

ifeq ($(wildcard /.dockerenv),)
export DOCKER_RUN := docker run -it --rm -v $(CURDIR):/src -p $(HUGO_PORT):$(HUGO_PORT) -e YARN_BUILD_DISABLED -e GITHUB_BASIC_AUTH $(DOCKER_IMAGE_NAME)
else
export DOCKER_RUN :=
endif

export README_DEPS ?= docs/targets.md

export YARN_BUILD_DISABLED ?= false

export INSTALL_PATH ?= $(CURDIR)/bin/

ifneq ($(YARN_BUILD_DISABLED),true)
COMPONENTS_DEPS += yarn/build
endif

export COMPONENTS_DIR ?= static/components

-include $(shell curl -sSL -o .build-harness "https://git.io/build-harness"; echo .build-harness)
-include tasks/Makefile.*

## Install OSX deps
deps-darwin:
	mkdir -p $(INSTALL_PATH)
	brew install asciinema

## Install package dependencies
deps: deps-$(OS) \
	  asciinema auth
	@exit 0

deps/asciinema:
	curl -sSL -o static/css/asciinema-player.css https://github.com/asciinema/asciinema-player/releases/download/v2.6.1/asciinema-player.css
	curl -sSL -o static/js/asciinema-player.js https://github.com/asciinema/asciinema-player/releases/download/v2.6.1/asciinema-player.js

## Start the hugo server for live editing using docker environment
run: docker/build
	$(DOCKER_RUN) make hugo/run

shell: docker/build
	$(DOCKER_RUN) bash

## Build front-end components
components/build: $(COMPONENTS_DEPS)
	@echo "Enabled components: $(COMPONENTS_DEPS)"
	@exit 0

## Generate all static content (outputs to public/) using docker environment
build: docker/build
	$(DOCKER_RUN) make hugo/build

## Validate all html is good
validate: lint test

.PHONY : test
## Run tests
test:
	$(DOCKER_RUN) htmltest -c $(HTMLTEST_CONFIG) --log-level $(HTMLTEST_LOG_LEVEL)

## Run smoketest
smoketest:
	$(DOCKER_RUN) make release hugo/build test HUGO_URL=/ HUGO_CONFIG=test.toml HUGO_PUBLISH_DIR=test HTMLTEST_CONFIG=.htmltest.smoketest.yaml

## Generate a release config
release:
	@[ "$(HUGO_CONFIG)" != "config.toml" ] || (echo "Cannot release with $(HUGO_CONFIG)"; exit 1)
	@[ "$(HTMLTEST_CONFIG)" != ".htmltest.yml" ] || (echo "Cannot release with $(HTMLTEST_CONFIG)"; exit 1)
	cat config.toml | \
		sed 's,^baseURL.*,baseURL = "$(HUGO_URL)",' | \
		sed 's,^publishDir.*,publishDir = "$(HUGO_PUBLISH_DIR)",' | \
		sed 's,^editURL.*,editURL = "$(HUGO_EDIT_URL)",' \
		> $(HUGO_CONFIG)
	@echo "Wrote $(HUGO_CONFIG) for $(HUGO_URL)..."
	cat .htmltest.yml | \
		sed 's,^OutputDir:.*,OutputDir: "$(TMPDIR)/.htmltest",' \
		> $(HTMLTEST_CONFIG)
	@echo "Wrote $(HTMLTEST_CONFIG) for codefresh..."

## Deploy static site to S3
deploy:
	aws s3 sync --delete --acl public-read --exclude 'release/*' --exact-timestamps $(HUGO_PUBLISH_DIR)/ s3://$(S3_BUCKET_NAME)/
	aws s3 sync --delete --acl public-read --exact-timestamps $(HUGO_PUBLISH_DIR)/release/$(SEMVERSION_TAG) s3://$(S3_BUCKET_NAME)/release/$(SEMVERSION_TAG)

## Update algolia search index
reindex:
	$(DOCKER_RUN) atomic-algolia

## Invalidate CloudFlare cache (all files)
invalidate-cache:
	$(DOCKER_RUN) cfcli purge

## Update terraform-modules pages
terraform-modules/update:
	./scripts/update-terraform-modules.sh

real-clean:
	$(MAKE) -C themes/cloudposse clean
