---
title: "Shared Slack Channels"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1170636836/How+to+Provision+Shared+Slack+Channels
sidebar_position: 100
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/how-to-guides/integrations/how-to-provision-shared-slack-channels.md
---

# How to Provision Shared Slack Channels

## Problem

Collaborating effectively between teams requires rapid back and forth communication. Email threads grow unwieldy and adding members to threads so they get all the context is difficult. Email as a medium is in general more insecure (e.g. more easily susceptible to phishing attacks). Email forums are for long-form communication, not the sort we’re accustomed to when needing to get quick answers.

## Solution

Slack supports sharing slack channels between slack teams (organizations) using what they call _Slack Connect_. Each organization gets to manage its side of the slack channel, including what to call the slack channel and enforce policies.

## Slack Connect Documentation

The official Slack Connect documentation: [https://slack.com/help/articles/115004151203-A-guide-to-Slack-Connect](https://slack.com/help/articles/115004151203-A-guide-to-Slack-Connect)

## Step by Step Instructions

1. Create a new Slack Channel as you would normally

<img src="/assets/refarch/cleanshot-2021-10-08-at-16.33.32@2x-20211008-213412.png" height="132" width="484" /><br/>

2. Give it a name, usually of the partner, customer or vendor, followed by `-general` since there may be future channels shared down the road. After clicking the “share outside ...” checkbox, the title of the dialg changes to “Slack Connect” which what Slack calls shared channels.

**NOTE**: all members can rename the channel on their end without affecting the local name of the channel. This means you should name the channel following your organization’s conventions.

<img src="/assets/refarch/cleanshot-2021-10-08-at-16.34.34@2x-20211008-213501.png" height="442" width="452" /><br/>

3. Proceed by clicking Next. Then you’re prompted to share the channel. There are (2) ways to do this: either by clicking the “copy share link” option or by entering in the email address of _anyone_ from the other organization. The other organization’s admins will then be prompted to accept the invitation.

<img src="/assets/refarch/cleanshot-2021-10-08-at-16.36.32@2x-20211008-213649.png" height="414" width="453" /><br/>

Then you’ll see a notice like this from the Slackbot.

<img src="/assets/refarch/cleanshot-2021-10-08-at-16.38.54@2x-20211008-213858.png" height="102" width="605" /><br/>

4. After the invitation is accepted by the other organization, the inviting organization may need to re-confirm the connect request. This may appear as a notice from the `Slackbot` to the slack admins.

<img src="/assets/refarch/cleanshot-2021-10-08-at-16.40.52@2x-20211008-214144.png" height="267" width="677" /><br/>

5. Once the connection is established, any members that exist in the channel can chat publicly or via direct message (DMs).

## Managing Slack Connections

You can accept/decline slack connections from here.

<img src="/assets/refarch/cleanshot-2021-10-28-at-09.45.23@2x-20211028-144708.png" height="512" width="994" /><br/>

