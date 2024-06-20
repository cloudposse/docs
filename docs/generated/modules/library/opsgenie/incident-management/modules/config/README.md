---
title: config
sidebar_label: config
sidebar_class_name: command
description: config
custom_edit_url: https://github.com/cloudposse/terraform-opsgenie-incident-management/blob/main/modules/config/README.md
---

## Config

Terraform module that configures a multitude of [Opsgenie resources](https://registry.terraform.io/providers/opsgenie/opsgenie/latest/docs). 
Many resources have cross-resource dependencies, which may be simpler to handle within a single module in certain cases, such as using YAML configurations.

This module is designed to accept an input configuration map. 
One nice way of handling this is by passing resource definitions from a YAML configuration file. 

See below for details & examples.

## YAML Examples

### `alert_policies.yaml`

```yaml
alert_policies:
- name: "prioritize-env-prod-critical-alerts"
  owner_team_name: acme.dev
  tags:
    - "ManagedBy:terraform"
  filter:
    type: match-all-conditions
    conditions:
      - field: source
        operation: matches
        expected_value: ".*prod.acme.*"
      - field: tags
        operation: contains
        expected_value: "severity:critical"
  priority: P1
```

### `api_integrations.yaml`

```yaml
api_integrations:
- name: acme-dev-opsgenie-sns-integration
  type: AmazonSns
  owner_team_name: acme.dev
```

### `escalations.yaml`

```yaml
escalations:
- name: acme.dev.some-service-escalation
  description: "repo: https://github.com/acme/some-service;owner:David Lightman @David Lightman"
  owner_team_name: acme.dev
  rule:
    condition: if-not-acked
    notify_type: default
    delay: 0
    recipients:
    - type: team
      team_name: acme.dev.some-service
```

### `notification_policies.yaml`

```yaml
notification_policies:
- name: auto-close-based-on-priority
  team_name: acme.dev
  auto_close_action:
    time_amount: 60
  filter:
    type: match-all-conditions
    conditions:
      - field: priority
        operation: less-than
        expected_value: P3
```

### `schedules.yaml`

```yaml
schedules:
  - name: acme.default
    description: "Acme Infrastructure Team"
    timezone: "America/Los_Angeles"
    owner_team_name: acme
    enabled: true
```

### `schedule_rotations.yaml`

```yaml
schedule_rotations:
  - name: acme.default.rotation
    schedule_name: acme.default
    start_date: "1970-01-01T00:00:00Z"
    type: weekly
    length: 1
    participants:
    - type: user
      username: opsgenie-test@cloudposse.com
    - type: user
      username: opsgenie-test-2@cloudposse.com
    time_restriction:
      type: time-of-day
      restrictions:
      - start_hour: 8
        start_min: 0
        end_hour: 20
        end_min: 0
```

### `team_routing_rules.yaml`

```yaml
team_routing_rules:
- name: some-service
  owner_team_name: acme.dev
  criteria:
    type: match-all-conditions
    conditions:
    - field: tags
      operation: contains
      expected_value: app:some-service
      not: false
  notify:
  - type: escalation
    name: acme.dev.some-service-escalation
  order: 0
```

### `teams.yaml`

```yaml
teams:
- name: acme
  description: Global Team for Acme Co.
- name: acme.dev
  description: Acme Dev Team
- name: acme.dev.some-service
  description: "repo: https://github.com/acme/some-service;owner:David Lightman @David Lightman"
```

### `users.yaml`

```yaml
users:
- username: opsgenie-test@cloudposse.com
  full_name: Opsgenie Test User
  role: User
  locale: "en_US"
  timezone: "America/New_York"
```


### `existing_users.yaml`

```yaml
existing_users:
- username: opsgenie-test@cloudposse.com
```


### `services.yaml`

```yaml
services:
- name: frontend
  team_id: "..."
  description: Frontend service
```

### `service_incident_rules.yaml`

```yaml
service_incident_rules:
- name: frontend-service-incident-rule-1
  service_name: frontend
  incident_rule:
    condition_match_type: match-all

    conditions:
      - field: source
        operation: matches
        expected_value: ".*stage.*"
      - field: tags
        operation: contains
        expected_value: "severity:info"

    incident_properties:
      message: This is a test message
      priority: P3

      stakeholder_properties:
        message: Message for stakeholders
        enable: true
```

## Usage

[Full Config Example](https://github.com/cloudposse/terraform-opsgenie-incident-management/tree/main/modules/config/../../examples/config)

```hcl
locals {
  # Build a map of our various Opsgenie resources that will be used to iterate over each module
  opsgenie_resources = merge([
    for resource_file in fileset(path.cwd, "resources/*.yaml") : {
      for k, v in yamldecode(file(resource_file)) : k => v
    }
  ]...)
}

module "opsgenie" {
  source  = "cloudposse/incident-management/opsgenie//modules/config"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"

  opsgenie_resources = local.opsgenie_resources
}
```

## Inputs

|  Name                          |  Default         |  Description                                                                   | Required |
|:-------------------------------|:----------------:|:-------------------------------------------------------------------------------|:--------:|
| `opsgenie_resources`           | `{}`             | A map generated by sourcing YAML resource definitions (see above).             | Yes      |


## Outputs

| Name                        | Description                                 |
|:----------------------------|:--------------------------------------------|
| `alert_policies`            | `name` and `id` of each alert policy        |
| `api_integrations`          | `name` and `id` of each API integration     |
| `escalations`               | `name` and `id` of each escalation          |
| `existing_users`            | `username` and `id` of each existing user   |
| `notification_policies`     | `name` and `id` of each notification policy |
| `schedules`                 | `name` and `id` of each schedules           |
| `schedule_rotations`        | `name` and `id` of each schedule rotations  |
| `services`                  | `name` and `id` of each service             |
| `services`                  | `name` and `id` of each service             |
| `service_incident_rule_ids` | `id` of each service incident rule          |
| `team_routing_rules`        | `name` and `id` of each team routing rule   |
| `teams`                     | `name` and `id` of each team                |
| `users`                     | `username` and `id` of each user            |

