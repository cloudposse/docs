export INSTALL_PATH ?= /usr/local/bin
export HUGO ?= hugo
export HUGO_VERSION ?= 0.40.2
export HUGO_URL ?= http://localhost.cloudposse.com:1313/
export HUGO_ARGS ?= --watch --buildDrafts
export HUGO_CONFIG ?= config.toml
export PACKAGES_VERSION ?= 0.1.7

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
	rm -rf public/
	$(HUGO) --config $(HUGO_CONFIG)

## Lint check all hugo code
lint:
	hugo --renderToMemory

## Validate all html is good
validate: lint
	htmltest

release:
	@[ "$(HUGO_CONFIG)" != "config.toml" ] || (echo "Cannot release with $(HUGO_CONFIG)"; exit 1)
	@sed 's,^baseURL.*,baseURL = "$(HUGO_URL)",' config.toml > $(HUGO_CONFIG)
	@echo "Wrotte $(HUGO_CONFIG)..."

deploy:
	aws s3 sync --delete --acl public --exact-timestamps ./public/ s3://$(S3_BUCKET_NAME)/

