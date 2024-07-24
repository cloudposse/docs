---
title: ecs-service
sidebar_label: ecs-service
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/ecs-service/README.md
tags: [terraform, aws, ecs-service]
---

# Component: `ecs-service`

This component is responsible for creating an ECS service.

## Usage

**Stack Level**: Regional

Here's an example snippet for how to use this component.

```yaml
# stacks/catalog/ecs-service/defaults.yaml
components:
  terraform:
    ecs-service/defaults:
      metadata:
        component: ecs-service
        type: abstract
      settings:
        spacelift:
          workspace_enabled: true
      vars:
        enabled: true
        public_lb_enabled: false
        ecr_stage_name: mgmt-automation
        task:
          launch_type: FARGATE
          network_mode: awsvpc
          desired_count: 1
          ignore_changes_desired_count: true
          ignore_changes_task_definition: false
          assign_public_ip: false
          propagate_tags: SERVICE
          wait_for_steady_state: true
          circuit_breaker_deployment_enabled: true
          circuit_breaker_rollback_enabled: true
```

This will launch a `kong` service using an ecr image from `mgmt-automation` account.

NOTE: Usage of `ecr_image` instead of `image`.

```yaml
import:
  - catalog/ecs-service/defaults

components:
  terraform:
    ecs/b2b/kong/service:
      metadata:
        component: ecs-service
        inherits:
          - ecs-service/defaults
      vars:
        name: kong
        public_lb_enabled: true
        cluster_attributes: [b2b]
        containers:
          service:
            name: "kong-gateway"
            ecr_image: kong:latest
            map_environment:
              KONG_DECLARATIVE_CONFIG: /home/kong/production.yml
            port_mappings:
              - containerPort: 8000
                hostPort: 8000
                protocol: tcp
        task:
          desired_count: 1
          task_memory: 512
          task_cpu: 256
```

This will launch a `httpd` service using an external image from dockerhub

NOTE: Usage of `image` instead of `ecr_image`.

```yaml
# stacks/catalog/ecs-service/httpd.yaml
import:
  - catalog/ecs-service/defaults

components:
  terraform:
    ecs/platform/httpd/service:
      metadata:
        component: ecs-service
        inherits:
          - ecs-service/defaults
      vars:
        enabled: true
        name: httpd
        public_lb_enabled: true
        cluster_attributes: [platform]
        containers:
          service:
            name: "Hello"
            image: httpd:2.4
            port_mappings:
              - containerPort: 80
                hostPort: 80
                protocol: tcp
            command:
              - '/bin/sh -c "echo ''<html> <head> <title>Amazon ECS Sample App</title> <style>body {margin-top: 40px;
                background-color: #333;} </style> </head><body> <div style=color:white;text-align:center> <h1>Amazon ECS
                Sample App</h1> <h2>Congratulations!</h2> <p>Your application is now running on a container in Amazon
                ECS.</p> </div></body></html>'' >  /usr/local/apache2/htdocs/index.html && httpd-foreground"'
            entrypoint: ["sh", "-c"]
        task:
          desired_count: 1
          task_memory: 512
          task_cpu: 256
```

This will launch google's `echoserver` using an external image from gcr

NOTE: Usage of `image` instead of `ecr_image`.

```yaml
# stacks/catalog/ecs-service/echoserver.yaml
import:
  - catalog/ecs-service/defaults

components:
  terraform:
    ecs/platform/echoserver/service:
      metadata:
        component: ecs-service
        inherits:
          - ecs-service/defaults
      vars:
        enabled: true
        name: echoserver
        public_lb_enabled: true
        cluster_attributes: [platform]
        containers:
          service:
            name: "echoserver"
            image: gcr.io/google_containers/echoserver:1.10
            port_mappings:
              - containerPort: 8080
                hostPort: 8080
                protocol: tcp
        task:
          desired_count: 1
          task_memory: 512
          task_cpu: 256
```

#### Other Domains

This component supports alternate service names for your ECS Service through a couple of variables:

- `vanity_domain` & `vanity_alias` - This will create a route to the service in the listener rules of the ALB. This will
  also create a Route 53 alias record in the hosted zone in this account. The hosted zone is looked up by the
  `vanity_domain` input.
- `additional_targets` - This will create a route to the service in the listener rules of the ALB. This will not create
  a Route 53 alias record.

Examples:

```yaml
ecs/platform/service/echo-server:
  vars:
    vanity_domain: "dev-acme.com"
    vanity_alias:
      - "echo-server.dev-acme.com"
    additional_targets:
      - "echo.acme.com"
```

This then creates the following listener rules:

```text
HTTP Host Header is
echo-server.public-platform.use2.dev.plat.service-discovery.com
 OR echo-server.dev-acme.com
 OR echo.acme.com
```

It will also create the record in Route53 to point `"echo-server.dev-acme.com"` to the ALB. Thus
`"echo-server.dev-acme.com"` should resolve.

We can then create a pointer to this service in the `acme.come` hosted zone.

```yaml
dns-primary:
  vars:
    domain_names:
      - acme.com
    record_config:
      - root_zone: acme.com
        name: echo.
        type: CNAME
        ttl: 60
        records:
          - echo-server.dev-acme.com
```

This will create a CNAME record in the `acme.com` hosted zone that points `echo.acme.com` to `echo-server.dev-acme.com`.

### EFS

EFS is supported by this ecs service, you can use either `efs_volumes` or `efs_component_volumes` in your task
definition.

This example shows how to use `efs_component_volumes` which remote looks up efs component and uses the `efs_id` to mount
the volume. And how to use `efs_volumes`

```yaml
components:
  terraform:
    ecs-services/my-service:
      metadata:
        component: ecs-service
        inherits:
          - ecs-services/defaults
      vars:
        containers:
          service:
            name: app
            image: my-image:latest
            log_configuration:
              logDriver: awslogs
              options: {}
            port_mappings:
              - containerPort: 8080
                hostPort: 8080
                protocol: tcp
            mount_points:
              - containerPath: "/var/lib/"
                sourceVolume: "my-volume-mount"

        task:
          efs_component_volumes:
            - name: "my-volume-mount"
              host_path: null
              efs_volume_configuration:
                - component: efs/my-volume-mount
                  root_directory: "/var/lib/"
                  transit_encryption: "ENABLED"
                  transit_encryption_port: 2999
                  authorization_config: []
          efs_volumes:
            - name: "my-volume-mount-2"
              host_path: null
              efs_volume_ configuration:
                - file_system_id: "fs-1234"
                  root_directory: "/var/lib/"
                  transit_encryption: "ENABLED"
                  transit_encryption_port: 2998
                  authorization_config: []
```

<!-- prettier-ignore-start -->
<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- hello terraform-docs -->
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- prettier-ignore-end -->

## References

- [cloudposse/terraform-aws-components](https://github.com/cloudposse/terraform-aws-components/tree/main/modules/ecs-service) -
  Cloud Posse's upstream component



## CHANGELOG

### PR [#1008](https://github.com/cloudposse/terraform-aws-components/pull/1008)

#### Possible Breaking Change

- Refactored how S3 Task Definitions and the Terraform Task definition are merged.
  - Introduced local `local.containers_priority_terraform` to be referenced whenever terraform Should take priority
  - Introduced local `local.containers_priority_s3` to be referenced whenever S3 Should take priority
- `map_secrets` pulled out from container definition to local where it can be better maintained. Used Terraform as
  priority as it is a calculated as a map of arns.
- `s3_mirror_name` now automatically uploads a task-template.json to s3 mirror where it can be pulled from GitHub
  Actions.

