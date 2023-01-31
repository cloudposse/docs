---
title: aws-ec2-ami-backup
sidebar_label: aws-ec2-ami-backup
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

custom_edit_url: https://github.com/cloudposse/terraform-aws-ec2-ami-backup/edit/master/README.md
---

# Component: `aws-ec2-ami-backup`
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
| ami_owner | AWS Account ID which is used as a filter for AMI list (e.g. `123456789012`) | string | `` | no |
| backup_schedule | The scheduling expression. (e.g. cron(0 20 * * ? *) or rate(5 minutes) | string | `cron(00 19 * * ? *)` | no |
| block_device_mappings | List of block device mappings to be included/excluded from created AMIs. With default value of [], AMIs will include all attached EBS volumes | list | `<list>` | no |
| cleanup_schedule | The scheduling expression. (e.g. cron(0 20 * * ? *) or rate(5 minutes) | string | `cron(05 19 * * ? *)` | no |
| instance_id | AWS Instance ID which is used for creating the AMI image (e.g. `id-123456789012`) | string | - | yes |
| name | Name  (e.g. `bastion` or `db`) | string | `` | no |
| namespace | Namespace (e.g. `cp` or `cloudposse`) | string | `` | no |
| reboot | Reboot the machine as part of the snapshot process | string | `false` | no |
| region | AWS Region where module should operate (e.g. `us-east-1`) | string | `` | no |
| retention_days | Is the number of days you want to keep the backups for (e.g. `14`) | string | `14` | no |
| stage | Stage (e.g. `prod`, `dev`, `staging`) | string | `` | no |



