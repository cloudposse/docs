---
title: api-gateway-account-settings
sidebar_label: api-gateway-account-settings
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/api-gateway-account-settings/README.md
tags: [terraform, aws, api-gateway-account-settings]
---

# Component: `api-gateway-account-settings`

This component is responsible for setting the global, regional settings required to allow API Gateway to write to
CloudWatch logs.

Every AWS region you want to deploy an API Gateway to must be configured with an IAM Role that gives API Gateway
permissions to create and write to CloudWatch logs. Without this configuration, API Gateway will not be able to send
logs to CloudWatch. This configuration is done once per region regardless of the number of API Gateways deployed in that
region. This module creates an IAM role, assigns it the necessary permissions to write logs and sets it as the
"CloudWatch log role ARN" in the API Gateway configuration.

## Usage

**Stack Level**: Regional

The following is a snippet for how to use this component:

```yaml
components:
  terraform:
    api-gateway-account-settings:
      settings:
        spacelift:
          workspace_enabled: true
      vars:
        enabled: true
        tags:
          Service: api-gateway
```

<!-- prettier-ignore-start -->
<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- hello terraform-docs -->
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- prettier-ignore-end -->

## References

- [cloudposse/terraform-aws-components](https://github.com/cloudposse/terraform-aws-components/tree/main/modules/api-gateway-settings) -
  Cloud Posse's upstream component



