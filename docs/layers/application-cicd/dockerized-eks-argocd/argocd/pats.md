---
title: "Authorization (PAT)"
sidebar_position: 20
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/how-to-guides/integrations/argocd/pats.md
  - argocd
  - github
  - eks
  - pat
---

# How to set up Authorization for ArgoCD with GitHub PATs

:::tip Fine-grained Personal Access Tokens (PAT)

Fine-grained PATs are preferred to classic PATs. All PATs except the Notifications GitHub PAT will be fine-grained PATs. See [Managing your personal access tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens).

:::

## Deployment

The deployment process for ArgoCD includes setting up access tokens for a number of responsibilities. We will need to create the desire state repositories with necessary access, create Webhooks for these repos, grant the app in the EKS cluster permission to send notifications, and grant access for GitHub workflows.

### 1. Establish a Bot User

We deploy a number of GitHub Personal Access Tokens (PATs) as part of the EKS with ArgoCD application. By default each PAT is given the least-access required for the given job.

Each one of these PATs will be associated with a given user. We recommend creating or using an existing "bot" user. For example, at Cloud Posse we have the "cloudpossebot" GitHub user. This user has its own email address and GitHub account, is accessible from our internal 1Password vault for all privileged users, and has all access keys and tokens stored with it in 1Password.

