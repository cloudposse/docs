---
title: aws-shield
sidebar_label: aws-shield
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/aws-shield/README.md
tags: [terraform, aws, aws-shield]
---

# Component: `aws-shield`

This component is responsible for enabling AWS Shield Advanced Protection for the following resources:

- Application Load Balancers (ALBs)
- CloudFront Distributions
- Elastic IPs
- Route53 Hosted Zones

This component assumes that resources it is configured to protect are not already protected by other components that
have their `xxx_aws_shield_protection_enabled` variable set to `true`.

This component also requires that the account where the component is being provisioned to has been
[subscribed to AWS Shield Advanced](https://docs.aws.amazon.com/waf/latest/developerguide/enable-ddos-prem.html).

## Usage

**Stack Level**: Global or Regional

The following snippet shows how to use all of this component's features in a stack configuration:

```yaml
components:
  terraform:
    aws-shield:
      settings:
        spacelift:
          workspace_enabled: true
      vars:
        enabled: true
        route53_zone_names:
          - test.ue1.example.net
        alb_names:
          - k8s-common-2c5f23ff99
        cloudfront_distribution_ids:
          - EDFDVBD632BHDS5
        eips:
          - 3.214.128.240
          - 35.172.208.150
          - 35.171.70.50
```

A typical global configuration will only include the `route53_zone_names` and `cloudfront_distribution_ids` variables,
as global Route53 Hosted Zones may exist in that account, and because CloudFront is a global AWS service.

A global stack configuration will not have a VPC, and hence `alb_names` and `eips` should not be defined:

```yaml
components:
  terraform:
    aws-shield:
      settings:
        spacelift:
          workspace_enabled: true
      vars:
        enabled: true
        route53_zone_names:
          - test.example.net
        cloudfront_distribution_ids:
          - EDFDVBD632BHDS5
```

Regional stack configurations will typically make use of all resources except for `cloudfront_distribution_ids`:

```yaml
components:
  terraform:
    aws-shield:
      settings:
        spacelift:
          workspace_enabled: true
      vars:
        route53_zone_names:
          - test.ue1.example.net
        alb_names:
          - k8s-common-2c5f23ff99
        eips:
          - 3.214.128.240
          - 35.172.208.150
          - 35.171.70.50
```

Stack configurations which rely on components with a `xxx_aws_shield_protection_enabled` variable should set that
variable to `true` and leave the corresponding variable for this component as empty, relying on that component's AWS
Shield Advanced functionality instead. This leads to more simplified inter-component dependencies and minimizes the need
for maintaining the provisioning order during a cold-start.

<!-- prettier-ignore-start -->
<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- hello terraform-docs -->
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- prettier-ignore-end -->

## References

- [cloudposse/terraform-aws-components](https://github.com/cloudposse/terraform-aws-components/tree/main/modules/aws-shield) -
  Cloud Posse's upstream component



