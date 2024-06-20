---
title: "Monitors by Stage"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1201438874/How+to+Provision+and+Tune+Datadog+Monitors+by+Stage
sidebar_position: 100
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/how-to-guides/integrations/datadog/how-to-provision-and-tune-datadog-monitors-by-stage.md
---

# How to Provision and Tune Datadog Monitors by Stage

## Problem
Datadog is a powerful platform with many ways of being configured. No one size fits all. Some companies choose to run with multiple datadog organizations, while others choose to consolidate in one account. Some companies want to adjust the thresholds at a service level, while others at the stage level. Multiple configurations exist and choosing the right one depends on what you want to accomplish.

## Solution

:::tip
Provision monitors by layer and vary the configurations by stage.

:::

Monitoring happens at every layer of your infrastructure. We should strive to push as many monitors as possible to the lower levels so that the benefits are realized by all higher layers. The manner of monitoring each layer varies. For example, the _Infrastructure_ layer is best monitored using the [datadog-integration](/components/library/aws/datadog-integration/) provisioned per AWS account. While the _Application_ layer may be better suited by provisioning monitors defined within the application repo itself or using custom resources to manage the monitors via Kubernetes.

<a href="https://lucid.app/publicSegments/view/612ad71e-3a0a-4dcb-872a-f9b0bbd0f65d/image.png" target="_blank"><img src="https://lucid.app/publicSegments/view/612ad71e-3a0a-4dcb-872a-f9b0bbd0f65d/image.png" width="960px"/></a>

### Application Monitors
Application monitors should be provisioned to monitor anything not caught by the underlying layers (e.g. application-specific behavior).

See [How to Use Multiple Infrastructure Repositories with Spacelift?](/reference-architecture/how-to-guides/integrations/spacelift/how-to-use-multiple-infrastructure-repositories-with-spacelift) for one approach to manage monitors using terraform.

See [https://github.com/FairwindsOps/astro](https://github.com/FairwindsOps/astro)by Fairwinds, for a Kubernetes approach using an Operator and Custom Resources. Note, the Cloud Posse YAML format for monitors provisioned with terraform was directly inspired by `astro` and share almost the same schema.

[https://github.com/FairwindsOps/astro/blob/master/conf-example.yml](https://github.com/FairwindsOps/astro/blob/master/conf-example.yml)

### Platform Monitors by Stage
In general, we should strive for delivering platform-level monitors that apply to all services operating on the platform, rather than one-off monitors for individual applications. Of course, there will always be exceptions - just use this as a guideline.

Here’s an example of setting up alerts for a production-tier and non-production-tier.

```
components:
  terraform:
    datadog-monitor-nonprod:
      component: datadog-monitor                               # Use the shared base component for `datadog-monitor`
      settings:
        spacelift:
          workspace_enabled: true
      vars:
        secrets_store_type: SSM
        datadog_api_secret_key: datadog/dev/datadog_api_key
        datadog_app_secret_key: datadog/dev/datadog_app_key
        datadog_monitors_config_paths:
          - catalog/monitors/nonprod/*.yaml                   # Specify the path to the configs relative to the base component.
        datadog_synthetics_config_paths: []

    datadog-monitor-prod:
      component: datadog-monitor
      settings:
        spacelift:
          workspace_enabled: true
      vars:
        secrets_store_type: SSM
        datadog_api_secret_key: datadog/prod/datadog_api_key
        datadog_app_secret_key: datadog/prod/datadog_app_key
        datadog_monitors_config_paths:
          - catalog/monitors/prod/*.yaml
        datadog_synthetics_config_paths: []

```


