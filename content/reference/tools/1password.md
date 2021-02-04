---
title: "1Password for Teams"
description: "1Password for Teams is a the best solution for securely managing shared secrets in a corporate setting."
tags:
- password management
- security
- tools
---
The [1Password for Teams](https://1password.com/teams/) product by AgileBits is argubably the most popular SaaS-based password management tool. In our opinion, it offers a better user experience over apps like LastPass as well as provides integration with [Duo](https://duo.com/docs/1password) and [Slack](https://support.1password.com/slack/) for real-time activity notifications.

# Best Practices

Here are some of our recommended practices for working with 1Password. If your organization choses an alternative password management solution, we recommend implementing compensating controls.

## Enable Real-time Slack Notifications

With real-time slack notifications, you'll be able to monitor logins for anomalies.

![Real-time Slack Notifications](/assets/1password-e3bc9e9c.png)

## Duo Integration for MFA

Leverage Duo push notifications for MFA. With Duo, you can do full-on geofencing to ensure logins do not come from untrusted locations.

![Duo Push Notifications](/assets/1password-57e89599.png)

## Create Role-based Teams

Define teams in terms of roles (E.g. `production-admin`, `staging-admin`, `dns`, `finance`, etc).

## AWS Master Credentials

We use 1Password to store the AWS Master Account "root" credentials. Share OTP (MFA) codes with trusted admins.

![1Password MFA Tokens](/assets/1password-ca184eb3.png)
