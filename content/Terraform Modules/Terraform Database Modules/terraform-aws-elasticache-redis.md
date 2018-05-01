---
title: "terraform-aws-elasticache-redis"
excerpt: "Terraform module to provision an [`ElastiCache`](https://aws.amazon.com/elasticache/) Redis Cluster"
---
# Terraform AWS Elasticache Redis
[block:parameters]
{
  "data": {
    "0-0": "GitHub Repo",
    "1-0": "Terraform Module",
    "2-0": "Release",
    "3-0": "Build Status",
    "0-1": "https://github.com/cloudposse/terraform-aws-elasticache-redis",
    "1-1": "terraform-aws-elasticache-redis",
    "2-1": "[![Release](https://img.shields.io/github/release/cloudposse/terraform-aws-elasticache-redis.svg)](https://github.com/cloudposse/terraform-aws-elasticache-redis/releases)",
    "3-1": "[![Build Status](https://travis-ci.org/cloudposse/terraform-aws-elasticache-redis.svg?branch=master)](https://travis-ci.org/cloudposse/terraform-aws-elasticache-redis)"
  },
  "cols": 2,
  "rows": 4
}
[/block]

# Usage

Include this repository as a module in your existing terraform code:
[block:code]
{
  "codes": [
    {
      "code": "module \"example_redis\" {\n  source                           = \"git::https://github.com/cloudposse/terraform-aws-elasticache-redis.git?ref=master\"\n  domain_name                      = \"example.com\"\n  proces_domain_validation_options = \"true\"\n  ttl                              = \"300\"\n}",
      "language": "json",
      "name": "HCL"
    }
  ]
}
[/block]
# Variables
[block:parameters]
{
  "data": {
    "h-0": "Name",
    "h-1": "Default",
    "h-2": "Description",
    "0-0": "enabled",
    "1-0": "namespace",
    "2-0": "stage",
    "3-0": "name",
    "4-0": "security_groups",
    "5-0": "vpc_id",
    "6-0": "subnets",
    "7-0": "cluster_size",
    "8-0": "instance_type",
    "9-0": "family",
    "10-0": "engine_version",
    "11-0": "port",
    "12-0": "maintenance_window",
    "13-0": "notification_topic_arn",
    "14-0": "alarm_cpu_threshold_percent",
    "15-0": "alarm_memory_threshold_bytes",
    "16-0": "alarm_actions",
    "17-0": "apply_immediately",
    "18-0": "automatic_failover",
    "19-0": "availability_zones",
    "19-2": "Availability zone ids",
    "20-0": "zone_id",
    "21-0": "attributes",
    "22-0": "tags",
    "23-0": "delimiter",
    "0-1": "true",
    "1-1": "global",
    "2-1": "default",
    "3-1": "redis",
    "4-1": "[]",
    "6-1": "[]",
    "5-1": "__REQUIRED__",
    "7-1": "1",
    "8-1": "cache.t2.micro",
    "9-1": "redis3.2",
    "10-1": "3.2.4",
    "11-1": "6379",
    "12-1": "wed:03:00-wed:04:00",
    "14-1": "75",
    "15-1": "10000000",
    "16-1": "[]",
    "19-1": "[]",
    "21-1": "[]",
    "17-1": "true",
    "18-1": "false",
    "20-1": "false",
    "22-1": "{}",
    "23-1": "-",
    "0-2": "Set to false to prevent the module from creating any resources",
    "1-2": "Namespace",
    "2-2": "Stage",
    "3-2": "Name",
    "4-2": "AWS security group ids",
    "5-2": "AWS VPC id",
    "6-2": "AWS subnet ids",
    "7-2": "Count of nodes in cluster",
    "8-2": "Elastic cache instance type",
    "9-2": "Redis family",
    "10-2": "Redis engine version",
    "11-2": "Redis port",
    "12-2": "Maintenance window",
    "13-2": "Notification topic arn",
    "14-2": "CPU threshold alarm level",
    "15-2": "Ram threshold alarm level",
    "16-2": "Alarm action list",
    "17-2": "Apply changes immediately",
    "18-2": "Automatic failover (Not available for T1/T2 instances)",
    "20-2": "Route53 DNS Zone id",
    "21-2": "Additional attributes (_e.g._ \"1\")",
    "22-2": "Additional tags (_e.g._ map(\"BusinessUnit\",\"ABC\")",
    "23-2": "Delimiter between `name`, `namespace`, `stage` and `attributes`"
  },
  "cols": 3,
  "rows": 24
}
[/block]
# Output
[block:parameters]
{
  "data": {
    "h-0": "Name",
    "h-1": "Description",
    "0-0": "id",
    "1-0": "security_group_id",
    "2-0": "host",
    "3-0": "port",
    "3-1": "Redis port",
    "2-1": "Redis host",
    "1-1": "Security group id",
    "0-1": "Redis cluster id"
  },
  "cols": 2,
  "rows": 4
}
[/block]