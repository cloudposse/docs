---
title: "Log Filtering"
---
## Datadog Log Filtering

This document presents an overview of options regarding filtering logs sent to Datadog.
### Datadog's recommended practice
Datadog positions their capability as [Logging Without Limits™](https://www.datadoghq.com/blog/logging-without-limits). They charge only [$0.10 per GB of log data ingested](https://www.datadoghq.com/pricing/?product=log-management#products) and recommend ingesting all logs, so that data is available on demand. Their more significant charge is based on the number of log events retained and the duration of the retention period (approx $1-2.50 per million events, depending on retention period).

**TL;DR** Ingest all logs, and use dynamic processing on the server side to determine which logs to process.

### Preserve All Data, Just in Case
By sending all log data to Datadog, you get 2 major benefits.

First, you can use their [Live Tail](https://docs.datadoghq.com/logs/explorer/live_tail/) feature to view the current log stream, after processing but before indexing, so that all log data, including data excluded from indexing by filters, is available for real-time troubleshooting.

Second, all logs ingested can be saved, with tags to support later filtering, to your own S3 bucket at no additional charge from Datadog. These logs can later be re-ingested (["rehydrated"](https://docs.datadoghq.com/logs/log_configuration/rehydrating)) for detailed analysis of an event, creating an historical view for on-demand retrospective analysis.
### Save Money with Server-Side Filtering
The primary log data-processing charge from Datadog is for indexing logs. By filtering logs out of indexing, you save on the (substantial) indexing and retention costs, but, as explained above, the logs remain available via your archive storage for later analysis if needed. An additional benefit of excluding logs via server-side filtering is that the filter can be easily modified or temporarily disabled during an incident to quickly provide additional information, and then restored when the incident is resolved.

- For documentation, see [Log Configuration -> Indexes -> Exclusion filters](https://docs.datadoghq.com/logs/log_configuration/indexes/#exclusion-filters)

#### Infrastructure as Code for Server-side Filtering
Datadog has moderate support for configuring server-side filtering via Terraform. There is unexplored complexity in the fact that the order of pipelines can be significant, but there is limited support for querying or managing the automatically provisioned integration pipelines. This area requires further investigation.

Meanwhile, configuration via the Datadog web UI is going to be the easiest way to begin in any case.
### Source Filtering
If you are sure you want to filter logs out at the source and not send them to Datadog, you can add filters on any application, and on the log forwarder. Filters are limited to regular expression matches, and can either exclude matches or exclude non-matches (include matches).

#### Application Log Filtering
For Kubernetes pods, you can filter out logs [via annotations](https://docs.datadoghq.com/agent/logs/advanced_log_collection?tab=kubernetes).

> To apply a specific configuration to a given container, Autodiscovery identifies containers by name, NOT image. It tries to match `<CONTAINER_IDENTIFIER>` to `.spec.containers[0].name`, not `.spec.containers[0].image`. To configure using Autodiscovery to collect container logs on a given `<CONTAINER_IDENTIFIER>` within your pod, add the following annotations to your pod’s log_processing_rules:

```yaml
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: cardpayment
spec:
  selector:
    matchLabels:
      app: cardpayment
  template:
    metadata:
      annotations:
        ad.datadoghq.com/<CONTAINER_IDENTIFIER>.logs: >-
          [{
            "source": "java",
            "service": "cardpayment",
            "log_processing_rules": [{
              "type": "exclude_at_match",
              "name": "exclude_datadoghq_users",
              "pattern": "\\w+@datadoghq.com"
            }]
          }]
      labels:
        app: cardpayment
      name: cardpayment
    spec:
      containers:
        - name: '<CONTAINER_IDENTIFIER>'
          image: cardpayment:latest
```

#### Filtering Logs via the Datadog Agent
The Datadog Agent can be configured with processing rules as well, via the `DD_LOGS_CONFIG_PROCESSING_RULES` environment variable.  Unlike the pod annotation, which only applies to the specified Docker container, rules configured at the Datadog Agent apply to all services for which the agent forwards logs.

Example (untested) entry in `values.yaml` (not stacks):

```yaml
datadog:
  envDict:
    DD_LOGS_CONFIG_PROCESSING_RULES: >-
     [{
       "type": "exclude_at_match",
       "name": "exclude_datadoghq_users",
       "pattern": "\\w+@datadoghq.com"
     }]
```
#### Filtering Logs via the Log Forwarder

In a similar fashion, the Lambda Log Forwarder can be configured to filter out logs via the `EXCLUDE_AT_MATCH` and `INCLUDE_AT_MATCH` environment variables. Unlike the other options which allow you to provide a list of rules, the Lambda only accepts a single regular expression. Also unlike the other options, backslashes do not need to be escaped in the regex string in the environment variable.

Example (untested) in the stack for `datadog-lambda-forwarder`:

```yaml
vars:
  datadog_forwarder_lambda_environment_variables:
    EXCLUDE_AT_MATCH: '\w+@datadoghq.com'
```
### Custom and Pre-defined Log Enhancement via Pipelines
Datadog supports data transformation [pipelines](https://docs.datadoghq.com/logs/log_configuration/pipelines) to transform and filter logs on the server side. They provide [numerous pre-defined pipelines](https://app.datadoghq.com/logs/pipelines/pipeline/library) (_Datadog login required_) and allow you to create your own as well. Your pipelines can extract standard or custom fields, and generate custom metrics. Custom metrics generated by logs are unaffected by index filtering. While not required, this can be used to create additional attributes used in deciding whether or not to index a log entry or not.


### Additional Resources
- [Log Configuration](https://docs.datadoghq.com/logs/log_configuration/) documentation covers pipelines, processors, log parsers, attributes and aliasing, indexing, archiving, and generating custom metrics.
- Datadog offers free online training courses. [Going Deeper with Logs Processing](https://learn.datadoghq.com/courses/going-deeper-with-logs-processing) covers pipelines, processors, log parsers, and standard attributes for log processing.

