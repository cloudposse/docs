---
title: "Support GovCloud and Other AWS Partitions"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1186365528/How+to+support+GovCloud+and+Other+AWS+Partitions+with+Terraform
sidebar_position: 100
---

# How to support GovCloud and Other AWS Partitions with Terraform

## Problem

AWS has several distinct types of cloud regions that range from the commercial regions (what most people are familiar with), to the GovCloud regions and China regions. In AWS parlance, these are called partitions. Not all services are supported in these regions due to regulatory requirements and each partition has its own [ARN format](https://docs.aws.amazon.com/govcloud-us/latest/UserGuide/using-govcloud.html). Terraform modules may not support all partitions if they were not written with it in mind.

## Solution

:::tip
Most Cloud Posse terraform modules should work in these partitions.

:::

For services available in the China regions, see [https://www.amazonaws.cn/en/about-aws/regional-product-services/](https://www.amazonaws.cn/en/about-aws/regional-product-services/) . For services available in GovCloud, consult [https://docs.aws.amazon.com/govcloud-us/latest/UserGuide/using-services.html](https://docs.aws.amazon.com/govcloud-us/latest/UserGuide/using-services.html) .

In order to support multiple partitions in HCL, simply use the following convention leveraging the `aws_partition` data source anywhere you need to construct an ARN.

```
# Look up the current AWS partition
data "aws_partition" "current" {}

data "aws_iam_policy_document" "bucket_policy" {
  statement {
    sid       = "ExampleUsingPartitions"
    effect    = "Deny"
    actions   = ["s3:PutObject"]
    # Construct the ARN using the appropriate partition.
    resources = ["arn:${data.aws_partition.current.partition}:s3:::${join("", aws_s3_bucket.default.*.id)}/*"]
    principals {
      identifiers = ["*"]
      type        = "*"
    }
  }
}
```

