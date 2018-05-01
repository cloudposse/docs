---
title: "terraform-aws-efs-backup"
excerpt: "Terraform module designed to easily backup EFS filesystems to S3 using DataPipeline."
---
# Terraform AWS EFS Backup 
[block:parameters]
{
  "data": {
    "0-0": "GitHub Repo",
    "1-0": "Terraform Module",
    "2-0": "Release",
    "3-0": "Build Status",
    "0-1": "https://github.com/cloudposse/terraform-aws-efs-backup",
    "1-1": "terraform-aws-efs-backup",
    "2-1": "[![Release](https://img.shields.io/github/release/cloudposse/terraform-aws-efs-backup.svg)](https://github.com/cloudposse/terraform-aws-efs-backup/releases)",
    "3-1": "[![Build Status](https://travis-ci.org/cloudposse/terraform-aws-efs-backup.svg)](https://travis-ci.org/cloudposse/terraform-aws-efs-backup)"
  },
  "cols": 2,
  "rows": 4
}
[/block]

The workflow is simple:

* Periodically launch resource (EC2 instance) based on schedule
* Execute the shell command defined in the activity on the instance
* Sync data from Production EFS to S3 Bucket by using `aws-cli`
* The execution log of the activity is stored in `S3`
* Publish the success or failure of the activity to an `SNS` topic
* Automatically rotate the backups using `S3 lifecycle rule`


# Usage

Include this module in your existing terraform code:
[block:code]
{
  "codes": [
    {
      "code": "module \"efs_backup\" {\n  source = \"git::https://github.com/cloudposse/terraform-aws-efs-backup.git?ref=master\"\n\n  name                               = \"${var.name}\"\n  stage                              = \"${var.stage}\"\n  namespace                          = \"${var.namespace}\"\n  vpc_id                             = \"${var.vpc_id}\"\n  efs_mount_target_id                = \"${var.efs_mount_target_id}\"\n  use_ip_address                     = \"false\"\n  noncurrent_version_expiration_days = \"${var.noncurrent_version_expiration_days}\"\n  ssh_key_pair                       = \"${var.ssh_key_pair}\"\n  datapipeline_config                = \"${var.datapipeline_config}\"\n  modify_security_group              = \"true\"\n}\n\noutput \"efs_backup_security_group\" {\n  value = \"${module.efs_backup.security_group_id}\"\n}",
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
    "3-3": "No",
    "4-3": "Yes",
    "5-3": "Yes",
    "6-3": "Yes",
    "7-3": "No",
    "8-3": "Yes",
    "9-3": "No",
    "10-3": "Yes",
    "11-3": "No",
    "12-3": "No",
    "13-3": "No",
    "13-2": "Delimiter to be used between `name`, `namespace`, `stage` and `attributes`",
    "0-2": "Namespace (e.g. `cp` or `cloudposse`)",
    "1-2": "Stage (e.g. `prod`, `dev`, `staging`)",
    "2-2": "Name  (e.g. `app` or `wordpress`)",
    "3-2": "(Optional) AWS Region. If not specified, will be derived from 'aws_region' data source",
    "4-2": "AWS VPC ID where module should operate (_e.g._ `vpc-a22222ee`)",
    "5-2": "Elastic File System Mount Target ID (_e.g._ `fsmt-279bfc62`)",
    "6-2": "If set to `true`, will use IP address instead of DNS name to connect to the `EFS`",
    "7-2": "Should the module modify the `EFS` security group",
    "8-2": "S3 object versions expiration period (days)",
    "9-2": "`SSH` key that will be deployed on DataPipeline's instance",
    "10-2": "DataPipeline configuration options",
    "11-2": "Additional attributes (_e.g._ `efs-backup`)",
    "12-2": "Additional tags (e.g. `map(\"BusinessUnit\",\"XYZ\")`",
    "0-1": "``",
    "1-1": "``",
    "2-1": "``",
    "4-1": "``",
    "5-1": "``",
    "9-1": "``",
    "3-1": "`us-east-1`",
    "6-1": "`false`",
    "7-1": "`false`",
    "8-1": "`35`",
    "10-1": "`${map(\"instance_type\", \"t2.micro\", \"email\", \"\", \"period\", \"24 hours\", \"timeout\", \"60 Minutes\")}\"`",
    "11-1": "`[]`",
    "12-1": "`{}`",
    "13-1": "`-`",
    "13-0": "delimiter",
    "12-0": "tags",
    "11-0": "attributes",
    "10-0": "datapipeline_config",
    "9-0": "ssh_key_pair",
    "8-0": "noncurrent_version_expiration_days",
    "7-0": "modify_security_group",
    "6-0": "use_ip_address",
    "5-0": "efs_mount_target_id",
    "4-0": "vpc_id",
    "3-0": "region",
    "2-0": "name",
    "1-0": "stage",
    "0-0": "namespace"
  },
  "cols": 4,
  "rows": 14
}
[/block]
# DataPipeline Config Variables
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
    "3-2": "Pipeline execution timeout",
    "2-2": "Frequency of pipeline execution (frequency of backups)",
    "1-2": "Email to use in `SNS`. Needs to be provided, otherwise the module will fail",
    "0-2": "Instance type to use",
    "0-1": "`t2.micro`",
    "1-1": "``",
    "2-1": "`24 hours`",
    "3-1": "`60 Minutes`",
    "0-0": "instance_type",
    "1-0": "email",
    "2-0": "period",
    "3-0": "timeout"
  },
  "cols": 4,
  "rows": 4
}
[/block]
# Integration with EFS

