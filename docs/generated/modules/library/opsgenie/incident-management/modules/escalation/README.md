---
title: escalation
sidebar_label: escalation
sidebar_class_name: command
description: escalation
custom_edit_url: https://github.com/cloudposse/terraform-opsgenie-incident-management/blob/main/modules/escalation/README.md
---

## Escalation

Terraform module to configure [Opsgenie Escalation](https://registry.terraform.io/providers/opsgenie/opsgenie/latest/docs/resources/escalation)


## Usage

[Create Opsgenie Escalation example](https://github.com/cloudposse/terraform-opsgenie-incident-management/tree/main/modules/escalation/../../examples/escalation)

```hcl
module "escalation" {
  source  = "cloudposse/incident-management/opsgenie//modules/escalation"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"

  escalation = {
    name          = module.label.id
    owner_team_id = module.owner_team.team_id

    rule = {
      recipients = [{
        type = "team"
        id   = module.escalation_team.team_id
      }]
    }
  }

}

```

## Inputs

**Note:** `escalation` is a map for two reasons: 
- to be able to put whole configuration in yaml file
- variables defined with type set are not robust enough (can't set default values)

|  Name                          |  Default                          |  Description                                                                                                                    | Required |
|:-------------------------------|:---------------------------------:|:--------------------------------------------------------------------------------------------------------------------------------|:--------:|
| `escalation`                   | `{}`                              | This variable is used to configure Opsgenie Escalation.                                                                         | Yes      |


## Outputs

| Name                        | Description                              |
|:----------------------------|:-----------------------------------------|
| `escalation_name`      | The name of the Opsgenie Escalation.|
| `escalation_id`        | The ID of the Opsgenie Escalation.  |

