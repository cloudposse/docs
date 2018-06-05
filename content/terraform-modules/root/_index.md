---
title: "Terraform Root Modules"
description: "Collection of Terraform Root Module invocations"
tags:
- terraform
- terraform-modules
- reference-architectures
---

We practice a pattern we call [`terraform-root-modules`](https://github.com/cloudposse/terraform-root-modules/) which is where we implement fully working invocations of modules designed to be used at the "root" level. [Terraform defines](https://www.terraform.io/docs/modules/index.html#definitions) a "root module" as the current working directory holding the Terraform configuration files where the `terraform apply` or `terraform get` is run. That is, terraform considers the entry point itself a valid module.

Our strategy is to define various common patterns that we use in our cloud infrastrucutres and codify them as "reference architectures". We build a docker image of the `terraform-root-modules` repo and tag regular releases, so it's possible to literally do `COPY --from=terraform-root-modules` in our geodesic modules using the [docker multi-stage build]({{< relref "tools/docker/best-practices.md#multi-stage-builds" >}}) convention.

Here's what it looks like in practice: (only relevant portions)

{{% include-code-block title="Dockerfile Snippet" file="terraform-modules/root/examples/Dockerfile" language="Dockerfile" %}}

We use this strategy for several reasons:

1. *Private Repos* It let's us get around challenges of doing a `git clone` during a `docker build`, since most organizations will not make their "root modules" public the way we do.
2. *No Wrappers Needed* Using multi-stage builds let's us avoid needing to use a wrapper cli like `terragrunt`.
3. *Reusable Pattern* It works for not just `terraform`, but any use-case where infrastructure should be versioned and copied/staged across multiple repositories
