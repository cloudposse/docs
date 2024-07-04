# GitHub Action Runner Controller

By default, GitHub Actions are run in the cloud on hosted machines, but we can opt to use "Self-Hosted" GitHub Action
Runners instead. Historically, we've deployed an Auto Scaling Group that gives each run a dedicated and customized
instance. Now that we've deployed EKS, we can save more by utilizing the `actions-runner-controller` to deploy
virtual-machines inside of EKS, and run GitHub Actions from these containers. These virtual-machines will be fully
customizable, scale automatically, and be cheaper than both GitHub hosted runners and ASG instances.

## Quick Start

| Steps                                                 | Example                                                                               |
| :---------------------------------------------------- | :------------------------------------------------------------------------------------ |
| 1. Generate GitHub Private Key                        | `ssm_github_secret_path: "/github_runners/controller_github_app_secret"`              |
| 2. Generate GitHub Webhook Secret Token               | `ssm_github_webhook_secret_token_path: "/github_runners/github_webhook_secret_token"` |
| 3. Connect to the VPN                                 |                                                                                       |
| 4. Deploy cluster and resources into the `auto` stack | `atmos workflow deploy/github-runners -f github`                                      |
| 5. Set up Webhook Driven Scaling                      | Click Ops                                                                             |

## Requirements

In order to deploy Self-Hosted GitHub Runners on EKS, follow the steps outlined in the
[EKS setup doc](https://docs.cloudposse.com/reference-architecture/setup/eks/). Those steps will complete the EKS
requirements.

### Generate Required Secrets

AWS SSM is used to store and retrieve secrets.

Decide on the SSM path for the GitHub secret (Application private key) and GitHub webhook secret.

#### GitHub Application Private Key

Since the secret is automatically scoped by AWS to the account and region where the secret is stored, we recommend the
secret be stored at `/github/acme/github_token`.

`stacks/catalog/eks/actions-runner-controller.yaml`:

```yaml
ssm_github_secret_path: "/github_runners/controller_github_app_secret"
```

The preferred way to authenticate is by _creating_ and _installing_ a GitHub App. This is the recommended approach as it
allows for more much more restricted access than using a personal access token, at least until
[fine-grained personal access token permissions](https://github.blog/2022-10-18-introducing-fine-grained-personal-access-tokens-for-github/)
are generally available. Follow the instructions
[here](https://github.com/actions/actions-runner-controller/blob/master/docs/authenticating-to-the-github-api.md) to
create and install the GitHub App.

At the creation stage, you will be asked to generate a private key. This is the private key that will be used to
authenticate the Action Runner Controller. Download the file and store the contents in SSM using the following command,
adjusting the profile and file name. The profile should be the `admin` role in the account to which you are deploying
the runner controller. The file name should be the name of the private key file you downloaded.

```
AWS_PROFILE=acme-core-use1-auto-admin chamber write github_runners controller_github_app_secret -- "$(cat APP_NAME.DATE.private-key.pem)"
```

You can verify the file was correctly written to SSM by matching the private key fingerprint reported by GitHub with:

```
AWS_PROFILE=acme-core-use1-auto-admin chamber read -q github_runners controller_github_app_secret | openssl rsa -in - -pubout -outform DER | openssl sha256 -binary | openssl base64
```

At this stage, record the Application ID and the private key fingerprint in your secrets manager (e.g. 1Password). You
will need the Application ID to configure the runner controller, and want the fingerprint to verify the private key.

Proceed to install the GitHub App in the organization or repository you want to use the runner controller for, and
record the Installation ID (the final numeric part of the URL, as explained in the instructions linked above) in your
secrets manager. You will need the Installation ID to configure the runner controller.

In your stack configuration, set the following variables, making sure to quote the values so they are treated as
strings, not numbers.

```
github_app_id: "12345"
github_app_installation_id: "12345"
```

#### GitHub Webhook Secret Token

If using the Webhook Driven autoscaling (recommended), generate a random string to use as the Secret when creating the
webhook in GitHub.

Generate the string using 1Password (no special characters, length 45) or by running

```bash
dd if=/dev/random bs=1 count=33  2>/dev/null | base64
```

Store this key in AWS SSM under the same path specified by `ssm_github_webhook_secret_token_path`

`stacks/catalog/eks/actions-runner-controller.yaml`:

```yaml
ssm_github_webhook_secret_token_path: "/github_runners/github_webhook_secret_token"
```

## Deploy

Automation has an unique set of components from the `plat` clusters and therefore has its own Atmos Workflow. Notably,
`auto` includes the `eks/actions-runner-controller` component, which is used to create the `self-hosted` runners for the
GitHub Repository or Organization

### `iam-service-linked-roles` Component

At this point we assume that the `iam-service-linked-roles` component is already deployed for `core-auto`. If not,
deploy this component now with the following command:

```bash
atmos terraform apply iam-service-linked-roles -s core-gbl-auto
```

### Deploy Automation Cluster Resources

Deploy the cluster with the same command as `plat`, but then run the dedicated `auto/deploy` job.

```bash
atmos workflow cluster/deploy -s core-use1-auto -f eks
atmos workflow auto/deploy -f eks
```

Validate `auto`: https://echo.use1.auto.core.acme-svc.com/

### Using Webhook Driven Autoscaling (Click Ops)

To use the Webhook Driven autoscaling, you must also install the GitHub organization-level webhook after deploying the
component (specifically, the webhook server). The URL for the webhook is determined by the `webhook.hostname_template`
and where it is deployed. Recommended URL is
`https://gha-webhook.[environment].[stage].[tenant].[service-discovery-domain]`, which for this organization would be
`https://gha-webhook.use1.auto.core.acme-svc.com`

As a GitHub organization admin, go to
`https://github.com/organizations/acme/settings/hooks`, and then:

- Click "Add webhook" and create a new webhook with the following settings:
  - Payload URL: copy from Terraform output `webhook_payload_url`
  - Content type: `application/json`
  - Secret: whatever you configured in the secret above
  - Which events would you like to trigger this webhook:
    - Select "Let me select individual events"
    - Uncheck everything ("Pushes" is likely the only thing already selected)
    - Check "Workflow jobs"
  - Ensure that "Active" is checked (should be checked by default)
  - Click "Add webhook" at the bottom of the settings page

After the webhook is created, select "edit" for the webhook and go to the "Recent Deliveries" tab and verify that there
is a delivery (of a "ping" event) with a green check mark. If not, verify all the settings and consult the logs of the
`actions-runner-controller-github-webhook-server` pod.

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

# Related Topics

- [Confluence EKS Documentation](https://docs.cloudposse.com/components/category/eks/)
- [Confluence Decision on Self Hosted GitHub Runner Strategy](https://docs.cloudposse.com/reference-architecture/design-decisions/foundational-release-engineering/decide-on-self-hosted-github-runner-strategy/#self-hosted-runners-on-kubernetes)
- [Karpenter Documentation](https://karpenter.sh/)