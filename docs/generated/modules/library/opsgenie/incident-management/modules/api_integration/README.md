---
title: api_integration
sidebar_label: api_integration
sidebar_class_name: command
description: api_integration
custom_edit_url: https://github.com/cloudposse/terraform-opsgenie-incident-management/blob/main/modules/api_integration/README.md
---

## API Integration

Terraform module to configure [Opsgenie API Integration](https://registry.terraform.io/providers/opsgenie/opsgenie/latest/docs/resources/api_integration)


## Usage

[Create Opsgenie API Integration example](https://github.com/cloudposse/terraform-opsgenie-incident-management/tree/main/modules/api_integration/../../examples/alert_policy)

```hcl
module "api_integration" {
  source  = "cloudposse/incident-management/opsgenie//modules/api_integration"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"

  api_integration = {
    name          = module.label.id
    type          = "AmazonSns"
    owner_team_id = module.team.team_id
  }
}
```

## Inputs

**Note:** `api_integration` is a map for two reasons: 
- to be able to put whole configuration in yaml file
- variables defined with type set are not robust enough (can't set default values)

|  Name                          |  Default                          |  Description                                                                                                                    | Required |
|:-------------------------------|:---------------------------------:|:--------------------------------------------------------------------------------------------------------------------------------|:--------:|
| `api_integration`              | `{}`                              | This variable is used to configure Opsgenie API Integration.                                                                    | Yes      |


## Outputs

| Name                        | Description                              |
|:----------------------------|:-----------------------------------------|
| `api_integration_api_key`   | API key of the created integration       |
| `api_integration_name`      | The name of the Opsgenie API Integration.|
| `api_integration_id`        | The ID of the Opsgenie API Integration.  |

