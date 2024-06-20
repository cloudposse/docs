---
title: "Monitoring"
sidebar_class_name: hidden
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/blob/main/docs/docs/fundamentals/monitoring.md
---

# Monitoring

Monitoring is a key component of any production system. It is important to have visibility into the health of your system and to be able to react to issues before they become problems.

import ReactPlayer from 'react-player';

<ReactPlayer controls url='https://docs.cloudposse.com/assets/refarch/handoffs/monitoring.mp4' />

## The Problem

Monitoring is a difficult problem to solve. There are many different tools and services that can be used to monitor your system. It is important to have a consistent approach to monitoring that can be applied across all of your systems.

There is often a tradeoff between the cost of monitoring and the value it provides. It is important to have a monitoring solution that is cost effective and provides value to your organization. Another problem is when monitoring is configured incorrectly and causes more problems than it solves, usually seen through ignored alerts or no alerts at all.

## Our Solution

We have developed a set of Terraform modules that can be used to deploy a monitoring solution for your system. These modules are designed to be used with Datadog. Datadog is a monitoring service that provides a wide range of features and integrations with other services.

We have broken down the monitoring solution into several components to make it easier to deploy and manage.

### Implementation

#### Foundation
- [`datadog-configuration`](/components/library/aws/datadog-configuration/): This is a **utility** component. This component expects Datadog API and APP keys to be stored in SSM or ASM, it then copies the keys to SSM/ASM of each account this component is deployed to. This is for several reasons:
  1. Keys can be easily rotated from one place
  2. Keys can be set for a group and then copied to all accounts in that group, meaning you could have a pair of api keys and app keys for production accounts and another set for non-production accounts.
  This component is **required** for all other components to work. As it also stores information about your Datadog account, which other components will use, such as your Datadog site url, along with providing an easy interface for other components to configure the Datadog provider.
