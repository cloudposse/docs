FROM node:10.11-stretch

ARG APT_PACKAGES="python3 python3-pip locales jq"
RUN apt-get update && \
    apt-get install -y ${APT_PACKAGES} && \
    rm -rf /var/lib/apt/lists/*

RUN localedef -i en_US -c -f UTF-8 -A /usr/share/locale/locale.alias en_US.UTF-8

ENV LANG="en_US.UTF-8"

WORKDIR /src
COPY Makefile ./

ENV HUGO_PORT=1313 \
    INSTALL_PATH="/usr/local/bin"

RUN make init && make deps

EXPOSE $HUGO_PORT
ENTRYPOINT [ "make" ]
