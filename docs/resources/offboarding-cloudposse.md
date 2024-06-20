---
title: "Offboarding Cloud Posse"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1267990561/Offboarding+Cloud+Posse
sidebar_position: 100
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/reference/offboarding-cloudposse.md
---

# Offboarding Cloud Posse

### Problem
- Your company is ready to take over all operations and needs to restrict Cloud Posse’s access to mission-critical environments for regulatory compliance (e.g. for HIPAA compliance). 

- Your engagement with Cloud Posse is coming to an end and you need to shut down entirely Cloud Posse’s access to all environments or you are pausing the engagement

- Cloud Posse has access to multiple systems and you may want to restrict access accordingly.

## Solution

### AWS 

#### **Option 1:** Restrict Federated IAM Access to Some Accounts

#### **Option 2:** Restrict Federated IAM Access to a Single Account

#### **Option 3:** Disable Federated IAM Access to All Accounts

:::info
After disabling all Federated IAM access, you have the option to issue Cloud Posse team members SSO access via your own IdP.

:::

#### **Option 4**: Issue IAM User Accounts

:::caution
We strongly discourage this approach as it’s generally an anti-pattern to bypass SSO and introduces new requirements for offboarding team members. 

:::

### Customer managed IdP

For things like Okta, Workspaces, or Azure AD:
  - Remove Cloud Posse team members from your IdP.
  - Remove any test accounts that were used for evaluating teams/groups.

### GitHub

Typically customers provision a “Cloud Posse” team within their GitHub org.

#### Option 1: Revoke All Access

Revoking this team’s access from repositories should be sufficient to remove all of our access. Also, ensure that any repositories do not have Cloud Posse usernames directly added as external contributors. This happens if repositories were created by our team in your organization.

#### Option 2: Downgrade Access
Changing our team’s access to read-only will enable us to still participate in Code Reviews.

<img src="/assets/refarch/cleanshot-2022-02-25-at-17.05.51-20220225-230814.png" height="936" width="626" /><br/>

### Spacelift

Depending on how Spacelift was configured, make sure the `LOGIN` policy does not include any Cloud Posse users.

Go to `https://<your-instance>.app.spacelift.io/policies`

Then remove our team’s access or any hardcoded usernames.

Also, make sure to sign out any logged in sessions, by going to `https://<your-instance>.app.spacelift.io/settings/sessions`

<img src="/assets/refarch/cleanshot-2022-02-25-at-17.13.52-20220225-231427.png" height="370" width="1115" /><br/>

<img src="/assets/refarch/image-20220225-231603.png" height="67" width="470" /><br/>

<img src="/assets/refarch/cleanshot-2022-02-25-at-17.18.20-20220225-231906.png" height="270" width="1031" /><br/>

### Slack

:::tip Leave Channels Open
We recommend keeping open channels of communication between our teams. That way we are able to help you out in a pinch.
:::

All customer channels are managed via Slack Connect. Some channels may be owned by your team, others by our team. If you desire to close the connection, ask your Slack administrator to remove our organization from the slack connection.

See: 
- [Removing Orgs from Slack Connect](https://slack.com/help/articles/360026489273-Remove-organizations-from-a-Slack-Connect-channel-) 
- [Removing external members from channels](https://slack.com/help/articles/5682545991443-Slack-Connect--Manage-external-people-#remove-external-people)

### Datadog

Offboard any `@cloudposse.com` email addresses.

### OpsGenie

Offboard any `@cloudposse.com` email addresses.

### Customer Jira & Confluence

Some customers have added our team directly to their Atlassian products. Make sure to offboard any `@cloudposse.com` email addresses.

### 1password

1Password vaults may be shared between our teams. Sometimes customers add Cloud Posse to their vaults, other times customers were added to vaults controlled by Cloud Posse. 

At the end of an engagement, we recommend to stop sharing vaults. 

#### Customer Managed Vaults

If your company controls the vault, simply remove Cloud Posse's team access from the vault. We recommend rotating all credentials both as an exercise and as an extra precaution.


#### Cloud Posse Managed Vaults

When vaults are controlled by Cloud Posse, we require the customer to take over ownership by creating their own vault, and manually copying over the secrets.

  - Create a new vault for your team
  - Recreate all the credentials in the new vault. **We recommend rotating credentials.**
  - Share the new vault with your team
  - Request Cloud Posse destroy it's vault
