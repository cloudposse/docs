---
title: integration_action
sidebar_label: integration_action
sidebar_class_name: command
description: integration_action
custom_edit_url: https://github.com/cloudposse/terraform-opsgenie-incident-management/blob/main/modules/integration_action/README.md
---

## Integration Action

Terraform module to configure [Opsgenie Integration Action](https://registry.terraform.io/providers/opsgenie/opsgenie/latest/docs/resources/integration_action)

NOTE: your OpsGenie plan must support advanced integrations. Otherwise, you will get the following error back from the API: `Your plan does not allow saving advanced integrations.`.


## Usage

[Create Opsgenie Integration Action example](https://github.com/cloudposse/terraform-opsgenie-incident-management/tree/main/modules/integration_action/../../examples/integration_action)

```hcl
module "integration_action" {
  source  = "cloudposse/incident-management/opsgenie//modules/integration_action"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"

  integration_action = {
    integration_id = module.api_integration.api_integration_id

    create = [
      {
        name  = "Create Non-informational Alerts"
        alias = "{{title}}"
        filter = {
          type = "match-all-conditions"
          conditions = [
            {
              field          = "priority"
              not            = true
              operation      = "equals"
              expected_value = "P5"
            }
          ]
        }
      }
    ]
  }
}
```

## Inputs

**Note:** `integration_action` is a map for two reasons: 
- to be able to put whole configuration in yaml file
- variables defined with type set are not robust enough (can't set default values)

|  Name                          |  Default                          |  Description                                                                                                                    | Required |
|:-------------------------------|:---------------------------------:|:--------------------------------------------------------------------------------------------------------------------------------|:--------:|
| `integration_action`          | `{}`                              | This variable is used to configure Opsgenie Integration Action.                                                                | Yes      |


## Outputs

| Name                        | Description                                  |
|:----------------------------|:---------------------------------------------|
| `integration_action_id`    | The ID of the Opsgenie Integration Action.  |

