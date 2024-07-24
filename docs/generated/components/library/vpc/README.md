---
title: vpc
sidebar_label: vpc
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/vpc/README.md
tags: [terraform, aws, vpc]
---

# Component: `vpc`

This component is responsible for provisioning a VPC and corresponding Subnets. Additionally, VPC Flow Logs can
optionally be enabled for auditing purposes. See the existing VPC configuration documentation for the provisioned
subnets.

## Usage

**Stack Level**: Regional

Here's an example snippet for how to use this component.

```yaml
# catalog/vpc/defaults or catalog/vpc
components:
  terraform:
    vpc/defaults:
      metadata:
        type: abstract
        component: vpc
      settings:
        spacelift:
          workspace_enabled: true
      vars:
        enabled: true
        name: vpc
        availability_zones:
          - "a"
          - "b"
          - "c"
        nat_gateway_enabled: true
        nat_instance_enabled: false
        max_subnet_count: 3
        vpc_flow_logs_enabled: true
        vpc_flow_logs_bucket_environment_name: <environment>
        vpc_flow_logs_bucket_stage_name: audit
        vpc_flow_logs_traffic_type: "ALL"
        subnet_type_tag_key: "example.net/subnet/type"
        assign_generated_ipv6_cidr_block: true
```

```yaml
import:
  - catalog/vpc

components:
  terraform:
    vpc:
      metadata:
        component: vpc
        inherits:
          - vpc/defaults
      vars:
        ipv4_primary_cidr_block: "10.111.0.0/18"
```

<!-- prettier-ignore-start -->
<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- hello terraform-docs -->
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- prettier-ignore-end -->

## References

- [cloudposse/terraform-aws-components](https://github.com/cloudposse/terraform-aws-components/tree/main/modules/vpc) -
  Cloud Posse's upstream component



