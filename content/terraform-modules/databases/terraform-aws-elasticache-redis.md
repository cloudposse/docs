---
title: "terraform-aws-elasticache-redis"
description: "Terraform module to provision an [`ElastiCache`](https://aws.amazon.com/elasticache/) Redis Cluster"
---
# Terraform AWS Elasticache Redis

|                  |                                                                                                                                                                            |  |
|:-----------------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:-|
| GitHub Repo      | https://github.com/cloudposse/terraform-aws-elasticache-redis                                                                                                              |  |
| Terraform Module | terraform-aws-elasticache-redis                                                                                                                                            |  |
| Release          | [![Release](https://img.shields.io/github/release/cloudposse/terraform-aws-elasticache-redis.svg)](https://github.com/cloudposse/terraform-aws-elasticache-redis/releases) |  |
| Build Status     | [![Build Status](https://travis-ci.org/cloudposse/terraform-aws-elasticache-redis.svg?branch=master)](https://travis-ci.org/cloudposse/terraform-aws-elasticache-redis)    |  |


# Usage

Include this repository as a module in your existing terraform code:

##### HCL
```hcl
module "example_redis" {
  source                           = "git::https://github.com/cloudposse/terraform-aws-elasticache-redis.git?ref=master"
  domain_name                      = "example.com"
  proces_domain_validation_options = "true"
  ttl                              = "300"
}
```

# Variables

| Name                         | Default                | Description                                                     |
|:-----------------------------|:-----------------------|:----------------------------------------------------------------|
| enabled                      | true                   | Set to false to prevent the module from creating any resources  |
| family                       | redis3.2               | Redis family                                                    |
| engine_version               | 3.2.4                  | Redis engine version                                            |
| port                         | 6379                   | Redis port                                                      |
| maintenance_window           | wed:03:00-wed:04:00    | Maintenance window                                              |
| notification_topic_arn       | Notification topic arn |                                                                 |
| alarm_cpu_threshold_percent  | 75                     | CPU threshold alarm level                                       |
| alarm_memory_threshold_bytes | 10000000               | Ram threshold alarm level                                       |
| alarm_actions                | []                     | Alarm action list                                               |
| apply_immediately            | true                   | Apply changes immediately                                       |
| automatic_failover           | false                  | Automatic failover (Not available for T1/T2 instances)          |
| namespace                    | global                 | Namespace                                                       |
| availability_zones           | []                     | Availability zone ids                                           |
| zone_id                      | false                  | Route53 DNS Zone id                                             |
| attributes                   | []                     | Additional attributes (_e.g._ "1")                              |
| tags                         | {}                     | Additional tags (_e.g._ map("BusinessUnit","ABC")               |
| delimiter                    | -                      | Delimiter between `name`, `namespace`, `stage` and `attributes` |
| stage                        | default                | Stage                                                           |
| name                         | redis                  | Name                                                            |
| security_groups              | []                     | AWS security group ids                                          |
| vpc_id                       | __REQUIRED__           | AWS VPC id                                                      |
| subnets                      | []                     | AWS subnet ids                                                  |
| cluster_size                 | 1                      | Count of nodes in cluster                                       |
| instance_type                | cache.t2.micro         | Elastic cache instance type                                     |

# Output

| Name              | Description       |
|:------------------|:------------------|
| id                | Redis cluster id  |
| security_group_id | Security group id |
| host              | Redis host        |
| port              | Redis port        |
