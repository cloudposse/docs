---
title: "terraform-aws-kops-state-backend"
excerpt: "Terraform module to provision dependencies for `kops` (config S3 bucket & DNS zone)."
---
# Terraform AWS Kops State Backend 

[block:parameters]
{
  "data": {
    "0-0": "GitHub Repo",
    "1-0": "Terraform Module",
    "2-0": "Release",
    "3-0": "Build Status",
    "0-1": "https://github.com/cloudposse/terraform-aws-kops-state-backend",
    "1-1": "terraform-aws-kops-state-backend",
    "2-1": "[![Release](https://img.shields.io/github/release/cloudposse/terraform-aws-kops-state-backend.svg)](https://github.com/cloudposse/terraform-aws-kops-state-backend/releases)",
    "3-1": "[![Build Status](https://travis-ci.org/cloudposse/terraform-aws-kops-state-backend.svg?branch=master)](https://travis-ci.org/cloudposse/terraform-aws-kops-state-backend)"
  },
  "cols": 2,
  "rows": 4
}
[/block]

The module supports the following:

1. Forced server-side encryption at rest for the S3 bucket
2. S3 bucket versioning to allow for `kops` state recovery in the case of accidental deletions or human errors


# Usage

This example will create a DNS zone called `kops.cloudxl.net` and delegate it from the parent zone `cloudxl.net` by setting `NS` and `SOA` records in the parent zone.

It will also create an S3 bucket with the name `cp-prod-kops-state` for storing `kops` manifests.

[block:code]
{
  "codes": [
    {
      "code": "module \"kops\" {\n  source                           = \"git::https://github.com/cloudposse/terraform-aws-kops-state-backend.git?ref=master\"\n  domain_name                      = \"example.com\"\n  proces_domain_validation_options = \"true\"\n  ttl                              = \"300\"\n}",
      "language": "json",
      "name": "HCL"
    }
  ]
}
[/block]

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/e347aef-kops-state-backend.png",
        "kops-state-backend.png",
        834,
        414,
        "#e9fae9"
      ]
    }
  ]
}
[/block]
To check that the created `kops` DNS zone has been tagged correctly, run

```sh
aws route53 list-tags-for-resources --resource-type hostedzone --resource-ids Z58RWQWFVU4HT
```

[block:code]
{
  "codes": [
    {
      "code": "{\n    \"ResourceTagSets\": [\n        {\n            \"ResourceType\": \"hostedzone\",\n            \"ResourceId\": \"Z58RWQWFVU4HT\",\n            \"Tags\": [\n                {\n                    \"Key\": \"Cluster\",\n                    \"Value\": \"kops.cloudxl.net\"\n                },\n                {\n                    \"Key\": \"Stage\",\n                    \"Value\": \"prod\"\n                },\n                {\n                    \"Key\": \"Namespace\",\n                    \"Value\": \"cp\"\n                },\n                {\n                    \"Key\": \"Name\",\n                    \"Value\": \"cp-prod-kops-state\"\n                }\n            ]\n        }\n    ]\n}",
      "language": "json"
    }
  ]
}
[/block]
# Variables
[block:callout]
{
  "type": "info",
  "body": "One of `parent_zone_name` or `parent_zone_id` is required, but not both.\nThe module will look up the parent zone by either name or ID.",
  "title": "NOTE"
}
[/block]

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
    "6-3": "No",
    "7-3": "No",
    "8-3": "No",
    "9-3": "No",
    "10-3": "No",
    "11-3": "No",
    "12-3": "No",
    "13-3": "No",
    "14-3": "No",
    "0-0": "`namespace`",
    "0-1": "``",
    "1-1": "``",
    "2-1": "`us-east-1`",
    "3-1": "``",
    "4-1": "``",
    "5-1": "`kops`",
    "6-1": "`[\"state\"]`",
    "7-1": "`{}`",
    "8-1": "`-`",
    "9-1": "`private`",
    "10-1": "`$${name}.$${parent_zone_name}`",
    "11-1": "`false`",
    "11-0": "`force_destroy`",
    "10-0": "`zone_name`",
    "9-0": "`acl`",
    "8-0": "`delimiter`",
    "7-0": "`tags`",
    "6-0": "`attributes`",
    "5-0": "`name`",
    "4-0": "`parent_zone_id`",
    "3-0": "`parent_zone_name`",
    "2-0": "`region`",
    "1-0": "`stage`",
    "0-2": "Namespace (_e.g._ `cp` or `cloudposse`)",
    "1-2": "Stage (_e.g._ `prod`, `dev`, `staging`)",
    "2-2": "AWS Region the S3 bucket should reside in",
    "3-2": "Parent DNS zone name (e.g. `domain.com`). Required if `parent_zone_id` is not provided",
    "4-2": "Parent DNS zone ID. Required if `parent_zone_name` is not provided",
    "5-2": "Name  (_e.g._ `kops`)",
    "6-2": "Additional attributes (_e.g._ `state`)",
    "7-2": "Additional tags  (_e.g._ `map(\"BusinessUnit\",\"XYZ\")`",
    "8-2": "Delimiter to be used between `namespace`, `stage`, `name`, and `attributes`",
    "9-2": "The canned ACL to apply to the S3 bucket",
    "10-2": "Template for `kops` DNS zone name",
    "11-2": "A boolean that indicates all objects should be deleted from the bucket so that the bucket can be destroyed without errors"
  },
  "cols": 4,
  "rows": 12
}
[/block]
## Outputs
[block:parameters]
{
  "data": {
    "h-0": "Name",
    "h-1": "Description",
    "0-0": "`parent_zone_id`",
    "1-0": "`parent_zone_name`",
    "2-0": "`zone_id`",
    "3-0": "`zone_name`",
    "4-0": "`bucket_name`",
    "5-0": "`bucket_region`",
    "6-0": "`bucket_domain_name`",
    "7-0": "`bucket_id`",
    "8-0": "`bucket_arn`",
    "8-1": "S3 bucket ARN",
    "7-1": "S3 bucket ID",
    "6-1": "S3 bucket domain name",
    "5-1": "S3 bucket region",
    "4-1": "S3 bucket name",
    "3-1": "`kops` zone name",
    "2-1": "`kops` zone ID",
    "1-1": "Parent zone name",
    "0-1": "Parent zone ID"
  },
  "cols": 2,
  "rows": 9
}
[/block]