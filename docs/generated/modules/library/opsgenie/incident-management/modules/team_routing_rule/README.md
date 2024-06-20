---
title: team_routing_rule
sidebar_label: team_routing_rule
sidebar_class_name: command
description: team_routing_rule
custom_edit_url: https://github.com/cloudposse/terraform-opsgenie-incident-management/blob/main/modules/team_routing_rule/README.md
---

##  Team Routing Rule

Terraform module to configure [Opsgenie Team Routing Rule](https://registry.terraform.io/providers/opsgenie/opsgenie/latest/docs/resources/team_routing_rule)


## Usage

[Create Opsgenie Team Routing Rule example](https://github.com/cloudposse/terraform-opsgenie-incident-management/tree/main/modules/team_routing_rule/../../examples/team_routing_rule)

```hcl
module "team_routing_rule" {
  source  = "cloudposse/incident-management/opsgenie//modules/team_routing_rule"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"

  team_routing_rule = {
    name    = module.label.id
    team_id = module.owner_team.team_id

    notify = [{
      type = "escalation"
      id   = module.escalation.escalation_id
    }]
  }
}
```

## Inputs

**Note:** `team_routing_rule` is a map for two reasons: 
- to be able to put whole configuration in yaml file
- variables defined with type set are not robust enough (can't set default values)

|  Name                          |  Default                          |  Description                                                                                                                    | Required |
|:-------------------------------|:---------------------------------:|:--------------------------------------------------------------------------------------------------------------------------------|:--------:|
| `team_routing_rule`            | `{}`                              | This variable is used to configure Opsgenie Team Routing Rule.                                                                  | Yes      |


## Outputs

| Name                        | Description                                 |
|:----------------------------|:--------------------------------------------|
| `team_routing_rule_name`    | The name of the Opsgenie Team Routing Rule.|
| `team_routing_rule_id`      | The ID of the Opsgenie Team Routing Rule.  |

## Important Note

Due to the Opsgenie terraform provider issue, there is a difference in the configuration of the `time_restriction` blocks based on `type`.

[Github Issue #282](https://github.com/opsgenie/terraform-provider-opsgenie/issues/282)

```hcl
time_restriction {
  type = "time-of-day"
  restriction {
    end_hour   = 17
    end_min    = 0
    start_hour = 9
    start_min  = 0
  }
}
```
vs
```hcl
 time_restriction {
  type = "weekday-and-time-of-day"
  restriction {
    end_day  = "friday"
    end_hour   = 17
    end_min    = 0
    start_day  = "monday"
    start_hour = 9
    start_min  = 0
  }
}
```

