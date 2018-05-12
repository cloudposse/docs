---
title: terraform-template-user-data-nfs
description: >-
  Terraform module designed to use template file to generate the bootstrap shell
  script `user_data.sh`
---

# Terraform Template User Data NFS

|                  |                                                                                                                                                                              |
|:-----------------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| GitHub Repo      | <https://github.com/cloudposse/terraform-template-user-data-nfs>                                                                                                             |
| Terraform Module | terraform-template-user-data-nfs                                                                                                                                             |
| Release          | [![Release](https://img.shields.io/github/release/cloudposse/terraform-template-user-data-nfs.svg)](https://github.com/cloudposse/terraform-template-user-data-nfs/releases) |
| Build Status     | [![Build Status](https://travis-ci.org/cloudposse/terraform-template-user-data-nfs.svg?branch=master)](https://travis-ci.org/cloudposse/terraform-template-user-data-nfs)    |

# Usage

Include this module in your existing terraform code:

## HCL

```hcl
module "user_data_nfs" {
  source                           = "git::https://github.com/cloudposse/terraform-template-user-data-nfs.git?ref=master"
  domain_name                      = "example.com"
  proces_domain_validation_options = "true"
  ttl                              = "300"
}
```

# Variables

| Name      | Default  | Description                                  | Required |
|:----------|:---------|:---------------------------------------------|:---------|
| namespace | ``       | Namespace (e.g. `cp` or `cloudposse`)        | Yes      |
| stage     | ``       | Stage (e.g. `prod`, `dev`, `staging`)        | Yes      |
| name      | ``       | Name (e.g. `bastion` or `db`)                | Yes      |
| dir       | ``       | Directory mount to                           | Yes      |
| host      | ``       | NFS server host                              | Yes      |
| os        | `ubuntu` | Server OS that will execute user data script | No       |
