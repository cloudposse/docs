# Philips Labs GitHub Action Runners

If we are not deploying EKS, it's not worth the additional effort to set up Self-Hosted runners on EKS. Instead, we
deploy Self-Hosted runners on EC2 instances. These are managed by an API Gateway and Lambda function that will
automatically scale the number of runners based on the number of pending jobs in the queue. The queue is written to by
the API Gateway from GitHub Events.

## Quick Start

| Steps                                        | Actions                                                                    | Calling Workflow                                                                                                    |
| :------------------------------------------- | :------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| 1. Generate GitHub App Private Key           | Set SSM Param `"/pl-github-runners/key"` to App private Key base64 encoded | `atmos workflow deploy/pl-github-runners -f github`                                                                 |
| 2. Note GitHub ID                            | Set SSM Param `"/pl-github-runners/id"` to the GitHub App ID               | `atmos workflow deploy/pl-github-runners -f github`                                                                 |
| 3. Deploy GitHub OIDC Provider               | Deploy GitHub OIDC to every needed account                                 | `atmos workflow deploy/github-oidc-provider -f github`                                                              |
| 4. Deploy GitHub Runners                     | Deploy the GitHub runners                                                  | `atmos workflow deploy/pl-github-runners -f github`                                                                 |
| 5. Update Webhook (if changed or redeployed) | Update the GitHub App Webhook                                              | (if `enable_update_github_app_webhook: true`) `atmos workflow deploy/pl-github-runners -f github`. Otherwise Manual |

## Deploy

The setup for the Philips Labs GitHub Action Runners requires first creating the GitHub App, then deploying the
`philips-labs-github-runner` component, and then finalizing the GitHub App webhook. Cloud Posse typically does not have
access to the customer's GitHub Organization settings, so the customer will need to create the initial GitHub App, then
hand the setup back to Cloud Posse. Then Cloud Posse can deploy the component and generate the webhook. Finally, the
customer will then need to add the webhook to the GitHub App and ensure the App is installed to all relevant GitHub
repositories.

