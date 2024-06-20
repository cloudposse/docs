---
title: ssm-parameter-chamber-reader
sidebar_label: ssm-parameter-chamber-reader
sidebar_class_name: command
description: |-
  Terraform module read ssm paramters managed with Chamber.
tags:
  - aws
  - terraform
  - terraform-modules
  - platform
  - chamber
  - ssm

custom_edit_url: https://github.com/cloudposse/terraform-aws-ssm-parameter-chamber-reader/blob/main/README.yaml
---

# Module: `ssm-parameter-chamber-reader`
Terraform module read ssm paramters managed with Chamber.










## Examples

```hcl
  variable "rbac_enabled" {
    type        = bool
    default     = null
    description = "Override rbac enabled"
  }

  module "account_id" {
    source = "git::https://github.com/cloudposse/terraform-aws-ssm-parameter-chamber-reader.git?ref=master"

    enabled         = "true"
    chamber_service = "kops"
    parameter       = "rbac_enabled"
    override_value  = var.rbac_enabled
  }
```



<!-- markdownlint-disable -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 0.12 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | n/a |

## Modules

No modules.

## Resources

| Name | Type |
|------|------|
| [aws_ssm_parameter.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/ssm_parameter) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_chamber_format"></a> [chamber\_format](#input\_chamber\_format) | Format to store parameters in SSM, for consumption with chamber | `string` | `"/%s/%s"` | no |
| <a name="input_chamber_service"></a> [chamber\_service](#input\_chamber\_service) | SSM parameter service name for use with chamber. This is used in chamber\_format where /$chamber\_service/$parameter would be the default. | `string` | n/a | yes |
| <a name="input_default_value"></a> [default\_value](#input\_default\_value) | Use as default value in case ssm paramter is empty | `string` | `""` | no |
| <a name="input_enabled"></a> [enabled](#input\_enabled) | Set to false to prevent the module from creating any resources | `bool` | `true` | no |
| <a name="input_override_key"></a> [override\_key](#input\_override\_key) | Is specified, use as key to read from ssm parameter and ignore chamber\_format. | `string` | `""` | no |
| <a name="input_override_value"></a> [override\_value](#input\_override\_value) | Is specified, just return it as value by skipping read from ssm parameter. | `string` | `""` | no |
| <a name="input_parameter"></a> [parameter](#input\_parameter) | SSM parameter name for use with chamber. This is used in chamber\_format where /$chamber\_service/$parameter would be the default. | `string` | n/a | yes |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_value"></a> [value](#output\_value) | Parameter value |
<!-- markdownlint-restore -->

