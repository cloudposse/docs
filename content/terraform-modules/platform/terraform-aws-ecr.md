---
title: terraform-aws-ecr
description: >-
  Terraform module to provision an [`AWS ECR Docker Container
  registry`](https://aws.amazon.com/ecr/).
---

# Terraform AWS ECR

|                  |                                                                                                                                                |
|:-----------------|:-----------------------------------------------------------------------------------------------------------------------------------------------|
| GitHub Repo      | <https://github.com/cloudposse/terraform-aws-ecr>                                                                                              |
| Terraform Module | terraform-aws-ecr                                                                                                                              |
| Release          | [![Release](https://img.shields.io/github/release/cloudposse/terraform-aws-ecr.svg)](https://github.com/cloudposse/terraform-aws-ecr/releases) |
| Build Status     | [![Build Status](https://travis-ci.org/cloudposse/terraform-aws-ecr.svg)](https://travis-ci.org/cloudposse/terraform-aws-ecr)                  |

# Usage

The module works in two distinct modes:

1. If you provide the existing IAM Role names in the `roles` attribute, the Roles will be granted permissions to work with the created registry.

2. If the `roles` attribute is omitted or is an empty list, a new IAM Role will be created and granted all the required permissions to work with the registry. The Role name will be assigned to the output variable `role_name`. In addition, an `EC2 Instance Profile` will be created from the new IAM Role, which might be assigned to EC2 instances granting them permissions to work with the ECR registry.

Include this repository as a module in your existing terraform code:

## HCL

```hcl
module "ecr" {
  source                           = "git::https://github.com/cloudposse/terraform-aws-ecr.git?ref=master"
  domain_name                      = "example.com"
  proces_domain_validation_options = "true"
  ttl                              = "300"
}
```

# Variables

| Name              | Default   | Description                                                                           | Required      |
|:------------------|:----------|:--------------------------------------------------------------------------------------|:--------------|
| `namespace`       | `global`  | Namespace (e.g. `cp` or `cloudposse`)                                                 | Yes           |
| `stage`           | `default` | Stage (e.g. `prod`, `dev`, `staging`)                                                 | Yes           |
| `name`            | `admin`   | The Name of the application or solution (e.g. `bastion` or `portal`)                  | Yes           |
| `roles`           | `[]`      | List of IAM role names that will be granted permissions to use the container registry | Yes           |
| `max_image_count` | `7`       | How many Docker Image versions AWS ECR will store                                     | No (optional) |

# Outputs

| Name           | Description                                                                       |
|:---------------|:----------------------------------------------------------------------------------|
| `registry_id`  | ID of the created AWS Container Registry                                          |
| `registry_url` | URL to the created AWS Container Registry                                         |
| `role_name`    | (Optional) The name of the newly created IAM role that has access to the registry |
