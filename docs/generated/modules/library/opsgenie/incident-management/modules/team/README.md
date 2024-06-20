---
title: team
sidebar_label: team
sidebar_class_name: command
description: team
custom_edit_url: https://github.com/cloudposse/terraform-opsgenie-incident-management/blob/main/modules/team/README.md
---

## Team

Terraform module to configure [Opsgenie Team](https://registry.terraform.io/providers/opsgenie/opsgenie/latest/docs/resources/team)


## Usage

[Create Opsgenie Team example](https://github.com/cloudposse/terraform-opsgenie-incident-management/tree/main/modules/team/../../examples/team)

```hcl
module "team" {
  source  = "cloudposse/incident-management/opsgenie//modules/team"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"

  team = {
    name        = module.label.id
    description = "team-description"
  }
}

module "ui_managed_team" {
  source  = "cloudposse/incident-management/opsgenie//modules/team"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"

  team = {
    name                     = module.label.id
    description              = "team-description"
    delete_default_resources = true
    ignore_members           = true
  }
}

```

## Inputs

**Note:** `team` is a map for two reasons: 
- to be able to put whole configuration in yaml file
- variables defined with type set are not robust enough (can't set default values)

|  Name                          |  Default                          |  Description                                                                                                                    | Required |
|:-------------------------------|:---------------------------------:|:--------------------------------------------------------------------------------------------------------------------------------|:--------:|
| `team`                         | `{}`                              | This variable is used to configure Opsgenie Team.                                                                               | Yes      |


## Outputs

| Name                        | Description                              |
|:----------------------------|:-----------------------------------------|
| `team_name`                 | The name of the Opsgenie Team.           |
| `team_id`                   | The ID of the Opsgenie Team.             |

