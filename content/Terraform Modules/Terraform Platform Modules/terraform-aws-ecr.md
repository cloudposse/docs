---
title: "terraform-aws-ecr"
excerpt: "Terraform module to provision an [`AWS ECR Docker Container registry`](https://aws.amazon.com/ecr/)."
---
# Terraform AWS ECR
[block:parameters]
{
  "data": {
    "0-0": "GitHub Repo",
    "1-0": "Terraform Module",
    "2-0": "Release",
    "3-0": "Build Status",
    "0-1": "https://github.com/cloudposse/terraform-aws-ecr",
    "1-1": "terraform-aws-ecr",
    "2-1": "[![Release](https://img.shields.io/github/release/cloudposse/terraform-aws-ecr.svg)](https://github.com/cloudposse/terraform-aws-ecr/releases)",
    "3-1": "[![Build Status](https://travis-ci.org/cloudposse/terraform-aws-ecr.svg)](https://travis-ci.org/cloudposse/terraform-aws-ecr)"
  },
  "cols": 2,
  "rows": 4
}
[/block]

# Usage

The module works in two distinct modes:

1. If you provide the existing IAM Role names in the `roles` attribute, the Roles will be granted permissions to work with the created registry.

2. If the `roles` attribute is omitted or is an empty list, a new IAM Role will be created and granted all the required permissions to work with the registry.
The Role name will be assigned to the output variable `role_name`.
In addition, an `EC2 Instance Profile` will be created from the new IAM Role, which might be assigned to EC2 instances granting them permissions to work with the ECR registry.


Include this repository as a module in your existing terraform code:

[block:code]
{
  "codes": [
    {
      "code": "module \"ecr\" {\n  source                           = \"git::https://github.com/cloudposse/terraform-aws-ecr.git?ref=master\"\n  domain_name                      = \"example.com\"\n  proces_domain_validation_options = \"true\"\n  ttl                              = \"300\"\n}",
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
    "4-2": "How many Docker Image versions AWS ECR will store",
    "3-2": "List of IAM role names that will be granted permissions to use the container registry",
    "2-2": "The Name of the application or solution  (e.g. `bastion` or `portal`)",
    "1-2": "Stage (e.g. `prod`, `dev`, `staging`)",
    "0-2": "Namespace (e.g. `cp` or `cloudposse`)",
    "0-1": "`global`",
    "1-1": "`default`",
    "2-1": "`admin`",
    "3-1": "`[]`",
    "4-1": "`7`",
    "4-0": "`max_image_count`",
    "3-0": "`roles`",
    "2-0": "`name`",
    "1-0": "`stage`",
    "0-0": "`namespace`",
    "0-3": "Yes",
    "1-3": "Yes",
    "2-3": "Yes",
    "3-3": "Yes",
    "4-3": "No (optional)"
  },
  "cols": 4,
  "rows": 5
}
[/block]
# Outputs
[block:parameters]
{
  "data": {
    "h-0": "Name",
    "h-1": "Description",
    "2-1": "(Optional) The name of the newly created IAM role that has access to the registry",
    "1-1": "URL to the created AWS Container Registry",
    "0-1": "ID of the created AWS Container Registry",
    "0-0": "`registry_id`",
    "1-0": "`registry_url`",
    "2-0": "`role_name`"
  },
  "cols": 2,
  "rows": 3
}
[/block]