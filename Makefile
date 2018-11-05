
export OS ?= $(shell uname -s | tr '[:upper:]' '[:lower:]')
export HUGO ?= hugo
export HUGO_VERSION ?= 0.42.1
export HUGO_PORT ?= 1313
export HUGO_URL ?= http://localhost.cloudposse.com:$(HUGO_PORT)/
export HUGO_EDIT_BRANCH ?= $(GIT_BRANCH)
export HUGO_EDIT_URL ?= https://github.com/cloudposse/docs/blob/$(HUGO_EDIT_BRANCH)
export HUGO_ARGS ?= --bind 0.0.0.0 --port $(HUGO_PORT) --watch --buildDrafts
export HUGO_CONFIG ?= config.toml
export HUGO_PUBLISH_DIR ?= public
export PACKAGES_VERSION ?= 0.1.7
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
export DOCKER_RUN ?= docker run -it --rm -v `pwd`:/src -p $(HUGO_PORT):$(HUGO_PORT) $(DOCKER_IMAGE_NAME)

export README_DEPS ?= docs/targets.md

export COMPONENTS_DIR ?= static/components
export UTTERANCES_VERSION ?= 0.1.0

-include $(shell curl -sSL -o .build-harness "https://git.io/build-harness"; echo .build-harness)

## Install OSX deps
deps-darwin:
	brew install asciinema

## Install Linux deps
deps-linux:
	@which pip3 >/dev/null || (echo "Install pip3 please"; exit 1)
	pip3 install asciinema

## Install package dependencies
deps: deps-$(OS) \
	  packages/install/hugo \
	  packages/install/htmltest
	  asciinema auth
	  npm install -g \
		atomic-algolia@0.3.15 \
	  	cloudflare-cli@3.0.0
	@exit 0

deps/asciinema:
	curl -sSL -o static/css/asciinema-player.css https://github.com/asciinema/asciinema-player/releases/download/v2.6.1/asciinema-player.css
	curl -sSL -o static/js/asciinema-player.js https://github.com/asciinema/asciinema-player/releases/download/v2.6.1/asciinema-player.js

## Install useful atom plugins
deps/atom:
	@which apm >/dev/null || (echo "Install the atom editor"; exit 1)
	@apm install -s \
		modular-snippets \
		language-hugo \
		autocomplete-paths \
		editorconfig \
		linter-ui-default \
		linter-markdown \
		language-markdown \
		markdown-table-editor \
		markdown-writer \
		tool-bar-markdown-writer \
		markdown-toc \
		project-manager \
		tool-bar \
		local-config \
		autocomplete-paths \
		linter \
		intentions \
		busy-signal \
		https://github.com/cloudposse/atom-markdown-image-assistant.git

	@echo "Now complete the setup by performing the following tasks:"
	@echo "1. Start/Restart Atom"
	@echo "2. Open menu 'Edit > Preferences'"
	@echo "3. Select tab 'Packages'"
	@echo "4. Type 'local' in filter field"
	@echo "5. Click settings for 'local-config' plugin"
	@echo "6. Select checkbox 'Auto apply'"
	@echo "7. Restart Atom twice"

## Open localhost in browser
open:
	open $(HUGO_URL)

## Start the hugo server for live editing using local environment
hugo/run: components/build
	$(HUGO) server $(HUGO_ARGS)

## Start the hugo server for live editing using docker environment
run: docker/build
	$(DOCKER_RUN) hugo/run

## Build customized utterances widget
utterances/build:
	rm -rf utterances $(COMPONENTS_DIR)/utterances
	git clone --branch $(UTTERANCES_VERSION) https://github.com/cloudposse/utterances.git
	cd utterances && yarn && yarn build
	mkdir -p $(COMPONENTS_DIR)/utterances
	mv utterances/dist/* $(COMPONENTS_DIR)/utterances
	rm -f $(COMPONENTS_DIR)/utterances/index.html
	sed -i 's|href="/|href="/components/utterances/|g' $(COMPONENTS_DIR)/utterances/utterances.html
	sed -i 's|src="/|src="/components/utterances/|g' $(COMPONENTS_DIR)/utterances/utterances.html
	rm -rf utterances

front/build:
	cd themes/cloudposse && yarn && yarn run gulp

# TODO: add command for running dev script in themes/cloudposse/package.json
front/build-dev:
	cd themes/cloudposse && yarn && yarn run dev

## Build front-end components
components/build: utterances/build \
	front/build
	@exit 0

## Generate all static content (outputs to public/) using local environment
hugo/build: components/build
	@[ "$(HUGO_PUBLISH_DIR)" != "/" ] || (echo "Invalid HUGO_PUBLISH_DIR=$(HUGO_PUBLISH_DIR)"; exit 1) 
	rm -rf $(HUGO_PUBLISH_DIR)
	$(HUGO) --templateMetrics --stepAnalysis --config $(HUGO_CONFIG)

## Generate all static content (outputs to public/) using docker environment
build: docker/build
	$(DOCKER_RUN) hugo/build

## Lint check common formatting mistakes
lint/formatting:
	@! grep -Eo 'CodeFresh' -R content/   # Should be Codefresh
	@! grep -Eo 'Code Fresh' -R content/  # Should be Codefresh
	@! grep -Eo 'CloudPosse' -R content/  # Should be Cloud Posse
	@! grep -Eo 'Cloudposse' -R content/  # Should be Cloud Posse
	@! grep -Eo 'Github' -R content/      # Should be GitHub
	@! grep -Eo 'go template' -R content/ # Should be Go template
	@! grep -Eo 'CI\\+CD' -R content/     # Should be CI/CD
	@! grep -Eo 'ci/cd' -R content/       # Should be CI/CD

## Lint check for empty markdown links
lint/check-for-empty-links:
	@! grep -Eo '\[.+\]\(\)' -R content/

## Lint check all hugo code
lint: lint/check-for-empty-links lint/formatting
	$(HUGO) --renderToMemory

## Validate all html is good
validate: lint test

.PHONY : test
## Run tests
test:
	htmltest -c $(HTMLTEST_CONFIG) --log-level $(HTMLTEST_LOG_LEVEL)

## Run smoketest
smoketest:
	make release hugo/build test HUGO_URL=/ HUGO_CONFIG=test.toml HUGO_PUBLISH_DIR=test HTMLTEST_CONFIG=.htmltest.smoketest.yaml

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
	atomic-algolia

## Invalidate CloudFlare cache (all files)
invalidate-cache:
	cfcli purge
