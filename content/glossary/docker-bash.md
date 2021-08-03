---
title: "The docker-bash pattern"
description: "This is a SweetOps pattern used to install tooling via a terminal prompt. The primary usage is in Geodesic, which looks like: `docker run --rm cloudposse/geodesic:latest-debian init | bash -s latest-debian`"
terms:
- docker-bash
tags:
- curl-bash
- docker-bash
- docker
- bash
- pattern
---
The docker-bash pattern is an approach to installing software on your local machine via your terminal and docker. It utilizes `docker run` to output a script which is then piped (i.e. `|` ) into `bash`. This enables the script to execute code on your machine which then does whatever setup or installation steps it needs to do to install the target software. Geodesic utilizes this pattern via the `init` script which is expected to be piped into bash:

```
docker run --rm cloudposse/geodesic:latest-debian init | bash -s latest-debian
```