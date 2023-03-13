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

# removed all files from `assets/js/*.js` and made 2 new special files `main.*.js` and `runtime~main.*.js`. This way we will not gonna get 404 by browser and page will load faster.
build-production: build
	ASSETS_DIR="build/assets/js" && \
	ASSETS_MAIN_FILE="$$(ls -1 $${ASSETS_DIR}/main.*.js)" && \
	ASSETS_RUNTIME_MAIN_FILE="$$(ls -1 $${ASSETS_DIR}/runtime~main.*.js)" && \
	rm -rf $${ASSETS_DIR}/* && \
	touch $${ASSETS_MAIN_FILE} && \
	touch $${ASSETS_RUNTIME_MAIN_FILE}

start:
	npm start

start-production:
	npm run serve

real-clean:
	rm -fr .docusaurus && \
    rm -fr build && \
    rm -fr node_modules
