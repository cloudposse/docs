---
title: "Monitor a new Service"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1295876536/How+to+Monitor+a+new+Service
sidebar_position: 100
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/how-to-guides/integrations/datadog/how-to-monitor-a-new-service.md
---

# How to Monitor a new Service

## Problem
When onboarding a new service we need some monitors to ensure its in a healthy status.

## Solution

:::tip
**TL;DR** Use Cluster Checks or Datadog Synthetics

:::
Depending on how the service is exposed we can use cluster checks or synthetics.

If a simple check will suffice we recommend using Cluster Checks:

- [How to Setup Datadog Cluster Checks and Network Monitors for External URLs of Applications](/reference-architecture/how-to-guides/integrations/datadog/how-to-setup-datadog-cluster-checks-and-network-monitors-for-ext)

- [Datadog Cluster Checks](/reference-architecture/components/datadog-agent/datadog-cluster-checks)

However if multiple steps (such as login) is required we recommend Datadog Synthetics:

- [How to create a Synthetic and SLO](/reference-architecture/how-to-guides/integrations/datadog/how-to-create-a-synthetic-and-slo)

These Checks are in addition to the default kubernetes checks we have that monitor for crashing pods, imagepullbackoff and other generic kubernetes issues.

## Next Steps
After setting up health check monitors we should decide if we need APM metrics for this service.

[https://docs.datadoghq.com/tracing/#send-traces-to-datadog](https://docs.datadoghq.com/tracing/#send-traces-to-datadog)

