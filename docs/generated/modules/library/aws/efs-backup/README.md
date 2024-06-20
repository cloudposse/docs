---
title: efs-backup
sidebar_label: efs-backup
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

custom_edit_url: https://github.com/cloudposse/terraform-aws-efs-backup/blob/main/README.yaml
---

# Module: `efs-backup`
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






<!-- markdownlint-disable -->
## Requirements

No requirements.

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | n/a |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_backups_label"></a> [backups\_label](#module\_backups\_label) | git::https://github.com/cloudposse/terraform-null-label.git | tags/0.3.1 |
| <a name="module_datapipeline_label"></a> [datapipeline\_label](#module\_datapipeline\_label) | git::https://github.com/cloudposse/terraform-null-label.git | tags/0.3.1 |
| <a name="module_label"></a> [label](#module\_label) | git::https://github.com/cloudposse/terraform-null-label.git | tags/0.3.1 |
| <a name="module_logs_label"></a> [logs\_label](#module\_logs\_label) | git::https://github.com/cloudposse/terraform-null-label.git | tags/0.3.1 |
| <a name="module_resource_role_label"></a> [resource\_role\_label](#module\_resource\_role\_label) | git::https://github.com/cloudposse/terraform-null-label.git | tags/0.3.1 |
| <a name="module_role_label"></a> [role\_label](#module\_role\_label) | git::https://github.com/cloudposse/terraform-null-label.git | tags/0.3.1 |
| <a name="module_sns_label"></a> [sns\_label](#module\_sns\_label) | git::https://github.com/cloudposse/terraform-null-label.git | tags/0.3.1 |

## Resources

| Name | Type |
|------|------|
| [aws_cloudformation_stack.datapipeline](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudformation_stack) | resource |
| [aws_cloudformation_stack.sns](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudformation_stack) | resource |
| [aws_iam_instance_profile.resource_role](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_instance_profile) | resource |
| [aws_iam_role.resource_role](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role) | resource |
| [aws_iam_role.role](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role) | resource |
| [aws_iam_role_policy_attachment.resource_role](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_iam_role_policy_attachment.role](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_s3_bucket.backups](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket) | resource |
| [aws_s3_bucket.logs](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket) | resource |
| [aws_security_group.datapipeline](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group) | resource |
| [aws_security_group_rule.datapipeline_efs_ingress](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group_rule) | resource |
| [aws_ami.amazon_linux](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/ami) | data source |
| [aws_efs_mount_target.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/efs_mount_target) | data source |
| [aws_iam_policy_document.resource_role](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.role](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_region.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/region) | data source |
| [aws_subnet_ids.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/subnet_ids) | data source |
| [aws_vpc.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/vpc) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_attributes"></a> [attributes](#input\_attributes) | Additional attributes (e.g. `efs-backup`) | `list(string)` | `[]` | no |
| <a name="input_datapipeline_config"></a> [datapipeline\_config](#input\_datapipeline\_config) | DataPipeline configuration options | `map(string)` | <pre>{<br/>  "email": "",<br/>  "instance_type": "t2.micro",<br/>  "period": "24 hours",<br/>  "timeout": "60 Minutes"<br/>}</pre> | no |
| <a name="input_datapipeline_security_group"></a> [datapipeline\_security\_group](#input\_datapipeline\_security\_group) | Optionally specify a security group to use for the datapipeline instances | `string` | `""` | no |
| <a name="input_delimiter"></a> [delimiter](#input\_delimiter) | Delimiter to be used between `name`, `namespace`, `stage`, etc. | `string` | `"-"` | no |
| <a name="input_efs_mount_target_id"></a> [efs\_mount\_target\_id](#input\_efs\_mount\_target\_id) | EFS Mount Target ID (e.g. `fsmt-279bfc62`) | `string` | n/a | yes |
| <a name="input_modify_security_group"></a> [modify\_security\_group](#input\_modify\_security\_group) | Should the module modify the `EFS` security group | `string` | `"false"` | no |
| <a name="input_name"></a> [name](#input\_name) | The Name of the application or solution  (e.g. `bastion` or `portal`) | `any` | n/a | yes |
| <a name="input_namespace"></a> [namespace](#input\_namespace) | Namespace (e.g. `cp` or `cloudposse`) | `any` | n/a | yes |
| <a name="input_noncurrent_version_expiration_days"></a> [noncurrent\_version\_expiration\_days](#input\_noncurrent\_version\_expiration\_days) | S3 object versions expiration period (days) | `string` | `"35"` | no |
| <a name="input_region"></a> [region](#input\_region) | (Optional) AWS Region. If not specified, will be derived from 'aws\_region' data source | `string` | `""` | no |
| <a name="input_ssh_key_pair"></a> [ssh\_key\_pair](#input\_ssh\_key\_pair) | `SSH` key that will be deployed on DataPipeline's instance | `string` | n/a | yes |
| <a name="input_stage"></a> [stage](#input\_stage) | Stage (e.g. `prod`, `dev`, `staging`) | `any` | n/a | yes |
| <a name="input_subnet_id"></a> [subnet\_id](#input\_subnet\_id) | Optionally specify the subnet to use | `string` | `""` | no |
| <a name="input_tags"></a> [tags](#input\_tags) | Additional tags (e.g. `map('BusinessUnit`,`XYZ`) | `map(string)` | `{}` | no |
| <a name="input_use_ip_address"></a> [use\_ip\_address](#input\_use\_ip\_address) | If set to `true`, will use IP address instead of DNS name to connect to the `EFS` | `string` | `"false"` | no |
| <a name="input_vpc_id"></a> [vpc\_id](#input\_vpc\_id) | VPC ID | `string` | `""` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_backups_bucket_name"></a> [backups\_bucket\_name](#output\_backups\_bucket\_name) | Backups bucket name |
| <a name="output_datapipeline_ids"></a> [datapipeline\_ids](#output\_datapipeline\_ids) | Datapipeline ids |
| <a name="output_logs_bucket_name"></a> [logs\_bucket\_name](#output\_logs\_bucket\_name) | Logs bucket name |
| <a name="output_security_group_id"></a> [security\_group\_id](#output\_security\_group\_id) | Security group id |
| <a name="output_sns_topic_arn"></a> [sns\_topic\_arn](#output\_sns\_topic\_arn) | Backup notification SNS topic ARN |
<!-- markdownlint-restore -->

