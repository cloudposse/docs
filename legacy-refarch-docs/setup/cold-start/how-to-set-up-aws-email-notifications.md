---
title: "How to Set Up AWS Email Notifications"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1176371445/How+to+Set+Up+AWS+Email+Notifications
sidebar_position: 100
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/setup/cold-start/how-to-set-up-aws-email-notifications.md
---

# How to Set Up AWS Email Notifications

:::caution
Make sure to use the email address corresponding to the [Decide on Email Address Format for AWS Accounts](/reference-architecture/fundamentals/design-decisions/cold-start/decide-on-email-address-format-for-aws-accounts) ADR.

:::

There should exist an `[organization]-aws-notifications` Slack channel dedicated for emails addressed to the dedicated AWS address, e.g. `aws@[domain]`. Cloud Posse recommends using `+` addressing, such that all AWS accounts will have their account email set to be `aws+[account name]@[domain]`. Once emails addressed to `aws@[domain]` are set up to be routed to this Slack channel's email address, all emails addressed to any of the AWS accounts' emails will appear in this channel, thanks to the use of `+` addressing.

If the use of `+` addressing is not possible, a dedicated email address such as `aws.[account name]@[domain]` can be set up for each AWS account, and a routing rule for each of these addresses to the AWS Notifications Slack channel's email address can be created.

The following is an example of how to set up this channel and configure email routing to the dedicated Slack channel's email address:

1. **Create the shared Slack channel (under Slack Connect):** (see also: [How to Provision Shared Slack Channels](/reference-architecture/how-to-guides/integrations/how-to-provision-shared-slack-channels) )

<img src="/assets/refarch/image-20211016-221505.png" height="496" width="500" /><br/>

2. **Generate the Slack channel's email address (at the top of the newly-created Slack channel):**

<img src="/assets/refarch/image-20211016-221515.png" height="176" width="500" /><br/>

3. **Set up email forwarding (example: G Suite / Google Workspace) in** `Google Workspace -> Settings for Gmail -> Routing -> Recipient address map`**:**

<img src="/assets/refarch/image-20211016-221527.png" height="637" width="500" /><br/>

4. Depending on your current Slack Workspace permissions, you may need to [https://slack.com/help/articles/360053335433-Manage-incoming-emails-for-your-workspace-or-organization](https://slack.com/help/articles/360053335433-Manage-incoming-emails-for-your-workspace-or-organization) and allow incoming email


