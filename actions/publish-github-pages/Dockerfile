FROM alpine:3.13

LABEL maintainer="Cloud Posse <hello@cloudposse.com>"

LABEL "com.github.actions.name"="Publish Hugo to GitHub Pages"
LABEL "com.github.actions.description"="Build a Hugo website and publish it to GitHub Actions."
LABEL "com.github.actions.icon"="activity"
LABEL "com.github.actions.color"="blue"

RUN	apk add --no-cache \
	bash \
	ca-certificates \
	curl \
	jq \
	git

COPY entrypoint.sh /

RUN chmod 755 /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
