FROM node:10.4-stretch

COPY Makefile .

# TODO fix locales
ENV LANG="en_US.UTF-8" \
    LC_ALL="en_US.UTF-8" \
    LC_CTYPE="en_US.UTF-8"  

# Install dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    && \
    make init && \
    make deps
