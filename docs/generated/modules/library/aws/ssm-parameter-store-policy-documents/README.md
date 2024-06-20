---
title: ssm-parameter-store-policy-documents
sidebar_label: ssm-parameter-store-policy-documents
sidebar_class_name: command
description: |-
  This module generates JSON documents for restricted permission sets for AWS SSM Parameter Store access.
  Helpful when combined with [terraform-aws-ssm-parameter-store](https://github.com/cloudposse/terraform-aws-ssm-parameter-store)
custom_edit_url: https://github.com/cloudposse/terraform-aws-ssm-parameter-store-policy-documents/blob/main/README.yaml
---

# Module: `ssm-parameter-store-policy-documents`
This module generates JSON documents for restricted permission sets for AWS SSM Parameter Store access.
Helpful when combined with [terraform-aws-ssm-parameter-store](https://github.com/cloudposse/terraform-aws-ssm-parameter-store)










## Examples

Create a policy that allows access to write all parameters
```hcl
module "ps_policy" {
  source = "git::https://github.com/cloudposse/terraform-aws-ssm-parameter-store-policy-documents.git?ref=master"
}

resource "aws_iam_policy" "ps_write" {
  name_prefix   = "write_any_parameter_store_value"
  path   = "/"
  policy = "${module.ps_policy.write_parameter_store_policy}"
}
```

Create a policy that allows managing all policies
```hcl
module "ps_policy" {
  source = "git::https://github.com/cloudposse/terraform-aws-ssm-parameter-store-policy-documents.git?ref=master"
}

resource "aws_iam_policy" "ps_manage" {
  name_prefix   = "manage_any_parameter_store_value"
  path   = "/"
  policy = "${module.ps_policy.manage_parameter_store_policy}"
}
```

Create a policy that allows reading all parameters that start with a certain prefix
```hcl
module "ps_policy" {
  source              = "git::https://github.com/cloudposse/terraform-aws-ssm-parameter-store-policy-documents.git?ref=master"
  parameter_root_name = "/cp/dev/app"

}

resource "aws_iam_policy" "ps_manage" {
  name_prefix   = "write_specific_parameter_store_value"
  path   = "/"
  policy = "${module.ps_policy.manage_parameter_store_policy}"
}
```

Create a kms policy to allow decrypting of the parameter store values
```hcl
module "kms_key" {
  source                  = "git::https://github.com/cloudposse/terraform-aws-kms-key.git?ref=master"
  namespace               = "cp"
  stage                   = "prod"
  name                    = "app"
  description             = "KMS key"
  deletion_window_in_days = 10
  enable_key_rotation     = "true"
  alias                   = "alias/parameter_store_key"
}

module "ps_policy" {
  source              = "git::https://github.com/cloudposse/terraform-aws-ssm-parameter-store-policy-documents.git?ref=master"
  parameter_root_name = "/cp/dev/app"
  kms_key             = "${module.kms_key.key_arn}"

}

resource "aws_iam_policy" "ps_kms" {
  name_prefix   = "decrypt_parameter_store_value"
  path   = "/"
  policy = "${module.ps_policy.manage_kms_store_policy}"
}
```

Create a policy for another account, or region
```hcl
module "ps_policy" {
  source              = "git::https://github.com/cloudposse/terraform-aws-ssm-parameter-store-policy-documents.git?ref=master"
  parameter_root_name = "/cp/dev/app"
  account_id          = "783649272629220"
  region              = "ap-southeast-2"

}

resource "aws_iam_policy" "ps_manage" {
  name_prefix   = "manage_any_parameter_store_value"
  path   = "/"
  policy = "${module.ps_policy.manage_parameter_store_policy}"
}
```



<!-- markdownlint-disable -->
## Requirements

No requirements.

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | n/a |

## Modules

No modules.

## Resources

| Name | Type |
|------|------|
| [aws_caller_identity.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/caller_identity) | data source |
| [aws_iam_policy_document.manage_kms_store](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.manage_parameter_store](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.put_xray_trace](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.read_parameter_store](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.write_parameter_store](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_region.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/region) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_account_id"></a> [account\_id](#input\_account\_id) | The account id of the parameter store you want to allow access to. If none supplied, it uses the current account id of the provider. | `string` | `""` | no |
| <a name="input_kms_key"></a> [kms\_key](#input\_kms\_key) | The arn of the KMS key that you want to allow access to. If empty it uses a wildcard resource (`*`). | `string` | `""` | no |
| <a name="input_parameter_root_name"></a> [parameter\_root\_name](#input\_parameter\_root\_name) | The prefix or root parameter that you want to allow access to. | `string` | `""` | no |
| <a name="input_region"></a> [region](#input\_region) | The region of the parameter store value that you want to allow access to. If none supplied, it uses the current region of the provider. | `string` | `""` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_manage_kms_store_policy"></a> [manage\_kms\_store\_policy](#output\_manage\_kms\_store\_policy) | A JSON policy document that allows decryption access to a KMS key. |
| <a name="output_manage_parameter_store_policy"></a> [manage\_parameter\_store\_policy](#output\_manage\_parameter\_store\_policy) | A JSON policy document that allows full access to the parameter store. |
| <a name="output_put_xray_trace_policy"></a> [put\_xray\_trace\_policy](#output\_put\_xray\_trace\_policy) | A JSON policy document that allows putting data into x-ray for tracing parameter store requests. |
| <a name="output_read_parameter_store_policy"></a> [read\_parameter\_store\_policy](#output\_read\_parameter\_store\_policy) | A JSON policy document that only allows read access to the parameter store. |
| <a name="output_write_parameter_store_policy"></a> [write\_parameter\_store\_policy](#output\_write\_parameter\_store\_policy) | A JSON policy document that only allows write access to the parameter store. |
<!-- markdownlint-restore -->