To enable connectivity between the `DataPipeline` instances and the `EFS`, use one of the following methods to configure Security Groups:

1. Explicitly add the `DataPipeline` SG (the output of this module `security_group_id`) to the list of the `ingress` rules of the `EFS` SG. For example:
[block:code]
{
  "codes": [
    {
      "code": "module \"elastic_beanstalk_environment\" {\n  source     = \"git::https://github.com/cloudposse/terraform-aws-elastic-beanstalk-environment.git?ref=master\"\n  namespace  = \"${var.namespace}\"\n  name       = \"${var.name}\"\n  stage      = \"${var.stage}\"\n  delimiter  = \"${var.delimiter}\"\n  attributes = [\"${compact(concat(var.attributes, list(\"eb-env\")))}\"]\n  tags       = \"${var.tags}\"\n\n  # ..............................\n}\n\nmodule \"efs\" {\n  source     = \"git::https://github.com/cloudposse/terraform-aws-efs.git?ref=tmaster\"\n  namespace  = \"${var.namespace}\"\n  name       = \"${var.name}\"\n  stage      = \"${var.stage}\"\n  delimiter  = \"${var.delimiter}\"\n  attributes = [\"${compact(concat(var.attributes, list(\"efs\")))}\"]\n  tags       = \"${var.tags}\"\n\n  # Allow EB/EC2 instances and DataPipeline instances to connect to the EFS\n  security_groups = [\"${module.elastic_beanstalk_environment.security_group_id}\", \"${module.efs_backup.security_group_id}\"]\n}\n\nmodule \"efs_backup\" {\n  source     = \"git::https://github.com/cloudposse/terraform-aws-efs-backup.git?ref=master\"\n  name       = \"${var.name}\"\n  stage      = \"${var.stage}\"\n  namespace  = \"${var.namespace}\"\n  delimiter  = \"${var.delimiter}\"\n  attributes = [\"${compact(concat(var.attributes, list(\"efs-backup\")))}\"]\n  tags       = \"${var.tags}\"\n  \n  # Important to set it to `false` since we added the `DataPipeline` SG (output of the `efs_backup` module) to the `security_groups` of the `efs` module\n  # See NOTE below for more information\n  modify_security_group = \"false\"\n\n  # ..............................\n}\n",
      "language": "json",
      "name": "HCL"
    }
  ]
}
[/block]

2. Set `modify_security_group` attribute to `true` so the module will modify the `EFS` SG to allow the `DataPipeline` to connect to the `EFS`
[block:callout]
{
  "type": "warning",
  "title": "NOTE",
  "body": "Do not mix these two methods together.\n\nTerraform does not support using a Security Group with in-line rules in conjunction with any Security Group Rule resources.\nSee: https://www.terraform.io/docs/providers/aws/r/security_group_rule.html\n\n> NOTE on Security Groups and Security Group Rules: Terraform currently provides both a standalone Security Group Rule resource (a single ingress or egress rule), and a Security Group resource with ingress and egress rules defined in-line. At this time you cannot use a Security Group with in-line rules in conjunction with any Security Group Rule resources. Doing so will cause a conflict of rule settings and will overwrite rules."
}
[/block]