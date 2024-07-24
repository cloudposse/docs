---
title: bastion
sidebar_label: bastion
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/bastion/README.md
tags: [terraform, aws, bastion]
---

# Component: `bastion`

This component is responsible for provisioning a generic Bastion host within an ASG with parameterized `user_data` and
support for AWS SSM Session Manager for remote access with IAM authentication.

If a special `container.sh` script is desired to run, set `container_enabled` to `true`, and set the `image_repository`
and `image_container` variables.

By default, this component acts as an "SSM Bastion", which is deployed to a private subnet and has SSM Enabled, allowing
access via the AWS Console, AWS CLI, or SSM Session tools such as [aws-gate](https://github.com/xen0l/aws-gate).
Alternatively, this component can be used as a regular SSH Bastion, deployed to a public subnet with Security Group
Rules allowing inbound traffic over port 22.

## Usage

**Stack Level**: Regional

By default, this component can be used as an "SSM Bastion" (deployed to a private subnet, accessed via SSM):

```yaml
components:
  terraform:
    bastion:
      vars:
        enabled: true
        name: bastion-ssm
        # Your choice of availability zones. If not specified, all private subnets are used.
        availability_zones: ["us-east-1a", "us-east-1b", "us-east-1c"]
        instance_type: t3.micro
        image_container: infrastructure:latest
        image_repository: "111111111111.dkr.ecr.us-east-1.amazonaws.com/example/infrastructure"
```

The following is an example snippet for how to use this component as a traditional bastion:

```yaml
components:
  terraform:
    bastion:
      vars:
        enabled: true
        name: bastion-traditional
        image_container: infrastructure:latest
        image_repository: "111111111111.dkr.ecr.us-east-1.amazonaws.com/example/infrastructure"
        associate_public_ip_address: true # deploy to public subnet and associate public IP with instance
        custom_bastion_hostname: bastion
        vanity_domain: example.com
        security_group_rules:
          - type: "ingress"
            from_port: 22
            to_port: 22
            protocol: tcp
            cidr_blocks: ["1.2.3.4/32"]
          - type: "egress"
            from_port: 0
            to_port: 0
            protocol: -1
            cidr_blocks: ["0.0.0.0/0"]
```

<!-- prettier-ignore-start -->
<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- hello terraform-docs -->
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- prettier-ignore-end -->

## References

- [cloudposse/terraform-aws-components](https://github.com/cloudposse/terraform-aws-components/tree/main/modules/bastion) -
  Cloud Posse's upstream component



