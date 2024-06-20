---
title: service
sidebar_label: service
sidebar_class_name: command
description: service
custom_edit_url: https://github.com/cloudposse/terraform-opsgenie-incident-management/blob/main/modules/service/README.md
---

## Service

Terraform module to configure [Opsgenie Service](https://registry.terraform.io/providers/opsgenie/opsgenie/latest/docs/resources/service)


## Usage

```hcl
module "service" {
  source  = "cloudposse/incident-management/opsgenie//modules/service"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"

  service = {
      name        = "frontend"
      team_id     = "..."
      description = "My company frontend service"
  }
}
```

## Inputs

**Note:** `service` is a map for two reasons: 
- to be able to put whole configuration in yaml file
- variables defined with type set are not robust enough (can't set default values)

|  Name                          |  Default                          |  Description                                                                                                                    | Required |
|:-------------------------------|:---------------------------------:|:--------------------------------------------------------------------------------------------------------------------------------|:--------:|
| `service`                      | `{}`                              | Opsgenie Service configuration                                                                              | Yes      |


## Outputs

| Name                        | Description                              |
|:----------------------------|:-----------------------------------------|
| `service_id`                | The ID of the Opsgenie Service           |
| `service_name`              | The name of the Opsgenie Service         |

