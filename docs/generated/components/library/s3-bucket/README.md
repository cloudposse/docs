---
title: s3-bucket
sidebar_label: s3-bucket
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/s3-bucket/README.md
tags: [terraform, aws, s3-bucket]
---

# Component: `s3-bucket`

This component is responsible for provisioning S3 buckets.

## Usage

**Stack Level**: Regional

Here are some example snippets for how to use this component:

`stacks/s3/defaults.yaml` file (base component for all S3 buckets with default settings):

```yaml
components:
  terraform:
    s3-bucket-defaults:
      metadata:
        type: abstract
      settings:
        spacelift:
          workspace_enabled: true
      vars:
        enabled: true
        account_map_tenant_name: core
        # Suggested configuration for all buckets
        user_enabled: false
        acl: "private"
        grants: null
        force_destroy: false
        versioning_enabled: false
        allow_encrypted_uploads_only: true
        block_public_acls: true
        block_public_policy: true
        ignore_public_acls: true
        restrict_public_buckets: true
        allow_ssl_requests_only: true
        lifecycle_configuration_rules:
          - id: default
            enabled: true
            abort_incomplete_multipart_upload_days: 90
            filter_and:
              prefix: ""
              tags: {}
            transition:
              - storage_class: GLACIER
                days: 60
            noncurrent_version_transition:
              - storage_class: GLACIER
                days: 60
            noncurrent_version_expiration:
              days: 90
            expiration:
              days: 120
```

```yaml
import:
  - catalog/s3/defaults

components:
  terraform:
    template-bucket:
      metadata:
        component: s3-bucket
        inherits:
          - s3-bucket-defaults
      vars:
        enabled: true
        name: template
        logging_bucket_name_rendering_enabled: true
        logging:
          bucket_name: s3-access-logs
          prefix: logs/
```

<!-- prettier-ignore-start -->
<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- hello terraform-docs -->
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- prettier-ignore-end -->

## References

- [cloudposse/terraform-aws-components](https://github.com/cloudposse/terraform-aws-components/tree/main/modules/s3-bucket) -
  Cloud Posse's upstream component



