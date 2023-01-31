---
title: aws-efs-cloudwatch-sns-alarms
sidebar_label: aws-efs-cloudwatch-sns-alarms
sidebar_class_name: command
description: |-
  Create a set of sane EFS CloudWatch alerts for monitoring the health of an EFS resource.

  | area    | metric             | comparison operator  | threshold         | rationale                                                          |
  |---------|--------------------|----------------------|-------------------|--------------------------------------------------------------------|
  | Storage | BurstCreditBalance | `<`                  | 192000000000      | 192 GB in Bytes (last hour where you can burst at 100 MB/sec)      |
  | Storage | PercentIOLimit     | `>`                  | 95                | When the IO limit has been exceeded, the system performance drops. |
custom_edit_url: https://github.com/cloudposse/terraform-aws-efs-cloudwatch-sns-alarms/edit/master/README.md
---

# Component: `aws-efs-cloudwatch-sns-alarms`
Create a set of sane EFS CloudWatch alerts for monitoring the health of an EFS resource.

| area    | metric             | comparison operator  | threshold         | rationale                                                          |
|---------|--------------------|----------------------|-------------------|--------------------------------------------------------------------|
| Storage | BurstCreditBalance | `<`                  | 192000000000      | 192 GB in Bytes (last hour where you can burst at 100 MB/sec)      |
| Storage | PercentIOLimit     | `>`                  | 95                | When the IO limit has been exceeded, the system performance drops. |










## Examples

```hcl
resource "aws_efs_file_system" "default" {
  creation_token = "app"
}

module "efs_alarms" {
  source        = "git::https://github.com/cloudposse/terraform-aws-efs-cloudwatch-sns-alarms.git?ref=master"
  filesystem_id = "${aws_efs_file_system.default.id}"
}
```



## Makefile Targets
```
Available targets:

  help                                This help screen
  help/all                            Display help for all targets
  lint                                Lint terraform code

```

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|:----:|:-----:|:-----:|
| add_sns_policy | Attach a policy that allows the notifications through to the SNS topic endpoint | string | `false` | no |
| additional_endpoint_arns | Any alert endpoints, such as autoscaling, or app escaling endpoint arns that will respond to an alert | list | `<list>` | no |
| burst_credit_balance_threshold | The minimum number of burst credits that a file system should have. | string | `192000000000` | no |
| filesystem_id | The EFS file system ID that you want to monitor | string | - | yes |
| percent_io_limit_threshold | IO Limit threshold | string | `95` | no |
| sns_topic_arn | An SNS topic ARN that has already been created. Its policy must already allow access from CloudWatch Alarms, or set `add_sns_policy` to `true` | string | `` | no |

## Outputs

| Name | Description |
|------|-------------|
| sns_topic_arn | An SNS topic ARN that has already been created. Its policy must already allow access from CloudWatch Alarms, or set `add_sns_policy` to `true` |



