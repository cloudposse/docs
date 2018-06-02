---
title: Terraform Module Best Practices
description: ''
weight: -1
---

# Root Module Pattern

This refers to the "root" or top-level invocation of terraform modules. We provide examples of these on our [`github.com/cloudposse/terraform-root-modules`](https://github.com/cloudposse/terraform-root-modules) repo.

This is a DRY pattern that allows module invocations to be easily versioned and copied between geodesic modules by leveraging docker's multi-stage-builds (e.g. `COPY --from=terraform-root-modules`).
