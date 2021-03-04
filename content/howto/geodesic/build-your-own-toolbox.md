---
title: "Build your own Toolbox"
description: "Learn how to build your own toolbox on top of Geodesic for your organization."
weight: 1
draft: true
---

Note: These are just scratch notes (in "draft") for now while we're building out the tutorial. I orginally had these in the tutorial, but wanted to keep that simple and figured I'd keep the below content around for usage here.

```Dockerfile
ARG VERSION=0.142.0
ARG OS=debian

FROM cloudposse/geodesic:$VERSION-$OS

ENV AWS_VAULT_ENABLED=true
ENV AWS_VAULT_SERVER_ENABLED=true
ENV AWS_VAULT_BACKEND=file

RUN apt-get install -y your-needed-package

# ... The rest of your configuration
```

```bash
# Build the toolbox for your Organization (Acme Corp)
docker build . -t acme:latest

# Install on your machine as your own executable toolbox
docker run --rm acme:latest | APP_NAME=acme bash -s latest-debian

# Start a new shell in your toolbox
acme
```
