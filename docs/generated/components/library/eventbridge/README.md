---
title: eventbridge
sidebar_label: eventbridge
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/eventbridge/README.md
tags: [terraform, aws, eventbridge]
---

# Component: `eventbridge`

The `eventbridge` component is a Terraform module that defines a CloudWatch EventBridge rule. The rule is pointed at
cloudwatch by default.

## Usage

**Stack Level**: Regional

Here's an example snippet for how to use this component.

```yaml
components:
  terraform:
    eventbridge/ecs-alerts:
      metadata:
        component: eventbridge
      vars:
        name: ecs-faults
        enabled: true
        cloudwatch_event_rule_description: "ECS failures and warnings"
        cloudwatch_event_rule_pattern:
          source:
            - aws.ecs
          detail:
            $or:
              - eventType:
                  - WARN
                  - ERROR
              - agentConnected:
                  - false
              - containers:
                  exitCode:
                    - anything-but:
                        - 0
```

<!-- prettier-ignore-start -->
<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- hello terraform-docs -->
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- prettier-ignore-end -->

## References

- [cloudposse/terraform-aws-components](https://github.com/cloudposse/terraform-aws-components/tree/master/modules/eventbridge) -
  Cloud Posse's upstream component



