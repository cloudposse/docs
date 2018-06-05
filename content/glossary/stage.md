---
title: "Stage"
description: 'One of the phases in the SDLC whereby software is deployed to an environment. Common stages are “Production”, “Staging”, “QA” or “Development”'
terms:
- Stage
- Staging
- production
- prod
- dev
tags:
- environment
- sdlc
- prod
- staging
- dev
---

It's important to note that within a given stage, there might be multiple environments. We always prescribe separating multiple stages by using multiple AWS accounts or organizational units. Then provisioning multiple environments within that stage as necessary.

For example, the "staging" account might run "pre-production" and "QA" environments.
