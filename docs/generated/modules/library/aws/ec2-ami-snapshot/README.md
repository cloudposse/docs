---
title: ec2-ami-snapshot
sidebar_label: ec2-ami-snapshot
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

custom_edit_url: https://github.com/cloudposse/terraform-aws-ec2-ami-snapshot/blob/main/README.yaml
---

# Module: `ec2-ami-snapshot`
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
| <a name="module_label"></a> [label](#module\_label) | git::https://github.com/cloudposse/tf_label.git | 0.2.0 |

## Resources

| Name | Type |
|------|------|
| [aws_ami_from_instance.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ami_from_instance) | resource |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_attributes"></a> [attributes](#input\_attributes) | Additional attributes (e.g. `policy` or `role`) | `list(string)` | `[]` | no |
| <a name="input_delimiter"></a> [delimiter](#input\_delimiter) | Delimiter to be used between `name`, `namespace`, `stage`, etc. | `string` | `"-"` | no |
| <a name="input_name"></a> [name](#input\_name) | The Name of the application or solution  (e.g. `bastion` or `portal`) | `string` | `""` | no |
| <a name="input_namespace"></a> [namespace](#input\_namespace) | Namespace (e.g. `cp` or `cloudposse`) | `string` | `""` | no |
| <a name="input_snapshot_without_reboot"></a> [snapshot\_without\_reboot](#input\_snapshot\_without\_reboot) | n/a | `string` | `"true"` | no |
| <a name="input_source_instance_id"></a> [source\_instance\_id](#input\_source\_instance\_id) | n/a | `any` | n/a | yes |
| <a name="input_stage"></a> [stage](#input\_stage) | Stage (e.g. `prod`, `dev`, `staging`) | `string` | `""` | no |
| <a name="input_tags"></a> [tags](#input\_tags) | Additional tags (e.g. `map('BusinessUnit','XYZ')`) | `map(string)` | `{}` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_ami_id"></a> [ami\_id](#output\_ami\_id) | AMI ID depends on the instance type and region in which you're launching your stack. And IDs can change regularly, such as when an AMI is updated with software updates. |
<!-- markdownlint-restore -->

