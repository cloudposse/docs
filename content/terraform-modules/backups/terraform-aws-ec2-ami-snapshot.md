---
title: terraform-aws-ec2-ami-snapshot
description: ''
---

# Terraform AWS EC2 AMI Snapshot

|                  |                                                                                                                                                                          |
|:-----------------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| GitHub Repo      | <https://github.com/cloudposse/terraform-aws-ec2-ami-snapshot>                                                                                                           |
| Terraform Module | terraform-aws-ec2-ami-snapshot                                                                                                                                           |
| Release          | [![Release](https://img.shields.io/github/release/cloudposse/terraform-aws-ec2-ami-snapshot.svg)](https://github.com/cloudposse/terraform-aws-ec2-ami-snapshot/releases) |
| Build Status     | [![Build Status](https://travis-ci.org/cloudposse/terraform-aws-ec2-ami-snapshot.svg?branch=master)](https://travis-ci.org/cloudposse/terraform-aws-ec2-ami-snapshot)    |

# Module usage

## Create an AWS instance

### HCL

```hcl
resource "aws_instance" "default" {
  ami           = "ami-408c7f28"
  instance_type = "t1.micro"

  tags = {
    Name = "test1"
  }
}
```

## Create AMI from an AWS instance.

Instance ID is required.

### HCL

```hcl
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

{{% dialog type="warning" icon="fa fa-exclamation-circle" title="Caveats" %}}
- Terraform will only keep the latest AMI snapshot (terraform will delete the previously generated AMI) See our Lamda based solution which avoids this pitfall: [terraform-aws-ec2-ami-backup]({{< relref "terraform-modules/backups/terraform-aws-ec2-ami-backup.md" >}})
- This is is not compatible with autoscaling groups
{{% /dialog %}}
