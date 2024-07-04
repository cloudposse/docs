# ArgoCD

:::caution SAML Security Considerations

SAML is an industry-standard but security concerns have been raised by Dex, Mastadon, and others, due to the inherent
difficulty of validating XML documents and inconsistent handling by SAML libraries in various languages. Our ArgoCD
implementation by default uses SAML authentication with Dex and ArgoCD. For more information, please see:

- [SAML is insecure by design](https://joonas.fi/2021/08/saml-is-insecure-by-design/)
- [SAML Raider - SAML2 Burp Extension](https://github.com/CompassSecurity/SAMLRaider)
- [Proposal: deprecate the SAML connector](https://github.com/dexidp/dex/discussions/1884)

:::

:::info

- [Mattermost blog post of July 28, 2021 where `@jupenur`](https://mattermost.com/blog/securing-xml-implementations-across-the-web/)
  states:
  > If you maintain an application in Ruby, JavaScript, .NET, or Java and rely on SAML or other security-critical XML
  > use-cases, the question burning in the back of your mind should be: “How do I patch this?” The good news is that you
  > should already be patched if you use Ruby or JavaScript and update your dependencies regularly. And if you use .NET
  > or Java, there’s probably nothing to worry about.

:::

## Quick Start

| Steps                               | Example                                                                                                                                                 |
| :---------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1. Vendor ArgoCD components         | `atmos workflow vendor -f argocd`                                                                                                                       |
| 2. Create ArgoCD repos              | ClickOps                                                                                                                                                |
| 3. Create GitHub PATs               | [ArgoCD Integrations: How to set up Authorization for ArgoCD with GitHub PATs](/reference-architecture/how-to-guides/integrations/argocd/pats)          |
| 4. Deploy ArgoCD repo configuration | `atmos workflow deploy/argocd-repos -f argocd`                                                                                                          |
| 5. Create IAM Identity Center Apps  | [ArgoCD Integrations: How to create an AWS Identity Center Application](/reference-architecture/how-to-guides/integrations/argocd/identity-center-apps) |
| 6. Deploy ArgoCD                    | `atmos workflow deploy/argocd -f argocd`                                                                                                                |
| 7. Create `example-app`             | ClickOps                                                                                                                                                |

## Requirements

In order to deploy ArgoCD, EKS must be fully deployed and functional. In particular, the user deploying the cluster must
have a working VPN connection to the targeted account. See
[the EKS documentation](https://docs.cloudposse.com/reference-architecture/setup/eks/) for details.

All deployment steps below assume that the environment has been successfully set up with the following steps.

1. Sign into AWS via Leapp
1. Connect to the VPN
1. Open Geodesic

## Initializing

First vendor all related components for the ArgoCD layer:

```console
atmos workflow vendor -f argocd
```

## Deployment

### Establish a Bot User

We deploy a number of GitHub Personal Access Tokens (PATs) as part of the EKS with ArgoCD application. By default each
PAT is given the least-access required for the given job.

Each one of these PATs will be associated with a given user. We recommend creating or using an existing "bot" user. For
example, at Cloud Posse we have the "cloudpossebot" GitHub user. This user has its own email address and GitHub account,
is accessible from our internal 1Password vault for all privileged users, and has all access keys and tokens stored with
it in 1Password.

This bot user will need permission to manage a few repositories in your Organization. If you wish to simplify
deployment, you can grant this user permission to create repositories. See (Create Permission for the Bot User)[#Create
Permission for the Bot User].

Use this bot user for all access tokens in the remainder of this guide.

### Create ArgoCD GitHub Repositories

Create the two required ArgoCD GitHub repos:

- [acme/argocd-deploy-non-prod](https://github.com/acme/argocd-deploy-non-prod)
- [acme/argocd-deploy-prod](https://github.com/acme/argocd-deploy-prod)

Then grant the bot user `Admin` access to these two repositories.

### Create all ArgoCD PATs

We will need several PATs for the following steps. Now that the ArgoCD repos are created, you can create all required
PATs.

Please see
[ArgoCD Integrations: How to set up Authorization for ArgoCD with GitHub PATs](/reference-architecture/how-to-guides/integrations/argocd/pats)
and follow all steps.

### Deploy ArgoCD GitHub Repositories Configuration

Deploy the ArgoCD configuration for the two GitHub repos with the following workflow:

```console
atmos workflow argocd-repos -f argocd
```

Once this finishes, review the two repos in your GitHub Organization. These should both be fully configured at this
point.

- [acme/argocd-deploy-non-prod](https://github.com/acme/argocd-deploy-non-prod)
- [acme/argocd-deploy-prod](https://github.com/acme/argocd-deploy-prod)

Now that the ArgoCD deployment repos are configured, we need to create GitHub PATs for ArgoCD.

### Create AWS Identity Center Applications

In order to authenticate with ArgoCD, we recommend using an AWS IAM Identity Center SAML Application. These apps can use
existing Identity Center groups that we've already setup as part of the
[Identity layer](https://docs.cloudposse.com/reference-architecture/setup/identity/).

Please see
[ArgoCD Integrations: How to create an AWS Identity Center Application](/reference-architecture/how-to-guides/integrations/argocd/identity-center-apps)
and follow all steps.

### Deploy ArgoCD to each EKS Cluster

Once the GitHub repositories are in place and the SAML applications have been created and configuration uploaded to SSM,
we're ready to deploy ArgoCD to each cluster.

Deploy `eks/argocd` to each cluster with the following workflow:

```console
atmos workflow deploy/argocd -f argocd
```

## Validation

Once all deployment steps are completed, ArgoCD should be accessible at the following URLs. Please note that you must be
able to authenticate with AWS Identity Center to access any given app.

- https://argocd.use1.dev.plat.acme-svc.com
- https://argocd.use1.staging.plat.acme-svc.com
- https://argocd.use1.prod.plat.acme-svc.com

## Next Steps

Assuming login goes well, here's a checklist of GitHub repos needed to connect ArgoCD:

- [x] `acme/infra-acme` repo (Should already exist!)
  - [x] `acme/infra-acme/.github/environments` private
        workflows. This directory stores private environment configurations. Primarily, that is the
        [`cloudposse/github-action-yaml-config-query`](https://github.com/cloudposse/github-action-yaml-config-query)
        action used to get role, namespace, and cluster mapping for each environment.
- [x] (2) ArgoCD deploy nonprod and prod (Should already be created by `argocd-repo` component in earlier step)
  - [x] `argocd-deploy-non-prod`
  - [x] `argocd-deploy-prod`
- [ ] `acme/example-app` repo should be private repo generated from the
      [app-on-eks-with-argocd](https://github.com/cloudposse-examples/app-on-eks-with-argocd) template

:::info Sensitive Log Output

Note that all of these workflow runs run from within your private app repo, so any sensitive log output will not be
public.

:::

### 1. Environment Configuration

Update the `cloudposse/github-action-interface-environment` action to point to your infrastructure repository.

1. Set `implementation_repository` to `acme/infra-acme`
2. Verify `implementation_path`, `implementation_file`, and `implementation_ref` match your local configuration.

[Example app reference](https://github.com/cloudposse-examples/app-on-eks-with-argocd/blob/1abe260c7f43dde1c6610845e5a64a9d08eb8856/.github/workflows/workflow-cd-preview-argocd.yml#L167-L178)

### 2. Verify GitHub OIDC Access Roles

:::info Capitalization Matters!

The IDP permissions in IAM will be sensitive to capitalization, and yet the docker image must -not- have uppercase
letters!

:::

Make sure that your repo is allowed to assume roles for all relevant clusters and ECR repos:

1. Update the `github_actions_allowed_repos` variable in `ecr`, `eks/cluster`, or any other relevant components with
   GitHub OIDC access.
2. If your GitHub Organization has mixed capitalization cases, make sure these entries are case-sensitive

### 3. GitHub Environment Secrets

Add each of the following secrets to the `acme/example-app` repo:

1. `github-private-actions-pat`: `${{ secrets.PUBLIC_REPO_ACCESS_TOKEN }}`
2. `registry`: `${{ secrets.ECR_REGISTRY }}`
3. `secret-outputs-passphrase`: `${{ secrets.GHA_SECRET_OUTPUT_PASSPHRASE }}`
4. `ecr-region`: `${{ secrets.ECR_REGION }}`
5. `ecr-iam-role`: `${{ secrets.ECR_IAM_ROLE }}`

### 4. Specify Ingress Group

1. Update the `deploy/releases/app.yaml`
2. Make sure the ingress is not set to `default`. It should likely be `alb-controller-ingress-group`. you can read more
   about this
   [from our docs on the alb controller component](https://docs.cloudposse.com/reference-architecture/quickstart/eks/#how-does-the-alb-controller-ingress-group-determine-the-name-of-the-alb)
3. Set the domain accordingly. Each environment will need the service domain + environment.stage.tenant (ie.
   `use2.staging.plat.acme-svc.com` )
4. If your organization has mixed case, you'll need to edit the `organization` parameter to be lowercased in the GitHub
   workflows: `feature-branch.yml`, `main-branch.yaml`, and `release.yaml`

## FAQ

### Migrating from ArgoCD version `<1.305.0` to `1.305.0`

In order to migrate to `1.305.0` from a lesser version, delete the previous SSM parameters in each account for
`/argocd/notifications/notifiers/service_webhook_github-commit-status/github-token` and redeploy `github-webhook-pat`,
`eks/argocd`, and `argocd-repos`.

Or use the following workflow:

```console
atmos workflow migrate_less_1_305 -f argocd
```

### About GitHub PATs

We deploy a number of GitHub Personal Access Tokens (PAT). Each has a specific purpose and is limited to the
fine-grained scope required by that specific job. These are as follows:

1. Terraform `argocd-repo` Access

The first PAT we deploy is used by Terraform with the `argocd-repo` component. This PAT is used to create and manage the
ArgoCD deployment repositories, add deployment ssh keys for those repos, and is stored in AWS SSM Parameter Store.

Terraform will pull that PAT from SSM typically using the `argocd/github` path in the `core-auto` account.

2. Terraform `eks/argocd` Access

The next two PATs are also used by Terraform now with the `eks/argocd` component. Each of these PATs is used to register
the webhook in GitHub for the ArgoCD Application created with this given component.

Terraform will pull that PAT from SSM typically using the `argocd/github` path in `plat-dev`, `plat-staging`, and
`plat-prod` accounts. You may notice this is the same path as #1 above. These PATs can be combined into a single PAT, as
both are only used by Terraform.

3. ArgoCD GitHub Notification Access

The next PAT is used by the ArgoCD notifications system to set the GitHub to commit status on successful deployments.
This PAT is stored in SSM and pulled by the `eks/argocd` component. That component will pass the token to the ArgoCD
application in the given EKS cluster. That ArgoCD Application uses that PAT only when synchronous mode is enabled.

We store this PAT in SSM using the `argocd/notifications/notifiers/common/github-token` path

4. GitHub Release Workflow Access

The final two PATs are used in the release engineering workflows; one for nonprod and one for prod. This token should
allow write permissions in `infra-acme` and the given ArgoCD deploy repo.