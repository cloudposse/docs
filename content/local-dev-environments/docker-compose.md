---
title: "Docker Compose"
description: "These are some of the “lessons learned” by Cloud Posse and general advice for working with Docker Compose."
---
![Docker Compose](/assets/7804914-docker-compose.png)

This document compiles “lessons learned” and advice for working with Docker Compose.

# Service Discovery

* Docker Compose will export all available services in `/etc/hosts` with literal container names.

# Best Practices:
* Avoid using `_` in container names as this won't work universally with DNS-based service discovery
* Avoid links (they will be deprecated in future versions)
* Use cross-container networking with an overlay network
     `--x-networking --x-network-driver=overlay `
* Always build local Docker image and deploy to Sagan repository;
    do not rely on 3rd party images to be available or up to date
* Use sidekick containers for bootstrapping


# Risks & Limitations

* No native way in `docker-compose` YAML to run bootstrapping scripts  (e.g. init DB); recommend sidekick containers
* No way to enforce startup *delays* between containers
* `restart: always` only works when the command exits non-zero
