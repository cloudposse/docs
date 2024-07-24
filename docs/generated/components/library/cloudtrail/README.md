---
title: cloudtrail
sidebar_label: cloudtrail
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/cloudtrail/README.md
tags: [terraform, aws, cloudtrail]
---

# Component: `cloudtrail`

This component is responsible for provisioning cloudtrail auditing in an individual account. It's expected to be used
alongside
[the `cloudtrail-bucket` component](https://github.com/cloudposse/terraform-aws-components/tree/main/modules/cloudtrail-bucket)
as it utilizes that bucket via remote state.

This component can either be deployed selectively to various accounts with `is_organization_trail=false`, or
alternatively created in all accounts if deployed to the management account `is_organization_trail=true`.

## Usage

**Stack Level**: Global

The following is an example snippet for how to use this component:

(`gbl-root.yaml`)

```yaml
components:
  terraform:
    cloudtrail:
      vars:
        enabled: true
        cloudtrail_bucket_environment_name: "ue1"
        cloudtrail_bucket_stage_name: "audit"
        cloudwatch_logs_retention_in_days: 730
        is_organization_trail: true
```

<!-- prettier-ignore-start -->
<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- hello terraform-docs -->
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- prettier-ignore-end -->

## References

- [cloudposse/terraform-aws-components](https://github.com/cloudposse/terraform-aws-components/tree/main/modules/cloudtrail) -
  Cloud Posse's upstream component