Follow the guide with the upstream module,
[philips-labs/terraform-aws-github-runner](https://github.com/philips-labs/terraform-aws-github-runner#setup-github-app-part-1),
or follow the steps below.

### Create the GitHub App

:::info Customer Requirement

This step requires access to the GitHub Organization. Customers will need to create this GitHub App in Jumpstart
engagements.

:::

1. Create a new GitHub App
1. Choose a name
1. Choose a website (mandatory, not required for the module).
1. Disable the webhook for now (we will configure this later or create an alternative webhook).
1. Add the following permission:

```diff
# Required Permissions for Repository Runners:
## Permissions for all runners:
### Repository:
+ Actions: Read-only (check for queued jobs)
+ Checks: Read-only (receive events for new builds)
+ Metadata: Read-only (default/required)

## Permissions for repository-level runners only:
### Repository:
+ Administration: Read & write (to register runner)

## Permissions for organization-level runners only:
### Organization
+ Self-hosted runners: Read & write (to register runner)
```

6. Generate a Private Key

If you are working with Cloud Posse, upload this Private Key and GitHub App ID to 1Password and inform Cloud Posse.
Otherwise, continue with the component deployment in `core-use1-auto`.

### Deploy the `philips-labs-github-runner` Component

:::tip

This step does _not_ require access to the GitHub Organization. Cloud Posse will run this deployment for Jumpstart
engagements.

:::

Run the `deploy/pl-github-runners` workflow with `atmos` to write the GitHub App information to the `core-use1-auto`
SSM account and deploy the component.

```console
atmos workflow deploy/pl-github-runners -f github
```

This is the same as the following steps:

1. Upload the PEM file key to the specified ssm path, `/pl-github-runners/key`, in `core-use1-auto` as a base64
   encoded string.
2. Upload the GitHub App ID to the specified ssm path, `/pl-github-runners/id`, in `core-use1-auto`.
3. Deploy the `philips-labs-github-runners` component to `core-use1-auto`. Run this with the following:

```console
atmos terraform apply philips-labs-github-runners -s core-use1-auto
```

Once the component is deployed, save the webhook URL and secret in 1Password. The endpoint can be found with the
following:

```console
atmos terraform output philips-labs-github-runners -s core-use1-auto 'webhook'
```

### Add the Webhook to the GitHub App

:::info Customer Requirement

This step requires access to the GitHub Organization. Customers will need to finalize the GitHub App in Jumpstart
engagements.

:::

Now that the component is deployed and the webhook has been created, add that webhook to the GitHub App. Both the
webhook URL and secret should now be stored in 1Password. If not, you can retrieve these values from the output of the
`philips-labs-github-runners` component in `core-use1-auto` as described in the previous step.

1. Open the GitHub App created in
   [Create the GitHub App above](https://docs.cloudposse.com/reference-architecture/setup/philips-labs-github-runners/#create-the-github-app)
1. Enable the webhook.
1. Provide the webhook url, should be part of the output of terraform.
1. Provide the webhook secret (`terraform output -raw <NAME_OUTPUT_VAR>`).
1. In the _"Permissions & Events"_ section and then _"Subscribe to Events"_ subsection, check _"Workflow Job"_.

1. Ensure the webhook for the GitHub app is enabled and pointing to the output of the module.
   - The endpoint can be found from `atmos terraform output philips-labs-github-runners -s core-use1-auto 'webhook'`

## Vendor

Vendor in the necessary components with the following workflow:

```bash
atmos workflow vendor -f github
```

## Deploy

:::info

You can run all workflows at once in the right order with

```bash
atmos workflow all -f github
```

:::

### GitHub OIDC Provider

First deploy the GitHub OIDC provider to all accounts where we want to grant GitHub access. The typical list of accounts
is included with the `deploy/github-oidc-provider` workflow; run the following with `SuperAdmin`:

```bash
atmos workflow deploy/github-oidc-provider -f github
```

### GitHub Runners

To deploy the self-hosted runners themselves, first verify [the GitHub App requirement](#Requirements) is complete
including both SSM parameters. Next we will deploy the token rotator and then the runners themselves.

```bash
atmos workflow deploy/github-runners -f github
```

If all goes well, you should now see self-hosted runners registered to your infrastructure repository in GitHub. If not,
read through the attached [FAQs](#FAQ).

## Usage

Once you've deployed Self Hosted runners select the appropriate runner set with the `runs-on` configuration in any
GitHub Actions workflow. For example, we can use the default runner set as such:

```yaml
runs-on: ["self-hosted", "default"]
```

However, it's very likely you will have resource-intensive jobs that the default runner size may not satisfy. We
recommend deploying additional runner sets for each tier of workflow resource requirements. For example in our internal
GitHub Organization, we have `default`, `medium`, and `large` runners.

### Using the `terraform` Label

By default, we configure the Atmos Terraform GitHub Actions to use the `terraform` labeled Self-Hosted runners.

```yaml
runs-on: ["self-hosted", "terraform"]
```

However also by default we only have the single runner set. We recommend deploying a second runner set with a larger
resource allocation for these specific jobs.

Remove the `terraform` label from the default runner set and add the `terraform` label to your new, larger runner set.
Since the workflows are all labeled with `terraform` already, they will automatically select the new runner set on their
next run.

# FAQ

## I cannot assume the role from GitHub Actions after deploying

The following error is very common if the GitHub workflow is missing proper permission.

```bash
Error: User: arn:aws:sts::***:assumed-role/acme-core-use1-auto-actions-runner@actions-runner-system/token-file-web-identity is not authorized to perform: sts:TagSession on resource: arn:aws:iam::999999999999:role/acme-plat-use1-dev-gha
```

In order to use a web identity, GitHub Action pipelines must have the following permission. See
[GitHub Action documentation for more](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services#adding-permissions-settings).

```yaml
permissions:
  id-token: write # This is required for requesting the JWT
  contents: read # This is required for actions/checkout
```