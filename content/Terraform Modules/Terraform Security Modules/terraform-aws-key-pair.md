---
title: "terraform-aws-key-pair"
excerpt: "Terraform module for generating (or importing) a SSH public key file into AWS."
---
# Terraform AWS Key Pair
[block:parameters]
{
  "data": {
    "0-0": "GitHub Repo",
    "1-0": "Terraform Module",
    "2-0": "Release",
    "3-0": "Build Status",
    "0-1": "https://github.com/cloudposse/terraform-aws-key-pair",
    "1-1": "terraform-aws-key-pair",
    "2-1": "[![Release](https://img.shields.io/github/release/cloudposse/terraform-aws-key-pair.svg)](https://github.com/cloudposse/terraform-aws-key-pair/releases)",
    "3-1": "[![Build Status](https://travis-ci.org/cloudposse/terraform-aws-key-pair.svg)](https://travis-ci.org/cloudposse/terraform-aws-key-pair)"
  },
  "cols": 2,
  "rows": 4
}
[/block]

[block:code]
{
  "codes": [
    {
      "code": "module \"default\" {\n  source                           = \"git::https://github.com/cloudposse/terraform-aws-key-pair.git?ref=master\"\n  domain_name                      = \"example.com\"\n  proces_domain_validation_options = \"true\"\n  ttl                              = \"300\"\n}",
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
    "0-0": "`namespace`",
    "1-0": "`stage`",
    "2-0": "`name`",
    "3-0": "`ssh_public_key_path`",
    "4-0": "`generate_ssh_key`",
    "5-0": "`private_key_extension`",
    "6-0": "`public_key_extension`",
    "7-0": "`chmod_command`",
    "0-1": "``",
    "1-1": "``",
    "2-1": "``",
    "3-1": "``",
    "5-1": "``",
    "4-1": "`false`",
    "6-1": "`.pub`",
    "7-1": "`chmod 600 %v`",
    "0-2": "Namespace (e.g. `cp` or `cloudposse`)",
    "1-2": "Stage (e.g. `prod`, `dev`, `staging`)",
    "2-2": "Application Name  (e.g. `bastion` or `app`)",
    "3-2": "Path to Read/Write SSH Public Key File (directory)",
    "4-2": "If set to `true`, new ssh key pair will be created",
    "5-2": "Private key file extension, _e.g._ `.pem`",
    "6-2": "Public key file extension, _e.g._ `.pub`",
    "7-2": "Template of the command executed on the private key file.",
    "0-3": "Yes",
    "1-3": "Yes",
    "2-3": "Yes",
    "3-3": "Yes",
    "4-3": "No",
    "5-3": "No",
    "6-3": "Yes",
    "7-3": "Yes(Linux), No(Windows)"
  },
  "cols": 4,
  "rows": 8
}
[/block]
# Outputs
[block:parameters]
{
  "data": {
    "h-0": "Name",
    "h-1": "Description",
    "0-0": "`key_name`",
    "1-0": "`public_key`",
    "1-1": "Contents of the generated public key",
    "0-1": "Name of SSH key"
  },
  "cols": 2,
  "rows": 2
}
[/block]