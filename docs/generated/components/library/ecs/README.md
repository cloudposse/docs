---
title: ecs
sidebar_label: ecs
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/ecs/README.md
tags: [terraform, aws, ecs]
---

# Component: `ecs`

This component is responsible for provisioning an ECS Cluster and associated load balancer.

## Usage

**Stack Level**: Regional

Here's an example snippet for how to use this component.

The following will create

- ecs cluster
- load balancer with an ACM cert placed on example.com
- r53 record on all \*.example.com which will point to the load balancer

```yaml
components:
  terraform:
    ecs:
      settings:
        spacelift:
          workspace_enabled: true
      vars:
        name: ecs
        enabled: true
        acm_certificate_domain: example.com
        route53_record_name: "*"
        # Create records will be created in each zone
        zone_names:
          - example.com
        capacity_providers_fargate: true
        capacity_providers_fargate_spot: true
        capacity_providers_ec2:
          default:
            instance_type: t3.medium
            max_size: 2

        alb_configuration:
          public:
            internal_enabled: false
            # resolves to *.public-platform.<environment>.<stage>.<tenant>.<domain>.<tld>
            route53_record_name: "*.public-platform"
            additional_certs:
              - "my-vanity-domain.com"
          private:
            internal_enabled: true
            route53_record_name: "*.private-platform"
            additional_certs:
              - "my-vanity-domain.com"
```

<!-- prettier-ignore-start -->
<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- hello terraform-docs -->
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- prettier-ignore-end -->

## References

- [cloudposse/terraform-aws-components](https://github.com/cloudposse/terraform-aws-components/tree/main/modules/ecs) -
  Cloud Posse's upstream component



