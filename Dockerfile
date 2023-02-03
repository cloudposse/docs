FROM node:19.5

RUN curl -1sLf 'https://dl.cloudsmith.io/public/cloudposse/packages/setup.deb.sh' | bash

ENV DOCUSAURUS_PORT=3000 \
    LANG="en_US.UTF-8"

EXPOSE $DOCUSAURUS_PORT

WORKDIR /src

ARG APT_PACKAGES="locales"

RUN apt-get update && \
    apt-get install -y ${APT_PACKAGES} && \
    rm -rf /var/lib/apt/lists/* && \
    localedef -i en_US -c -f UTF-8 -A /usr/share/locale/locale.alias en_US.UTF-8

ADD Makefile ./

RUN make init
