---
title: "Decide on Datadog Private Locations"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1223426229/REFARCH-499+-+Decide+on+Datadog+Private+Locations
sidebar_position: 100
refarch_id: REFARCH-499
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/fundamentals/design-decisions/foundational-monitoring-platform/decide-on-datadog-private-locations.md
---

# Decide on Datadog Private Locations

## Problem
Datadog Private Locations are a feature that needs to be enabled in your datadog account that allows monitoring applications that aren’t accessible to the open internet.

To enable private locations, we need to:

- Enable the feature in each datadog account.

- Deploy the Private Location Docker Image.

We can deploy the private location container to EKS. This leads to another decision: Do we deploy it once with the capability to ping the rest of the clusters' internal addresses, or do we deploy it to every cluster?

## Cost
According to [https://www.datadoghq.com/pricing/?product=synthetic-monitoring#synthetic-monitoring-is-there-any-extra-charge-for-using-private-locations](https://www.datadoghq.com/pricing/?product=synthetic-monitoring#synthetic-monitoring-is-there-any-extra-charge-for-using-private-locations), registering a new Private Location is not at an additional cost; the regular costs for synthetics still apply.

> [**Is there any extra charge for using private locations?**](https://www.datadoghq.com/pricing/?product=synthetic-monitoring#synthetic-monitoring-is-there-any-extra-charge-for-using-private-locations)
> No. There are no additional costs to set up a private location. All test runs to a private location are billed just as they are to a managed location.

## Solution

### Option 1: Enable Private Locations, and deploy to every cluster  (Recommended)

:::tip
Our Recommendation is to use Option 1 because it enables private location features and provides a consistent way to scale.

:::

:plus: Private Location Monitoring

:plus: One helm chart per cluster via a component installation

:minus: Must run an additional container per cluster

### Option 2: Don’t Use Private Locations

:plus: Ever So Slightly Cheaper (We don’t run the container)

:minus: Monitoring Only Publicly accessible services

## References

- [https://www.datadoghq.com/pricing/?product=synthetic-monitoring#synthetic-monitoring-is-there-any-extra-charge-for-using-private-locations](https://www.datadoghq.com/pricing/?product=synthetic-monitoring#synthetic-monitoring-is-there-any-extra-charge-for-using-private-locations)

- [https://docs.datadoghq.com/synthetics/private_locations/?tab=helmchart#overview](https://docs.datadoghq.com/synthetics/private_locations/?tab=helmchart#overview)


