---
title: "terraform-null-label"
excerpt: "Terraform module designed to generate consistent label names and tags for resources. Use `terraform-null-label` to implement a strict naming convention."
---
# Terraform Null Label
[block:parameters]
{
  "data": {
    "0-0": "GitHub Repo",
    "1-0": "Terraform Module",
    "2-0": "Release",
    "3-0": "Build Status",
    "0-1": "https://github.com/cloudposse/terraform-null-label",
    "1-1": "terraform-null-label",
    "2-1": "[![Release](https://img.shields.io/github/release/cloudposse/terraform-null-label.svg)](https://github.com/cloudposse/terraform-null-label/releases)",
    "3-1": "[![Build Status](https://travis-ci.org/cloudposse/terraform-null-label.svg)](https://travis-ci.org/cloudposse/terraform-null-label)"
  },
  "cols": 2,
  "rows": 4
}
[/block]

A label follows the following convention: `{namespace}-{stage}-{name}-{attributes}`. The delimiter (e.g. `-`) is interchangeable.

It's recommended to use one `terraform-null-label` module for every unique resource of a given resource type.
For example, if you have 10 instances, there should be 10 different labels.
However, if you have multiple different kinds of resources (e.g. instances, security groups, file systems, and elastic ips), then they can all share the same label assuming they are logically related.

