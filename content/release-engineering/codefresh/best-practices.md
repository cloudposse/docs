---
title: "Codefresh \"Best Practices\""
description: "Our tips for working with Codefresh"
tags:
- best-practices
---

# Managing Secrets

Use `chamber` to manage secrets. Provision a dedicated IAM user with limited scope by using the  [terraform-aws-iam-chamber-user](https://github.com/cloudposse/terraform-aws-iam-chamber-user) terraform module. Review our guide on [managing secrets with CI/CD]({{< relref "secrets-management/cicd.md" >}}).
Also, a sample invocation of `terraform-aws-iam-chamber-user` is part of "[root modules](https://github.com/cloudposse/terraform-root-modules/blob/master/aws/chamber/user.tf)".

{{% include-github title="Example AWS IAM Chamber User for Codefresh" type="code-block" org="cloudposse" repo="terraform-root-modules" ref="master" file="/aws/chamber/user.tf" language="hcl" %}}

# Naming Kubernetes Contexts

Use cluster name. e.g. `us-west-2-staing-example-com`

{{< img src="/assets/best-practices-d9e507c5.png" title="Codefresh Kubernetes Integration" >}}

# Use a `codefresh.yml` build file

Always include the pipeline manifest in the source repo. This allows it to be versioned alongside the code it builds.

{{< img src="/assets/best-practices-70ab60e9.png" title="Use YAML from Repository" >}}

# Stick non-secrets in `codefresh.yml`

Set all non-secret values in the pipeline config so that they can be versioned.

# Use Conditions to Control Flow

Use conditions to control when a build step should be run. This is useful for deploying to various kubernetes clusters by setting the `KUBE_CONTEXT` based on the branch or tag.

```
when:
  condition:
    all:
      executeForTag: "'${{SEMVERSION_TAG}}' != ''"
```

# Use a Containerized Build Harness

A [`build-harness`]({{< relref "release-engineering/build-harness.md" >}}) is like a "[test harness](https://en.wikipedia.org/wiki/Test_harness)". It provides reusable methods for building and deploying software. This allows to keep things DRY by offloading the business logic to a centralized repo that can be versioned and shared across multiple projects. We provide one that we use in nearly all of our projects.

Cloud Posse's Build Harness is free.
**GitHub:** <https://github.com/cloudposse/build-harness>
**Docker Hub:** <https://hub.docker.com/r/cloudposse/build-harness/>

An example invocation can be found in our CI/CD process for [how we build helm charts]({{< relref "release-engineering/cicd-process/build-charts.md" >}})

# Use the `cli`

Codefresh provides a decent [cli](https://codefresh-io.github.io/cli/) tool to control pipelines.

# Use Cron Triggers

Codefresh provides the ability to run jobs periodically with cron-like functionality.

{{< img src="/assets/best-practices-3fbbf706.png" title="Add a Codefresh Cron Trigger" >}}

This is ideal for a couple of use-cases:
1. Rerun infrequently triggered pipelines periodically to ensure they still work
2. Rebuild containers containing time-sensitive data (e.g. figures for a database, or MaxMind GeoIP databases)
