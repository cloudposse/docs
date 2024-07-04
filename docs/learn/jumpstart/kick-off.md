---
title: "Kick Off"
sidebar_position: 10
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/blob/main/docs/docs/fundamentals/kick-off.md
---

# Kick Off

Every engagement has three main phases: the kickoff, the implementation, and the delivery. The kickoff is the project's first phase and is essential to hit the ground running. The kickoff is the time to get to know each other, confirm the requirements outlined in the contract, and lay out the expectations for the project.

## Preparing for the Kickoff Meeting

This document outlines what to expect from your first call with Cloud Posse. In order to make the most of this meeting, please read through this document and come prepared with questions. In particular, please review the following:

1. Identify stakeholders and establish ownership of the engagement within your Organization.
2. Read through the [Design Decisions](#review-design-decisions) and prepare questions and decisions.
3. Review the list of [Actions Items](#action-items) following this call.

## Kickoff Meeting Agenda

### Introductions

Here we will review who is on the call, what their roles are, and identify our technical point of contact at Cloud Posse. We will also review the working timezones of the teams.

### Project Overview

Cloud Posse will begin deploying your infrastructure following the [Reference Architecture](/reference-architecture/) and your team's design decisions. The Reference Architecture is a collection of best practices for building a secure, scalable, and highly available infrastructure on AWS. The Reference Architecture is a living document that is constantly evolving as we learn from our customers and the community.

We will deploy your infrastructure in _layers_. These layers are designed to manage collections of deliverables and will be a mix of generated content from a private reference, vendored Terraform from open source libraries, and any customization for your Organization. Because we are delivering an entire infrastructure repository, these initial PRs will be massive; a complete infrastructure set up requires dozens of components, each with Terraform modules, configuration, account setup, and documentation. You are absolutely welcome to follow along, but we do not intend for your team to be required to review these massive PRs. Cloud Posse internally reviews these PRs extensively to ensure that the final product works as intended.

Once we're confident that we've deployed a given layer entirely, we then schedule the [Hand-Off Calls](#handoff-calls). A handoff call is intended to explain a given topic and provide the opportunity for your team to review and provide feedback on any given layer, as well as answer other questions. Before each Hand-Off Call we will have a [Fundamental Six Pager](/reference-architecture/category/fundamentals/) that goes into detail on the subject, but we can use the handoff calls however best suites your team. These calls can be a lecture of the material from the given six pager, a demo from Cloud Posse, or an opportunity practice hands-on labs.

:::tip

If you come prepared to a Hand-Off call, we can skip the lecture and spend more time answering questions or working through hands-on labs.

:::

### Shared Customer Workshop

#### Option 1

**When:** Thursdays, 7:00-7:30A PT/ 9:00-9:30A CT/ 10:00-10:30A ET

**Who:** Customers Only

#### Option 2

**When:** Wednesdays, 1:00-1:30P PT/ 3:00-3:30P CT/ 4:00-4:30P ET

**Who:** Customers Only

This is a great opportunity to get your questions answered and to get help with your project.

### Community Office Hours

**When:** Wednesdays, 11:30a-12:30p PT/ 1:30p-2:30p CT/ 2:30p-3:30p ET

**Who:** Anyone

This is a good way to keep up with the latest developments and trends in the DevOps community.

Sign up at [cloudposse.com/office-hours](https://cloudposse.com/office-hours/)

### SweetOps Slack

If you are looking for a community of like-minded DevOps practitioners, please join the [SweetOps Slack](https://slack.sweetops.com/).

### Review [Design Decisions](/reference-architecture/fundamentals/design-decisions)

- [ ] [Decide on Namespace Abbreviation](/reference-architecture/fundamentals/design-decisions/cold-start/decide-on-namespace-abbreviation/)
- [ ] [Decide on Infrastructure Repository Name](/reference-architecture/fundamentals/design-decisions/cold-start/decide-on-infrastructure-repository-name/)
- [ ] [Decide on Email Address Format for AWS Accounts](/reference-architecture/fundamentals/design-decisions/cold-start/decide-on-email-address-format-for-aws-accounts/)
- [ ] [Decide on IdP](/reference-architecture/fundamentals/design-decisions/cold-start/decide-on-idp/)
- [ ] [Decide on IdP Integration Method](/reference-architecture/fundamentals/design-decisions/cold-start/decide-on-idp-integration)
- [ ] [Decide on Primary AWS Region and Secondary AWS Region](/reference-architecture/fundamentals/design-decisions/cold-start/decide-on-primary-aws-region/)
- [ ] [Decide on CIDR Allocation Strategy](/reference-architecture/fundamentals/design-decisions/cold-start/decide-on-cidr-allocation/)
- [ ] [Decide on Service Discovery Domain](/reference-architecture/fundamentals/design-decisions/cold-start/decide-on-service-discovery-domain/)
- [ ] [Decide on Vanity Domain](/reference-architecture/reference/adrs/jumpstart/decide-on-vanity-domain/)
- [ ] [Decide on Release Engineering Strategy](/reference-architecture/fundamentals/design-decisions/cold-start/decide-on-release-engineering-strategy/)

## Action Items

Cloud Posse will need a few subscriptions set up from you in order to deploy your infrastructure. Some of these may not apply to all engagements, but please start setting
up the relevant subscriptions now.

### 1Password

Cloud Posse will use 1Password to share secrets your team. You do not need to use 1Password internally, but Cloud Posse will need to use 1Password to transfer secrets.
You can either create your own 1Password Vault and add Cloud Posse as members or request that Cloud Posse create a temporary vault (free for you). However, if Cloud Posse creates that vault for you,
only three users can be added at a time.

**We cannot create AWS accounts until we have access to 1Password.**

### Slack

We should already be using Slack for a shared general channel between Cloud Posse and your team. However, we will need an additional channel for AWS notifications and to access AWS account setup emails. We'll also use this channel for AWS budget alerts.

- [ ] Create a new Slack channel for AWS notifications, for example `#aws-notifications`
- [ ] Invite Cloud Posse
- [ ] [Set Up AWS Email Notifications](/reference-architecture/setup/cold-start/how-to-set-up-aws-email-notifications/) with your chosen email address for each account. If you are using plus-addressing, you will only need to connect the primary email address.
- [ ] [Create a Slack Webhook for that same channel](https://api.slack.com/messaging/webhooks). This is required to enable Budget alerts in Slack. Please share the Webhook URL and the final name of the Slack channel with Cloud Posse.

### AWS Organization (root account)

We will be launching a new AWS Organization from a single root account. Cloud Posse will be terraforming your entire organization, creating 12-plus accounts, and doing everything from the ground up. We're responsible for configuring SSO, fine-grained IAM roles, and more. We'll need a net-new Organization, so we cannot jeopardize any of your current operations.

Please create a new AWS root account and add the root credentials to 1Password. Cloud Posse will take it from there.

### GitHub

Please create a new repository in your GitHub organization and grant the Cloud Posse team access. We will need GitHub access to create your Infrastructure as Code repository.

#### Atmos Component Updater Requirements

Cloud Posse will deploy a GitHub Action that will automatically suggest pull requests in your new repository.
To do so, we need to create and install a GitHub App and allow GitHub Actions to create and approve pull requests within your GitHub Organization.
For more on the Atmos Component Updater, see [atmos.tools](https://atmos.tools/integrations/github-actions/component-updater).

- [ ] Create and install a GitHub App for Atmos

1. Create a new GitHub App
2. Name this new app whatever you prefer. For example, `Atmos Component Updater`.
3. List a Homepage URL of your choosing. This is required by GitHub, but you can use any URL. For example use our documentation page: `https://atmos.tools/integrations/github-actions/component-updater/`
4. (Optional) Add an icon for your new app (example provided below)

<details>
<summary>Feel free to download and use our Atmos icon with your GitHub App!</summary>

![App Icon](/assets/refarch/github-app-icon.png)

</details>

5. Assign only the following Repository permissions:

```diff
+ Contents: Read and write
+ Pull Requests: Read and write
+ Metadata: Read-only
```

6. Generate a new private key [following the GitHub documentation](https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/managing-private-keys-for-github-apps#generating-private-keys).
7. Share both the App ID and the new private key with Cloud Posse in 1Password

- [ ] Allow GitHub Actions to create and approve pull requests

1. Go to `https://github.com/organizations/YOUR_ORG/settings/actions`
2. Check "Allow GitHub Actions to create and approve pull requests"

- [ ] Create `atmos` GitHub Environment

:::tip Optional

If you grant Cloud Posse `admin` in your new infrastructure repository, we will do this for you.

:::

We recommend creating a new GitHub environment for Atmos. With environments, the Atmos Component Updater workflow will be required to follow any branch protection rules before running or accessing the environment's secrets. Plus, GitHub natively organizes these Deployments separately in the GitHub UI.

1. Open "Settings" for your repository
1. Navigate to "Environments"
1. Select "New environment"
1. Name the new environment, "atmos".
1. In the drop-down next to "Deployment branches and tags", select "Protected branches only"
1. In "Environment secrets", create the two required secrets for App ID and App Private Key created above and in 1Password. We will pull these secrets from GitHub Actions with `secrets.ATMOS_APP_ID` and `secrets.ATMOS_PRIVATE_KEY` respectively.

#### GitHub Enterprise

If you are deploying Release Engineering with Cloud Posse, we will also need a GitHub Enterprise subscription. GitHub Enterprise is required to support native approval gates on deployments to environments.

### AWS IAM Identity Center (AWS SSO)

In order connect your chosen IdP to AWS IAM Identity Center (AWS SSO), we will to configure your provider and create a metadata file. Please follow the relevant linked guide and follow the steps for the Identity Provider. All steps in AWS will be handled by Cloud Posse.

Please also provision a single test user in your IdP for Cloud Posse to use for testing and add those user credentials to 1Password.

- [GSuite](https://aws.amazon.com/blogs/security/how-to-use-g-suite-as-external-identity-provider-aws-sso/): Follow the "Google Workspace SAML application setup" steps only. Cloud Posse will handle the rest.
- [Office 365](/reference-architecture/how-to-guides/integrations/how-to-setup-office-365-aws-sso/)
- [JumpCloud](https://jumpcloud.com/support/integrate-with-aws-iam-identity-center)
- [Other AWS supported IdPs: Azure AD, CyberArk, Okta, OneLogin, Ping Identity](https://docs.aws.amazon.com/singlesignon/latest/userguide/supported-idps.html)

:::caution

GSuite does not automatically sync Users and Groups with AWS Identity Center without additional configuration! If using GSuite as an IdP, considering deploying the [ssosync tool](https://github.com/awslabs/ssosync).

:::

:::tip Integrating JumpCloud with AWS IAM Identity Center

The official AWS documentation for setting up JumpCloud with AWS IAM Identity Center is not accurate. Instead, please refer to the [JumpCloud official documentation](https://jumpcloud.com/support/integrate-with-aws-iam-identity-center)

:::

### AWS SAML

If deploying AWS SAML as an alternative to AWS SSO, we will need a separate configuration and metadata file. Again, please refer to the relevant linked guide.

- [GSuite](https://aws.amazon.com/blogs/desktop-and-application-streaming/setting-up-g-suite-saml-2-0-federation-with-amazon-appstream-2-0/): Follow Steps 1 through 7. This document refers to Appstream, but the process will be the same for AWS.
- [Office 365](/reference-architecture/how-to-guides/integrations/how-to-setup-saml-login-to-aws-from-office-365/)
- [JumpCloud](https://support.jumpcloud.com/support/s/article/getting-started-applications-saml-sso2)
- [Okta](https://help.okta.com/en-us/Content/Topics/DeploymentGuides/AWS/aws-configure-identity-provider.htm)

### Requirements for Purchasing Domains

If we plan to use the `core-dns` account to register domains, we will need to add a credit card directly to that individual account. When the account is ready, please add a credit card to the `core-dns` account following the [AWS documentation](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/manage-cc.html#Add-cc).

### Spacelift

If deploying Spacelift, we will need a Spacelift subscription. Please see [How to Sign Up for Spacelift](/reference-architecture/how-to-guides/integrations/spacelift/). This document answers many common questions and describes the signup process step-by-step.

Cloud Posse will need "admin" access for Spacelift to deploy all resources.

### Datadog

Sign up for Datadog following the [How to Sign Up for Datadog?](/reference-architecture/how-to-guides/integrations/datadog/how-to-sign-up-for-datadog/) documentation.

Cloud Posse will need "admin" access for Datadog as well to complete the Datadog setup.

### OpsGenie

Sign up for OpsGenie following the [How to Sign Up for OpsGenie?](/reference-architecture/how-to-guides/tutorials/how-to-implement-incident-management-with-opsgenie/how-to-sign-up-for-opsgenie/) documentation.

### Self Hosted Github Runners on EKS

If you are deploying the Actions Runner Controller solution for Self-Hosted Github Runners, please generate the required secrets following the
[GitHub Action Runner Controller setup docs](/reference-architecture/setup/github-arc/#requirements).

Feel free to store these secrets in 1Password if you do not have AWS access yet. Cloud Posse can complete the setup from there.

### Self Hosted Github Runners with Philips Labs (ECS)

If you have chosen ECS as a platform, we recommend deploying Philips Labs GitHub Action Runners. Please read through the [Philips Labs GitHub Action Runners Setup Requirements](/reference-architecture/setup/philips-labs-github-runners/#requirements).

In particular, we will need a new GitHub App including a Private Key, an App ID, and an App Installation ID. Please store these secrets in 1Password.

### Release Engineering

If we are deploying release engineering as part of the engagement, we will need a few additional items from your team.

- [ ] [Enable GitHub Actions for your GitHub Organization](https://docs.github.com/en/organizations/managing-organization-settings/disabling-or-limiting-github-actions-for-your-organization).
- [ ] [Allow access via fine-grained personal access tokens for your GitHub Organization](https://docs.github.com/en/organizations/managing-programmatic-access-to-your-organization/setting-a-personal-access-token-policy-for-your-organization#restricting-access-by-fine-grained-personal-access-tokens).
- [ ] Create an empty `example-app` private repository in your Organization. We'll deploy an example for release engineering here.

#### PATs for ECS with `ecspresso`

1. Create one fine-grained PAT with the following permission. Please see [Creating a fine-grained personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-fine-grained-personal-access-token)

This PAT needs read access to your `infrastructure` repository:

```diff
Repository
+ Contents: Read-only
+ Metadata: Read-only
```

2. Save the new fine-grained PAT as a GitHub environment secret in the new `example-app` private repository in your Organization.

#### PATs for EKS with ArgoCD

ArgoCD requires a number of PATs. Please see [How to set up Authorization for ArgoCD with GitHub PATs](/reference-architecture/how-to-guides/integrations/argocd/pats)

## Handoff Calls

Generally, expect to schedule the following Handoff calls. These are subject to change and should be adaptable to fit your individual engagement.

1. [Kick Off](/reference-architecture/fundamentals/kick-off/)
2. [Introduction to Toolset](/reference-architecture/fundamentals)
3. [Identity and Authentication](/reference-architecture/fundamentals/iam-identity/)
4. [Component Development](/reference-architecture/fundamentals/component-development/)
5. [Account Management](/reference-architecture/fundamentals/account-management/)
6. [Network and DNS](/reference-architecture/fundamentals/network-and-dns/)
7. [Spacelift](/reference-architecture/fundamentals/spacelift/) or [GitOps](/reference-architecture/fundamentals/gitops/)
8. [ECS](/reference-architecture/fundamentals/ecs/) or [EKS](/reference-architecture/fundamentals/eks/)
9. [Monitoring](/reference-architecture/fundamentals/monitoring/) and [Alerting](/reference-architecture/fundamentals/alerting)
10. [Release Engineering](/reference-architecture/fundamentals/release-engineering/)
11. Final Call (Sign-off)

## How to Succeed

Cloud Posse has noticed several patterns that lead to successful projects.

### Come Prepared

Review six pagers and documentation before Hand-Off calls. This will help you to know what questions need to be asked. Coming unprepared will lead to a lot of questions and back-and-forth. This will slow down material resulting in less time for new material.

### Take Initiative

The most successful customers take initiative to make customizations to their Reference Architecture. This is a great way to make the Reference Architecture your own. It also helps to build a deeper understanding of the Reference Architecture and how it works.

### Cameras On

We recommend that all participants have their cameras on. This helps to build trust and rapport. It also helps to keep everyone engaged and focused. This also lets us gage how everyone is understanding the material. If you are having trouble understanding something, please ask questions.

### Ask Questions

We encourage you to ask questions. We want to make sure that everyone understands the material. We also want to make sure that we are providing the right level of detail. Our meetings are intended to be interactive and encourage conversation. Please feel free to interject at any time if you have a question or a comment to add to the discussion.

## Get Support

See [Support](/reference-architecture/support/)

### Slack

If you need help, please ask in your team's Cloud Posse channel, for example: `#acme-general`. This helps avoid DMs (siloed and repeated information) and keeps the conversation in the open. Never hesitate to `@` a team member if you need help. We are here to help you.

You can also reach out to our community with our [SweetOps Slack community](#sweetops-slack).

### Office Hours

Both the [Shared Customer Workshops](#shared-customer-workshop) and [Community Office Hours](#community-office-hours) are great opportunities to ask questions and get help.

### Documentation

You can always find how-to guides, design decisions, and other helpful pages at [docs.cloudposse.com](/)

## FAQ

### What is the difference between a Service Discovery Domain and a Vanity Domain?

This is an extremely common question. Please see [What is the difference between a Vanity and a Service Domain?](/reference-architecture/fundamentals/network-and-dns/#what-is-the-difference-between-a-vanity-and-a-service-domain)

### Do we have to use 1Password?

Yes, Cloud Posse only uses 1Password to share secrets. You do not need to use 1Password internally, but Cloud Posse will need to use 1Password to transfer secrets to your team. You can either create your own 1Password Vault and add Cloud Posse as members or request that Cloud Posse create a temporary vault (free for you).

### Do we have to create a new Organization?

Yes! We need this single root account to start a new AWS Organization. Cloud Posse will be terraforming your entire organization, creating 12-plus accounts, and doing everything from the ground up. We're responsible for configuring SSO, fine-grained IAM roles, and more. We'll need a net-new Organization, so we cannot jeopardize any of your current operations.

Once created, we will invite your team to join the new Organization.

### How many email addresses do we need to create?

Only one email with `+` addressing is required. This email will be used to create your AWS accounts. For example, `aws+%s@acme.com`.

### What is plus email addressing?

Plus email addressing, also known as plus addressing or subaddressing, is a feature offered by some email providers that allows users to create multiple variations of their email address by adding a "+" sign and a unique identifier after their username and before the "@" symbol.

For example, if the email address is "john.doe@example.com", a user can create variations such as "john.doe+newsletter@example.com" or "john.doe+work@example.com". Emails sent to these variations will still be delivered to the original email address, but the unique identifier can be used to filter or organize incoming emails.

### How can we track progress?

We send status updates on Fridays via Slack! Or feel free to reach out anytime for an update.

### Why are the initial Pull Requests so large?

The reason that these PRs are so large is because we are generating content for your entire infrastructure repository.
A complete infrastructure set up requires dozens of components, each with Terraform modules, configuration, account setup, and documentation.

We've organized these full infrastructure configurations into "layers", which generally reflect the topics of the handoff calls.
Specifically, these layers are typically: baseline, accounts, identity, network, spacelift, eks, monitoring, and data, as well as a few
miscellaneous additions for smaller addons.

In order to deploy any given layer, we must create all content for that given layer. For example, eks adds 200+ files.
These are all required to be able to deploy EKS, so we cannot make this PR smaller. However, as the foundation is built out,
these PRs will naturally become small, as additional layers have fewer requirements.

Regarding your team's internal review, we do not intend for your team to be required to review these massive PRs.
Cloud Posse internally reviews these PRs extensively to ensure that the final product works as intended. Once we're
confident that we've deployed a given layer entirely, then we schedule the handoff calls. A handoff call is intended
to explain a given topic and provide the opportunity for your team to review and provide feedback on any given layer,
as well as answer other questions.

### How can we customize our architecture?

Customizations are out of scope typically, but we can assess each on a case-by-case basis.
You will learn your environment and be confident to make customizations on your own.
Often we can deploy an example of the customization, but it's up to you to implement the full deployment

### What if we need something that is out of scope of the SOW?

That will require a change order or adding another SOW for Professional services. Please reach out to Erik.