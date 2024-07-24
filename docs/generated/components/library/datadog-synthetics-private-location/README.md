---
title: datadog-synthetics-private-location
sidebar_label: datadog-synthetics-private-location
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/datadog-synthetics-private-location/README.md
tags: [terraform, aws, datadog-synthetics-private-location]
---

# Component: `datadog-synthetics-private-location`

This component provisions a Datadog synthetics private location on Datadog and a private location agent on EKS cluster.

Private locations allow you to monitor internal-facing applications or any private URLs that are not accessible from the
public internet.

## Usage

**Stack Level**: Regional

Use this in the catalog or use these variables to overwrite the catalog values.

```yaml
components:
  terraform:
    datadog-synthetics-private-location:
      settings:
        spacelift:
          workspace_enabled: true
      vars:
        enabled: true
        name: "datadog-synthetics-private-location"
        description: "Datadog Synthetics Private Location Agent"
        kubernetes_namespace: "monitoring"
        create_namespace: true
        # https://github.com/DataDog/helm-charts/tree/main/charts/synthetics-private-location
        repository: "https://helm.datadoghq.com"
        chart: "synthetics-private-location"
        chart_version: "0.15.15"
        timeout: 180
        wait: true
        atomic: true
        cleanup_on_fail: true
```

## Synthetics Private Location Config

```shell
docker run --rm datadog/synthetics-private-location-worker --help
```

```
The Datadog Synthetics Private Location Worker runs tests on privately accessible websites and brings results to Datadog

Access keys:
      --accessKey        Access Key for Datadog API authentication  [string]
      --secretAccessKey  Secret Access Key for Datadog API authentication  [string]
      --datadogApiKey    Datadog API key to send browser tests artifacts (e.g. screenshots)  [string]
      --privateKey       Private Key used to decrypt test configurations  [array]
      --publicKey        Public Key used by Datadog to encrypt test results. Composed of --publicKey.pem and --publicKey.fingerprint

Worker configuration:
      --site                      Datadog site (datadoghq.com, us3.datadoghq.com, datadoghq.eu or ddog-gov.com)  [string] [required] [default: "datadoghq.com"]
      --concurrency               Maximum number of tests executed in parallel  [number] [default: 10]
      --maxNumberMessagesToFetch  Maximum number of tests that can be fetched at the same time  [number] [default: 10]
      --proxyDatadog              Proxy URL used to send requests to Datadog  [string] [default: none]
      --dumpConfig                Display non-secret worker configuration parameters  [boolean]
      --enableStatusProbes        Enable the probes system for Kubernetes  [boolean] [default: false]
      --statusProbesPort          The port for the probes server to listen on  [number] [default: 8080]
      --config                    Path to JSON config file  [default: "/etc/datadog/synthetics-check-runner.json"]

Tests configuration:
      --maxTimeout            Maximum test execution duration, in milliseconds  [number] [default: 60000]
      --proxyTestRequests     Proxy URL used to send test requests  [string] [default: none]
      --proxyIgnoreSSLErrors  Discard SSL errors when using a proxy  [boolean] [default: false]
      --dnsUseHost            Use local DNS config for API tests and HTTP steps in browser tests (currently ["192.168.65.5"])  [boolean] [default: true]
      --dnsServer             DNS server IPs used in given order for API tests and HTTP steps in browser tests (--dnsServer="1.0.0.1" --dnsServer="9.9.9.9") and after local DNS config, if --dnsUseHost is present  [array] [default: ["8.8.8.8","1.1.1.1"]]

Network filtering:
      --allowedIPRanges               Grant access to IP ranges (has precedence over --blockedIPRanges)  [default: none]
      --blockedIPRanges               Deny access to IP ranges (e.g. --blockedIPRanges.4="127.0.0.0/8" --blockedIPRanges.6="::1/128")  [default: none]
      --enableDefaultBlockedIpRanges  Deny access to all reserved IP ranges, except for those explicitly set in --allowedIPRanges  [boolean] [default: false]
      --allowedDomainNames            Grant access to domain names for API tests (has precedence over --blockedDomainNames, e.g. --allowedDomainNames="*.example.com")  [array] [default: none]
      --blockedDomainNames            Deny access to domain names for API tests (e.g. --blockedDomainNames="example.org" --blockedDomainNames="*.com")  [array] [default: none]

Options:
      --enableIPv6  Use IPv6 to perform tests. (Warning: IPv6 in Docker is only supported with Linux host)  [boolean] [default: false]
      --version     Show version number  [boolean]
  -f, --logFormat   Format log output  [choices: "pretty", "pretty-compact", "json"] [default: "pretty"]
  -h, --help        Show help  [boolean]

Volumes:
    /etc/datadog/certs/  .pem certificates present in this directory will be imported and trusted as certificate authorities for API and browser tests

Environment variables:
    Command options can also be set via environment variables (DATADOG_API_KEY="...", DATADOG_WORKER_CONCURRENCY="15", DATADOG_DNS_USE_HOST="true")
    For options that accept multiple arguments, JSON string array notation should be used (DATADOG_TESTS_DNS_SERVER='["8.8.8.8", "1.1.1.1"]')

    Supported environment variables:
        DATADOG_ACCESS_KEY,
        DATADOG_API_KEY,
        DATADOG_PRIVATE_KEY,
        DATADOG_PUBLIC_KEY_FINGERPRINT,
        DATADOG_PUBLIC_KEY_PEM,
        DATADOG_SECRET_ACCESS_KEY,
        DATADOG_SITE,
        DATADOG_WORKER_CONCURRENCY,
        DATADOG_WORKER_LOG_FORMAT,
        DATADOG_WORKER_MAX_NUMBER_MESSAGES_TO_FETCH,
        DATADOG_WORKER_PROXY,
        DATADOG_TESTS_DNS_SERVER,
        DATADOG_TESTS_DNS_USE_HOST,
        DATADOG_TESTS_PROXY,
        DATADOG_TESTS_PROXY_IGNORE_SSL_ERRORS,
        DATADOG_TESTS_TIMEOUT,
        DATADOG_ALLOWED_IP_RANGES_4,
        DATADOG_ALLOWED_IP_RANGES_6,
        DATADOG_BLOCKED_IP_RANGES_4,
        DATADOG_BLOCKED_IP_RANGES_6,
        DATADOG_ENABLE_DEFAULT_WINDOWS_FIREWALL_RULES,
        DATADOG_ALLOWED_DOMAIN_NAMES,
        DATADOG_BLOCKED_DOMAIN_NAMES,
        DATADOG_WORKER_ENABLE_STATUS_PROBES,
        DATADOG_WORKER_STATUS_PROBES_PORT
```

