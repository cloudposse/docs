---
title: schedule
sidebar_label: schedule
sidebar_class_name: command
description: schedule
custom_edit_url: https://github.com/cloudposse/terraform-opsgenie-incident-management/blob/main/modules/schedule/README.md
---

## schedule

Terraform module to configure [Opsgenie Schedule](https://registry.terraform.io/providers/opsgenie/opsgenie/latest/docs/resources/schedule)


## Usage

[Opsgenie Schedule example](https://github.com/cloudposse/terraform-opsgenie-incident-management/tree/main/modules/schedule/../../examples/schedule)

```hcl
module "schedule" {
  source  = "cloudposse/incident-management/opsgenie//modules/schedule"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"

  schedule = {
    name        = module.label.id
    description = "schedule-description"
  }
}

data "opsgenie_team" "the_team" {
  name  = var.team_name
}

module "team_schedule" {

  source  = "cloudposse/incident-management/opsgenie//modules/schedule"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"

  schedule = {
    name                     = module.label.id
    description              = "team-schedule-description"
    owner_team_id            = data.opsgenie_team.the_team.id
  }
}
```

## Inputs

**Note:** `schedule` is a map for two reasons: 
- to be able to put whole configuration in yaml file
- variables defined with type set are not robust enough (can't set default values)

|  Name                          |  Default                          |  Description                                                                                                                    | Required |
|:-------------------------------|:---------------------------------:|:--------------------------------------------------------------------------------------------------------------------------------|:--------:|
| `schedule`                         | `{}`                              | This variable is used to configure Opsgenie schedule.                                                                               | Yes      |


## Outputs

| Name                        | Description                              |
|:----------------------------|:-----------------------------------------|
| `schedule_name`                 | The name of the Opsgenie schedule.           |
| `schedule_id`                   | The ID of the Opsgenie schedule.             |

