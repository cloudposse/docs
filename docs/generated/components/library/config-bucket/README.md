---
title: config-bucket
sidebar_label: config-bucket
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/config-bucket/README.md
tags: [terraform, aws, config-bucket]
---

# Component: `config-bucket`

This module creates an S3 bucket suitable for storing `AWS Config` data.

It implements a configurable log retention policy, which allows you to efficiently manage logs across different storage
classes (_e.g._ `Glacier`) and ultimately expire the data altogether.

It enables server-side encryption by default.
<a name="https://docs.aws.amazon.com/AmazonS3/latest/dev/bucket-encryption.html">https://docs.aws.amazon.com/AmazonS3/latest/dev/bucket-encryption.html</a>

It blocks public access to the bucket by default.
<a name="https://docs.aws.amazon.com/AmazonS3/latest/dev/access-control-block-public-access.html">https://docs.aws.amazon.com/AmazonS3/latest/dev/access-control-block-public-access.html</a>

## Usage

**Stack Level**: Regional

Here's an example snippet for how to use this component. It's suggested to apply this component to only the centralized
`audit` account.

```yaml
components:
  terraform:
    config-bucket:
      vars:
        enabled: true
        name: "config"
        noncurrent_version_expiration_days: 180
        noncurrent_version_transition_days: 30
        standard_transition_days: 60
        glacier_transition_days: 180
        expiration_days: 365
```

<!-- prettier-ignore-start -->
<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- hello terraform-docs -->
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- prettier-ignore-end -->

## References

- [cloudposse/terraform-aws-components](https://github.com/cloudposse/terraform-aws-components/tree/main/modules/config-bucket) -
  Cloud Posse's upstream component



