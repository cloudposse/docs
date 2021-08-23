---
title: "Build your own Toolbox"
description: "Learn how to build your own toolbox on top of Geodesic for your organization."
weight: 1
draft: true
---

Note: These are just scratch notes (in "draft") for now while we're building out the tutorial. I originally had these in the tutorial, but wanted to keep that simple and figured I'd keep the below content around for usage here.

Copy "Dockerfile.custom" from Geodesic repo and edit to taste (and of course,
rename it to "Dockerfile")

```Dockerfile
ARG VERSION=0.142.0
ARG OS=debian

FROM cloudposse/geodesic:$VERSION-$OS

RUN apt-get update && apt-get install -y your-needed-package

# ... The rest of your configuration
```

Copy "Makefile.custom" from Geodesic repo and edit to taste (and of course,
rename it to "Makefile")

```makefile
export APP_NAME = acme
export DOCKER_ORG ?= acmecorp
export DOCKER_IMAGE ?= $(DOCKER_ORG)/toolbox
```

```bash
# Build the toolbox for your Organization (Acme Corp)
make build

# Install on your machine as your own executable toolbox
make install

# Start a new shell in your toolbox
acme
```
