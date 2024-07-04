---
title: "Decide on External Monitoring Solution"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1172078755/REFARCH-111+-+Decide+on+External+Monitoring+Solution
sidebar_position: 100
refarch_id: REFARCH-111
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/fundamentals/design-decisions/foundational-monitoring-platform/decide-on-external-monitoring-solution.md
---

# Decide on External Monitoring Solution

## Problem

We’ll want some sort of external monitoring solution, ideally provided by an external third-party SaaS.

## Solution

Use a third-party monitoring solution, ideally one that supports more advanced synthetics as well as behind-the-firewall monitoring checks.

:::tip
We recommend you stick with the synthetic monitoring provided by Datadog which supports both public and private endpoints via the private locations.

:::

|**Service** | **Pricing Page**|
| ----- | ----- |
|**Pingdom** | [https://www.pingdom.com/pricing/](https://www.pingdom.com/pricing/)|
|**UptimeRobot** | [https://uptimerobot.com/pricing/](https://uptimerobot.com/pricing/)|
|**NewRelic Synthetic Monitors** | [https://docs.newrelic.com/docs/synthetics/synthetic-monitoring/using-monitors/intro-synthetic-monitoring/#types-of-synthetic-monitors](https://docs.newrelic.com/docs/synthetics/synthetic-monitoring/using-monitors/intro-synthetic-monitoring/#types-of-synthetic-monitors)|
|**StatusCake** | [https://www.statuscake.com/pricing/](https://www.statuscake.com/pricing/)|
|**Datadog Synthetic Monitoring** | [https://www.datadoghq.com/product/synthetic-monitoring/](https://www.datadoghq.com/product/synthetic-monitoring/) <br/><br/>[https://docs.datadoghq.com/getting_started/synthetics/private_location/](https://docs.datadoghq.com/getting_started/synthetics/private_location/) <br/><br/>(We have full support for this in our [https://github.com/cloudposse/terraform-datadog-platform](https://github.com/cloudposse/terraform-datadog-platform) module)|

:::caution
 Datadog Synthetics can get very pricey

:::

