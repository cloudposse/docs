FROM node:10.4-stretch

RUN apt-get update \
    && apt-get install -y \
    python3 \
    python3-pip \
    locales \
    && rm -rf /var/lib/apt/lists/*

RUN localedef -i en_US -c -f UTF-8 -A /usr/share/locale/locale.alias en_US.UTF-8

ENV LANG="en_US.UTF-8"

COPY Makefile .

RUN make init && make deps

WORKDIR /src
ENTRYPOINT [ "/build-harness/vendor/hugo" ]
