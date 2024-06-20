---
title: service_incident_rule
sidebar_label: service_incident_rule
sidebar_class_name: command
description: service_incident_rule
custom_edit_url: https://github.com/cloudposse/terraform-opsgenie-incident-management/blob/main/modules/service_incident_rule/README.md
---

##  Service Incident Rule

Terraform module to configure [Opsgenie Service Incident Rule](https://registry.terraform.io/providers/opsgenie/opsgenie/latest/docs/resources/service_incident_rule)


## Usage

[Create Opsgenie Team Routing Rule example](https://github.com/cloudposse/terraform-opsgenie-incident-management/tree/main/modules/service_incident_rule/../../examples/service_incident_rule)

```hcl
module "service_incident_rule" {
  source  = "cloudposse/incident-management/opsgenie//modules/service_incident_rule"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"

  service_incident_rule = {
    service_id = "..."

    incident_rule = {
      condition_match_type = "match-all"

      conditions = [
        {
          field          = "tags"
          operation      = "contains"
          expected_value = "expected1"
        }
      ]

      incident_properties = {
        message  = "This is a test message"
        priority = "P3"
        
        stakeholder_properties = {
          message = "Message for stakeholders"
          enable  = true
        }
      }
    }
  }
}
```

## Inputs

**Note:** `service_incident_rule` is a map for two reasons: 
- to be able to put whole configuration in yaml file
- variables defined with type set are not robust enough (can't set default values)

|  Name                          |  Default                          |  Description                                     | Required |
|:-------------------------------|:---------------------------------:|:-------------------------------------------------|:--------:|
| `service_incident_rule`        | `{}`                              | Opsgenie Service Incident Rule configuration     | Yes      |


## Outputs

| Name                          | Description                                    |
|:------------------------------|:-----------------------------------------------|
| `service_incident_rule_id`    | The ID of the Opsgenie Service Incident Rule   |

