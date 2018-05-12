---
title: terraform-aws-datadog-integration
description: Terraform Module for DataDog integration with AWS.
---

# Terraform AWS DataDog Integration

|                  |                                                                                                                                                                                |
|:-----------------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| GitHub Repo      | <https://github.com/cloudposse/terraform-aws-datadog-integration>                                                                                                              |
| Terraform Module | terraform-datadog-aws-integration                                                                                                                                              |
| Release          | [![Release](https://img.shields.io/github/release/cloudposse/terraform-aws-datadog-integration.svg)](https://github.com/cloudposse/terraform-aws-datadog-integration/releases) |
| Build Status     | [![Build Status](https://travis-ci.org/cloudposse/terraform-datadog-aws-integration.svg?branch=master)](https://travis-ci.org/cloudposse/terraform-datadog-aws-integration)    |

# Usage

Include this module in your existing terraform code.

## HCL

```hcl
module "datadog_aws_integration" {
  source                           = "git::https://github.com/cloudposse/terraform-aws-datadog-integration.git?ref=master"
  domain_name                      = "example.com"
  proces_domain_validation_options = "true"
  ttl                              = "300"
}
```

{{% dialog type="info" icon="fa-info-circle" title="Note" %}}
At the moment the module supports `RDS integration only`. It will be modified as necessary to integrate the needful services.
{{% /dialog %}}

# Variables

| Name                   | Default        | Description                                                                              |
|:-----------------------|:---------------|:-----------------------------------------------------------------------------------------|
| namespace              |                | Namespace (e.g. `cp` or `cloudposse`)                                                    |
| stage                  |                | Stage (e.g. `prod`, `dev`, `staging`)                                                    |
| name                   |                | Name (e.g. `bastion` or `db`)                                                            |
| attributes             | []             | Additional attributes (e.g. `policy` or `role`)                                          |
| tags                   | {}             | Additional tags (e.g. `map("BusinessUnit","XYZ")`                                        |
| datadog_external_id    |                | External Id of the DataDog service                                                       |
| datadog_aws_account_id | `464622532012` | Datadog's AWS account ID                                                                 |
| integrations           | []             | List of AWS Services to integration with the DataDog service (e.g EC2, RDS, Billing ...) |

# Outputs

| Name   | Description                                               |
|:-------|:----------------------------------------------------------|
| `role` | Name of AWS IAM Role associated with creating integration |
