FROM node:11.2-stretch

RUN curl -1sLf 'https://dl.cloudsmith.io/public/cloudposse/packages/setup.deb.sh' | bash
RUN apt-get install hugo htmltest yq

WORKDIR /src

ENV HUGO_PORT=1313 \
    INSTALL_PATH="/usr/local/bin" \
    LANG="en_US.UTF-8"

EXPOSE $HUGO_PORT

ARG APT_PACKAGES="python3 python3-pip locales jq less"
RUN apt-get update && \
    apt-get install -y ${APT_PACKAGES} && \
    rm -rf /var/lib/apt/lists/* && \
    localedef -i en_US -c -f UTF-8 -A /usr/share/locale/locale.alias en_US.UTF-8 && \
    npm install -g atomic-algolia@0.3.15 cloudflare-cli@4.1.0 && \
	pip3 install asciinema

# Update yarn
RUN curl --compressed -o- -L https://yarnpkg.com/install.sh | bash

COPY Makefile ./

RUN make init
