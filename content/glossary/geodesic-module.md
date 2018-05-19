---
title: "Geodesic Module"
description: "A geodesic module is a docker image that extends the geodesic base image and implements functions specific to that stage or account."
terms:
- geodesic Module
tags:
- Geodesic
---

Usually we create geodesic modules that correspond to each AWS organization.

For example, the standard geodesic modules are:

- `root.cloudposse.org` - a module which is reponsible for administering the root AWS account and provisioning all subaccounts (organizations).
- `prod.cloudposse.org` - a module which is responsible for provisioning all production infrastructure including production kops clusters and backing services (E.g. rds)
- `staging.cloudposse.org` - a module which is responsible for provisioning all staging resources
- `dev.cloudposse.org` - a module which is responsible for provisioning a sandbox environment for developers
- `testing.cloudposse.org` - a module which is responsible for provisioning the organization used for testing of infrastructure modules (E.g. testing terraform modules as part of CI/CD)
