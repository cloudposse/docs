---
title: terraform-aws-kops-state-backend
description: >-
  Terraform module to provision dependencies for `kops` (config S3 bucket & DNS
  zone).
---

# Terraform AWS Kops State Backend

|                  |                                                                                                                                                                              |
|:-----------------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| GitHub Repo      | <https://github.com/cloudposse/terraform-aws-kops-state-backend>                                                                                                             |
| Terraform Module | terraform-aws-kops-state-backend                                                                                                                                             |
| Release          | [![Release](https://img.shields.io/github/release/cloudposse/terraform-aws-kops-state-backend.svg)](https://github.com/cloudposse/terraform-aws-kops-state-backend/releases) |
| Build Status     | [![Build Status](https://travis-ci.org/cloudposse/terraform-aws-kops-state-backend.svg?branch=master)](https://travis-ci.org/cloudposse/terraform-aws-kops-state-backend)    |

The module supports the following:

1. Forced server-side encryption at rest for the S3 bucket
2. S3 bucket versioning to allow for `kops` state recovery in the case of accidental deletions or human errors

# Usage

This example will create a DNS zone called `kops.cloudxl.net` and delegate it from the parent zone `cloudxl.net` by setting `NS` and `SOA` records in the parent zone.

It will also create an S3 bucket with the name `cp-prod-kops-state` for storing `kops` manifests.

## HCL

```hcl
module "kops" {
  source                           = "git::https://github.com/cloudposse/terraform-aws-kops-state-backend.git?ref=master"
  domain_name                      = "example.com"
  proces_domain_validation_options = "true"
  ttl                              = "300"
}
```

![Terraform Outputs Screenshots](/assets/e347aef-kops-state-backend.png)

To check that the created `kops` DNS zone has been tagged correctly, run:

```sh
aws route53 list-tags-for-resources --resource-type hostedzone --resource-ids Z58RWQWFVU4HT
```

### #

```json
{
    "ResourceTagSets": [
        {
            "ResourceType": "hostedzone",
            "ResourceId": "Z58RWQWFVU4HT",
            "Tags": [
                {
                    "Key": "Cluster",
                    "Value": "kops.cloudxl.net"
                },
                {
                    "Key": "Stage",
                    "Value": "prod"
                },
                {
                    "Key": "Namespace",
                    "Value": "cp"
                },
                {
                    "Key": "Name",
                    "Value": "cp-prod-kops-state"
                }
            ]
        }
    ]
}
```

# Variables


{{% dialog type="info" icon="fa fa-info-circle" title="Note" %}}
One of `parent_zone_name` or `parent_zone_id` is required, but not both. The module will look up the parent zone by either name or ID.
{{% /dialog %}}

| Name               | Default                         | Description                                                                                                               | Required |
|:-------------------|:--------------------------------|:--------------------------------------------------------------------------------------------------------------------------|:--------:|
| `namespace`        |                                 | Namespace (_e.g._ `cp` or `cloudposse`)                                                                                   |   Yes    |
| `stage`            |                                 | Stage (_e.g._ `prod`, `dev`, `staging`)                                                                                   |   Yes    |
| `region`           | `us-east-1`                     | AWS Region the S3 bucket should reside in                                                                                 |   Yes    |
| `parent_zone_name` |                                 | Parent DNS zone name (e.g. `domain.com`). Required if `parent_zone_id` is not provided                                    |   Yes    |
| `parent_zone_id`   |                                 | Parent DNS zone ID. Required if `parent_zone_name` is not provided                                                        |   Yes    |
| `name`             | `kops-state`                    | S3 bucket name (_e.g._ `kops-state`)                                                                                      |   Yes    |
| `cluster_name`     | `us-east-1`                     | Kops cluster name (_e.g._ `us-east-1` or `cluster-1`)                                                                     |   Yes    |
| `attributes`       | `[]`                            | Additional attributes (_e.g._ `1`)                                                                                        |    No    |
| `tags`             | `{}`                            | Additional tags  (_e.g._ `map("BusinessUnit","XYZ")`                                                                      |    No    |
| `delimiter`        | `-`                             | Delimiter to be used between `namespace`, `stage`, `name`, and `attributes`                                               |    No    |
| `acl`              | `private`                       | The canned ACL to apply to the S3 bucket                                                                                  |    No    |
| `zone_name`        | `$${name}.$${parent_zone_name}` | Template for the DNS zone name                                                                                            |    No    |
| `force_destroy`    | `false`                         | A boolean that indicates all objects should be deleted from the bucket so that the bucket can be destroyed without errors |    No    |

## Outputs

| Name                 | Description           |
|:---------------------|:----------------------|
| `parent_zone_id`     | Parent zone ID        |
| `parent_zone_name`   | Parent zone name      |
| `zone_id`            | `kops` zone ID        |
| `zone_name`          | `kops` zone name      |
| `bucket_name`        | S3 bucket name        |
| `bucket_region`      | S3 bucket region      |
| `bucket_domain_name` | S3 bucket domain name |
| `bucket_id`          | S3 bucket ID          |
| `bucket_arn`         | S3 bucket ARN         |
