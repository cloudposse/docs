---
title: "Onboard a New Service"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1288601737/How+to+Onboard+a+New+Service+with+Datadog+and+OpsGenie
sidebar_position: 105
---

# How to Onboard a New Service with Datadog and OpsGenie

## Problem
When spinning up a new service you want to quickly get a set of monitors up and running on the app, even if more detailed APMs are to come. Similarly, we immediately want a particular team to be considered the app owner, who will be notified if the app has an alert.

By default, we should know if the new app is deployed and healthy, and its current load. We should also be able to quickly spin up new monitors for the application that are more specific to logs or other exposed metrics.

## Solution

:::tip
**TL;DR**

1. Tag your Application with `service` and `team`

2. Ensure the team with users exists in OpsGenie

3. Add Monitors, Synthetics and SLOs for your Application.

:::

1. Ensure the deployment location is fetching tags to datadog. This is usually in Kubernetes or an AWS Service such as ECS or Elastic Bean Stalk. Follow this guide to ensure tags are being sent to datadog. [Datadog: How to Pass Tags Along to Datadog](/reference-architecture/how-to-guides/integrations/datadog/how-to-pass-tags-along-to-datadog/).

2. Ensure that your application is deployed with the following tags:

1. **required**: `team:<owning-team>`

2. **required**: `service:<service-name>`

3. **optional**:  `app:<app-name>`
In Kubernetes this might look like:

```
[...]
metadata:
  labels:
    team: sre
    service: my-api
    app: my-app
```

3. If Tag fetching is setup (#1) and your app is tagged (#2) then the datadog side is complete (excluding additional monitors). The next step would be to ensure that a team exists in opsgenie to receive an alert. We need to ensure an opsgenie-team component instance for `<owning-team>` exists. This would be a team with `name: <owning-team>` to be set.
**If no team already exists** follow this guide to create a new opsgenie team [How to Create New Teams in OpsGenie](/reference-architecture/how-to-guides/integrations/opsgenie/how-to-create-new-teams-in-opsgenie).

4. Once a team exists we need people to respond to the alert. Follow [How to Add Users to a Team in OpsGenie](/reference-architecture/how-to-guides/integrations/opsgenie/how-to-add-users-to-a-team-in-opsgenie)  to add people to a team.

At this point the default suite of monitors will create a base system of monitoring and alerting for a new service. The default suite of monitors includes:
 - `(k8s) <stage> - ImagePullBackOff detected`
 - `(k8s) <stage> - CrashloopBackOff detected`
Which will be triggered if the app fails to pull an image or crashes on startup. The healthcheck defined in k8s will crashloop the pod if it fails (such as a `/health` on an actuator springboot application not being able to be reached.)

5. Add additional monitors!
This Guide walks through the different ways to monitor a new service [How to Monitor a new Service](/reference-architecture/how-to-guides/integrations/datadog/how-to-monitor-a-new-service)
Follow this guide to create new monitors: [datadog-monitor](/components/library/aws/datadog-monitor/)

6. _Optionally_**:** Add **SLOs** and **Synthetic Checks**! [How to create a Synthetic and SLO](/reference-architecture/how-to-guides/integrations/datadog/how-to-create-a-synthetic-and-slo)

:::info
The reason for all these steps is to set it up once, and be able to reuse the existing configuration for new services. Once this process has been ran through once, only steps **#2 (Tagging your app)**, and **#3, #4 (Opsgenie Ensuring a team exists, with users exists).** This makes the process easy to get started with new applications. Once the app is deployed you can start investigating Key Metrics you want to record for your app and start developing SLOs

:::


