---
title: datadog-synthetics
sidebar_label: datadog-synthetics
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/datadog-synthetics/README.md
tags: [terraform, aws, datadog-synthetics]
---

# Component: `datadog-synthetics`

This component provides the ability to implement
[Datadog synthetic tests](https://docs.datadoghq.com/synthetics/guide/).

Synthetic tests allow you to observe how your systems and applications are performing using simulated requests and
actions from the AWS managed locations around the globe, and to monitor internal endpoints from
[Private Locations](https://docs.datadoghq.com/synthetics/private_locations).

## Usage

**Stack Level**: Regional

Here's an example snippet for how to use this component:

### Stack Configuration

```yaml
components:
  terraform:
    datadog-synthetics:
      metadata:
        component: "datadog-synthetics"
      settings:
        spacelift:
          workspace_enabled: true
      vars:
        enabled: true
        name: "datadog-synthetics"
        locations:
          - "all"
        # List of paths to Datadog synthetic test configurations
        synthetics_paths:
          - "catalog/synthetics/examples/*.yaml"
        synthetics_private_location_component_name: "datadog-synthetics-private-location"
        private_location_test_enabled: true
```

### Synthetics Configuration Examples

Below are examples of Datadog browser and API synthetic tests.

The synthetic tests are defined in YAML using either the
[Datadog Terraform provider](https://registry.terraform.io/providers/DataDog/datadog/latest/docs/resources/synthetics_test)
schema or the [Datadog Synthetics API](https://docs.datadoghq.com/api/latest/synthetics) schema. See the
`terraform-datadog-platform` Terraform module
[README](https://github.com/cloudposse/terraform-datadog-platform/blob/main/modules/synthetics/README.md) for more
details. We recommend using the API schema so you can more create and edit tests using the Datadog web API and then
import them into this module by downloading the test using the Datadog REST API. (See the Datadog API documentation for
the appropriate `curl` commands to use.)

```yaml
# API schema
my-browser-test:
  name: My Browser Test
  status: live
  type: browser
  config:
    request:
      method: GET
      headers: {}
      url: https://example.com/login
    setCookie: |-
      DatadogTest=true
  message: "My Browser Test Failed"
  options:
    device_ids:
      - chrome.laptop_large
      - edge.tablet
      - firefox.mobile_small
    ignoreServerCertificateError: false
    disableCors: false
    disableCsp: false
    noScreenshot: false
    tick_every: 86400
    min_failure_duration: 0
    min_location_failed: 1
    retry:
      count: 0
      interval: 300
    monitor_options:
      renotify_interval: 0
    ci:
      executionRule: non_blocking
    rumSettings:
      isEnabled: false
    enableProfiling: false
    enableSecurityTesting: false
  locations:
    - aws:us-east-1
    - aws:us-west-2

# Terraform schema
my-api-test:
  name: "API Test"
  message: "API Test Failed"
  type: api
  subtype: http
  tags:
    - "managed-by:Terraform"
  status: "live"
  request_definition:
    url: "CHANGEME"
    method: GET
  request_headers:
    Accept-Charset: "utf-8, iso-8859-1;q=0.5"
    Accept: "text/json"
  options_list:
    tick_every: 1800
    no_screenshot: false
    follow_redirects: true
    retry:
      count: 2
      interval: 10
    monitor_options:
      renotify_interval: 300
  assertion:
    - type: statusCode
      operator: is
      target: "200"
    - type: body
      operator: validatesJSONPath
      targetjsonpath:
        operator: is
        targetvalue: true
        jsonpath: foo.bar
```

These configuration examples are defined in the YAML files in the
[catalog/synthetics/examples](https://github.com/cloudposse/terraform-aws-components/tree/main/modules/datadog-synthetics/catalog/synthetics/examples)
folder.

You can use different subfolders for your use-case. For example, you can have `dev` and `prod` subfolders to define
different synthetic tests for the `dev` and `prod` environments.

Then use the `synthetic_paths` variable to point the component to the synthetic test configuration files.

The configuration files are processed and transformed in the following order:

- The `datadog-synthetics` component loads the YAML configuration files from the filesystem paths specified by the
  `synthetics_paths` variable

- Then, in the
  [synthetics](https://github.com/cloudposse/terraform-datadog-platform/blob/master/modules/synthetics/main.tf) module,
  the YAML configuration files are merged and transformed from YAML into the
  [Datadog Terraform provider](https://registry.terraform.io/providers/DataDog/datadog/latest/docs/resources/synthetics_test)
  schema

- And finally, the Datadog Terraform provider uses the
  [Datadog Synthetics API](https://docs.datadoghq.com/api/latest/synthetics) specifications to call the Datadog API and
  provision the synthetic tests

<!-- prettier-ignore-start -->
<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- hello terraform-docs -->
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- prettier-ignore-end -->

## References

- [Datadog Synthetics](https://docs.datadoghq.com/synthetics)
- [Getting Started with Synthetic Monitoring](https://docs.datadoghq.com/getting_started/synthetics)
- [Synthetic Monitoring Guides](https://docs.datadoghq.com/synthetics/guide)
- [Using Synthetic Test Monitors](https://docs.datadoghq.com/synthetics/guide/synthetic-test-monitors)
- [Create An API Test With The API](https://docs.datadoghq.com/synthetics/guide/create-api-test-with-the-api)
- [Manage Your Browser Tests Programmatically](https://docs.datadoghq.com/synthetics/guide/manage-browser-tests-through-the-api)
- [Browser Tests](https://docs.datadoghq.com/synthetics/browser_tests)
- [Synthetics API](https://docs.datadoghq.com/api/latest/synthetics)
- [Terraform resource `datadog_synthetics_test`](https://registry.terraform.io/providers/DataDog/datadog/latest/docs/resources/synthetics_test)



## CHANGELOG

### Changes approximately v1.329.0

#### API Schema accepted

Test can now be defined using the Datadog API schema, meaning that the test definition returned by

- `https://api.datadoghq.com/api/v1/synthetics/tests/api/{public_id}`
- `https://api.datadoghq.com/api/v1/synthetics/tests/browser/{public_id}`

can be directly used a map value (you still need to supply a key, though).

You can mix tests using the API schema with tests using the old Terraform schema. You could probably get away with
mixing them in the same test, but it is not recommended.

#### Default locations

Previously, the default locations for Synthetics tests were "all" public locations. Now the default is no locations, in
favor of locations being specified in each test configuration, which is more flexible. Also, since the tests are
expensive, it is better to err on the side of too few test locations than too many.

