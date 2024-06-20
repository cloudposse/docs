---
title: glue-catalog-database
sidebar_label: glue-catalog-database
sidebar_class_name: command
description: glue-catalog-database
custom_edit_url: https://github.com/cloudposse/terraform-aws-glue/blob/main/modules/glue-catalog-database/README.md
---

# glue-catalog-database

Terraform module to provision AWS Glue Catalog Databases.

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

module "glue_catalog_database" {
  source = "cloudposse/glue/aws//modules/glue-catalog-database"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"

  catalog_database_name        = "analytics"
  catalog_database_description = "Glue Catalog database using data located in an S3 bucket"
  location_uri                 = format("s3://%s", module.s3_bucket_source.bucket_id)

  context = module.this.context
}
```

