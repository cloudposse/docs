---
title: terraform-aws-efs-backup
description: >-
  Terraform module designed to easily backup EFS filesystems to S3 using
  DataPipeline.
---

# Terraform AWS EFS Backup

```
             |
```

---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ GitHub Repo | <https://github.com/cloudposse/terraform-aws-efs-backup> Terraform Module | terraform-aws-efs-backup Release | [![Release](https://img.shields.io/github/release/cloudposse/terraform-aws-efs-backup.svg)](https://github.com/cloudposse/terraform-aws-efs-backup/releases) Build Status | [![Build Status](https://travis-ci.org/cloudposse/terraform-aws-efs-backup.svg)](https://travis-ci.org/cloudposse/terraform-aws-efs-backup)

The workflow is simple:

- Periodically launch resource (EC2 instance) based on schedule
- Execute the shell command defined in the activity on the instance
- Sync data from Production EFS to S3 Bucket by using `aws-cli`
- The execution log of the activity is stored in `S3`
- Publish the success or failure of the activity to an `SNS` topic
- Automatically rotate the backups using `S3 lifecycle rule`

# Usage

Include this module in your existing terraform code:

## HCL

```hcl
module "efs_backup" {
  source = "git::https://github.com/cloudposse/terraform-aws-efs-backup.git?ref=master"

  name                               = "${var.name}"
  stage                              = "${var.stage}"
  namespace                          = "${var.namespace}"
  vpc_id                             = "${var.vpc_id}"
  efs_mount_target_id                = "${var.efs_mount_target_id}"
  use_ip_address                     = "false"
  noncurrent_version_expiration_days = "${var.noncurrent_version_expiration_days}"
  ssh_key_pair                       = "${var.ssh_key_pair}"
  datapipeline_config                = "${var.datapipeline_config}"
  modify_security_group              = "true"
}

output "efs_backup_security_group" {
  value = "${module.efs_backup.security_group_id}"
}
```

# Variables

| Name                               | Default                                                                                            | Description                                                                            | Required |
|:-----------------------------------|:---------------------------------------------------------------------------------------------------|:---------------------------------------------------------------------------------------|:---------|
| namespace                          |                                                                                                    | Namespace (e.g. `cp` or `cloudposse`)                                                  | Yes      |
| ssh_key_pair                       |                                                                                                    | `SSH` key that will be deployed on DataPipeline's instance                             | No       |
| datapipeline_config                | `${map("instance_type", "t2.micro", "email", "", "period", "24 hours", "timeout", "60 Minutes")}"` | DataPipeline configuration options                                                     | Yes      |
| attributes                         | `[]`                                                                                               | Additional attributes (_e.g._ `efs-backup`)                                            | No       |
| tags                               | `{}`                                                                                               | Additional tags (e.g. `map("BusinessUnit","XYZ")`                                      | No       |
| delimiter                          | `-`                                                                                                | Delimiter to be used between `name`, `namespace`, `stage` and `attributes`             | No       |
| stage                              |                                                                                                    | Stage (e.g. `prod`, `dev`, `staging`)                                                  | Yes      |
| name                               |                                                                                                    | Name (e.g. `app` or `wordpress`)                                                       | Yes      |
| region                             | `us-east-1`                                                                                        | (Optional) AWS Region. If not specified, will be derived from 'aws_region' data source | No       |
| vpc_id                             |                                                                                                    | AWS VPC ID where module should operate (_e.g._ `vpc-a22222ee`)                         | Yes      |
| efs_mount_target_id                |                                                                                                    | Elastic File System Mount Target ID (_e.g._ `fsmt-279bfc62`)                           | Yes      |
| use_ip_address                     | `false`                                                                                            | If set to `true`, will use IP address instead of DNS name to connect to the `EFS`      | Yes      |
| modify_security_group              | `false`                                                                                            | Should the module modify the `EFS` security group                                      | No       |
| noncurrent_version_expiration_days | `35`                                                                                               | S3 object versions expiration period (days)                                            | Yes      |

# DataPipeline Config Variables

| Name          | Default      | Description                                                                 | Required |
|:--------------|:-------------|:----------------------------------------------------------------------------|:---------|
| instance_type | `t2.micro`   | Instance type to use                                                        | Yes      |
| email         |              | Email to use in `SNS`. Needs to be provided, otherwise the module will fail | Yes      |
| period        | `24 hours`   | Frequency of pipeline execution (frequency of backups)                      | Yes      |
| timeout       | `60 Minutes` | Pipeline execution timeout                                                  | Yes      |

# Integration with EFS

To enable connectivity between the `DataPipeline` instances and the `EFS`, use one of the following methods to configure Security Groups:

1. Explicitly add the `DataPipeline` SG (the output of this module `security_group_id`) to the list of the `ingress` rules of the `EFS` SG. For example:

## HCL

```hcl
module "elastic_beanstalk_environment" {
  source     = "git::https://github.com/cloudposse/terraform-aws-elastic-beanstalk-environment.git?ref=master"
  namespace  = "${var.namespace}"
  name       = "${var.name}"
  stage      = "${var.stage}"
  delimiter  = "${var.delimiter}"
  attributes = ["${compact(concat(var.attributes, list("eb-env")))}"]
  tags       = "${var.tags}"

  # ..............................
}

module "efs" {
  source     = "git::https://github.com/cloudposse/terraform-aws-efs.git?ref=tmaster"
  namespace  = "${var.namespace}"
  name       = "${var.name}"
  stage      = "${var.stage}"
  delimiter  = "${var.delimiter}"
  attributes = ["${compact(concat(var.attributes, list("efs")))}"]
  tags       = "${var.tags}"

  # Allow EB/EC2 instances and DataPipeline instances to connect to the EFS
  security_groups = ["${module.elastic_beanstalk_environment.security_group_id}", "${module.efs_backup.security_group_id}"]
}

module "efs_backup" {
  source     = "git::https://github.com/cloudposse/terraform-aws-efs-backup.git?ref=master"
  name       = "${var.name}"
  stage      = "${var.stage}"
  namespace  = "${var.namespace}"
  delimiter  = "${var.delimiter}"
  attributes = ["${compact(concat(var.attributes, list("efs-backup")))}"]
  tags       = "${var.tags}"

  # Important to set it to `false` since we added the `DataPipeline` SG (output of the `efs_backup` module) to the `security_groups` of the `efs` module
  # See NOTE below for more information
  modify_security_group = "false"

  # ..............................
}
```

1. Set `modify_security_group` attribute to `true` so the module will modify the `EFS` SG to allow the `DataPipeline` to connect to the `EFS`

{{% dialog type="warning" icon="fa fa-exclamation-circle" title="Important" %}}
Do not mix these two methods together.

Terraform does not support using a Security Group with in-line rules in conjunction with any Security Group Rule resources. See: <https://www.terraform.io/docs/providers/aws/r/security_group_rule.html>

> NOTE on Security Groups and Security Group Rules: Terraform currently provides both a standalone Security Group Rule resource (a single ingress or egress rule), and a Security Group resource with ingress and egress rules defined in-line. At this time you cannot use a Security Group with in-line rules in conjunction with any Security Group Rule resources. Doing so will cause a conflict of rule settings and will overwrite rules.

{{% /dialog %}}
