---
title: "terraform-aws-ec2-ami-backup"
excerpt: "Terraform module for automatic AMI creation"
---
# Terraform AWS EC2 AMI Backup
[block:parameters]
{
  "data": {
    "0-0": "GitHub Repo",
    "1-0": "Terraform Module",
    "2-0": "Release",
    "3-0": "Build Status",
    "0-1": "https://github.com/cloudposse/terraform-aws-ec2-ami-backup",
    "1-1": "terraform-aws-ec2-ami-backup",
    "2-1": "[![Release](https://img.shields.io/github/release/cloudposse/terraform-aws-ec2-ami-backup.svg)](https://github.com/cloudposse/terraform-aws-ec2-ami-backup/releases)",
    "3-1": "[![Build Status](https://travis-ci.org/cloudposse/terraform-aws-ec2-ami-backup.svg?branch=master)](https://travis-ci.org/cloudposse/terraform-aws-ec2-ami-backup)"
  },
  "cols": 2,
  "rows": 4
}
[/block]
This repo contains a terraform module that creates two lambda functions
that will create AMI automatically at regular intervals. 

It is based on the code at:
* <https://serverlesscode.com/post/lambda-schedule-ebs-snapshot-backups/> and
* <https://serverlesscode.com/post/lambda-schedule-ebs-snapshot-backups-2/>.

# Usage

Include this repository as a module in your existing terraform code:
[block:code]
{
  "codes": [
    {
      "code": "module \"lambda_ami_backup\" {\n  source = \"git::https://github.com/cloudposse/tf_ami_backup.git?ref=tags/0.1.0\"\n\n  name              = \"${var.name}\"\n  stage             = \"${var.stage}\"\n  namespace         = \"${var.namespace}\"\n  region            = \"${var.region}\"\n  ami_owner         = \"${var.ami_owner}\"\n  instance_id       = \"${var.instance_id}\"\n  retention_days    = \"14\"\n}",
      "language": "json",
      "name": "HCL"
    }
  ]
}
[/block]
# Variables
[block:parameters]
{
  "data": {
    "h-0": "Name",
    "h-1": "Default",
    "h-2": "Description",
    "h-3": "Required",
    "0-3": "Yes",
    "1-3": "Yes",
    "2-3": "Yes",
    "3-3": "Yes",
    "4-3": "Yes",
    "5-3": "Yes",
    "6-3": "No",
    "7-3": "No",
    "8-3": "No",
    "0-2": "Namespace (e.g. `cp` or `cloudposse`)",
    "1-2": "Stage (e.g. `prod`, `dev`, `staging`",
    "2-2": "Name  (e.g. `bastion` or `db`)",
    "3-2": "AWS Region where module should operate (e.g. `us-east-1`)",
    "4-2": "AWS Account ID which is used as a filter for AMI list (e.g. `123456789012`)",
    "5-2": "AWS Instance ID which is used for creating the AMI image (e.g. `id-123456789012`)",
    "6-2": "Is the number of days you want to keep the backups for (e.g. `14`)",
    "7-2": "The scheduling expression. (e.g. cron(0 20 * * ? *",
    "8-2": "The scheduling expression. (e.g. cron(0 20 * * ? *",
    "8-1": "`cron(05 19 * * ? *)`",
    "7-1": "`cron(00 19 * * ? *)`",
    "6-1": "`14`",
    "5-1": "``",
    "4-1": "``",
    "3-1": "``",
    "2-1": "``",
    "1-1": "``",
    "0-1": "``",
    "0-0": "namespace",
    "1-0": "stage",
    "2-0": "name",
    "3-0": "region",
    "4-0": "ami_owner",
    "5-0": "instance_id",
    "6-0": "retention_days",
    "7-0": "backup_schedule",
    "8-0": "cleanup_schedule"
  },
  "cols": 4,
  "rows": 9
}
[/block]