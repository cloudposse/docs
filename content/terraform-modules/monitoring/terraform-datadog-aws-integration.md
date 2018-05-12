---
title: terraform-datadog-aws-integration
description: Terraform Module for integration DataDog with AWS
---

# Terraform Datadog AWS Integration

|                  |                                                                                                                                                                                |
|:-----------------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| GitHub Repo      | <https://github.com/cloudposse/terraform-aws-datadog-integration>                                                                                                              |
| Terraform Module | terraform-datadog-aws-integration                                                                                                                                              |
| Release          | [![Release](https://img.shields.io/github/release/cloudposse/terraform-datadog-aws-integration.svg)](https://github.com/cloudposse/terraform-datadog-aws-integration/releases) |
| Build Status     | [![Build Status](https://travis-ci.org/cloudposse/terraform-datadog-aws-integration.svg?branch=master)](https://travis-ci.org/cloudposse/terraform-datadog-aws-integration)    |

# Usage

{{% dialog type="info" icon="fa-info-circle" title="Note" %}}
At the moment the module supports `RDS integration only`. It will be modified as necessary to integrate the needful services.
{{% /dialog %}}

Include this module in your existing terraform code:

## HCL

```hcl
module "datadog_aws_integration" {
  source                           = "git::https://github.com/cloudposse/terraform-datadog-aws-integration.git?ref=master"
  domain_name                      = "example.com"
  proces_domain_validation_options = "true"
  ttl                              = "300"
}
```

# Variables

| Name                   | Default        | Description                                                                              | Required |
|:-----------------------|:---------------|:-----------------------------------------------------------------------------------------|:---------|
| namespace              |                | Namespace (e.g. `cp` or `cloudposse`)                                                    | Yes      |
| stage                  |                | Stage (e.g. `prod`, `dev`, `staging`)                                                    | Yes      |
| name                   |                | Name (e.g. `bastion` or `db`)                                                            | Yes      |
| attributes             | []             | Additional attributes (e.g. `policy` or `role`)                                          | No       |
| tags                   | {}             | Additional tags (e.g. `map("BusinessUnit","XYZ")`                                        | No       |
| datadog_external_id    |                | External Id of the DataDog service                                                       | Yes      |
| datadog_aws_account_id | `464622532012` | Datadog's AWS account ID                                                                 | No       |
| integrations           | []             | List of AWS Services to integration with the DataDog service (e.g EC2, RDS, Billing ...) | Yes      |

# Outputs

| Name   | Description                                               |
|:-------|:----------------------------------------------------------|
| `role` | Name of AWS IAM Role associated with creating integration |
