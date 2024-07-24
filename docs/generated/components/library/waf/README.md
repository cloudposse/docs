---
title: waf
sidebar_label: waf
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/waf/README.md
tags: [terraform, aws, waf]
---

# Component: `aws-waf-acl`

This component is responsible for provisioning an AWS Web Application Firewall (WAF) with an associated managed rule
group.

## Usage

**Stack Level**: Regional

Here's an example snippet for how to use this component.

```yaml
components:
  terraform:
    waf:
      vars:
        enabled: true
        name: waf
        acl_name: default
        default_action: allow
        description: Default web ACL
        visibility_config:
          cloudwatch_metrics_enabled: false
          metric_name: "default"
          sampled_requests_enabled: false
        managed_rule_group_statement_rules:
          - name: "OWASP-10"
            # Rules are processed in order based on the value of priority, lowest number first
            priority: 1

            statement:
              name: AWSManagedRulesCommonRuleSet
              vendor_name: AWS

            visibility_config:
              # Defines and enables Amazon CloudWatch metrics and web request sample collection.
              cloudwatch_metrics_enabled: false
              metric_name: "OWASP-10"
              sampled_requests_enabled: false
```

<!-- prettier-ignore-start -->
<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- hello terraform-docs -->
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- prettier-ignore-end -->

## References

- [cloudposse/terraform-aws-components](https://github.com/cloudposse/terraform-aws-components/tree/main/modules/waf) -
  Cloud Posse's upstream component



