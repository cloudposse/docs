---
title: philips-labs-github-runners
sidebar_label: philips-labs-github-runners
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/philips-labs-github-runners/README.md
tags: [terraform, aws, philips-labs-github-runners]
---

# Component: `philips-labs-github-runners`

This component is responsible for provisioning the surrounding infrastructure for the github runners.

## Prerequisites

- Github App installed on the organization
  - For more details see
    [Philips Lab's Setting up a Github App](https://github.com/philips-labs/terraform-aws-github-runner/tree/main#setup-github-app-part-1)
  - Ensure you create a **PRIVATE KEY** and store it in SSM, **NOT** to be confused with a **Client Secret**. Private
    Keys are created in the GitHub App Configuration and scrolling to the bottom.
- Github App ID and private key stored in SSM under `/pl-github-runners/id` (or the value of
  `var.github_app_id_ssm_path`)
- Github App Private Key stored in SSM (base64 encoded) under `/pl-github-runners/key` (or the value of
  `var.github_app_key_ssm_path`)

## Usage

**Stack Level**: Regional

Here's an example snippet for how to use this component.

```yaml
components:
  terraform:
    philips-labs-github-runners:
      vars:
        enabled: true
```

The following will create

- An API Gateway
- Lambdas
- SQS Queue
- EC2 Launch Template instances

The API Gateway is registered as a webhook within the GitHub app. Which scales up or down, via lambdas, the EC2 Launch
Template by the number of messages in the SQS queue.

![Architecture](https://github.com/philips-labs/terraform-aws-github-runner/blob/main/docs/component-overview.svg)

## Modules

### `webhook-github-app`

This is a fork of https://github.com/philips-labs/terraform-aws-github-runner/tree/main/modules/webhook-github-app.

We customized it until this PR is resolved as it does not update the github app webhook until this is merged.

- https://github.com/philips-labs/terraform-aws-github-runner/pull/3625

This module also requires an environment variable

- `GH_TOKEN` - a github token be set

This module also requires the `gh` cli to be installed. Your Dockerfile can be updated to include the following to
install it:

```dockerfile
ARG GH_CLI_VERSION=2.39.1
# ...
ARG GH_CLI_VERSION
RUN apt-get update && apt-get install -y --allow-downgrades \
    gh="${GH_CLI_VERSION}-*"
```

By default, we leave this disabled, as it requires a github token to be set. You can enable it by setting
`var.enable_update_github_app_webhook` to `true`. When enabled, it will update the github app webhook to point to the
API Gateway. This can occur if the API Gateway is deleted and recreated.

When disabled, you will need to manually update the github app webhook to point to the API Gateway. This is output by
the component, and available via the `webhook` output under `endpoint`.

<!-- prettier-ignore-start -->
<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- hello terraform-docs -->
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- prettier-ignore-end -->

## References

- [cloudposse/terraform-aws-components](https://github.com/cloudposse/terraform-aws-components/tree/main/modules/ecs) -
  Cloud Posse's upstream component



