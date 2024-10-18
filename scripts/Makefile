
build:
	docker build -t docs-collator --progress=plain .

run: build
	docker run -it --rm -e PUBLIC_REPO_ACCESS_TOKEN=$(PUBLIC_REPO_ACCESS_TOKEN) -v $(PWD)/docs:/docs docs-collator /scripts/render-docs-for-components.sh
