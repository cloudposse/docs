---
title: datadog-private-location-ecs
sidebar_label: datadog-private-location-ecs
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/datadog-private-location-ecs/README.md
tags: [terraform, aws, datadog-private-location-ecs]
---

# Component: `datadog-private-location-ecs`

This component is responsible for creating a datadog private location and deploying it to ECS (EC2 / Fargate)

## Usage

**Note** The app key required for this component requires admin level permissions if you are using the default roles.
Admin's have permissions to Write to private locations, which is needed for this component.

**Stack Level**: Regional

Here's an example snippet for how to use this component.

```yaml
# stacks/catalog/datadog/private-location.yaml
components:
  terraform:
    datadog-private-location:
      metadata:
        component: datadog-private-location-ecs
      settings:
        spacelift:
          workspace_enabled: true
      vars:
        enabled: true
        name: datadog-private-location
        task:
          task_memory: 512
          task_cpu: 256
          launch_type: FARGATE
          # capacity_provider_strategies takes precedence over launch_type
          capacity_provider_strategies:
            - capacity_provider: FARGATE_SPOT
              weight: 100
              base: null
          network_mode: awsvpc
          desired_count: 1
          ignore_changes_desired_count: true
          ignore_changes_task_definition: false
          use_alb_security_group: false
          assign_public_ip: false
          propagate_tags: SERVICE
          wait_for_steady_state: true
          circuit_breaker_deployment_enabled: true
          circuit_breaker_rollback_enabled: true
        containers:
          datadog:
            name: datadog-private-location
            image: public.ecr.aws/datadog/synthetics-private-location-worker:latest
            compatibilities:
              - EC2
              - FARGATE
              - FARGATE_SPOT
            log_configuration:
              logDriver: awslogs
              options: {}
            port_mappings: []
```

<!-- prettier-ignore-start -->
<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- hello terraform-docs -->
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- prettier-ignore-end -->

## References

- [cloudposse/terraform-aws-components](https://github.com/cloudposse/terraform-aws-components/tree/main/modules/ecs-service) -
  Cloud Posse's upstream component



