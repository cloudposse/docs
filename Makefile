-include .env

export INSTALL_PATH ?= /usr/local/bin
export HUGO ?= hugo
export HUGO_VERSION ?= 0.40.2
export HUGO_URL ?= http://localhost.cloudposse.com:1313/
export HUGO_ARGS ?= --watch --buildDrafts
export HUGO_CONFIG ?= config.toml
export HUGO_PUBLISH_DIR ?= public
export PACKAGES_VERSION ?= 0.1.7
export HTMLTEST_LOG_LEVEL ?= 2
export ALGOLIA_INDEX_FILE ?= $(HUGO_PUBLISH_DIR)/algolia.json
export ALGOLIA_APPLICATION_INDEX ?= dev

-include $(shell curl -sSL -o .build-harness "https://git.io/build-harness"; echo .build-harness)

## Install package dependencies
deps: packages/install/hugo \
	  packages/install/htmltest

## Open localhost in browser
open:
	open $(HUGO_URL)

## Start the hugo server for live editing
run:
	$(HUGO) server $(HUGO_ARGS)

## Generate all static content (outputs to public/)
build:
	@[ "$(HUGO_PUBLISH_DIR)" != "/" ] || (echo "Invalid HUGO_PUBLISH_DIR=$(HUGO_PUBLISH_DIR)"; exit 1) 
	rm -rf $(HUGO_PUBLISH_DIR)
	$(HUGO) --config $(HUGO_CONFIG)

## Lint check all hugo code
lint:
	hugo --renderToMemory

## Validate all html is good
validate: lint test

.PHONY : test
## Run tests
test:
	htmltest --log-level $(HTMLTEST_LOG_LEVEL)

## Run smoketest
smoketest:
	make release build test HUGO_URL=/ HUGO_CONFIG=test.toml HUGO_PUBLISH_DIR=test

## Generate a release config
release:
	@[ "$(HUGO_CONFIG)" != "config.toml" ] || (echo "Cannot release with $(HUGO_CONFIG)"; exit 1)
	cat config.toml | \
		sed 's,^baseURL.*,baseURL = "$(HUGO_URL)",' | \
		sed 's,^publishDir.*,publishDir = "$(HUGO_PUBLISH_DIR)",' \
		> $(HUGO_CONFIG)
	@echo "Wrote $(HUGO_CONFIG) for $(HUGO_URL)..."

## Deploy static site to S3
deploy:
	aws s3 sync --delete --acl public-read --exact-timestamps $(HUGO_PUBLISH_DIR)/ s3://$(S3_BUCKET_NAME)/


## Update algolia search index
reindex:
	jq -cM  .[] $(ALGOLIA_INDEX_FILE) | tr '\n' '\0' | \
		xargs -0 -n 1 -I'{}' \
			curl -X POST \
				-H "X-Algolia-API-Key: $(ALGOLIA_API_KEY)" \
				-H "X-Algolia-Application-Id: $(ALGOLIA_APPLICATION_ID)" \
				-d '{}' \
				"https://$(ALGOLIA_APPLICATION_ID).algolia.net/1/indexes/$(ALGOLIA_APPLICATION_INDEX)"