- [`datadog-integration`](/components/library/aws/datadog-integration/): This component is the core component binding Datadog to AWS, this component is deployed to every account and sets up all the Datadog Integration tiles with AWS. This is what provides the majority of your metrics to AWS!
- [`datadog-lambda-forwarder`](/components/library/aws/datadog-lambda-forwarder/): This component is an AWS Lambda function that ships logs from AWS to Datadog. Details of it can be found [here](https://docs.datadoghq.com/logs/guide/forwarder/?tab=terraform)
- [`datadog-monitor`](/components/library/aws/datadog-monitor/): This component deploys monitors via yaml configuration. When you [vendor](https://atmos.tools/cli/commands/vendor/usage/#docusaurus_skipToContent_fallback) in this component you will find [our catalog of pre-built monitors](https://github.com/cloudposse/terraform-datadog-platform/tree/main/catalog/monitors). We deploy this component to every account, our monitors have Terraform interpolation to allow you to set the thresholds for each monitor. This allows you to set different thresholds per stage using the same monitors but different configurations using familiar atmos inheritance.

#### EKS
- [`datadog-agent`](/components/library/aws/eks/datadog-agent/): This component deploys the Datadog agent on EKS, it also deploys the [Datadog Cluster Agent](https://docs.datadoghq.com/agent/cluster_agent/), the agent is a daemonset that runs on every node in your cluster (with the exception of fargate (serverless) nodes). This component handles sending Kubernetes metrics, logs, and events to Datadog. This component also can deploy the [Datadog Cluster Checks](https://docs.datadoghq.com/containers/cluster_agent/clusterchecks/) which are a way to run checks on your cluster from within the cluster itself, this is often a cheaper way than [Synthetic Monitoring](https://docs.datadoghq.com/synthetics/) to monitor services in your cluster.
- [`datadog-private-location-eks`](/components/library/aws/datadog-synthetics-private-location/): This component deploys a private location for [Synthetic Monitoring](https://docs.datadoghq.com/synthetics/) to your EKS cluster. This allows synthetic checks to run even inside a private cluster.

#### ECS
- [`ecs-service`](/components/library/aws/ecs-service/): This component contains variables that enable Datadog integration with ECS. For more information on how to deploy a service to ecs, see the [ecs-service](/components/library/aws/ecs-service/) component, specifically the [`datadog_agent_sidecar_enabled`](/components/library/aws/ecs-service/#input_datadog_agent_sidecar_enabled) variable.
- [`datadog-private-location-ecs`](/components/library/aws/datadog-private-location-ecs/): This component deploys a private location for [Synthetic Monitoring](https://docs.datadoghq.com/synthetics/) to your ECS cluster. This allows synthetic checks to run against your ECS cluster.

#### Additional
- [`datadog-logs-archive`](/components/library/aws/datadog-logs-archive/): This component creates a single [log archive](https://docs.datadoghq.com/logs/log_configuration/archives/?tab=awss3) pipeline for each AWS account. Using this component you can setup [multiple logs archive rules](https://docs.datadoghq.com/logs/log_configuration/archives/?tab=awss3#multiple-archives).
- [`datadog-synthetics`](/components/library/aws/datadog-synthetics/): This component deploys Datadog synthetic checks, which are external health checks for your services, similar to [Pingdom](https://www.pingdom.com/).

## References
- [How to Monitor a new Service](/reference-architecture/how-to-guides/tutorials/how-to-implement-sre-with-Datadog/how-to-monitor-a-new-service/)
- [How to Provision and Tune Datadog Monitors by Stage](/reference-architecture/how-to-guides/tutorials/how-to-provision-and-tune-Datadog-monitors-by-stage/)
- [How to create a Synthetic and SLO](/reference-architecture/how-to-guides/tutorials/how-to-implement-sre-with-Datadog/how-to-create-a-synthetic-and-slo/)
- [How to set up Datadog Cluster Checks and Network Monitors for External URLs of Applications](/reference-architecture/how-to-guides/tutorials/how-to-implement-sre-with-Datadog/how-to-setup-Datadog-cluster-checks-and-network-monitors-for-ext/)
- [How to Sign Up for Datadog?](/reference-architecture/how-to-guides/tutorials/how-to-sign-up-for-Datadog/)
- [How to use Datadog Metrics for Horizontal Pod Autoscaling (HPA)](/reference-architecture/how-to-guides/tutorials/how-to-use-Datadog-metrics-for-horizontal-pod-autoscaling-hpa/)

## FAQ

### How do I add a new monitor?

The easiest way to get started with an IaC monitor is to create it by hand in Datadog! While this may seem counterintuitive, seeing live graphs of your data and being able to view available metrics makes it much easier to figure out what is really important to look at.

Once you have a monitor configured in Datadog, you can export it to JSON, convert it to YAML, and then add it to your catalog of monitors.

Don't forget to replace hardcoded variables with Terraform variables or Datadog variables, as both interpolations will work.

### What is Datadog Interpolation vs Terraform Interpolation?
When looking at a Datadog monitor, anything with `${foo}` is Terraform interpolation; this will be substituted before being sent to Datadog.
`{{bar}}` is Datadog interpolation. This will be used by datadog when **the event comes in**. This is useful for things like tags where you want to tag the event with the name of the cluster, but you don't know the name of the cluster when you create the monitor.

### I'm not receiving the metrics I need, what do I do?
First off, we need to figure out where **should** the metrics be coming from.

If you are trying to receive metrics or logs from an EKS deployment or service, check if the [`datadog-agent`](/components/library/aws/eks/Datadog-agent/) is deployed and its logs look healthy.

If you are trying to receive metrics or logs from an ECS service, check the datadog agent sidecar container is deployed to your [`ecs-service`](/components/library/aws/ecs-service/).

If you are trying to receive metrics from an AWS Service, first check if the [Datadog AWS Integration](https://app.datadoghq.com/integrations/amazon-web-services) is deployed via [`datadog-integration`](/components/library/aws/datadog-integration/) and that the tile is working. Then check if the Datadog AWS Integration is enabled for the service you are trying to monitor. You can often find the metric is under the integration tiles' **metrics** tab. If it is enabled and working and you are not receiving metrics, check the integration role has the right permissions.

If you are trying to receive logs from an AWS Service, check the [`datadog-lambda-forwarder`](/components/library/aws/datadog-lambda-forwarder/) is deployed and working
