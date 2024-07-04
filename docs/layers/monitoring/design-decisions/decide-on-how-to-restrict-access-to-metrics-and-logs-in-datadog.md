---
title: "Decide on How to Restrict Access to Metrics and Logs in Datadog"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1171652763/REFARCH-294+-+Decide+on+How+to+Restrict+Access+to+Metrics+and+Logs+in+Datadog
sidebar_position: 100
refarch_id: REFARCH-294
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/fundamentals/design-decisions/foundational-monitoring-platform/decide-on-how-to-restrict-access-to-metrics-and-logs-in-datadog.md
---

# Decide on How to Restrict Access to Metrics and Logs in Datadog

## Problem
Restricting access to metrics and logs concerns organizations subject to benchmark compliance. There are a few ways this can be done with various tradeoffs.

## Solution

### Option 1: RBAC
With RBAC, Roles can be used to categorize users and define what account permissions those users have (read, modify) on resources. Any user who is associated with one or more roles receives all permissions granted by their associated roles. The more roles a user is associated with, the more access they have within a Datadog account.

[https://docs.datadoghq.com/account_management/rbac/permissions/](https://docs.datadoghq.com/account_management/rbac/permissions/)

#### Built-in Roles (Recommended)
By default, Datadog offers three roles,

- Datadog Admin

- Datadog Standard

- Datadog Read-Only

#### Custom Roles
You can create [custom roles](https://docs.datadoghq.com/account_management/rbac/?tab=datadogapplication#custom-roles) to define a better mapping between your users and their permissions.

:::info
**NOTE**
If you use a SAML identity provider, you can integrate it with Datadog for authentication, and you can map identity attributes to Datadog default and custom roles. For more information, see [Single Sign On With SAML](https://docs.datadoghq.com/account_management/saml/).

:::

:::caution
Creating and modifying custom roles is an **opt-in** Enterprise feature. Contact Datadog support to get it enabled for your account.

:::
[https://docs.datadoghq.com/account_management/rbac/?tab=datadogapplication](https://docs.datadoghq.com/account_management/rbac/?tab=datadogapplication)

### Option 2: Datadog Child Organizations

:::danger
We do not recommend this approach because you cannot do cross-account tracing. Datadog alert email notifications do not include the account information which is problematic when using multiple accounts.

:::

See [Decide on Datadog Account Strategy](/reference-architecture/fundamentals/design-decisions/foundational-monitoring-platform/decide-on-datadog-account-strategy)

## References

- [https://docs.datadoghq.com/account_management/rbac/permissions/](https://docs.datadoghq.com/account_management/rbac/permissions/)

