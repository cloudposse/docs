---
title: ipam
sidebar_label: ipam
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/ipam/README.md
tags: [terraform, aws, ipam]
---

# Component: `ipam`

This component is responsible for provisioning IPAM per region in a centralized account.

## Usage

**Stack Level**: Regional

Here's an example snippet for how to use this component.

```yaml
components:
  terraform:
    ipam:
      vars:
        enabled: true
        top_cidr: [10.96.0.0/11]
        pool_configurations:
          core:
            cidr: [10.96.0.0/12]
            locale: us-east-2
            sub_pools:
              network:
                cidr: [10.96.0.0/16]
                ram_share_accounts: [core-network]
              auto:
                cidr: [10.97.0.0/16]
                ram_share_accounts: [core-auto]
              corp:
                cidr: [10.98.0.0/16]
                ram_share_accounts: [core-corp]
          plat:
            cidr: [10.112.0.0/12]
            locale: us-east-2
            sub_pools:
              dev:
                cidr: [10.112.0.0/16]
                ram_share_accounts: [plat-dev]
              staging:
                cidr: [10.113.0.0/16]
                ram_share_accounts: [plat-staging]
              prod:
                cidr: [10.114.0.0/16]
                ram_share_accounts: [plat-prod]
              sandbox:
                cidr: [10.115.0.0/16]
                ram_share_accounts: [plat-sandbox]
```

<!-- prettier-ignore-start -->
<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- hello terraform-docs -->
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- prettier-ignore-end -->

## References

- [cloudposse/terraform-aws-components](https://github.com/cloudposse/terraform-aws-components/tree/main/modules/TODO) -
  Cloud Posse's upstream component



## CHANGELOG

### Components PR [Fix components](https://github.com/cloudposse/terraform-aws-components/pull/855)

