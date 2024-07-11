---
title: "Decide on Transactional Email (SMTP) Provider for Operational Emails"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1175650562/REFARCH-79+-+Decide+on+Transactional+Email+%28SMTP%29+Provider+for+Operational+Emails
sidebar_position: 100
refarch_id: REFARCH-79
---

# Decide on Transactional Email (SMTP) Provider for Operational Emails

## Problem
We’ll want to have an SMTP email gateway that’s used by services like Alert Manager, Sentry, Printunl, et al to send emails.

## Considered Options

#### AWS SES
Our recommended option is to provision an SES gateway using our [https://github.com/cloudposse/terraform-aws-ses](https://github.com/cloudposse/terraform-aws-ses) module for this.

It’s also worth noting is that every AWS SES starts in Sandbox. Sending emails via it (emails not verified in AWS SES) is only allowed after support requests (so requires some human intervention to automate).

SES is also only available in the following regions:

- `us-east-1`

- `us-east-2`

- `us-west-2`

- `ap-south-1`

- `ap-southeast-2`

- `eu-west-1`

- `eu-west-2`

- `sa-east-1`

This will use the vanity branded domain in [Decide on Vanity (Branded) Domain](/reference-architecture/fundamentals/design-decisions/foundational-platform/decide-on-vanity-branded-domain) if SES is used for customer-facing emails. If these are for internal domains then we can use the service discovery domains.

#### Mailgun
The other option we typically recommend is mailgun. It’s very economical and easy to integrate with. There’s also a terraform provider for managing mailgun configurations.

#### Bring-your-own
We’ll happily integrate with whatever SMTP system your company uses today.

:::caution
Gmail is not a good option because they will rate limit sending.

:::


