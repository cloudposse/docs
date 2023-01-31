---
title: aws-ec2-ami-snapshot
sidebar_label: aws-ec2-ami-snapshot
sidebar_class_name: command
description: |-
  Terraform module to easily generate AMI snapshots to create replica instances
tags:
  - aws
  - terraform
  - terraform-modules
  - backups
  - ami
  - snapshot
  - replica

custom_edit_url: https://github.com/cloudposse/terraform-aws-ec2-ami-snapshot/edit/master/README.md
---

# Component: `aws-ec2-ami-snapshot`
Terraform module to easily generate AMI snapshots to create replica instances






## Usage

### Create an AWS instance
```
resource "aws_instance" "default" {
  ami           = "ami-408c7f28"
  instance_type = "t1.micro"

  tags = {
    Name = "test1"
  }
}
```

### Create AMI from an AWS instance. Instance ID is required"
```
module "tf_ami_from_instance" {
  source             = "git::https://github.com/cloudposse/tf_ami_from_instance.git?ref=master"
  source_instance_id = "${aws_instance.web.id}"
  stage              = "${var.stage}"
  namespace          = "${var.namespace}"
  name               = "${var.name}"
  attributes         = "${var.attributes}"
  tags               = "${var.tags}"
}

```

## Caveats
* Terraform will only keep the latest AMI snapshot (terraform will delete the previously generated AMI) See our Lamda based solution which avoids this pitfall: https://github.com/cloudposse/tf_lambda_ami_backup
* This is is not compatible with autoscaling groups






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
| attributes | Additional attributes (e.g. `policy` or `role`) | list | `<list>` | no |
| delimiter | Delimiter to be used between `name`, `namespace`, `stage`, etc. | string | `-` | no |
| name | The Name of the application or solution  (e.g. `bastion` or `portal`) | string | `` | no |
| namespace | Namespace (e.g. `cp` or `cloudposse`) | string | `` | no |
| snapshot_without_reboot |  | string | `true` | no |
| source_instance_id |  | string | - | yes |
| stage | Stage (e.g. `prod`, `dev`, `staging`) | string | `` | no |
| tags | Additional tags (e.g. `map('BusinessUnit','XYZ')`) | map | `<map>` | no |

## Outputs

| Name | Description |
|------|-------------|
| ami_id | AMI ID depends on the instance type and region in which you're launching your stack. And IDs can change regularly, such as when an AMI is updated with software updates. |



