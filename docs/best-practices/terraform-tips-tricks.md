---
title: "Terraform Tips & Tricks"
description: "A small collection of helpful hints"
tags:
  - terraform
  - "Tips & Tricks"
  - git
---

![Terraform](/assets/a1f105a-terraform.png)

# S3 Bucket Lifecycle Rules

```hcl title="Example: S3 Bucket Lifecycle Rules"
module "assets_bucket_label" {
  source    = "git::https://github.com/cloudposse/terraform-null-label.git?ref=tags/0.3.3"
  namespace = "eg"
  stage     = "dev"
  name      = "assets"
}

resource "aws_s3_bucket" "assets" {
  bucket        = "${module.assets_bucket_label.id}"
  tags          = "${module.assets_bucket_label.tags}"
  acl           = "private"
  region        = "us-west-2"
  force_destroy = false

  lifecycle_rule {
    id      = "${module.assets_bucket_label.id}"
    enabled = true

    prefix = ""
    tags   = "${module.assets_bucket_label.tags}"

    noncurrent_version_expiration {
      days = "90"
    }

    noncurrent_version_transition {
      days          = "60"
      storage_class = "GLACIER"
    }

    transition {
      days          = "30"
      storage_class = "STANDARD_IA"
    }

    transition {
      days          = "60"
      storage_class = "GLACIER"
    }

    expiration {
      days = "180"
    }
  }
}
```

For an example of how we use it, check out our [`terraform-aws-s3-log-storage`](https://github.com/cloudposse/terraform-aws-s3-log-storage) module.

:::info
- https://docs.aws.amazon.com/AmazonS3/latest/dev/object-lifecycle-mgmt.html
- https://www.terraform.io/docs/providers/aws/r/s3_bucket.html#using-object-lifecycle
:::


# Encrypted S3 Buckets

```hcl title="Example: Encrypted S3 Bucket"
module "assets_bucket_label" {
  source    = "git::https://github.com/cloudposse/terraform-null-label.git?ref=tags/0.3.3"
  namespace = "eg"
  stage     = "dev"
  name      = "assets"
}

resource "aws_s3_bucket" "assets" {
  bucket        = "${module.assets_bucket_label.id}"
  tags          = "${module.assets_bucket_label.tags}"
  acl           = "private"
  region        = "us-west-2"
  force_destroy = false

  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }
    }
  }
}
```

For an example of how we use it, check out our [`terraform-aws-s3-log-storage`](https://github.com/cloudposse/terraform-aws-s3-log-storage) module.

# Use Pre Commit Hooks for Linting

We strongly urge that all code be linted prior to checking into Git. Running `terraform fmt` on the codebase before committing will accomplish this.

To set this up so that it happens automatically prior to any commit, configure `git` pre-commit hooks using the `pre-commit` utility.

##### OSX Installation
```shell
brew install pre-commit
```

Then run `pre-commit install` in a given terraform repo to configure the hooks.

##### .pre-commit-config.yaml
```yaml
- repo: git://github.com/antonbabenko/pre-commit-terraform
  sha: v1.45.0
  hooks:
    - id: terraform_fmt
    - id: terraform_validate
```

After setting this up, every time you commit, the `terraform fmt` command will be run to canonicalize your files and a basic smoke test to validate all configurations without requiring required variables to be set.

Any time your commit affects any `*.tf` files, the validator will ensure well-formed terraform code.
