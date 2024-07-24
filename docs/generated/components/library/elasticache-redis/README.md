---
title: elasticache-redis
sidebar_label: elasticache-redis
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/elasticache-redis/README.md
tags: [terraform, aws, elasticache-redis]
---

# Component: `elasticache-redis`

This component is responsible for provisioning [ElastiCache Redis](https://aws.amazon.com/elasticache/redis/) clusters.

## Usage

**Stack Level**: Regional

Here's an example snippet for how to use this component.

`stacks/catalog/elasticache/elasticache-redis/defaults.yaml` file (default settings for all Redis clusters):

```yaml
components:
  terraform:
    elasticache-redis:
      vars:
        enabled: true
        name: "elasticache-redis"
        family: redis6.x
        ingress_cidr_blocks: []
        egress_cidr_blocks: ["0.0.0.0/0"]
        port: 6379
        at_rest_encryption_enabled: true
        transit_encryption_enabled: false
        apply_immediately: false
        automatic_failover_enabled: false
        cloudwatch_metric_alarms_enabled: false
        redis_clusters:
          redis-main:
            num_replicas: 1
            num_shards: 0
            replicas_per_shard: 0
            engine_version: 6.0.5
            instance_type: cache.t2.small
            parameters:
              - name: notify-keyspace-events
                value: "lK"
```

`stacks/org/ou/account/region.yaml` file (imports and overrides the default settings for a specific cluster):

```yaml
import:
  - catalog/elasticache/elasticache-redis/defaults.yaml

components:
  terraform:
    elasticache-redis:
      vars:
        enabled: true
        redis_clusters:
          redis-main:
            num_replicas: 1
            num_shards: 0
            replicas_per_shard: 0
            engine_version: 6.0.5
            instance_type: cache.t2.small
            parameters:
              - name: notify-keyspace-events
                value: lK
```

<!-- prettier-ignore-start -->
<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- hello terraform-docs -->
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- prettier-ignore-end -->

## References

- [cloudposse/terraform-aws-components](https://github.com/cloudposse/terraform-aws-components/tree/main/modules/elasticache-redis) -
  Cloud Posse's upstream component



