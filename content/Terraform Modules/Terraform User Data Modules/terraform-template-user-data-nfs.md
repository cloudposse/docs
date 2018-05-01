---
title: "terraform-template-user-data-nfs"
excerpt: "Terraform module designed to use template file to generate the bootstrap shell script `user_data.sh`"
---
# Terraform Template User Data NFS
[block:parameters]
{
  "data": {
    "0-0": "GitHub Repo",
    "1-0": "Terraform Module",
    "2-0": "Release",
    "3-0": "Build Status",
    "0-1": "https://github.com/cloudposse/terraform-template-user-data-nfs",
    "1-1": "terraform-template-user-data-nfs",
    "2-1": "[![Release](https://img.shields.io/github/release/cloudposse/terraform-template-user-data-nfs.svg)](https://github.com/cloudposse/terraform-template-user-data-nfs/releases)",
    "3-1": "[![Build Status](https://travis-ci.org/cloudposse/terraform-template-user-data-nfs.svg?branch=master)](https://travis-ci.org/cloudposse/terraform-template-user-data-nfs)"
  },
  "cols": 2,
  "rows": 4
}
[/block]

# Usage

Include this module in your existing terraform code:
[block:code]
{
  "codes": [
    {
      "code": "module \"user_data_nfs\" {\n  source                           = \"git::https://github.com/cloudposse/terraform-template-user-data-nfs.git?ref=master\"\n  domain_name                      = \"example.com\"\n  proces_domain_validation_options = \"true\"\n  ttl                              = \"300\"\n}",
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
    "5-3": "No",
    "5-2": "Server OS that will execute user data script",
    "4-2": "NFS server host",
    "3-2": "Directory mount to",
    "2-2": "Name  (e.g. `bastion` or `db`)",
    "1-2": "Stage (e.g. `prod`, `dev`, `staging`)",
    "0-2": "Namespace (e.g. `cp` or `cloudposse`)",
    "0-1": "``",
    "1-1": "``",
    "2-1": "``",
    "3-1": "``",
    "4-1": "``",
    "5-1": "`ubuntu`",
    "5-0": "os",
    "4-0": "host",
    "3-0": "dir",
    "2-0": "name",
    "1-0": "stage",
    "0-0": "namespace"
  },
  "cols": 4,
  "rows": 6
}
[/block]