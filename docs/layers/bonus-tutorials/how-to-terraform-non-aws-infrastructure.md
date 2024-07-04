---
title: "Terraform non-AWS Infrastructure"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1182334977
sidebar_position: 100
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/how-to-guides/tutorials/how-to-terraform-non-aws-infrastructure.md
---

# How to terraform non-AWS infrastructure?

## Problem

Most of the infrastructure found inside of the infrastructure repository is for AWS, but companies rely on other platforms like Datadog, OpsGenie, Snowflake, etc. If the `infrastructure` repository is just for AWS, then where do we put the rest of the infrastructure code for these systems?

## Solution

:::tip
The `infrastructure` repository is for any Infrastructure as Code, regardless of the platform or service. Simply use a stack name that confers which cloud or region.

:::

The `infrastructure/` repository has a `stacks/` folder. Every stack by convention is named something like `$env-$name`, and we use custom AWS short-codes to denote the `$env`. However, another way to think of this is as a region in a cloud, and few services other than AWS have multiple regions exposed. For example, if you wanted to terraform `datadog`, you could consider that an environment or `snowflake` could be another environment.

In the latest version of `atmos`, we also now support stack configurations organized into folder structures. This means you could organize configurations like `stacks/datadog/legacy.yaml` and `stacks/snowflake/us.yaml`

## Other Considerations

- Even though you’re terraforming some service outside of AWS, does that service directly relate to some service in AWS? Maybe then it should be associated with the AWS stack.

- You could also host the infrastructure code in a separate repository and point spacelift to that repository. See [How to Use Multiple Infrastructure Repositories with Spacelift?](/reference-architecture/how-to-guides/integrations/spacelift/how-to-use-multiple-infrastructure-repositories-with-spacelift)