This bot user will need permission to manage a few repositories in your Organization. If you wish to simplify deployment, you can grant this user permission to create repositories. See (Create Permission for the Bot User)[#Create Permission for the Bot User].

Use this bot user for all access tokens in the remainder of this guide.

### 2. Create ArgoCD GitHub Repositories

Create the two required ArgoCD GitHub repos:

- [acme/argocd-deploy-non-prod](https://github.com/acme/argocd-deploy-non-prod)
- [acme/argocd-deploy-prod](https://github.com/acme/argocd-deploy-prod)

Then grant the bot user `Admin` access to these two repositories.

### 3. Create the first GitHub PAT

In order for Terraform to manage these two GitHub repositories for ArgoCD, we must deploy our first GitHub PAT ([follow this manual to create a PAT](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)).


:::info Token Naming Convention

All tokens created in this setup guide use a Cloud Posse naming convention. If a different pattern makes more sense for your organization, feel free to change it up! See [FAQ: What is the Cloud Posse naming convention for PATs?](#what-is-the-cloud-posse-naming-convention-for-pats).

:::

This token needs permission to manage the ArgoCD deployment repositories.

1. Name this PAT `argocd/terraform/argocd-repo`.
2. For repository access, select "Only select repositories" and choose both `acme/argocd-deploy-non-prod` and `acme/argocd-deploy-prod`.
3. Grant this PAT the following permissions

```diff
# Repository permissions
+ Administration: Read and write
+ Contents: Read and write
+ Metadata: Read-only

# Organization permissions
+ Members: Read-only
```

Use the following workflow to upload this PAT to AWS SSM:

```console
atmos workflow deploy/terraform-argocdrepo-pat -f argocd
```

Or manually save this PAT to AWS SSM at `argocd/github/api_key` in the `core-auto` account.

### 4. Deploy ArgoCD GitHub Repositories Configuration

Deploy the ArgoCD configuration for the two GitHub repos with the following workflow:

```console
atmos workflow argocd-repos -f argocd
```

Once this finishes, review the two repos in your GitHub Organization. These should both be fully configured at this point.
- [acme/argocd-deploy-non-prod](https://github.com/acme/argocd-deploy-non-prod)
- [acme/argocd-deploy-prod](https://github.com/acme/argocd-deploy-prod)

Now that the ArgoCD deployment repos are configured, we need to create GitHub PATs for ArgoCD.

### 5. Create the Webhook GitHub PATs

The next two PATs created will be used by Terraform with the `eks/argocd` component; one for `argocd-deploy-non-prod` and one for `argocd-deploy-prod`. Each of these PATs is used to register the webhook in GitHub for the ArgoCD Application created with this given component. Terraform will pull that PAT from SSM typically using the `argocd/github` path in `plat-dev`, `plat-staging`, and `plat-prod` accounts.

:::info Tip

You may notice these PATs use the same SSM path as PAT #1 yet is deployed to a different account. We intentionally separate these PATs in order to adhere to least-privilege principle. This way, each account can pull a PAT from the same SSM path in the same account with the minimal set of permission that this account requires.

These PATs can be combined into a single PAT if preferred.

:::

Create two PATs with the following allowed permissions. First nonprod:

1. Name this PAT `argocd/terraform-webhooks/nonprod`
2. Limit this PAT to `acme/argocd-deploy-non-prod`
3. Grant the following permission:

```diff
Repository:
+ Webhooks: Read and write
+ Metadata: Read-only
```

Use the following workflow to upload this PAT to AWS SSM:

```console
atmos workflow deploy/terraform-webhooks-nonprod-pat -f argocd
```

Or manually save this PAT to AWS SSM at `argocd/github/api_key` in the `plat-dev` and `plat-staging` accounts.

Now the same for prod:

1. Name this PAT `argocd/terraform-webhooks/prod`
2. Limit this PAT to `acme/argocd-deploy-prod`
3. Grant the following permission (again):

```diff
Repository:
+ Webhooks: Read and write
+ Metadata: Read-only
```

Use the following workflow to upload this PAT to AWS SSM:

```console
atmos workflow deploy/terraform-webhooks-prod-pat -f argocd
```

Or manually save this PAT to AWS SSM at `argocd/github/api_key` in the `plat-prod` account.

### 6. Create the Notifications GitHub PAT

The next PAT is used by the ArgoCD notifications system to set the GitHub to commit status on successful deployments. This PAT is stored in SSM and pulled by the `eks/argocd` component. That component will pass the token to the ArgoCD application in the given EKS cluster. That ArgoCD Application uses that PAT only when synchronous mode is enabled.

As of January 2023, GitHub does not support fine-grained PATs with the [commit statuses API](https://docs.github.com/en/rest/commits/statuses?apiVersion=2022-11-28#create-a-commit-status). Therefore, we must create a _classic_ PAT for the bot user.

1. Name this _classic_ PAT `ARGOCD_APP_NOTIFICATIONS`
2. Grant the following permission:

```diff
+ repo:status
```

3. Then check that the bot user has access to the _application_ repo. For example for Cloud Posse, that is [cloudposse-examples/app-on-eks-with-argo](https://github.com/cloudposse-examples/app-on-eks-with-argocd).

Use the following workflow to upload this PAT to AWS SSM:

```console
atmos workflow deploy/app-notifications-pat -f argocd
```

Or manually save this PAT to AWS SSM at `argocd/notifications/notifiers/common/github-token` in the `plat-dev`, `plat-staging`, and `plat-prod` accounts.

### 7. Create the Workflows GitHub PATs

The final two PATs are used in the release engineering workflows; again one for nonprod and one for prod. Each PAT will need access to two repos. First, it needs read access to the private environment configuration. By default, this is the `infra-repo` repository. Second, it needs write access to the given ArgoCD deploy repository in order to update the deployment configuration for new applications.

For the nonprod PAT:

1. Name this PAT `argocd/github/nonprod`
2. Limit this PAT to `acme/argocd-deploy-non-prod` and `acme/infra-repo`
3. Grant this PAT the following permissions:

```diff
Repository
+ Contents: Read and write
+ Metadata: Read-only
```

This PAT _does not_ need to be uploaded to AWS SSM, and instead store this PAT for reference in 1Password. We will upload this PAT as a GitHub secret for the release workflows, typically with the `ARGOCD_GITHUB_NONPROD` secret.

Now for the prod PAT:

1. Name this PAT `argocd/github/prod`
2. Limit this PAT to `acme/argocd-deploy-prod` and `acme/infra-repo`
3. Grant this PAT the following permissions:

```diff
Repository
+ Contents: Read and write
+ Metadata: Read-only
```

Again store this PAT for reference in 1Password and upload this PAT as a GitHub secret for the release workflows, typically with the `ARGOCD_GITHUB_PROD` secret.

## FAQ

### What is the Cloud Posse naming convention for PATs

You can name your PATs however you prefer, but for the sake of consistency, we recommend establishing a naming convention for PATs. At Cloud Posse we prefer to use the following pattern:

`<app>/<actor>/<use-case || namespace>`

However for *classic* PATs, secret names can only contain alphanumeric characters ([a-z], [A-Z], [0-9]) or underscores (\_). Spaces are not allowed. Must start with a letter ([a-z], [A-Z]) or underscores (\_). So for *classic* PATs use all Caps and underscores.

For example:

```console
# 1. Terraform access for argocd-repo. Requires access to apply both prod and nonprod
argocd/terraform/argocd-repo # needs read on org members, write admin and code on both argocd repos

# 2. Terraform access for eks/argocd webhooks
argocd/terraform-webhooks/nonprod # needs permission to write repository hooks on argocd-deploy-nonprod
argocd/terraform-webhooks/prod # needs permission to write repository hooks on argocd-deploy-prod

# 3. ArgoCD access for app in cluster
ARGOCD_APP_NOTIFICATIONS # needs permission to write commit statuses on any application repo

# 4. GitHub Workflow access
argocd/github/nonprod # needs write access to argocd-deploy-nonprod and read for infra
argocd/github/prod # needs write access to argocd-deploy-prod and read for infra
```

### Can we use the Bot user to create the ArgoCD repos?

By default, we do not require that the bot user creates the ArgoCD deployment repositories. However, the component does support enabling that option. If you wish to allow the bot user to both create and manage the ArgoCD deployment repos, grant the bot user permission in your Organization, and then set `var.create_repo` to `true` in `stacks/catalog/argocd-repo/defaults.yaml`.

### Resource not accessible by personal access token

```console
{
  "message": "Resource not accessible by personal access token",
  "documentation_url": "https://docs.github.com/rest/commits/statuses#create-a-commit-status"
}
```

You may see this message if you attempt to use a fine-grained PAT to set a GitHub commit status. As of January 2023, GitHub does not support fine-grained PATs with the [commit statuses API](https://docs.github.com/en/rest/commits/statuses?apiVersion=2022-11-28#create-a-commit-status). Therefore, we must create a _classic_ PAT for the bot user.

### Forbids access via a personal access token (classic).

```console
{
  "message": "`acme` forbids access via a personal access token (classic). Please use a GitHub App, OAuth App, or a personal access token with fine-grained permissions.",
  "documentation_url": "https://docs.github.com/rest/commits/statuses#create-a-commit-status"
}
```

You must enable classic PATs for the GitHub Organization.

Under the GitHub Organization settings, go to `Personal access tokens` > `Settings` > `Personal access token (classic)` and select `Allow access via personal access tokens (classic)`.

### Why not use a GitHub App?

At the time this component was developed, GitHub Apps were not fully supported. However, we plan to update our recommendation to a GitHub App soon! Please check with Cloud Posse on the latest status.

## References
- [Setting up ArgoCD](/reference-architecture/setup/argocd/)