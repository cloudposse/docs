---
title: "Decide on Email Address Format for AWS Accounts"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1175846958/REFARCH-51+-+Decide+on+Email+Address+Format+for+AWS+Accounts
sidebar_position: 100
refarch_id: REFARCH-51
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/fundamentals/design-decisions/cold-start/decide-on-email-address-format-for-aws-accounts.md
---

# Decide on Email Address Format for AWS Accounts
Every AWS account needs a unique email address. Email address cannot be reused across multiple AWS accounts.

### Use Plus Addressing

We'll use `+` addressing for each account (e.g. `ops+prod@ourcompany.com`)

:::info
Office 365 has finally added support for [https://docs.microsoft.com/en-us/exchange/recipients-in-exchange-online/plus-addressing-in-exchange-online](https://docs.microsoft.com/en-us/exchange/recipients-in-exchange-online/plus-addressing-in-exchange-online).

:::

### Use Slack Email Gateway

- Create email group/alias for AWS accounts e.g. `ops@ourcompany.com`

- Ideally set up to forward to a shared slack channel like `#aws-notifications`

Follow [this guide to set up slack forwarding](/reference-architecture/setup/cold-start/how-to-set-up-aws-email-notifications/).

### Use Mailgun

Mailgun supports plus addressing and complex forwarding rules. It’s free for 5,000 emails.

### Use Google Group - Recommended

Google Groups are probably the most common solution we see. It [works very well with plus addressing](https://support.google.com/a/users/answer/9308648?hl=en).

### Use OpsGenie Email Integration

OpsGenie is nice, but it does not support plus addressing. That means we’ll need to provision one integration for each account.

### Use AWS SES with Lambda Forwarder (catch-22)

Provisioning AWS SES is nice, but we need an email address even for the root account, so it doesn’t solve the cold-start problem.

[https://github.com/cloudposse/terraform-aws-ses-lambda-forwarder](https://github.com/cloudposse/terraform-aws-ses-lambda-forwarder)


