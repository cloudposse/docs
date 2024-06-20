---
title: glue-crawler
sidebar_label: glue-crawler
sidebar_class_name: command
description: glue-crawler
custom_edit_url: https://github.com/cloudposse/terraform-aws-glue/blob/main/modules/glue-crawler/README.md
---

# glue-crawler

Terraform module to provision AWS Glue Crawlers.

## Usage

```hcl
module "s3_bucket_source" {
  source  = "cloudposse/s3-bucket/aws"
  version = "2.0.3"

  acl                          = "private"
  versioning_enabled           = false
  force_destroy                = true
  allow_encrypted_uploads_only = true
  allow_ssl_requests_only      = true
  block_public_acls            = true
  block_public_policy          = true
  ignore_public_acls           = true
  restrict_public_buckets      = true

  attributes = ["source"]
  context    = module.this.context
}

module "iam_role" {
  source  = "cloudposse/iam-role/aws"
  version = "0.16.2"

  principals = {
    "Service" = ["glue.amazonaws.com"]
  }

  managed_policy_arns = [
    "arn:aws:iam::aws:policy/service-role/AWSGlueServiceRole"
  ]

  policy_document_count = 0
  policy_description    = "Policy for AWS Glue with access to EC2, S3, and Cloudwatch Logs"
  role_description      = "Role for AWS Glue with access to EC2, S3, and Cloudwatch Logs"

  context = module.this.context
}

module "s3_bucket_destination" {
  source  = "cloudposse/s3-bucket/aws"
  version = "2.0.3"

  acl                          = "private"
  versioning_enabled           = false
  force_destroy                = true
  allow_encrypted_uploads_only = true
  allow_ssl_requests_only      = true
  block_public_acls            = true
  block_public_policy          = true
  ignore_public_acls           = true
  restrict_public_buckets      = true

  attributes = ["destination"]
  context    = module.this.context
}

module "glue_catalog_database" {
  source = "cloudposse/glue/aws//modules/glue-catalog-database"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"

  catalog_database_name        = "analytics"
  catalog_database_description = "Glue Catalog database using data located in an S3 bucket"
  location_uri                 = format("s3://%s", module.s3_bucket_source.bucket_id)

  context = module.this.context
}

module "glue_crawler" {
  source = "cloudposse/glue/aws//modules/glue-crawler"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"

  crawler_description = "Glue crawler that processes data in the source S3 bucket and writes the result into the destination S3 bucket"
  database_name       = module.glue_catalog_database.name
  role                = module.iam_role.arn
  schedule            = "cron(0 1 * * ? *)"

  schema_change_policy = {
    delete_behavior = "LOG"
    update_behavior = null
  }

  s3_target = [
    {
      path = format("s3://%s", module.s3_bucket_destination.bucket_id)
    }
  ]

  configuration = jsonencode(
    {
      Grouping = {
        TableGroupingPolicy = "CombineCompatibleSchemas"
      }
      CrawlerOutput = {
        Partitions = {
          AddOrUpdateBehavior = "InheritFromTable"
        }
      }
      Version = 1
    }
  )

  context = module.this.context
}
```

