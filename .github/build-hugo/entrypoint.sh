#!/usr/bin/env bash
#apt-get update && \
#    apt-get install -y python3 python3-pip locales jq && \
#    rm -rf /var/lib/apt/lists/* && \
#    localedef -i en_US -c -f UTF-8 -A /usr/share/locale/locale.alias en_US.UTF-8 && \
#    npm install -g atomic-algolia@0.3.15 cloudflare-cli@3.0.0 && \
#	pip3 install asciinema

set +e -x
pwd
ls -rhtal .
make lint
make release
make real-clean hugo/build
