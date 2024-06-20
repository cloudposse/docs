---
title: "How to Sign Up"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1185382459/How+to+Sign+Up+for+Spacelift
sidebar_position: 0
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/how-to-guides/integrations/spacelift/spacelift.md
---

# How to Sign Up for Spacelift

## Problem
You’ve been asked to signup for the Spacelift service and you’re not sure which plan to choose or where to go next. You have questions on pricing and want to better understand your options. You already use GitHub Actions, or some other CI/CD platform and want to understand why you need yet another platform.

## Solution

:::tip
Signup for any trial Spacelift account and it will automatically be enabled as an **Enterprise Trial**. We’ll request via our partern-channel that Spacelift bump it up to an extended **Enterprise Trial**, while you work with them to reach a fair price.

:::

### Why do we need Spacelift?
See [Use Spacelift for GitOps with Terraform](/reference-architecture/reference/adrs/use-spacelift-for-gitops-with-terraform) to learn why.

### Why do we need an Enterprise Agreement?
For Cloud Posse engagements, you’ll need to have the **Enterprise-tier** agreement which enables these features.
- **“Self-hosted private worker pools”** which will execute `terraform plan/apply` on the EC2 instances that we provision and control, not on the Spacelift cloud -- better, or required in many cases, for security and compliance.

- This is deployed to private subnets and its IPs are allowlisted in security groups so it can manage EKS clusters, helm charts, aurora/rds cluster resources (databases, users), and other private resources.

- **“Webhook-based audit logging”** which is used to send notifications from Spacelift to external systems like Datadog or Opsgenie. These notifications include audit login, the status of each stack, each run, etc., which is useful for compliance and stacks’ status visibility.

