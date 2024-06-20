---
title: "Run Docker-in-Docker with Geodesic"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1186332735
sidebar_position: 100
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/how-to-guides/tutorials/how-to-run-docker-in-docker-with-geodesic.md
---

# How to run Docker-in-Docker with Geodesic?

## Problem

Using the a `geodesic` based toolbox, sometimes it would be helpful to be able to leverage all the commands that ship with the image together with other containers. Out-of-the-box we do not ship docker as it adds a lot of unnecessary cruft to the base image.

## Solution

:::tip
Simply invoke the `geodesic` wrapper script with `--with-docker` or set the environment variable `WITH_DOCKER=true`

:::

### Debian Instructions

Here are the steps to reproduce for Debian.

First, install the `geodesic` shell.

:::info
 If you’re running from an infrastructure repository, you should run `make install` instead, which will install the appropriate image and wrapper script.

:::

Here’s an example of doing it more generally, simply using the geodesic base image that is publicly available.

```
docker run -it public.ecr.aws/cloudposse/geodesic:latest-debian -c init | bash
```

Start the shell, which was just installed (usually to `/usr/local/bin/something`). This will ensure the docker socket is mounted into the container.

**Pro tip:** `/usr/loca/bin/geodesic` is a simple shell script. Inspect it to understand how it works.

```
geodesic --with-docker
```

After running this command, you’re dropped into an interactive shell within the container.

Then install `docker` as you would normally.

:::caution
The docker package goes by many different names depending on the OS distribution.

:::

```
apt-get -y install docker.io
```

Validate docker is working:

```
docker ps
```

