---
title: "Sign Up"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1209499827
sidebar_position: 100
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/how-to-guides/integrations/opsgenie/how-to-sign-up-for-opsgenie.md
---

# How to Sign Up for OpsGenie?

## Problem
You’ve been asked to [sign up for OpsGenie](https://www.atlassian.com/software/opsgenie/pricing), but are unsure of what plan is needed for your organization. The pricing increases depending on features, but you’re not sure what features will be required.

## Solution
[https://www.atlassian.com/software/opsgenie/pricing](https://www.atlassian.com/software/opsgenie/pricing)

:::tip
We recommend the Enterprise Plan.

:::
Some resources cannot be provisioned unless on a Standard or Enterprise plan. While our terraform modules support all plans, what we will do will be limited. Using Standard is ok to start, but we really recommend Enterprise has some more features we recommend leveraging.

### Option 1: Enterprise Plan (Recommended)
The main thing we can use from the Enterprise plan (and supported by the component) is “Service Subscriptions”.

> Opsgenie enables you to map alerts to the business services they impact and have a clear understanding of which teams need to respond and who needs to be kept up to date on the progress towards resolution. Disparate teams are notified simultaneously and presented with the tools they need to collaborate during resolution.With this, it basically means that the services we create (e.g. backend, a website, an app, a k8s deployemnt, or really any abstraction we can call a service) can be managed like this:

```
Service → Datadog alert → Opsgenie business service →  Opsgenie alert → Opsgenie incident → Team notification → Escalation
```
This entire chain can be used only in the Enterprise plan.

All of these things are only available in the Enterprise Plan: [https://www.atlassian.com/software/opsgenie/service-aware-incident-management](https://www.atlassian.com/software/opsgenie/service-aware-incident-management)

So in short, if you have 20 microservices that send metrics to Datadog, Datadog monitors send alerts to Opsgenie, Opsgenie creates alerts per service (which is your microservice). If incidents are enabled and configured, then Opsgenie creates an incident from an alert and assigns it to the team.

The last part (alert → incident → team notification → incident status page → acknowledgment → postmortem) is only in Enterprise plans.

### Option 2: Standard Plan
In Standard, all parts can be deployed and used separately, e.g.

```
Service → Datadog alert → Opsgenie alert → Team notification → Escalation
```
Or...

```
External alert → Opsgenie alert → Opsgenie incident → Team notification → Escalation
```
They don’t allow to use of Opsgenie services to create incidents and notify teams in the Standard plan. No `Opsgenie business service` involved, which is

> Opsgenie enables you to map alerts to the business services they impact and have a clear understanding of which teams need to respond and who needs to be kept up to date on the progress towards resolution. Disparate teams are notified simultaneously and presented with the tools they need to collaborate during resolution.

## Troubleshooting
<img src="/assets/refarch/image-20211124-035525.png" height="1102" width="1188" /><br/>

### Error: `You do not have the right to use Service API, Took: 0.002000, RequestId: f4550375-efa7-49bc-ac04-3a0d6709f7d1`
This is related to [https://community.atlassian.com/t5/Opsgenie-questions/Using-Incident-API-trial-account/qaq-p/1455015](https://community.atlassian.com/t5/Opsgenie-questions/Using-Incident-API-trial-account/qaq-p/1455015) for the [https://docs.opsgenie.com/docs/service-api](https://docs.opsgenie.com/docs/service-api). Upgrade the Opsgenie trial if your plan is currently on a trial.

> Service API is only available to Standard and Enterprise plans


