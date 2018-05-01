---
title: "terraform-aws-s3-website"
excerpt: "Terraform module for creating S3 backed Websites"
---
# Terraform AWS S3 Website
[block:parameters]
{
  "data": {
    "0-0": "GitHub Repo",
    "1-0": "Terraform Module",
    "2-0": "Release",
    "3-0": "Build Status",
    "0-1": "https://github.com/cloudposse/terraform-aws-s3-website",
    "1-1": "terraform-aws-s3-website",
    "2-1": "[![Release](https://img.shields.io/github/release/cloudposse/terraform-aws-s3-website.svg)](https://github.com/cloudposse/terraform-aws-s3-website/releases)",
    "3-1": "[![Build Status](https://travis-ci.org/cloudposse/terraform-aws-s3-website.svg?branch=master)](https://travis-ci.org/cloudposse/terraform-aws-s3-website)"
  },
  "cols": 2,
  "rows": 4
}
[/block]

# Further Reading

* http://docs.aws.amazon.com/AmazonS3/latest/dev/website-hosting-custom-domain-walkthrough.html

# Usage

## Create s3 website bucket
[block:code]
{
  "codes": [
    {
      "code": "module \"website\" {\n  source                           = \"git::https://github.com/cloudposse/terraform-aws-s3-website.git?ref=master\"\n  domain_name                      = \"example.com\"\n  proces_domain_validation_options = \"true\"\n  ttl                              = \"300\"\n}",
      "language": "json",
      "name": "HCL"
    }
  ]
}
[/block]

## Create S3 Website Bucket with Route53 DNS
[block:code]
{
  "codes": [
    {
      "code": "module \"website\" {\n  source                           = \"git::https://github.com/cloudposse/terraform-aws-s3-website.git?ref=master\"\n  domain_name                      = \"example.com\"\n  proces_domain_validation_options = \"true\"\n  ttl                              = \"300\"\n}",
      "language": "json",
      "name": "HCL"
    }
  ]
}
[/block]

