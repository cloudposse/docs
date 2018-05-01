---
title: "terraform-aws-dynamic-subnets"
excerpt: "Terraform module for public and private [`subnets`](http://docs.aws.amazon.com/AmazonVPC/latest/UserGuide/VPC_Subnets.html) provisioning in existing AWS [`VPC`](https://aws.amazon.com/vpc)"
---
# Terraform AWS Dynamic Subnets
[block:parameters]
{
  "data": {
    "0-0": "GitHub Repo",
    "1-0": "Terraform Module",
    "2-0": "Release",
    "3-0": "Build Status",
    "0-1": "https://github.com/cloudposse/terraform-aws-dynamic-subnets",
    "1-1": "terraform-aws-dynamic-subnets",
    "2-1": "[![Release](https://img.shields.io/github/release/cloudposse/terraform-aws-dynamic-subnets.svg)](https://github.com/cloudposse/terraform-aws-dynamic-subnets/releases)",
    "3-1": "[![Build Status](https://travis-ci.org/cloudposse/terraform-aws-dynamic-subnets.svg)](https://travis-ci.org/cloudposse/terraform-aws-dynamic-subnets)"
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
      "code": "module \"subnets\" {\n  source                           = \"git::https://github.com/cloudposse/terraform-aws-dynamic-subnets.git?ref=master\"\n  domain_name                      = \"example.com\"\n  proces_domain_validation_options = \"true\"\n  ttl                              = \"300\"\n}",
      "language": "json",
      "name": "HCL"
    }
  ]
}
[/block]

[block:callout]
{
  "type": "info",
  "body": "This module is intended for use with existing VPC and existing Internet Gateway.\nYou should use [terraform-aws-vpc](https://github.com/cloudposse/terraform-aws-vpc) module if you plan to use a new (separate) VPC.",
  "title": "NOTE"
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
    "7-3": "Yes",
    "8-3": "No",
    "9-3": "Yes",
    "10-3": "No",
    "11-3": "No",
    "12-3": "No",
    "0-2": "Namespace (e.g. `cp` or `cloudposse`)",
    "2-2": "Name  (e.g. `bastion` or `db`)",
    "1-2": "Stage (e.g. `prod`, `dev`, `staging`)",
    "3-2": "Additional tags (e.g. `Key, Value`)",
    "4-2": "AWS Region where module should operate (e.g. `us-east-1`)",
    "5-2": "The VPC ID where subnets will be created (e.g. `vpc-aceb2723`)",
    "6-2": "The base CIDR block which will be divided into subnet CIDR blocks (e.g. `10.0.0.0/16`)",
    "7-2": "The Internet Gateway ID public route table will point to (e.g. `igw-9c26a123`)",
    "8-2": "The default route table for public subnets. Provides access to the Internet. If not set here, will be created. (e.g. `rtb-f4f0ce12`)",
    "9-2": "The list of Availability Zones where subnets will be created (e.g. `[\"us-eas-1a\", \"us-eas-1b\"]`)",
    "10-2": "Network ACL ID that will be added to public subnets.  If empty, a new ACL will be created",
    "11-2": "Network ACL ID that will be added to private subnets.  If empty, a new ACL will be created",
    "12-2": "Flag to enable/disable NAT gateways",
    "12-1": "`true`",
    "9-1": "[]",
    "10-1": "``",
    "11-1": "``",
    "8-1": "``",
    "7-1": "``",
    "6-1": "``",
    "5-1": "``",
    "4-1": "``",
    "3-1": "``",
    "2-1": "``",
    "1-1": "``",
    "0-1": "``",
    "0-0": "namespace",
    "1-0": "stage",
    "2-0": "name",
    "3-0": "tags",
    "4-0": "region",
    "5-0": "vpc_id",
    "6-0": "cidr_block",
    "7-0": "igw_id",
    "8-0": "vpc_default_route_table_id",
    "9-0": "availability_zones",
    "10-0": "public_network_acl_id",
    "11-0": "private_network_acl_id",
    "12-0": "nat_gateway_enabled"
  },
  "cols": 4,
  "rows": 13
}
[/block]
# TL;DR

`tf_subnets` creates a set of subnets based on `${var.cidr_block}` input
and amount of Availability Zones in a region.

For subnet set calculation `tf_subnets` uses TF [cidrsubnet](https://www.terraform.io/docs/configuration/interpolation.html#cidrsubnet-iprange-newbits-netnum-) interpolation.

## Calculation logic

```hcl
${
  cidrsubnet(
  signum(length(var.cidr_block)) == 1 ?
  var.cidr_block : data.aws_vpc.default.cidr_block,
  ceil(log(length(data.aws_availability_zones.available.names) * 2, 2)),
  count.index)
}
```

## Detailed Explanation

1. Use `${var.cidr_block}` input (if specified) or
   use a VPC CIDR block `data.aws_vpc.default.cidr_block` (e.g. `10.0.0.0/16`)
2. Get number of available AZ in the region (e.g. `length(data.aws_availability_zones.available.names)`)
3. Calculate `newbits`. `newbits` number tells on how many subnets will
   be CIDR block (input or VPC) divided. `newbits` is an amount of `binary digits`.
[block:callout]
{
  "type": "success",
  "title": "Example",
  "body": "`newbits = 1` - 2 subnets are available (`1 binary digit` allows to count up to `2`)\n\n`newbits = 2` - 4 subnets are available (`2 binary digits` allows to count up to `4`)\n\n`newbits = 3` - 8 subnets are available (`3 binary digits` allows to count up to `8`)"
}
[/block]
4. We know, that we have `6` AZs in a `us-east-1` region (see step 2).

5. We need to create `1 public` subnet and `1 private` subnet in each AZ,
     thus we need to create `12 subnets` in total (`6` AZs * (`1 public` + `1 private`)).

6. We need `4 binary digits` for that ( 2<sup>4</sup> = 16 ).
    In order to calculate amount of `binary digits` we should use `logarithm`
    function. We should use logarithm for `base 2` because decimal numbers
    can be calculated as `powers` of binary number.
    See [Wiki](https://en.wikipedia.org/wiki/Binary_number#Decimal)
    for more details
[block:callout]
{
  "type": "success",
  "title": "Example",
  "body": "For `12 subnets` we need `3.58` amount `binary digits` (log<sub>2</sub>12)\n\nFor `16 subnets` we need `4` amount `binary digits` (log<sub>2</sub>16)\n\nFor `7 subnets` we need `2.81` amount `binary digits` (log<sub>2</sub>7)\n\netc..."
}
[/block]
7. We can't calculate amount `binary digits` using fractional values.
    We can't round it down because smaller amount `binary digits` is
    insufficient for required number calculation.
    Thus we should round it up. See TF [ceil](https://www.terraform.io/docs/configuration/interpolation.html#ceil-float-).
[block:callout]
{
  "type": "success",
  "title": "Example",
  "body": "For `12 subnets` we need `4` amount `binary digits` (ceil(log<sub>2</sub>12))\n\nFor `16 subnets` we need `4` amount `binary digits` (ceil(log<sub>2</sub>16))\n\nFor `7 subnets` we need `3` amount `binary digits` (ceil(log<sub>2</sub>7))\n\netc..."
}
[/block]

8. Assign private subnets according to AZ number (we're using `count.index` for that).
9. Assign public subnets according to AZ number but with a shift.
    Using shift number according to the amount of AZs in a region (see step 2)
    (we're using `length(data.aws_availability_zones.available.names) + count.index` for that)