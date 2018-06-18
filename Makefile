-include $(shell curl -sSL -o .build-harness "https://git.io/build-harness"; echo .build-harness)

export INSTALL_PATH ?= /usr/local/bin
export OS ?= $(shell uname -s | tr '[:upper:]' '[:lower:]')
export HUGO ?= hugo
export HUGO_VERSION ?= 0.40.2
export HUGO_URL ?= http://localhost.cloudposse.com:1313/
export HUGO_EDIT_BRANCH ?= $(GIT_BRANCH)
export HUGO_EDIT_URL ?= https://github.com/cloudposse/docs/blob/$(HUGO_EDIT_BRANCH)
export HUGO_ARGS ?= --watch --buildDrafts
export HUGO_CONFIG ?= config.toml
export HUGO_PUBLISH_DIR ?= public
export PACKAGES_VERSION ?= 0.1.7
export HTMLTEST_LOG_LEVEL ?= 2
export HTMLTEST_CONFIG ?= .htmltest.yml

export ALGOLIA_INDEX_FILE ?= $(HUGO_PUBLISH_DIR)/index.algolia.json
export ALGOLIA_APPLICATION_INDEX ?= dev
export ALGOLIA_API_ENDPOINT ?= "https://$(ALGOLIA_APPLICATION_ID).algolia.net/1/indexes/$(ALGOLIA_APPLICATION_INDEX)"
#export ALGOLIA_API_ENDPOINT ?= "https://httpbin.org/post"

export ASCIINEMA_VERSION ?= 2.6.1

export README_DEPS ?= docs/targets.md

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

## Start the hugo server for live editing
run:
	$(HUGO) server $(HUGO_ARGS)

## Generate all static content (outputs to public/)
build:
	@[ "$(HUGO_PUBLISH_DIR)" != "/" ] || (echo "Invalid HUGO_PUBLISH_DIR=$(HUGO_PUBLISH_DIR)"; exit 1) 
	rm -rf $(HUGO_PUBLISH_DIR)
	$(HUGO) --templateMetrics --stepAnalysis --config $(HUGO_CONFIG)

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
	hugo --renderToMemory

## Validate all html is good
validate: lint test

.PHONY : test
## Run tests
test:
	htmltest -c $(HTMLTEST_CONFIG) --log-level $(HTMLTEST_LOG_LEVEL)

## Run smoketest
smoketest:
	make release build test HUGO_URL=/ HUGO_CONFIG=test.toml HUGO_PUBLISH_DIR=test HTMLTEST_CONFIG=.htmltest.smoketest.yaml

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
	aws s3 sync --delete --acl public-read --exact-timestamps $(HUGO_PUBLISH_DIR)/ s3://$(S3_BUCKET_NAME)/

## Update algolia search index
reindex:
	rm -rf algolia/
	mkdir -p algolia
	jq -c .[] $(ALGOLIA_INDEX_FILE) | split -l 1 - algolia/
	find algolia/ -type f -exec \
			curl -X POST \
				--connect-timeout 5 \
				--max-time 10 \
				--retry 5 \
				--retry-delay 5 \
				--retry-max-time 60 \
				-H "X-Algolia-API-Key: $(ALGOLIA_API_KEY)" \
				-H "X-Algolia-Application-Id: $(ALGOLIA_APPLICATION_ID)" \
				-d '@{}' \
				$(ALGOLIA_API_ENDPOINT) \;
