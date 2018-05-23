---
title: "Using Secrets with CI/CD"
description: "Learn how we recommend managing secrets as part of CI/CD pipelines."
tags:
- CI/CD
- codefresh
- secrets
---

We advocate using `chamber` with all CI/CD pipelines to access secrets. Chamber provides a universal interface and a single "system of record" for storing and rotating secrets.

Enabling CI/CD systems to access chamber depends on the CI/CD solution. For CodeBuild/CodePipeline, it's possible to leverage IAM Roles to grant access to KMS+SSM, while for other systems which are external to AWS, it's necessary to [provision a chamber IAM user](https://github.com/cloudposse/terraform-aws-iam-chamber-user) with a very limited scope (the link provides an example for how we do this using `terraform`).

# Using Chamber with Codefresh

If using Codefresh, there a few things that need to happen.

1. Provision a [`terraform-aws-iam-chamber-user`](https://github.com/cloudposse/terraform-aws-iam-chamber-user) for each AWS account that Codefresh should deploy to.
2. Add the chamber user's IAM credentials as *encrypted* environment variables in the Codefresh pipeline.
3. Leverage `chamber` in one of your build-steps using our [`build-harness`](https://github.com/cloudposse/build-harness).

In the example below, we assume the AWS credentials have already been exported in the Codefresh pipeline. We then proceed to invoke `chamber exec kops $NAMESPACE` from the `cloudposse/build-harness` which will pull in the secrets from the `kops` service namespace as well as the `$NAMESPACE` service namespace, if any exist. This strategy allows any particular namespace to define it's own specific environment variables.

{{% include-code-block title="Using Chamber with Codefresh" file="secrets-management/examples/chamber-with-codefresh.yaml" %}}
