---
title: cloudwatch-flow-logs
sidebar_label: cloudwatch-flow-logs
sidebar_class_name: command
description: |-
  Terraform module for enabling [`flow logs`](http://docs.aws.amazon.com/AmazonVPC/latest/UserGuide/flow-logs.html) for `vpc` and `subnets`.
tags:
  - aws
  - terraform
  - terraform-modules
  - logging
  - cloudwatch-logs
  - vpc-flow-logs
  - ec2
  - secops

custom_edit_url: https://github.com/cloudposse/terraform-aws-cloudwatch-flow-logs/blob/main/README.yaml
---

# Module: `cloudwatch-flow-logs`
Terraform module for enabling [`flow logs`](http://docs.aws.amazon.com/AmazonVPC/latest/UserGuide/flow-logs.html) for `vpc` and `subnets`.






## Usage

```terraform
module "flow_logs" {
  source    = "git::https://github.com/cloudposse/terraform-aws-cloudwatch-flow-logs.git?ref=master"
  vpc_id    = "${var.vpc_id}"
  namespace = "${var.namespace}"
  stage     = "${var.stage}"
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

| Name | Source | Version |
|------|--------|---------|
| <a name="module_kinesis_label"></a> [kinesis\_label](#module\_kinesis\_label) | git::https://github.com/cloudposse/terraform-null-label.git | tags/0.3.1 |
| <a name="module_log_group_label"></a> [log\_group\_label](#module\_log\_group\_label) | git::https://github.com/cloudposse/terraform-null-label.git | tags/0.3.1 |
| <a name="module_subnet_label"></a> [subnet\_label](#module\_subnet\_label) | git::https://github.com/cloudposse/terraform-null-label.git | tags/0.3.1 |
| <a name="module_subscription_filter_label"></a> [subscription\_filter\_label](#module\_subscription\_filter\_label) | git::https://github.com/cloudposse/terraform-null-label.git | tags/0.3.1 |
| <a name="module_vpc_label"></a> [vpc\_label](#module\_vpc\_label) | git::https://github.com/cloudposse/terraform-null-label.git | tags/0.3.1 |

## Resources

| Name | Type |
|------|------|
| [aws_cloudwatch_log_group.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_log_group) | resource |
| [aws_cloudwatch_log_subscription_filter.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_log_subscription_filter) | resource |
| [aws_flow_log.eni](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/flow_log) | resource |
| [aws_flow_log.subnets](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/flow_log) | resource |
| [aws_flow_log.vpc](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/flow_log) | resource |
| [aws_iam_role.kinesis](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role) | resource |
| [aws_iam_role.log](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role) | resource |
| [aws_iam_role_policy.kinesis](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy) | resource |
| [aws_iam_role_policy.log](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy) | resource |
| [aws_kinesis_stream.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/kinesis_stream) | resource |
| [aws_iam_policy_document.kinesis](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.kinesis_assume](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.log](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.log_assume](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_region.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/region) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_attributes"></a> [attributes](#input\_attributes) | Additional attributes (e.g. `policy` or `role`) | `list(string)` | `[]` | no |
| <a name="input_delimiter"></a> [delimiter](#input\_delimiter) | Delimiter to be used between `name`, `namespace`, `stage`, etc. | `string` | `"-"` | no |
| <a name="input_enabled"></a> [enabled](#input\_enabled) | Set to false to prevent the module from creating anything | `string` | `"true"` | no |
| <a name="input_encryption_type"></a> [encryption\_type](#input\_encryption\_type) | GUID for the customer-managed KMS key to use for encryption. The only acceptable values are NONE or KMS | `string` | `"NONE"` | no |
| <a name="input_eni_ids"></a> [eni\_ids](#input\_eni\_ids) | IDs of ENIs | `list(string)` | `[]` | no |
| <a name="input_filter_pattern"></a> [filter\_pattern](#input\_filter\_pattern) | Valid CloudWatch Logs filter pattern for subscribing to a filtered stream of log events | `string` | `"[version, account, eni, source, destination, srcport, destport, protocol, packets, bytes, windowstart, windowend, action, flowlogstatus]"` | no |
| <a name="input_kms_key_id"></a> [kms\_key\_id](#input\_kms\_key\_id) | ID of KMS key | `string` | `""` | no |
| <a name="input_name"></a> [name](#input\_name) | Name  (e.g. `bastion` or `db`) | `string` | `""` | no |
| <a name="input_namespace"></a> [namespace](#input\_namespace) | Namespace (e.g. `cp` or `cloudposse`) | `string` | n/a | yes |
| <a name="input_region"></a> [region](#input\_region) | AWS region | `string` | `""` | no |
| <a name="input_retention_in_days"></a> [retention\_in\_days](#input\_retention\_in\_days) | Number of days you want to retain log events in the log group | `string` | `"30"` | no |
| <a name="input_retention_period"></a> [retention\_period](#input\_retention\_period) | Length of time data records are accessible after they are added to the stream | `string` | `"48"` | no |
| <a name="input_shard_count"></a> [shard\_count](#input\_shard\_count) | Number of shards that the stream will use | `string` | `"1"` | no |
| <a name="input_shard_level_metrics"></a> [shard\_level\_metrics](#input\_shard\_level\_metrics) | List of shard-level CloudWatch metrics which can be enabled for the stream | `list` | <pre>[<br/>  "IncomingBytes",<br/>  "OutgoingBytes"<br/>]</pre> | no |
| <a name="input_stage"></a> [stage](#input\_stage) | Stage (e.g. `prod`, `dev`, `staging`) | `string` | n/a | yes |
| <a name="input_subnet_ids"></a> [subnet\_ids](#input\_subnet\_ids) | IDs of subnets | `list(string)` | `[]` | no |
| <a name="input_tags"></a> [tags](#input\_tags) | Additional tags (e.g. map(`BusinessUnit`,`XYZ`) | `map(string)` | `{}` | no |
| <a name="input_traffic_type"></a> [traffic\_type](#input\_traffic\_type) | Type of traffic to capture. Valid values: ACCEPT,REJECT, ALL | `string` | `"ALL"` | no |
| <a name="input_vpc_id"></a> [vpc\_id](#input\_vpc\_id) | ID of VPC | `any` | n/a | yes |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_eni_flow_ids"></a> [eni\_flow\_ids](#output\_eni\_flow\_ids) | Flow Log IDs of ENIs |
| <a name="output_kinesis_arn"></a> [kinesis\_arn](#output\_kinesis\_arn) | Kinesis Stream ARN |
| <a name="output_kinesis_id"></a> [kinesis\_id](#output\_kinesis\_id) | Kinesis Stream ID |
| <a name="output_kinesis_name"></a> [kinesis\_name](#output\_kinesis\_name) | Kinesis Stream name |
| <a name="output_kinesis_shard_count"></a> [kinesis\_shard\_count](#output\_kinesis\_shard\_count) | Kinesis Stream Shard count |
| <a name="output_log_group_arn"></a> [log\_group\_arn](#output\_log\_group\_arn) | ARN of the log group |
| <a name="output_subnet_flow_ids"></a> [subnet\_flow\_ids](#output\_subnet\_flow\_ids) | Flow Log IDs of subnets |
| <a name="output_vpc_flow_id"></a> [vpc\_flow\_id](#output\_vpc\_flow\_id) | VPC Flow Log ID |
<!-- markdownlint-restore -->

