---
title: "Decide on the Application Service Log Destination for ECS"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1198424160/REFARCH-484+-+Decide+on+the+Application+Service+Log+Destination+for+ECS
sidebar_position: 100
refarch_id: REFARCH-484
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/fundamentals/design-decisions/foundational-platform/decide-on-the-application-service-log-destination-for-ecs.md
---

# Decide on the Application Service Log Destination for ECS

## Context and Problem Statement
Should logs be sent to datadog or log only to cloudwatch logs?

## Considered Options

### Option 1. Fluent Bit sidecar is required for ECS Fargate

> In addition to your application container, your task definition needs to specify a Fluent Bit sidecar container that’s responsible for routing logs to Datadog. AWS provides an `aws-for-fluent-bit` Docker image you can use to create the sidecar container.([source](https://www.datadoghq.com/blog/aws-fargate-monitoring-with-datadog/))

#### Pros
- Recommended by Datadog

- Works without much configuration

- Prior art for this

#### Cons
- Sidecar required

- Fargate cpu/mem requirements would go up per task

- More expensive due to fargate pricing is by cpu/mem

### Option 2. Datadog Lambda Forwarder
Apps log directly to cloudwatch log groups and the Datadog lambda forwarder would then forwards the logs

[https://github.com/DataDog/datadog-serverless-functions/tree/master/aws/logs_monitoring](https://github.com/DataDog/datadog-serverless-functions/tree/master/aws/logs_monitoring)

And we have a module for this

[https://github.com/cloudposse/terraform-aws-datadog-lambda-forwarder](https://github.com/cloudposse/terraform-aws-datadog-lambda-forwarder)

#### Pros
- Apps log to cloudwatch log groups

- if logging to a single log group per account, we can use `filter_patterns` to filter the events

- if logging to a log group per service, we can give it multiple cloudwatch log group names or deploy a separate lambda per service

- Module exposes providing your own lambda in case forking the official Datadog one is needed

- Prior art for this

#### Cons
- Previously recommended by Datadog

- Need to log to cloudwatch logs before pushing to Datadog

- Maintaining upgrades for the lambdas

- Monitoring lambdas

### Option 3. Fluentd with CloudWatch Plugin
In the future, if AWS adds a logdriver for `fluentd` without firelens (like with `splunk`), then we can forward to a fluentd aggregator without a sidecar and without logging to cloudwatch.

We could create a single service in each ecs cluster to run fluentd and the cloudwatch plugin would be able to push cloudwatch logs to datadog.

[https://hub.docker.com/r/fluent/fluentd/](https://hub.docker.com/r/fluent/fluentd/)

[https://github.com/fluent-plugins-nursery/fluent-plugin-cloudwatch-logs#in_cloudwatch_logs](https://github.com/fluent-plugins-nursery/fluent-plugin-cloudwatch-logs#in_cloudwatch_logs)

#### Pros
- More control over parsing logs

- Can output to multiple SIEMs

#### Cons
- Same cons as option 1

- Maintaining a fluentd cluster

- Monitoring a fluentd cluster

- We don’t have prior art for this.

