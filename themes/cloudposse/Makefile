node_modules: 
	yarn

static/css/styles.css: $(shell find src/ -type f -name '*.scss')
	yarn run gulp
	@touch $@

.PHONY : build
build: node_modules static/css/styles.css

.PHONY : build-dev
build-dev:
	yarn
	yarn run dev

.PHONY : clean
clean:
	rm -rf node_modules
