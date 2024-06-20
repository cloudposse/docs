---
title: ec2-ami-backup
sidebar_label: ec2-ami-backup
sidebar_class_name: command
description: |-
  This repo contains a terraform module that creates two lambda functions
  that will create AMI automatically at regular intervals. It is based on
  the code at
  <https://serverlesscode.com/post/lambda-schedule-ebs-snapshot-backups/> and
  <https://serverlesscode.com/post/lambda-schedule-ebs-snapshot-backups-2/>.
tags:
  - aws
  - terraform
  - terraform-modules
  - backups
  - aws-lambda
  - ami
  - scheduled-events
  - cronjob
  - snapshot
  - ebs

custom_edit_url: https://github.com/cloudposse/terraform-aws-ec2-ami-backup/blob/main/README.yaml
---

# Module: `ec2-ami-backup`
This repo contains a terraform module that creates two lambda functions
that will create AMI automatically at regular intervals. It is based on
the code at
<https://serverlesscode.com/post/lambda-schedule-ebs-snapshot-backups/> and
<https://serverlesscode.com/post/lambda-schedule-ebs-snapshot-backups-2/>.






## Usage

Include this repository as a module in your existing terraform code:

```hcl
module "lambda_ami_backup" {
  source = "git::https://github.com/cloudposse/terraform-aws-ec2-ami-backup.git?ref=tags/0.3.2"

  name           = "${var.name}"
  stage          = "${var.stage}"
  namespace      = "${var.namespace}"
  region         = "${var.region}"
  ami_owner      = "${var.ami_owner}"
  instance_id    = "${var.instance_id}"
  retention_days = "14"
}
```




## Examples

Example on excluding some of attached EBS volumes:

```hcl
module "lambda_ami_backup" {
  source = "git::https://github.com/cloudposse/terraform-aws-ec2-ami-backup.git?ref=tags/0.3.2"

  name           = "${var.name}"
  stage          = "${var.stage}"
  namespace      = "${var.namespace}"
  region         = "${var.region}"
  ami_owner      = "${var.ami_owner}"
  instance_id    = "${var.instance_id}"
  retention_days = "14"

  block_device_mappings = [
    { "DeviceName" = "/dev/xvdf", "NoDevice" = "" },
    { "DeviceName" = "/dev/xvdg", "NoDevice" = "" },
  ]
}
```



<!-- markdownlint-disable -->
## Requirements

No requirements.

## Providers

| Name | Version |
|------|---------|
| <a name="provider_archive"></a> [archive](#provider\_archive) | n/a |
| <a name="provider_aws"></a> [aws](#provider\_aws) | n/a |
| <a name="provider_null"></a> [null](#provider\_null) | n/a |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_label"></a> [label](#module\_label) | git::https://github.com/cloudposse/terraform-null-label.git | tags/0.3.7 |
| <a name="module_label_backup"></a> [label\_backup](#module\_label\_backup) | git::https://github.com/cloudposse/terraform-null-label.git | tags/0.3.7 |
| <a name="module_label_cleanup"></a> [label\_cleanup](#module\_label\_cleanup) | git::https://github.com/cloudposse/terraform-null-label.git | tags/0.3.7 |
| <a name="module_label_role"></a> [label\_role](#module\_label\_role) | git::https://github.com/cloudposse/terraform-null-label.git | tags/0.3.7 |

## Resources

| Name | Type |
|------|------|
| [aws_cloudwatch_event_rule.ami_backup](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_event_rule) | resource |
| [aws_cloudwatch_event_rule.ami_cleanup](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_event_rule) | resource |
| [aws_cloudwatch_event_target.ami_backup](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_event_target) | resource |
| [aws_cloudwatch_event_target.ami_cleanup](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_event_target) | resource |
| [aws_iam_role.ami_backup](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role) | resource |
| [aws_iam_role_policy.ami_backup](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy) | resource |
| [aws_lambda_function.ami_backup](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_function) | resource |
| [aws_lambda_function.ami_cleanup](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_function) | resource |
| [aws_lambda_permission.ami_backup](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_permission) | resource |
| [aws_lambda_permission.ami_cleanup](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_permission) | resource |
| [null_resource.schedule](https://registry.terraform.io/providers/hashicorp/null/latest/docs/resources/resource) | resource |
| [archive_file.ami_backup](https://registry.terraform.io/providers/hashicorp/archive/latest/docs/data-sources/file) | data source |
| [archive_file.ami_cleanup](https://registry.terraform.io/providers/hashicorp/archive/latest/docs/data-sources/file) | data source |
| [aws_iam_policy_document.ami_backup](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_ami_owner"></a> [ami\_owner](#input\_ami\_owner) | AWS Account ID which is used as a filter for AMI list (e.g. `123456789012`) | `string` | `""` | no |
| <a name="input_backup_schedule"></a> [backup\_schedule](#input\_backup\_schedule) | The scheduling expression. (e.g. cron(0 20 * * ? *) or rate(5 minutes) | `string` | `"cron(00 19 * * ? *)"` | no |
| <a name="input_block_device_mappings"></a> [block\_device\_mappings](#input\_block\_device\_mappings) | List of block device mappings to be included/excluded from created AMIs. With default value of [], AMIs will include all attached EBS volumes | `list(string)` | `[]` | no |
| <a name="input_cleanup_schedule"></a> [cleanup\_schedule](#input\_cleanup\_schedule) | The scheduling expression. (e.g. cron(0 20 * * ? *) or rate(5 minutes) | `string` | `"cron(05 19 * * ? *)"` | no |
| <a name="input_instance_id"></a> [instance\_id](#input\_instance\_id) | AWS Instance ID which is used for creating the AMI image (e.g. `id-123456789012`) | `any` | n/a | yes |
| <a name="input_name"></a> [name](#input\_name) | Name  (e.g. `bastion` or `db`) | `string` | `""` | no |
| <a name="input_namespace"></a> [namespace](#input\_namespace) | Namespace (e.g. `cp` or `cloudposse`) | `string` | `""` | no |
| <a name="input_reboot"></a> [reboot](#input\_reboot) | Reboot the machine as part of the snapshot process | `string` | `"false"` | no |
| <a name="input_region"></a> [region](#input\_region) | AWS Region where module should operate (e.g. `us-east-1`) | `string` | `""` | no |
| <a name="input_retention_days"></a> [retention\_days](#input\_retention\_days) | Is the number of days you want to keep the backups for (e.g. `14`) | `string` | `"14"` | no |
| <a name="input_stage"></a> [stage](#input\_stage) | Stage (e.g. `prod`, `dev`, `staging`) | `string` | `""` | no |

## Outputs

No outputs.
<!-- markdownlint-restore -->