All [Cloud Posse modules](https://github.com/cloudposse?utf8=%E2%9C%93&q=tf_&type=&language=) use this module to ensure resources can be instantiated multiple times within an account and without conflict.
[block:callout]
{
  "type": "info",
  "title": "NOTE",
  "body": "The `null` refers to the primary Terraform [provider](https://www.terraform.io/docs/providers/null/index.html) used to implement this module."
}
[/block]
# Usage

## Simple Example

Include this repository as a module in your existing terraform code:
[block:code]
{
  "codes": [
    {
      "code": "module \"eg_prod_bastion_label\" {\n  source     = \"git::https://github.com/cloudposse/terraform-null-label.git?ref=master\"\n  namespace  = \"eg\"\n  stage      = \"prod\"\n  name       = \"bastion\"\n  attributes = [\"public\"]\n  delimiter  = \"-\"\n  tags       = \"${map(\"BusinessUnit\", \"XYZ\", \"Snapshot\", \"true\")}\"\n}",
      "language": "json",
      "name": "HCL"
    }
  ]
}
[/block]
This will create an `id` with the value of `eg-prod-bastion-public`.

Now reference the label when creating an instance (for example):
[block:code]
{
  "codes": [
    {
      "code": "resource \"aws_instance\" \"eg_prod_bastion_public\" {\n  instance_type = \"t1.micro\"\n  tags          = \"${module.eg_prod_bastion_label.tags}\"\n}",
      "language": "json",
      "name": "HCL"
    }
  ]
}
[/block]
Or define a security group:
[block:code]
{
  "codes": [
    {
      "code": "resource \"aws_security_group\" \"eg_prod_bastion_public\" {\n  vpc_id = \"${var.vpc_id}\"\n  name   = \"${module.eg_prod_bastion_label.id}\"\n  tags   = \"${module.eg_prod_bastion_label.tags}\"\n  egress {\n    from_port   = 0\n    to_port     = 0\n    protocol    = \"-1\"\n    cidr_blocks = [\"0.0.0.0/0\"]\n  }\n}",
      "language": "json",
      "name": "HCL"
    }
  ]
}
[/block]

## Advanced Example

Here is a more complex example with two instances using two different labels. Note how efficiently the tags are defined for both the instance and the security group.
[block:code]
{
  "codes": [
    {
      "code": "module \"eg_prod_bastion_abc_label\" {\n  source     = \"git::https://github.com/cloudposse/terraform-null-label.git?ref=master\"\n  namespace  = \"eg\"\n  stage      = \"prod\"\n  name       = \"bastion\"\n  attributes = [\"abc\"]\n  delimiter  = \"-\"\n  tags       = \"${map(\"BusinessUnit\", \"ABC\")}\"\n}\n\nresource \"aws_security_group\" \"eg_prod_bastion_abc\" {\n  name = \"${module.eg_prod_bastion_abc_label.id}\"\n  tags = \"${module.eg_prod_bastion_abc_label.tags}\"\n  ingress {\n    from_port   = 22\n    to_port     = 22\n    protocol    = \"tcp\"\n    cidr_blocks = [\"0.0.0.0/0\"]\n  }\n}\n\nresource \"aws_instance\" \"eg_prod_bastion_abc\" {\n   instance_type          = \"t1.micro\"\n   tags                   = \"${module.eg_prod_bastion_abc_label.tags}\"\n   vpc_security_group_ids = [\"${aws_security_group.eg_prod_bastion_abc.id\"}]\n}\n\nmodule \"eg_prod_bastion_xyz_label\" {\n  source     = \"git::https://github.com/cloudposse/terraform-null-label.git?ref=master\"\n  namespace  = \"eg\"\n  stage      = \"prod\"\n  name       = \"bastion\"\n  attributes = [\"xyz\"]\n  delimiter  = \"-\"\n  tags       = \"${map(\"BusinessUnit\", \"XYZ\")}\"\n}\n\nresource \"aws_security_group\" \"eg_prod_bastion_xyz\" {\n  name = \"module.eg_prod_bastion_xyz_label.id\"\n  tags = \"${module.eg_prod_bastion_xyz_label.tags}\"\n  ingress {\n    from_port   = 22\n    to_port     = 22\n    protocol    = \"tcp\"\n    cidr_blocks = [\"0.0.0.0/0\"]\n  }\n}\n\nresource \"aws_instance\" \"eg_prod_bastion_xyz\" {\n   instance_type          = \"t1.micro\"\n   tags                   = \"${module.eg_prod_bastion_xyz_label.tags}\"\n   vpc_security_group_ids = [\"${aws_security_group.eg_prod_bastion_xyz.id}\"]\n}",
      "language": "json",
      "name": "HCL"
    }
  ]
}
[/block]
# Inputs
[block:parameters]
{
  "data": {
    "0-0": "attributes",
    "h-0": "Name",
    "h-1": "Default",
    "h-2": "Description",
    "1-0": "delimiter",
    "2-0": "enabled",
    "3-0": "name",
    "4-0": "namespace",
    "5-0": "stage",
    "6-0": "tags",
    "0-1": "[]",
    "1-1": "\"-\"",
    "2-1": "\"true\"",
    "3-1": "__REQUIRED__",
    "4-1": "__REQUIRED__",
    "5-1": "__REQUIRED__",
    "6-1": "{}",
    "6-2": "Additional tags (e.g. `map('BusinessUnit`,`XYZ`)",
    "5-2": "Stage, e.g. 'prod', 'staging', 'dev', or 'test'",
    "4-2": "Namespace, which could be your organization name, e.g. 'cp' or 'cloudposse'",
    "3-2": "Solution name, e.g. 'app' or 'jenkins'",
    "2-2": "Set to false to prevent the module from creating any resources",
    "1-2": "Delimiter to be used between `name`, `namespace`, `stage`, etc.",
    "0-2": "Additional attributes (e.g. `policy` or `role`)"
  },
  "cols": 3,
  "rows": 7
}
[/block]

[block:callout]
{
  "type": "danger",
  "title": "WARNING",
  "body": "Any tags passed as an input to this module will *override* the tags generated by this module."
}
[/block]
# Outputs
[block:parameters]
{
  "data": {
    "h-0": "Name",
    "h-1": "Description",
    "0-0": "attributes",
    "1-0": "id",
    "2-0": "name",
    "3-0": "namespace",
    "4-0": "stage",
    "5-0": "tags",
    "5-1": "Merge input tags with our tags. Note: `Name` has a special meaning in AWS and we need to disamgiuate it by using the computed `id`",
    "4-1": "Normalized stage",
    "3-1": "Normalized namespace",
    "2-1": "Normalized name",
    "1-1": "Disambiguated ID",
    "0-1": "Normalized attributes"
  },
  "cols": 2,
  "rows": 6
}
[/block]