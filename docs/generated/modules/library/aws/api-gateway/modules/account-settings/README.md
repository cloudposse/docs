---
title: account-settings
sidebar_label: account-settings
sidebar_class_name: command
description: account-settings
custom_edit_url: https://github.com/cloudposse/terraform-aws-api-gateway/blob/main/modules/account-settings/README.md
---

# API Gateway Account Settings Module

This module allows you set the global, regional settings required to allow API Gateway to write to CloudWatch logs.

Every AWS region you want to deploy an API Gateway to must be configured with an IAM Role that gives API Gateway permissions to create and write to CloudWatch logs. Without this configuration, API Gateway will not be able to send logs to CloudWatch. This configuration is done once per region regardless of the number of API Gateways deployed in that region. This module creates an IAM role, assigns it the necessary permissions to write logs and sets it as the "CloudWatch log role ARN" in the API Gateway configuration.

## Usage

**IMPORTANT:** The `main` branch is used in `source` just as an example. In your code, do not pin to `main` because there may be breaking changes between releases.
Instead pin to the release tag (e.g. `?ref=tags/x.y.z`) of one of our [latest releases](https://github.com/cloudposse/terraform-aws-config/releases).

For a complete example, see [examples/account-settings](https://github.com/cloudposse/terraform-aws-api-gateway/tree/main/modules/account-settings/../../examples/account-settings).

For automated tests of the complete example using [bats](https://github.com/bats-core/bats-core) and [Terratest](https://github.com/gruntwork-io/terratest)(which tests and deploys the example on AWS), see [test](https://github.com/cloudposse/terraform-aws-api-gateway/tree/main/modules/account-settings/../../test).

```hcl
module "account_settings" {
  source = "cloudposse/api-gateway/aws//modules/account-settings"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"

  context = module.this.context
}
```

