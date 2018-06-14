FROM node:10.4-stretch

ARG APT_PACKAGES="python3 python3-pip locales" 
RUN apt-get update && \
    apt-get install -y ${APT_PACKAGES} && \
    rm -rf /var/lib/apt/lists/*

RUN localedef -i en_US -c -f UTF-8 -A /usr/share/locale/locale.alias en_US.UTF-8

ENV LANG="en_US.UTF-8"

COPY Makefile .

ENV PORT=1313
RUN make init && make deps

EXPOSE $PORT
WORKDIR /src
ENTRYPOINT [ "/build-harness/vendor/hugo" ]
