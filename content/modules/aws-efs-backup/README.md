---
title: aws-efs-backup
sidebar_label: aws-efs-backup
sidebar_class_name: command
description: |-
  Terraform module designed to easily backup EFS filesystems to S3 using DataPipeline.

  The workflow is simple:

  * Periodically launch resource (EC2 instance) based on schedule
  * Execute the shell command defined in the activity on the instance
  * Sync data from Production EFS to S3 Bucket by using `aws-cli`
  * The execution log of the activity is stored in `S3`
  * Publish the success or failure of the activity to an `SNS` topic
  * Automatically rotate the backups using `S3 lifecycle rule`
tags:
  - aws
  - terraform
  - terraform-modules
  - backups
  - datapipeline
  - s3
  - efs
  - nfs
  - snapshot
  - lambda
  - automatic
  - scheduled-job
  - cronjob

custom_edit_url: https://github.com/cloudposse/terraform-aws-efs-backup/edit/master/README.md
---

# Component: `aws-efs-backup`
Terraform module designed to easily backup EFS filesystems to S3 using DataPipeline.

The workflow is simple:

* Periodically launch resource (EC2 instance) based on schedule
* Execute the shell command defined in the activity on the instance
* Sync data from Production EFS to S3 Bucket by using `aws-cli`
* The execution log of the activity is stored in `S3`
* Publish the success or failure of the activity to an `SNS` topic
* Automatically rotate the backups using `S3 lifecycle rule`






## Usage

Include this module in your existing terraform code:

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
## Integration with `EFS`

To enable connectivity between the `DataPipeline` instances and the `EFS`, use one of the following methods to configure Security Groups:

1. Explicitly add the `DataPipeline` SG (the output of this module `security_group_id`) to the list of the `ingress` rules of the `EFS` SG. For example:

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

2. Set `modify_security_group` attribute to `true` so the module will modify the `EFS` SG to allow the `DataPipeline` to connect to the `EFS`

**NOTE:** Do not mix these two methods together. 
`Terraform` does not support using a Security Group with in-line rules in conjunction with any Security Group Rule resources.
https://www.terraform.io/docs/providers/aws/r/security_group_rule.html
> NOTE on Security Groups and Security Group Rules: Terraform currently provides both a standalone Security Group Rule resource 
(a single ingress or egress rule), and a Security Group resource with ingress and egress rules defined in-line. 
At this time you cannot use a Security Group with in-line rules in conjunction with any Security Group Rule resources. 
Doing so will cause a conflict of rule settings and will overwrite rules.






## Makefile Targets
```
Available targets:

  help                                Help screen
  help/all                            Display help for all targets
  help/short                          This help short screen
  lint                                Lint terraform code

```
## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|:----:|:-----:|:-----:|
| attributes | Additional attributes (e.g. `efs-backup`) | list | `<list>` | no |
| datapipeline_config | DataPipeline configuration options | map | `<map>` | no |
| datapipeline_security_group | Optionally specify a security group to use for the datapipeline instances | string | `` | no |
| delimiter | Delimiter to be used between `name`, `namespace`, `stage`, etc. | string | `-` | no |
| efs_mount_target_id | EFS Mount Target ID (e.g. `fsmt-279bfc62`) | string | - | yes |
| modify_security_group | Should the module modify the `EFS` security group | string | `false` | no |
| name | The Name of the application or solution  (e.g. `bastion` or `portal`) | string | - | yes |
| namespace | Namespace (e.g. `cp` or `cloudposse`) | string | - | yes |
| noncurrent_version_expiration_days | S3 object versions expiration period (days) | string | `35` | no |
| region | (Optional) AWS Region. If not specified, will be derived from 'aws_region' data source | string | `` | no |
| ssh_key_pair | `SSH` key that will be deployed on DataPipeline's instance | string | - | yes |
| stage | Stage (e.g. `prod`, `dev`, `staging`) | string | - | yes |
| subnet_id | Optionally specify the subnet to use | string | `` | no |
| tags | Additional tags (e.g. `map('BusinessUnit`,`XYZ`) | map | `<map>` | no |
| use_ip_address | If set to `true`, will use IP address instead of DNS name to connect to the `EFS` | string | `false` | no |
| vpc_id | VPC ID | string | `` | no |

## Outputs

| Name | Description |
|------|-------------|
| backups_bucket_name | Backups bucket name |
| datapipeline_ids | Datapipeline ids |
| logs_bucket_name | Logs bucket name |
| security_group_id | Security group id |
| sns_topic_arn | Backup notification SNS topic ARN |



