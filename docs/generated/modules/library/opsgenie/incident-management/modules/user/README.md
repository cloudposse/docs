---
title: user
sidebar_label: user
sidebar_class_name: command
description: user
custom_edit_url: https://github.com/cloudposse/terraform-opsgenie-incident-management/blob/main/modules/user/README.md
---

## User

Terraform module to configure [Opsgenie User](https://registry.terraform.io/providers/opsgenie/opsgenie/latest/docs/resources/user)


## Usage

[Create Opsgenie User example](https://github.com/cloudposse/terraform-opsgenie-incident-management/tree/main/modules/user/../../examples/user)

```hcl
module "user" {
  source  = "cloudposse/incident-management/opsgenie//modules/user"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"

  user = {
    username  = "opsgenie-test@cloudposse.com"
    full_name = "Opsgenie Test User"
    role      = "User"
    locale    = "en_US"
    timezone  = "America/New_York"
  }
}
```

## Inputs

**Note:** `user` is a map for two reasons: 
- to be able to put whole configuration in yaml file
- variables defined with type set are not robust enough (can't set default values)

|  Name                          |  Default                          |  Description                                                                                                                    | Required |
|:-------------------------------|:---------------------------------:|:--------------------------------------------------------------------------------------------------------------------------------|:--------:|
| `user`                         | `{}`                              | Opsgenie User configuration                                                                              | Yes      |


## Outputs

| Name                        | Description                              |
|:----------------------------|:-----------------------------------------|
| `user_id`                   | The ID of the Opsgenie User              |
| `user_name`                 | The name of the Opsgenie User            |

