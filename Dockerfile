FROM cloudposse/packages:0.93.0 as packages

ENV INSTALL_PATH=/dist
RUN mkdir -p ${INSTALL_PATH}
RUN make -C /packages/install hugo HUGO_VERSION=0.42.1
RUN make -C /packages/install htmltest HTMLTEST_VERSION=0.9.1

FROM node:11.2-stretch

COPY --from=packages /dist/ /usr/local/bin/

WORKDIR /src

ENV HUGO_PORT=1313 \
    INSTALL_PATH="/usr/local/bin" \
    LANG="en_US.UTF-8"

EXPOSE $HUGO_PORT

ARG APT_PACKAGES="python3 python3-pip locales jq"
RUN apt-get update && \
    apt-get install -y ${APT_PACKAGES} && \
    rm -rf /var/lib/apt/lists/* && \
    localedef -i en_US -c -f UTF-8 -A /usr/share/locale/locale.alias en_US.UTF-8 && \
    npm install -g atomic-algolia@0.3.15 cloudflare-cli@3.0.0 && \
	pip3 install asciinema

COPY Makefile ./

RUN make init
