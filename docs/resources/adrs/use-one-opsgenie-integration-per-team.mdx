---
title: "Use One OpsGenie Integration per Team"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1233453061/Use+One+OpsGenie+Integration+per+Team
sidebar_position: 100
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/reference/adrs/use-one-opsgenie-integration-per-team.md
---

# Use One OpsGenie Integration per Team

:::info Needs Update!

The content in this ADR may be out-of-date and needing an update. For questions, please reach out to Cloud Posse

:::

## Context
OpsGenie Integrates with Datadog, on the OpsGenie Platform this creates an API key that when used, sends to that specific Integration. e.g. A Key that is used by datadog to send events to OpsGenie. Many integrations can be setup on OpsGenie, allowing Datadog to specify which integration to use. This is important because an integration on OpsGenie can be specified to handle events differently. This means datadog can send an event to `@OpsGenie-1` and its routed differently in Opsgenie than if the message contained `@OpsGenie-2`. The problem with adding more integrations, is creating them in Opsgenie can be done through terraform, but adding the generated API Key must be added to DataDog manually.

**TL;DR:** We support OpsGenie today and have a considerable investment in supporting it, but are open to implementing PagerDuty.

### OpsGenie Integration Per Team (Decided)

Create an opsgenie api integration of `type=datadog` per team which maps to a responding team in order to enable `@opsgenie-<integration>` to be inserted within a Datadog Monitor message. This will allow us to tag resources with a team and then set the message `@opsgenie-{{team.name}}` and depending on the incident rule per team, it will or will not declare an incident.

#### Pros

- Simple logic

- **This follows Datadog’s opsgenie guide** [https://docs.datadoghq.com/integrations/opsgenie/#create-acknowledge-and-close-opsgenie-alerts-from-datadog](https://docs.datadoghq.com/integrations/opsgenie/#create-acknowledge-and-close-opsgenie-alerts-from-datadog) ****

- We would have either no global alert policy or a generic one

#### Cons

- For each team, we’d have to clickops a Opsgenie integration in Datadog because Datadog API doesn’t support opsgenie integration.
(however, Only really a cold-start problem)

### One OpsGenie Integration with Global Routing Rules

We create a single opsgenie api integration of `type=datadog` which has a global alert policy per team because the alert policy cannot templatize the responder based on the incoming key value tag

#### Pros

- Single generic api integration because this will have to be clickops’ed in Datadog because of no Datadog API for opsgenie integration

- Terraform support for global alert policy per team

#### Cons

- Many global alert policies, specifically 1 per team minimum

## Decision

We have decided to go with an Integration per team. This is because it follows the recommended Datadog vs OpsGenie Integration method, it provides a clean approach to team routing, and it is hopeful that eventually the clickOps portion can be terraformed once the API is exposed.


