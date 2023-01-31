---
title: aws-iam-policy-document-aggregator
sidebar_label: aws-iam-policy-document-aggregator
sidebar_class_name: command
description: |-
  Terraform module to aggregate multiple IAM policy documents into single policy document.

  # NOTE: This module is now deprecated due to new functionality in the Terraform AWS Provider. See below on migration steps

  Now that the AWS provider supports the `override_policy_documents` argument on the `aws_iam_policy_document` data source, this module is no longer necessary. All code using this module can be migrated to natively use the `aws_iam_policy_document` data source by doing the following change:

  ```hcl
  # Previous module usage:
  module "aggregated_policy" {
    source  = "cloudposse/iam-policy-document-aggregator/aws"
    version = "0.8.0"

    source_documents = [
      data.aws_iam_policy_document.base.json,
      data.aws_iam_policy_document.resource_full_access.json
    ]
  }
  ```

  Replace the above with: 
  ```hcl
  data "aws_iam_policy_document" "aggregated" {
    override_policy_documents = [
      data.aws_iam_policy_document.base.json,
      data.aws_iam_policy_document.resource_full_access.json
    ]
  }
  ```

  And then update your references to `module.aggregated_policy.result_document` with `data.aws_iam_policy_document.aggregated.json`. 

  Please see the discussion in #31 for further details.
tags:
  - aws
  - terraform
  - terraform-modules
  - iam
  - policy
  - role
  - policy-document

custom_edit_url: https://github.com/cloudposse/terraform-aws-iam-policy-document-aggregator/edit/master/README.md
---

# Component: `aws-iam-policy-document-aggregator`
Terraform module to aggregate multiple IAM policy documents into single policy document.

# NOTE: This module is now deprecated due to new functionality in the Terraform AWS Provider. See below on migration steps

Now that the AWS provider supports the `override_policy_documents` argument on the `aws_iam_policy_document` data source, this module is no longer necessary. All code using this module can be migrated to natively use the `aws_iam_policy_document` data source by doing the following change:

```hcl
# Previous module usage:
module "aggregated_policy" {
  source  = "cloudposse/iam-policy-document-aggregator/aws"
  version = "0.8.0"

  source_documents = [
    data.aws_iam_policy_document.base.json,
    data.aws_iam_policy_document.resource_full_access.json
  ]
}
```

Replace the above with: 
```hcl
data "aws_iam_policy_document" "aggregated" {
  override_policy_documents = [
    data.aws_iam_policy_document.base.json,
    data.aws_iam_policy_document.resource_full_access.json
  ]
}
```

And then update your references to `module.aggregated_policy.result_document` with `data.aws_iam_policy_document.aggregated.json`. 

Please see the discussion in #31 for further details.






## Usage

For a complete example, see [examples/complete](examples/complete).

For automated tests of the complete example using [bats](https://github.com/bats-core/bats-core) and [Terratest](https://github.com/gruntwork-io/terratest) (which tests and deploys the example on AWS), see [test](test).

This example creates a single IAM policy document from multiple IAM policy documents.

```hcl
  data "aws_iam_policy_document" "resource_full_access" {
    statement {
      sid       = "FullAccess"
      effect    = "Allow"
      resources = ["arn:aws:s3:::bucketname/path/*"]

      actions = [
        "s3:PutObject",
        "s3:PutObjectAcl",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket",
        "s3:ListBucketMultipartUploads",
        "s3:GetBucketLocation",
        "s3:AbortMultipartUpload"
      ]
    }
  }

  data "aws_iam_policy_document" "base" {
    statement {
      sid       = "BaseAccess"
      effect    = "Allow"
      resources = ["*"]

      actions = [
        "s3:ListBucket",
        "s3:ListBucketVersions"
      ]
    }
  }

  module "aggregated_policy" {
    source = "cloudposse/iam-policy-document-aggregator/aws"
    # Cloud Posse recommends pinning every module to a specific version
    # version = "x.x.x"

    source_documents = [
      data.aws_iam_policy_document.base.json,
      data.aws_iam_policy_document.resource_full_access.json
    ]
}
```

### Additional Examples
The [`example`](./example) directory contains the example.






<!-- markdownlint-disable -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 0.13.0 |
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | >= 2.23 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | >= 2.23 |

## Modules

No modules.

## Resources

| Name | Type |
|------|------|
| [aws_iam_policy_document.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.eight](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.empty](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.five](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.four](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.nine](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.one](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.seven](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.six](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.three](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.two](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.zero](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_source_documents"></a> [source\_documents](#input\_source\_documents) | List of JSON IAM policy documents.<br/><br/><b>Limits:</b><br/>* List size max 10<br/> * Statement can be overriden by the statement with the same sid from the latest policy. | `list(string)` | `[]` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_result_document"></a> [result\_document](#output\_result\_document) | Aggregated IAM policy |
<!-- markdownlint-restore -->


