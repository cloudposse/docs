---
title: opsgenie-team
sidebar_label: opsgenie-team
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/opsgenie-team/README.md
tags: [terraform, aws, opsgenie-team]
---

# Component: `opsgenie-team`

This component is responsible for provisioning Opsgenie teams and related services, rules, schedules.

## Usage

#### Pre-requisites

You need an API Key stored in `/opsgenie/opsgenie_api_key` of SSM, this is configurable using the
`ssm_parameter_name_format` and `ssm_path` variables.

Opsgenie is now part of Atlassian, so you need to make sure you are creating an Opsgenie API Key, which looks like
`abcdef12-3456-7890-abcd-ef0123456789` and not an Atlassian API key, which looks like

```shell
ATAfT3xFfGF0VFXAfl8EmQNPVv1Hlazp3wsJgTmM8Ph7iP-RtQyiEfw-fkDS2LvymlyUOOhc5XiSx46vQWnznCJolq-GMX4KzdvOSPhEWr-BF6LEkJQC4CSjDJv0N7d91-0gVekNmCD2kXY9haUHUSpO4H7X6QxyImUb9VmOKIWTbQi8rf4CF28=63CB21B9
```

Generate an API Key by going to Settings -> API key management on your Opsgenie control panel, which will have an
address like `https://<your-org>.app.opsgenie.com/settings/api-key-management`, and click the "Add new API key" button.
For more information, see the
[Opsgenie API key management documentation](https://support.atlassian.com/opsgenie/docs/api-key-management/).

Once you have the key, you'll need to test it with a curl to verify that you are at least on a Standard plan with
OpsGenie:

```
curl -X GET 'https://api.opsgenie.com/v2/account' \
    --header "Authorization: GenieKey $API_KEY"
```

The result should be something similar to below:

```
{
    "data": {
        "name": "opsgenie",
        "plan": {
            "maxUserCount": 1500,
            "name": "Enterprise",
     ...
}
```

If you see `Free` or `Essentials` in the plan, then you won't be able to use this component. You can see more details
here: [OpsGenie pricing/features](https://www.atlassian.com/software/opsgenie/pricing#)

#### Getting Started

**Stack Level**: Global

Here's an example snippet for how to use this component.

This component should only be applied once as the resources it creates are regional, but it works with integrations.
This is typically done via the auto or corp stack (e.g. `gbl-auto.yaml`).

```yaml
# 9-5 Mon-Fri
business_hours: &business_hours
  type: "weekday-and-time-of-day"
  restrictions:
    - start_hour: 9
      start_min: 00
      start_day: "monday"
      end_hour: 17
      end_min: 00
      end_day: "friday"

# 9-5 Every Day
waking_hours: &waking_hours
  type: "time-of-day"
  restrictions:
    - start_hour: 9
      start_min: 00
      end_hour: 17
      end_min: 00

# This is a partial incident mapping, we use this as a base to add P1 & P2 below. This is not a complete mapping as there is no P0
priority_level_to_incident: &priority_level_to_incident
  enabled: true
  type: incident
  priority: P1
  order: 1
  notify: # if omitted, this will default to the default schedule
    type: schedule
    name: default
  criteria:
    type: "match-all-conditions"
    conditions:
      - field: priority
        operation: equals
        expected_value: P0

p1: &p1_is_incident
  <<: *priority_level_to_incident
  priority: P1
  criteria:
    type: "match-all-conditions"
    conditions:
      - field: priority
        operation: equals
        expected_value: P1

p2: &p2_is_incident
  <<: *priority_level_to_incident
  priority: P2
  criteria:
    type: "match-all-conditions"
    conditions:
      - field: priority
        operation: equals
        expected_value: P2

components:
  terraform:
    # defaults
    opsgenie-team-defaults:
      metadata:
        type: abstract
        component: opsgenie-team

      vars:
        schedules:
          london_schedule:
            enabled: false
            description: "London Schedule"
            timezone: "Europe/London"

        # Routing Rules determine how alerts are routed to the team,
        # this includes priority changes, incident mappings, and schedules.
        routing_rules:
          london_schedule:
            enabled: false
            type: alert
            # https://support.atlassian.com/opsgenie/docs/supported-timezone-ids/
            timezone: Europe/London
            notify:
              type: schedule # could be escalation, could be none
              name: london_schedule
            time_restriction: *waking_hours
            criteria:
              type: "match-all-conditions"
              conditions:
                - field: priority
                  operation: greater-than
                  expected_value: P2

          # Since Incidents require a service, we create a rule for every `routing_rule` type `incident` for every service on the team.
          # This is done behind the scenes by the `opsgenie-team` component.
          # These rules below map P1 & P2 to incidents, using yaml anchors from above.
          p1: *p1_is_incident
          p2: *p2_is_incident

    # New team
    opsgenie-team-sre:
      metadata:
        type: real
        component: opsgenie-team
        inherits:
          - opsgenie-team-defaults
      vars:
        enabled: true
        name: sre

        # These members will be added with an opsgenie_user
        # To clickops members, set this key to an empty list `[]`
        members:
          - user: user@example.com
            role: owner

        escalations:
          otherteam_escalation:
            enabled: true
            name: otherteam_escalation
            description: Other team escalation
            rules:
              condition: if-not-acked
              notify_type: default
              delay: 60
              recipients:
                - type: team
                  name: otherteam

          yaep_escalation:
            enabled: true
            name: yaep_escalation
            description: Yet another escalation policy
            rules:
              condition: if-not-acked
              notify_type: default
              delay: 90
              recipients:
                - type: user
                  name: user@example.com

          schedule_escalation:
            enabled: true
            name: schedule_escalation
            description: Schedule escalation policy
            rules:
              condition: if-not-acked
              notify_type: default
              delay: 30
              recipients:
                - type: schedule
                  name: secondary_on_call
```

The API keys relating to the Opsgenie Integrations are stored in SSM Parameter Store and can be accessed via chamber.

```
AWS_PROFILE=foo chamber list opsgenie-team/<team>
```

### ClickOps Work

- After deploying the opsgenie-team component the created team will have a schedule named after the team. This is
  purposely left to be clickOps’d so the UI can be used to set who is on call, as that is the usual way (not through
  code). Additionally, we do not want a re-apply of the Terraform to delete or shuffle who is planned to be on call,
  thus we left who is on-call on a schedule out of the component.

## Known Issues

### Different API Endpoints in Use

The problem is there are 3 different api endpoints in use

- `/webapp` - the most robust - only exposed to the UI (that we've seen)
- `/v2/` - robust with some differences from `webapp`
- `/v1/` - the oldest and furthest from the live UI.

### Cannot create users

This module does not create users. Users must have already been created to be added to a team.

### Cannot Add dependent Services

- Api Currently doesn't support Multiple ServiceIds for incident Rules

### Cannot Add Stakeholders

- Track the issue: https://github.com/opsgenie/terraform-provider-opsgenie/issues/278

### No Resource to create Slack Integration

- Track the issue: https://github.com/DataDog/terraform-provider-datadog/issues/67

### Out of Date Terraform Docs

Another Problem is the terraform docs are not always up to date with the provider code.

The OpsGenie Provider uses a mix of `/v1` and `/v2`. This means there are many things you can only do from the UI.

Listed below in no particular order

- Incident Routing cannot add dependent services - in `v1` and `v2` a `service_incident_rule` object has `serviceId` as
  type string, in webapp this becomes `serviceIds` of type `list(string)`
- Opsgenie Provider appears to be inconsistent with how it uses `time_restriction`:
  - `restrictions` for type `weekday-and-time-of-day`
  - `restriction` for type `time-of-day`

Unfortunately none of this is in the terraform docs, and was found via errors and digging through source code.

Track the issue: https://github.com/opsgenie/terraform-provider-opsgenie/issues/282

### GMT Style Timezones

We recommend to use the human readable timezone such as `Europe/London`.

- Setting a schedule to a GMT-style timezone with offsets can cause inconsistent plans.

  Setting the timezone to `Etc/GMT+1` instead of `Europe/London`, will lead to permadrift as OpsGenie converts the GMT
  offsets to regional timezones at deploy-time. In the previous deploy, the GMT style get converted to
  `Atlantic/Cape_Verde`.

  ```hcl
  # module.routing["london_schedule"].module.team_routing_rule[0].opsgenie_team_routing_rule.this[0] will be updated in-place
  ~ resource "opsgenie_team_routing_rule" "this" {
          id         = "4b4c4454-8ccf-41a9-b856-02bec6419ba7"
          name       = "london_schedule"
      ~ timezone   = "Atlantic/Cape_Verde" -> "Etc/GMT+1"
          # (2 unchanged attributes hidden)
  ```

  Some GMT styles will not cause a timezone change on subsequent applies such as `Etc/GMT+8` for `Asia/Taipei`.

- If the calendar date has crossed daylight savings time, the `Etc/GMT+` GMT style will need to be updated to reflect
  the correct timezone.

Track the issue: https://github.com/opsgenie/terraform-provider-opsgenie/issues/258

<!-- prettier-ignore-start -->
<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- hello terraform-docs -->
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- prettier-ignore-end -->

## Related How-to Guides

- [How to Add Users to a Team in OpsGenie](https://docs.cloudposse.com/reference-architecture/how-to-guides/tutorials/how-to-implement-incident-management-with-opsgenie/how-to-add-users-to-a-team-in-opsgenie)
- [How to Pass Tags Along to Datadog](https://docs.cloudposse.com/reference-architecture/how-to-guides/tutorials/how-to-implement-incident-management-with-opsgenie/how-to-pass-tags-along-to-datadog)
- [How to Onboard a New Service with Datadog and OpsGenie](https://docs.cloudposse.com/reference-architecture/how-to-guides/tutorials/how-to-implement-incident-management-with-opsgenie/how-to-onboard-a-new-service-with-datadog-and-opsgenie)
- [How to Create Escalation Rules in OpsGenie](https://docs.cloudposse.com/reference-architecture/how-to-guides/tutorials/how-to-implement-incident-management-with-opsgenie/how-to-create-escalation-rules-in-opsgenie)
- [How to Setup Rotations in OpsGenie](https://docs.cloudposse.com/reference-architecture/how-to-guides/tutorials/how-to-implement-incident-management-with-opsgenie/how-to-setup-rotations-in-opsgenie)
- [How to Create New Teams in OpsGenie](https://docs.cloudposse.com/reference-architecture/how-to-guides/tutorials/how-to-implement-incident-management-with-opsgenie/how-to-create-new-teams-in-opsgenie)
- [How to Sign Up for OpsGenie?](https://docs.cloudposse.com/reference-architecture/how-to-guides/tutorials/how-to-implement-incident-management-with-opsgenie/how-to-sign-up-for-opsgenie/)
- [How to Implement Incident Management with OpsGenie](https://docs.cloudposse.com/reference-architecture/how-to-guides/tutorials/how-to-implement-incident-management-with-opsgenie)

## References

- [cloudposse/terraform-aws-components](https://github.com/cloudposse/terraform-aws-components/tree/main/modules/opsgenie-team) -
  Cloud Posse's upstream component



## CHANGELOG

### Changes in PR #889, expected Component version ~1.334.0

#### `team` replaced with `team_options`

The `team` variable has been replaced with `team_options` to reduce confusion. The component only ever creates at most
one team, with the name specified in the `name` variable. The `team` variable was introduced to provide a single object
to specify other options, but was not implemented properly.

#### Team membership now managed by this component by default

Previously, the default behavior was to not manage team membership, allowing users to be managed via the Opsgenie UI.
Now the default is to manage via the `members` input. To restore the previous behavior, set
`team_options.ignore_members` to `true`.

