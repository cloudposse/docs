---
title: "terraform-aws-ec2-ami-snapshot"
excerpt: ""
---
# Terraform AWS EC2 AMI Snapshot
[block:parameters]
{
  "data": {
    "0-0": "GitHub Repo",
    "1-0": "Terraform Module",
    "2-0": "Release",
    "3-0": "Build Status",
    "0-1": "https://github.com/cloudposse/terraform-aws-ec2-ami-snapshot",
    "1-1": "terraform-aws-ec2-ami-snapshot",
    "2-1": "[![Release](https://img.shields.io/github/release/cloudposse/terraform-aws-ec2-ami-snapshot.svg)](https://github.com/cloudposse/terraform-aws-ec2-ami-snapshot/releases)",
    "3-1": "[![Build Status](https://travis-ci.org/cloudposse/terraform-aws-ec2-ami-snapshot.svg?branch=master)](https://travis-ci.org/cloudposse/terraform-aws-ec2-ami-snapshot)"
  },
  "cols": 2,
  "rows": 4
}
[/block]

# Module usage

## Create an AWS instance
[block:code]
{
  "codes": [
    {
      "code": "resource \"aws_instance\" \"default\" {\n  ami           = \"ami-408c7f28\"\n  instance_type = \"t1.micro\"\n\n  tags = {\n    Name = \"test1\"\n  }\n}",
      "language": "json",
      "name": "HCL"
    }
  ]
}
[/block]
## Create AMI from an AWS instance. 

Instance ID is required.
[block:code]
{
  "codes": [
    {
      "code": "module \"tf_ami_from_instance\" {\n  source             = \"git::https://github.com/cloudposse/tf_ami_from_instance.git?ref=master\"\n  source_instance_id = \"${aws_instance.web.id}\"\n  stage              = \"${var.stage}\"\n  namespace          = \"${var.namespace}\"\n  name               = \"${var.name}\"\n  attributes         = \"${var.attributes}\"\n  tags               = \"${var.tags}\"\n}",
      "language": "json",
      "name": "HCL"
    }
  ]
}
[/block]

[block:callout]
{
  "type": "danger",
  "title": "CAVEATS",
  "body": "* Terraform will only keep the latest AMI snapshot (terraform will delete the previously generated AMI) See our Lamda based solution which avoids this pitfall: [terraform-aws-ec2-ami-backup](doc:terraform-aws-ec2-ami-backup) \n* This is is not compatible with autoscaling groups"
}
[/block]