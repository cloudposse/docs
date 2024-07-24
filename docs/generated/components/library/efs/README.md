---
title: efs
sidebar_label: efs
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/efs/README.md
tags: [terraform, aws, efs]
---

# Component: `efs`

This component is responsible for provisioning an [EFS](https://aws.amazon.com/efs/) Network File System with KMS
encryption-at-rest. EFS is an excellent choice as the default block storage for EKS clusters so that volumes are not
zone-locked.

## Usage

**Stack Level**: Regional

Here's an example snippet for how to use this component.

```yaml
components:
  terraform:
    efs:
      vars:
        enabled: true
        name: shared-files
        dns_name: shared-files
        provisioned_throughput_in_mibps: 10
      # additional_security_group_rules:
      #   - key: "fargate_efs"
      #     type: "ingress"
      #     from_port: 2049
      #     to_port: 2049
      #     protocol: "tcp"
      #     description: "Allow Fargate EFS Volume mounts"
      #     cidr_blocks: ["0.0.0.0/0"]
```

<!-- prettier-ignore-start -->
<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- hello terraform-docs -->
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- prettier-ignore-end -->

## References

- [cloudposse/terraform-aws-components](https://github.com/cloudposse/terraform-aws-components/tree/main/modules/efs) -
  Cloud Posse's upstream component