[block:callout]
{
  "type": "warning",
  "body": "Only specify `parent_zone_id` or `parent_zone_name`, but not both",
  "title": "IMPORTANT"
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
    "6-3": "Yes",
    "3-3": "No",
    "4-3": "No",
    "5-3": "No",
    "7-3": "No",
    "8-3": "No",
    "9-3": "No",
    "10-3": "No",
    "11-3": "No",
    "12-3": "No",
    "13-3": "No",
    "14-3": "No",
    "15-3": "No",
    "27-3": "No",
    "26-3": "No",
    "25-3": "No",
    "24-3": "No",
    "23-3": "No",
    "22-3": "No",
    "21-3": "No",
    "20-3": "No",
    "19-3": "No",
    "18-3": "No",
    "17-3": "No",
    "16-3": "No",
    "29-3": "No",
    "28-3": "No",
    "0-2": "Namespace (e.g. `cp` or `cloudposse`)",
    "1-2": "Stage (e.g. `prod`, `dev`, `staging`)",
    "2-2": "Name  (e.g. `bastion` or `db`)",
    "3-2": "Additional attributes (e.g. `policy` or `role`)",
    "4-2": "Additional tags  (e.g. `map(\"BusinessUnit\",\"XYZ\")`",
    "5-2": "Delimiter to be used between `name`, `namespace`, `stage`, `arguments`, etc.",
    "6-2": "Name of website bucket in `fqdn` format (e.g. `test.example.com`). IMPORTANT! Do not add trailing dot (`.`)",
    "7-2": "ID of the hosted zone to contain the record or specify `parent_zone_name` instead",
    "8-2": "Name of the hosted zone to contain the record or specify `parent_zone_id` instead",
    "9-2": "An absolute path to the document to return in case of a 4XX error",
    "10-2": "Amazon S3 returns this index document when requests are made to the root domain or any of the subfolders",
    "10-1": "`index.html`",
    "9-1": "`404.html`",
    "8-1": "``",
    "7-1": "``",
    "6-1": "`[]`",
    "3-1": "`[]`",
    "5-1": "`-`",
    "4-1": "`{}`",
    "2-1": "``",
    "1-1": "``",
    "0-1": "``",
    "0-0": "`namespace`",
    "1-0": "`stage`",
    "2-0": "`name`",
    "3-0": "`attributes`",
    "4-0": "`tags`",
    "5-0": "`delimiter`",
    "6-0": "`hostname`",
    "7-0": "`parent_zone_id`",
    "8-0": "`parent_zone_name`",
    "9-0": "`error_document`",
    "10-0": "`index_document`",
    "11-0": "`force_destroy`",
    "12-0": "`lifecycle_rule_enabled`",
    "13-0": "`noncurrent_version_transition_days`",
    "14-0": "`noncurrent_version_expiration_days`",
    "15-0": "`cors_allowed_headers`",
    "16-0": "`cors_allowed_methods`",
    "17-0": "`cors_allowed_origins`",
    "18-0": "`cors_max_age_seconds`",
    "19-0": "`cors_expose_headers`",
    "20-0": "`prefix`",
    "21-0": "`region`",
    "22-0": "`routing_rules`",
    "23-0": "`versioning_enabled`",
    "24-0": "`logs_standard_transition_days`",
    "25-0": "`logs_glacier_transition_days`",
    "26-0": "`logs_expiration_days`",
    "27-0": "`replication_source_principal_arns`",
    "28-0": "`deployment_arns`",
    "29-0": "`deployment_actions`",
    "29-1": "read/write/ls",
    "28-1": "`{}`",
    "27-1": "`[]`",
    "26-1": "`90`",
    "25-1": "`60`",
    "24-1": "`30`",
    "23-1": "``",
    "22-1": "``",
    "21-1": "``",
    "20-1": "``",
    "19-1": "`[\"ETag\"]`",
    "18-1": "`3600`",
    "17-1": "`[\"*\"]`",
    "16-1": "`[\"GET\"]`",
    "15-1": "`[\"*\"]`",
    "14-1": "`90`",
    "13-1": "`30`",
    "12-1": "``",
    "11-1": "``",
    "11-2": "Delete all objects from the bucket so that the bucket can be destroyed without error (e.g. `true` or `false`)",
    "12-2": "Lifecycle rule status (e.g. `true` or `false`)",
    "13-2": "Number of days to persist in the standard storage tier before moving to the glacier tier infrequent access tier",
    "14-2": "Specifies when noncurrent object versions expire",
    "15-2": "List of allowed headers",
    "16-2": "List of allowed methods (e.g. ` GET, PUT, POST, DELETE, HEAD`)",
    "17-2": "List of allowed origins (e.g. ` example.com, test.com`)",
    "18-2": "Time in seconds that browser can cache the response",
    "19-2": "List of expose header in the response",
    "20-2": "Prefix identifying one or more objects to which the rule applies",
    "21-2": "AWS region this bucket should reside in",
    "22-2": "A json array containing routing rules describing redirect behavior and when redirects are applied",
    "23-2": "State of versioning (e.g. `true` or `false`)",
    "24-2": "Number of days to persist in the standard storage tier before moving to the glacier tier",
    "25-2": "Number of days after which to move the data to the glacier storage tier",
    "26-2": "Number of days after which to expunge the objects",
    "27-2": "List of principal ARNs to grant replication access from different AWS accounts",
    "28-2": "Map of deployment ARNs to lists of S3 path prefixes to grant `deployment_actions` permissions",
    "29-2": "List of actions to permit deployment ARNs to perform"
  },
  "cols": 4,
  "rows": 30
}
[/block]
# Outputs
[block:parameters]
{
  "data": {
    "h-0": "Name",
    "h-1": "Description",
    "0-0": "`hostname`",
    "1-0": "`s3_bucket_domain_name`",
    "2-0": "`s3_bucket_name`",
    "2-1": "Name of of website bucket",
    "1-1": "DNS-record of website bucket",
    "0-1": "Assigned DNS-record to the DNS-record of website bucket"
  },
  "cols": 2,
  "rows": 3
}
[/block]