## References

- https://docs.datadoghq.com/synthetics/private_locations
- https://docs.datadoghq.com/synthetics/private_locations/configuration/
- https://github.com/DataDog/helm-charts/tree/main/charts/synthetics-private-location
- https://github.com/DataDog/helm-charts/blob/main/charts/synthetics-private-location/values.yaml

<!-- prettier-ignore-start -->
<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- hello terraform-docs -->
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- prettier-ignore-end -->

## References

- https://docs.datadoghq.com/getting_started/synthetics/private_location
- https://docs.datadoghq.com/synthetics/private_locations/configuration
- https://registry.terraform.io/providers/DataDog/datadog/latest/docs/resources/synthetics_private_location
- https://github.com/DataDog/helm-charts/tree/main/charts/synthetics-private-location


## CHANGELOG

### PR [#814](https://github.com/cloudposse/terraform-aws-components/pull/814)

#### Possible Breaking Change

Previously this component directly created the Kubernetes namespace for the agent when `create_namespace` was set to
`true`. Now this component delegates that responsibility to the `helm-release` module, which better coordinates the
destruction of resources at destruction time (for example, ensuring that the Helm release is completely destroyed and
finalizers run before deleting the namespace).

Generally the simplest upgrade path is to destroy the Helm release, then destroy the namespace, then apply the new
configuration. Alternatively, you can use `terraform state mv` to move the existing namespace to the new Terraform
"address", which will preserve the existing deployment and reduce the possibility of the destroy failing and leaving the
Kubernetes cluster in a bad state.