- For a full breakdown of the differences, check out the [spacelift pricing](https://spacelift.io/pricing).

This is required in order to provision any database users or schemas, manage EKS clusters on a private subnet, or in general manage any resources residing in private subnets in a VPC. The other benefit with an Enterprise Agreement is that it will fix your costs, even if you burst your Spacelift Workers. If you were on a Metered (aka “pay-as-you-go plan”), you will be charged for those bursts and that will add up to thousands per month.

The Spacelift Enterprise 30 day trial (with an option to extend it) should be signed up to take advantage of these features.

:::tip Referrals

Cloud Posse has a partnership with Spacelift that can save you cost! Please reach out to Cloud Posse for a referral.

:::

### Who should you contact regarding Spacelift contracts and pricing?

Reach out to Pawel Hawtry [pawelh@spacelift.io](mailto:pawelh@spacelift.io) and mention you are working with Cloud Posse. Alternatively, we’re happy to facilitate an introduction directly.

### What if Spacelift is too expensive?

First, make sure you understand why we chose to [Use Spacelift for GitOps with Terraform](/reference-architecture/reference/adrs/use-spacelift-for-gitops-with-terraform). DIY is non-trivial.

Spacelift wants your business and they only want happy customers. Work with them to reach a middle ground that makes everyone happy.

### Why can’t we start with an entry-level plan?

(See [How to Sign Up for Spacelift](/reference-architecture/how-to-guides/integrations/spacelift) )

- Only enterprise plans support self-hosted workers which are required in order to manage any infrastructure provisioned inside of VPCs (E.g. Databases, non-public EKS clusters, terraform provisioners, etc). Additionally, using EC2 Instance Profiles we’re able to grant the precise roles we want to give Spacelift without any hardcoded credentials.

- Only enterprise plans support fixed costs. Cloud is metered billing, which means if we scale up our workers temporarily to flush out a large queue of plans, they will charge for the additional workers on a monthly rate. They do not have the ability to disable this and it happens automatically.  Several customers have accidentally encountered _Bill Shock_ as a result of this (we got it all sorted out for them in the end!)

<img src="/assets/refarch/cleanshot-2021-11-16-at-00.24.00@2x-20211116-062545.png" height="813" width="1707" /><br/>

<img src="/assets/refarch/cleanshot-2021-11-16-at-00.21.25-20211116-062238.png" height="300" width="477" /><br/>

### Is Spacelift SOC2 Compliant?

Yes, Spacelift has SOC2 Type II certification performed by an independent external auditor who confirms the effectiveness of internal controls in terms of Spacelift security, availability, processing integrity, confidentiality, and privacy of customer data.

[https://spacelift.io/security](https://spacelift.io/security)

Spacelift’s SOC2 Type 2 report and the pentest report from April 2021 is attached below. If anyone ever has any security-related questions, they can reach out to [@Wojciech Syrkiewicz-Trepiak](mailto:wojciechs@spacelift.io), Spacelift’s security engineer. Spacelift also has D&O and Cyber & Tech Insurance in place.

Please reach out to Spacelift to request a report.

### How many runners will we need?

**TL;DR:** it really varies, but start with a minimum of 2-3.

Since Spacelift permits you to scale up for short periods of time without metering, we recommend starting with a commitment of 2-3 runners online at any time. We’ll configure your workers to autoscale up as necessary.

### Can we consolidate multiple Spacelift Organizations under one bill?

Yes! Spacelift can consolidate the billing. For example, if you have multiple GitHub Organizations, each one associated with a different Spacelift Organization, Spacelift can consolidate the invoice.

### Where do we sign up?

How you sign up depends on if you’re using GitHub or GitLab.

#### GitHub Organizations
<img src="/assets/refarch/cleanshot-2021-10-25-at-16.54.34@2x-20211025-215448.png" height="648" width="559" /><br/>

[https://spacelift.io/free-trial](https://spacelift.io/free-trial)

After signing up using your GitHub account, you should be prompted to install the Spacelift GitHub App.

Or install it by going here:

[https://github.com/apps/spacelift-io/installations/new](https://github.com/apps/spacelift-io/installations/new)

[https://github.com/apps/spacelift-io](https://github.com/apps/spacelift-io)

#### GitLab Organizations
<img src="/assets/refarch/cleanshot-2021-10-25-at-16.52.11@2x-20211025-215322.png" height="633" width="538" /><br/>

For organizations running GitLab, register with your work email address instead.

[https://spacelift.io/free-trial](https://spacelift.io/free-trial)

Once you’ve signed up for the Spacelift trial, we’ll configure GitLab as source control integration. To learn more about setting up the GitLab integration, see the [https://docs.spacelift.io/integrations/source-control/gitlab](https://docs.spacelift.io/integrations/source-control/gitlab) integration documentation.

### What if HashiCorp Decides to go the way of MongoDB and Elastic with Licensing? ... where does that put Spacelift?

Spacelift is actually using Terraform the same way GitHub Actions or GitLab uses it. Spacelift does not distribute the binary and they don't link against it. So Spacelift is no different than any other system in that respect.

Therefore, based on Spacelift’s usage pattern there should be no concern. Also, if Terraform ever becomes a tool that cannot be used in third-party automation, there is likely going to be a hard fork from the community.

## Signup Process

:::info
Sign up for Spacelift after the cold start components and `vpc` component have been provisioned in the automation account

:::

1. Sign up [https://spacelift.io/free-trial](https://spacelift.io/free-trial)

2. Install [Spacelift GitHub app](https://github.com/apps/spacelift-io/installations/new) into the customer GitHub organization

1. Once the app is installed into the customer GitHub organization, the GitHub organization admin will receive an email from Spacelift

3. Click on the link in the email from Spacelift

1. After the Spacelift app has been installed and enabled, only the integration creator (the admin of the customer GitHub org) gets administrative permissions by default, so all other users and administrators must be granted their access using a login policy.

4. Add the following login policy.

1. Click `Policies` at the top

2. Click `Add Policies`

3. Set a name like `Login Policy`

4. Change the policy type to `Login policy`

5. Copy and paste the policy below

6. Change the `user_collaborators` to the customer github org

7. Add any additional `admin_collaborators` from the Cloud Posse team

8. Add the names of the Cloud Posse `CLOUDPOSSE-CASE-SENSITIVE-TEAM-NAME` and non cloudposse `YOUR-CASE-SENSITIVE-TEAM-NAME` team names.

9. Finally, click `Create Policy`

```
package spacelift
# See https://docs.spacelift.io/concepts/policy/login-policy for implementation details.
# Note: Login policies don't affect GitHub organization or SSO admins.
# Note 2: Enabling SSO requires that all users have an IdP (G Suite) account, so we'll just use
#          GitHub authentication in the meantime while working with external collaborators.
# Map session input data to human friendly variables to use in policy evaluation
username	:= input.session.login
member_of   := input.session.teams

github_org   := input.session.member

# Define GitHub usernames of non-github_org org external collaborators with admin vs. user access
admin_collaborators := { "osterman", "aknysh", "Nuru", "nitrocode" } # case sensitive names of collaborators

user_collaborators  := { "Customer Github Org" } # case sensitive name of the github org

# Grant admin access to github_org org members in the non cloud posse case-sensitive team
# Do not use the slug here, use the name shown in github.com/org/teams
admin {
  github_org
  member_of[_] == "YOUR-CASE-SENSITIVE-TEAM-NAME"
}

# Grant admin access to github_org org members in the Cloud Posse group
# Do not use the slug here, use the name shown in github.com/org/teams
admin {
  github_org
  member_of[_] == "CLOUDPOSSE-CASE-SENSITIVE-TEAM-NAME"
}

# Grant admin access to non-github_org org accounts in the admin_collaborators set
admin {
  # not github_org
  admin_collaborators[username]
}

# Grant user access to accounts in the user_collaborators set
allow {
  # not github_org
  user_collaborators[username]
}

# Deny access to any non-github_org org accounts who aren't defined in external collaborators sets
deny {
  not github_org
  not user_collaborators[username]
  not admin_collaborators[username]
}
```

5. Verify Cloud Posse users have administrative access

6. Create an administrative api key

1. Click the three horizontal bars on the top right hand corner

2. Click `Settings`

3. Click `API KEYS`

4. Click `Add new API Key`

5. Give it a name like `Spacelift worker pool API admin key`

6. Enable `Admin`

7. Click `Add Key`

8. A file will download. Save the contents to our shared 1Password vault. This will give us the `key_secret` and the `token`.

9. Also share the 16 character string next to the name of the key which gives us the `key_id`.

:::caution
After signing up and following the above steps, let our team know what your Spacelift account slug is and we’ll get it upgraded to an Enterprise trial via our partner channels with Spacelift.

:::

