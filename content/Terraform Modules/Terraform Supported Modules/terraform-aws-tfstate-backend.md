---
title: "terraform-aws-tfstate-backend"
excerpt: "Terraform module to provision an S3 bucket to store `terraform.tfstate` file and a DynamoDB table to lock the state file to prevent concurrent modifications and state corruption."
---
# Terraform AWS TF State Backend
[block:parameters]
{
  "data": {
    "0-0": "GitHub Repo",
    "1-0": "Terraform Module",
    "2-0": "Release",
    "3-0": "Build Status",
    "0-1": "https://github.com/cloudposse/terraform-aws-tfstate-backend",
    "1-1": "terraform-aws-tfstate-backend",
    "2-1": "[![Release](https://img.shields.io/github/release/cloudposse/terraform-aws-tfstate-backend.svg)](https://github.com/cloudposse/terraform-aws-tfstate-backend/releases)",
    "3-1": "[![Build Status](https://travis-ci.org/cloudposse/terraform-aws-tfstate-backend.svg?branch=master)](https://travis-ci.org/cloudposse/terraform-aws-tfstate-backend)"
  },
  "cols": 2,
  "rows": 4
}
[/block]

The module supports the following:

1. Forced server-side encryption at rest for the S3 bucket
2. S3 bucket versioning to allow for Terraform state recovery in the case of accidental deletions and human errors
3. State locking and consistency checking via DynamoDB table to prevent concurrent operations
4. DynamoDB server-side encryption

https://www.terraform.io/docs/backends/types/s3.html

[block:callout]
{
  "type": "info",
  "body": "The operators of the module (IAM Users) must have permissions to create S3 buckets and DynamoDB tables when performing `terraform plan` and `terraform apply`",
  "title": "NOTE"
}
[/block]
# Usage
[block:code]
{
  "codes": [
    {
      "code": "module \"terraform_state_backend\" {\n  source                           = \"git::https://github.com/cloudposse/terraform-aws-tfstate-backend.git?ref=master\"\n  domain_name                      = \"example.com\"\n  proces_domain_validation_options = \"true\"\n  ttl                              = \"300\"\n}",
      "language": "json",
      "name": "HCL"
    }
  ]
}
[/block]

[block:callout]
{
  "type": "info",
  "title": "NOTE",
  "body": "First, create the bucket and table without any state enabled (Terraform will use the local file system to store state).\n\nYou can then import the bucket and table by using [`terraform import`](https://www.terraform.io/docs/import/index.html) and store the state file into the bucket.\n\nOnce the bucket and table have been created, configure the [backend](https://www.terraform.io/docs/backends/types/s3.html)"
}
[/block]

[block:code]
{
  "codes": [
    {
      "code": "module \"terraform_state_backend\" {\n  source                           = \"git::https://github.com/cloudposse/terraform-aws-tfstate-backend.git?ref=master\"\n  domain_name                      = \"example.com\"\n  proces_domain_validation_options = \"true\"\n  ttl                              = \"300\"\n}",
      "language": "json",
      "name": "HCL"
    }
  ]
}
[/block]
Initialize the backend with `terraform init`.

After `terraform apply`, `terraform.tfstate` file will be stored in the bucket, 
and the DynamoDB table will be used to lock the state to prevent concurrent modifications.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/f5a8966-s3-bucket-with-terraform-state.png",
        "s3-bucket-with-terraform-state.png",
        1164,
        1292,
        "#f1f4f5"
      ]
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
    "0-1": "``",
    "1-1": "``",
    "1-0": "`stage`",
    "2-0": "`region`",
    "3-0": "`name`",
    "4-0": "`attributes`",
    "5-0": "`tags`",
    "6-0": "`delimiter`",
    "0-2": "Namespace (_e.g._ `cp` or `cloudposse`)",
    "1-2": "Stage (_e.g._ `prod`, `dev`, `staging`)",
    "2-2": "AWS Region the S3 bucket should reside in",
    "3-2": "Name  (_e.g._ `app`, `cluster`, or `terraform`)",
    "4-2": "Additional attributes (_e.g._ `policy` or `role`)",
    "5-2": "Additional tags  (_e.g._ `map(\"BusinessUnit\",\"XYZ\")",
    "6-2": "Delimiter to be used between `namespace`, `stage`, `name`, and `attributes`",
    "7-2": "The canned ACL to apply to the S3 bucket",
    "8-2": "DynamoDB read capacity units",
    "9-2": "DynamoDB write capacity units",
    "7-0": "`acl`",
    "8-0": "`read_capacity`",
    "9-0": "`write_capacity`",
    "0-3": "Yes",
    "1-3": "Yes",
    "2-3": "Yes",
    "3-3": "No",
    "4-3": "No",
    "5-3": "No",
    "6-3": "No",
    "7-3": "No",
    "8-3": "No",
    "9-3": "No",
    "9-1": "`5`",
    "8-1": "`5`",
    "7-1": "`private`",
    "6-1": "`-`",
    "5-1": "`{}`",
    "4-1": "`[\"state\"]`",
    "3-1": "`terraform`",
    "2-1": "`us-east-1`"
  },
  "cols": 4,
  "rows": 10
}
[/block]
# Outputs
[block:parameters]
{
  "data": {
    "h-0": "Name",
    "h-1": "Description",
    "0-0": "`s3_bucket_domain_name`",
    "1-0": "`s3_bucket_id`",
    "2-0": "`s3_bucket_arn`",
    "4-0": "`dynamodb_table_arn`",
    "3-0": "`dynamodb_table_id`",
    "5-0": "`dynamodb_table_name`",
    "5-1": "DynamoDB table name",
    "4-1": "DynamoDB table ARN",
    "3-1": "DynamoDB table ID",
    "2-1": "S3 bucket ARN",
    "1-1": "3 bucket ID",
    "0-1": "S3 bucket domain name"
  },
  "cols": 2,
  "rows": 6
}
[/block]