---
title: terraform-aws-tfstate-backend
description: >-
  Terraform module to provision an S3 bucket to store `terraform.tfstate` file
  and a DynamoDB table to lock the state file to prevent concurrent
  modifications and state corruption.
---

# Terraform AWS TF State Backend

|                  |                                                                                                                                                                        |
|:-----------------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| GitHub Repo      | <https://github.com/cloudposse/terraform-aws-tfstate-backend>                                                                                                          |
| Terraform Module | terraform-aws-tfstate-backend                                                                                                                                          |
| Release          | [![Release](https://img.shields.io/github/release/cloudposse/terraform-aws-tfstate-backend.svg)](https://github.com/cloudposse/terraform-aws-tfstate-backend/releases) |
| Build Status     | [![Build Status](https://travis-ci.org/cloudposse/terraform-aws-tfstate-backend.svg?branch=master)](https://travis-ci.org/cloudposse/terraform-aws-tfstate-backend)    |

The module supports the following:

1. Forced server-side encryption at rest for the S3 bucket
2. S3 bucket versioning to allow for Terraform state recovery in the case of accidental deletions and human errors
3. State locking and consistency checking via DynamoDB table to prevent concurrent operations
4. DynamoDB server-side encryption

<https://www.terraform.io/docs/backends/types/s3.html>

{{% dialog type="info" icon="fa-info-circle" title="Note" %}}
The operators of the module (IAM Users) must have permissions to create S3 buckets and DynamoDB tables when performing `terraform plan` and `terraform apply`
{{% /dialog %}}

# Usage

## HCL

```hcl
module "terraform_state_backend" {
  source                           = "git::https://github.com/cloudposse/terraform-aws-tfstate-backend.git?ref=master"
  domain_name                      = "example.com"
  proces_domain_validation_options = "true"
  ttl                              = "300"
}
```

{{% dialog type="tip" icon="fa-info-circle" title="Tip" %}}
First, create the bucket and table without any state enabled (Terraform will use the local file system to store state).

You can then import the bucket and table by using [`terraform import`](https://www.terraform.io/docs/import/index.html) and store the state file into the bucket.

Once the bucket and table have been created, configure the [backend](https://www.terraform.io/docs/backends/types/s3.html)
{{% /dialog %}}


## HCL

```hcl
module "terraform_state_backend" {
  source                           = "git::https://github.com/cloudposse/terraform-aws-tfstate-backend.git?ref=master"
  domain_name                      = "example.com"
  proces_domain_validation_options = "true"
  ttl                              = "300"
}
```

Initialize the backend with `terraform init`.

After `terraform apply`, `terraform.tfstate` file will be stored in the bucket, and the DynamoDB table will be used to lock the state to prevent concurrent modifications.

{{< img src="/assets/f5a8966-s3-bucket-with-terraform-state.png" title="Terraform Apply Output" >}}

# Variables

| Name             | Default     | Description                                                                 | Required |
|:-----------------|:------------|:----------------------------------------------------------------------------|:---------|
| `namespace`      |             | Namespace (_e.g._ `cp` or `cloudposse`)                                     | Yes      |
| `write_capacity` | `5`         | DynamoDB write capacity units                                               | No       |
| `stage`          |             | Stage (_e.g._ `prod`, `dev`, `staging`)                                     | Yes      |
| `region`         | `us-east-1` | AWS Region the S3 bucket should reside in                                   | Yes      |
| `name`           | `terraform` | Name (_e.g._ `app`, `cluster`, or `terraform`)                              | No       |
| `attributes`     | `["state"]` | Additional attributes (_e.g._ `policy` or `role`)                           | No       |
| `tags`           | `{}`        | Additional tags (_e.g._ `map("BusinessUnit","XYZ")                          | No       |
| `delimiter`      | `-`         | Delimiter to be used between `namespace`, `stage`, `name`, and `attributes` | No       |
| `acl`            | `private`   | The canned ACL to apply to the S3 bucket                                    | No       |
| `read_capacity`  | `5`         | DynamoDB read capacity units                                                | No       |

# Outputs

| Name                    | Description           |
|:------------------------|:----------------------|
| `s3_bucket_domain_name` | S3 bucket domain name |
| `s3_bucket_id`          | 3 bucket ID           |
| `s3_bucket_arn`         | S3 bucket ARN         |
| `dynamodb_table_id`     | DynamoDB table ID     |
| `dynamodb_table_arn`    | DynamoDB table ARN    |
| `dynamodb_table_name`   | DynamoDB table name   |
