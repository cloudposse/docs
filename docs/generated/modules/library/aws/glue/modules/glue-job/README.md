---
title: glue-job
sidebar_label: glue-job
sidebar_class_name: command
description: glue-job
custom_edit_url: https://github.com/cloudposse/terraform-aws-glue/blob/main/modules/glue-job/README.md
---

# glue-job

Terraform module to provision AWS Glue Jobs.

## Usage

```hcl
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

module "s3_bucket_job_source" {
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

  context = module.this.context
}

module "glue_job" {
  source = "cloudposse/glue/aws//modules/glue-job"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"

  job_name          = "geo_processor"
  job_description   = "Glue Job for processing geo data"
  role_arn          = module.iam_role.arn
  glue_version      = "2.0"
  default_arguments = {}

  worker_type       = "Standard"
  number_of_workers = 2
  max_retries       = 2

  # The job timeout in minutes
  timeout = 20

  command = {
    name            = "glueetl"
    script_location = format("s3://%s/geo.py", module.s3_bucket_job_source.bucket_id)
    python_version  = 3
  }

  context = module.this.context
}
```

