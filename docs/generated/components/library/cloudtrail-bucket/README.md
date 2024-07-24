---
title: cloudtrail-bucket
sidebar_label: cloudtrail-bucket
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/cloudtrail-bucket/README.md
tags: [terraform, aws, cloudtrail-bucket]
---

# Component: `cloudtrail-bucket`

This component is responsible for provisioning a bucket for storing cloudtrail logs for auditing purposes. It's expected
to be used alongside
[the `cloudtrail` component](https://github.com/cloudposse/terraform-aws-components/tree/main/modules/cloudtrail).

## Usage

**Stack Level**: Regional

Here's an example snippet for how to use this component. It's suggested to apply this component to only the centralized
`audit` account.

```yaml
components:
  terraform:
    cloudtrail-bucket:
      vars:
        enabled: true
        name: "cloudtrail"
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

- [cloudposse/terraform-aws-components](https://github.com/cloudposse/terraform-aws-components/tree/main/modules/cloudtrail-bucket) -
  Cloud Posse's upstream component



