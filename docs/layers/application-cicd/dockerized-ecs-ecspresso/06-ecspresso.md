# Ecspresso

This setup guide will help you get started with [ecspresso](https://github.com/kayac/ecspresso). It features an example
app, which demonstrates how your GitHub Actions work with your infrastructure repository.

:::caution Default Workflows Placement

**All Workflows live in the example app repository**

This is not a D.R.Y. setup. Workflows with `ecspresso` and `workflow` **prefixes** should be moved to a shared workflow
repository that can be used by the rest of your organization.

<details><summary>We place all workflows inside the example app for a couple of reasons</summary>

1. This makes the example apps self-contained and can be easily forked and tested
2. The getting started process is significantly faster
3. Customizations can be done on a single repo before bringing them to your organizations shared workflow repository.

</details>

:::

## Quick Start

| Steps                                                | Actions                                                                           |
| ---------------------------------------------------- | --------------------------------------------------------------------------------- |
| 1. Create a repository from the Example App template | [cloudposse/example-app-on-ecs](https://github.com/cloudposse/example-app-on-ecs) |
| 2. Update and reapply `ecr`                          | `atmos terraform apply ecr -s core-use1-artifacts`                                |
| 3. Validate the environment configuration            | Click Ops                                                                         |
| 4. Create a GitHub PAT                               | Click Ops                                                                         |
| 5. Set all Example App repository secrets            | Click Ops                                                                         |
| 6. Deploy the example ECS services                   | `atmos workflow deploy/app-on-ecs -f app-on-ecs`                                  |
| 7. Validate workflows                                | Click Ops                                                                         |

## Deployment

### Create the Example App repository

:::info Customer Requirement

This step requires access to the GitHub Organization. Customers will need to create this GitHub repository in Jumpstart
engagements.

:::

Cloud Posse deploys an example application with this new repository. This is separate from the infrastructure repository
and can be used as reference for future applications. Cloud Posse also maintains a public example of this app repository
with [cloudposse/example-app-on-ecs](https://github.com/cloudposse/example-app-on-ecs/). This is a GitHub repository
template, meaning it can be used to create new repositories with predefined content.

1. Create a new repository in your organization from the
   [cloudposse/example-app-on-ecs](https://github.com/cloudposse/example-app-on-ecs/) template.
2. Choose any name for the repository. For example, we might call this repo
   `acme/example-app-on-ecs`.
3. Grant Cloud Posse `admin` access to this repository.
4. If necessary, install the self-hosted runner GitHub App to this new repository.

### Create Image and GitHub OIDC Access Roles for ECR

The Example App will build and push an image to the ECR registry. Create that image with the `ecr` component if not
already created. The Example App GitHub Workflows will also need to be able to access that registry, and to do so, we
deploy GitHub OIDC roles with the same `ecr` component.

Add the following snippet in addition to any other repositories or images already included in these lists:

```yaml
components:
  terraform:
    ecr:
      vars:
        github_actions_allowed_repos:
          - acme/example-app-on-ecs
        # ECR must be all lowercase
        images:
          - acme/example-app-on-ecs
```

Reapply the `ecr` component with the following:

```console
atmos terraform apply ecr -s core-use1-artifacts
```

### Configure the Environment

We use the
[cloudposse/github-action-interface-environment](https://github.com/cloudposse/github-action-interface-environment)
GitHub Composite Action to read environment configuration from a private location. By default, we use the infrastructure
repository as that private location and save the configuration to
[`.github/environments/ecspresso.yaml`](./.github/environments/ecspresso.yaml).

This action stores metadata about the environments we want to deploy to. It is the binding glue between our GHA, GitHub
environments, and our infrastructure. When this action is called, an `environment` input is passed in. We then look up
in the map below information about that environment, that information is stored as an output to be used by the rest of
the GitHub actions.

:::info GitHub Composite Actions

For more on GitHub Composite Actions, please see the
[official GitHub documentation](https://docs.github.com/en/actions/creating-actions/creating-a-composite-action).

:::

Create or confirm the configuration in `.github/environments/ecspresso.yaml` in the
`acme/infra-acme` repository now.

If the file doesn't exist, here's the template:

:::info GitHub OIDC Roles

The `role` defined in this configuration may not exist yet. This role will be created by the given `ecs-service`
component with the GitHub OIDC mixin. Once completing the
[Deploy the Example App ECS Service](#deploy-the-example-app-ecs-service) step, please verify this role is correct.

:::

<details>
<summary>
Copy, paste, and edit this in <code>./.github/environments/ecspresso.yaml</code>
</summary>

```yaml
name: 'Environments'
description: 'Get information about cluster'
inputs:
  environment:
    description: "Environment name"
    required: true
  namespace:
    description: "Namespace name"
    required: true
  repository:
    description: "Repository name"
    required: false
  application:
    description: "Application name"
    required: false
  attributes:
    description: "Comma separated attributes"
    required: false
outputs:
  name:
    description: "Environment name"
    value: ${{ steps.result.outputs.name }}
  region:
    description: "AWS Region"
    value: ${{ steps.result.outputs.region }}
  role:
    description: "IAM Role"
    value: ${{ steps.result.outputs.role }}
  cluster:
    description: "Cluster"
    value: ${{ steps.result.outputs.cluster }}
  namespace:
    description: "Namespace"
    value: ${{ steps.result.outputs.namespace }}
  ssm-path:
    description: "SSM path"
    value: ${{ steps.result.outputs.ssm-path }}
  s3-bucket:
    description: "S3 Bucket name"
    value: ${{ steps.result.outputs.s3-bucket }}
  account-id:
    description: "AWS account id"
    value: ${{ steps.result.outputs.aws-account-id }}
  stage:
    description: "Stage name"
    value: ${{ steps.result.outputs.stage }}
runs:
  using: "composite"
  steps:
    - uses: cloudposse/github-action-yaml-config-query@0.1.0
      id: suffix
      with:
        query: .${{ inputs.application == '' }}
        config: |
          true:
            suffix: ${{ inputs.repository }}
          false:
            suffix: ${{ inputs.repository }}-${{ inputs.application }}

    - uses: cloudposse/github-action-yaml-config-query@0.1.0
      id: result
      with:
        query: .${{ inputs.environment }}
        config: |
          qa1:
            cluster: acme-plat-${{ steps.region.outputs.result }}-dev-ecs-platform
            name: acme-plat-${{ steps.region.outputs.result }}-dev-${{ steps.name.outputs.name }}-qa1
            role: arn:aws:iam::101010101010:role/acme-plat-${{ steps.region.outputs.result }}-dev-${{ steps.name.outputs.name }}-qa1
            ssm-path: /ecs-service/${{ steps.name.outputs.name }}/url/0
            region: us-east-1
          qa2:
            cluster: acme-plat-${{ steps.region.outputs.result }}-dev-ecs-platform
            name: acme-plat-${{ steps.region.outputs.result }}-dev-${{ steps.name.outputs.name }}-qa2
            role: arn:aws:iam::101010101010:role/acme-plat-${{ steps.region.outputs.result }}-dev-${{ steps.name.outputs.name }}-qa2
            ssm-path: /ecs-service/${{ steps.name.outputs.name }}/url/0
            region: us-east-1
          dev:
            cluster: acme-plat-use1-dev-ecs-platform
            name: acme-plat-use1-dev-${{ steps.suffix.outputs.suffix }}
            role: arn:aws:iam::101010101010:role/acme-plat-use1-dev-${{ steps.suffix.outputs.suffix }}
            ssm-path: /ecs-service/${{ steps.suffix.outputs.suffix }}/url/0
            region: us-east-1
            s3-bucket: acme-plat-use1-dev-ecs-tasks-mirror
            aws-account-id: 101010101010
            stage: dev
          prod:
            cluster: acme-plat-use1-prod-ecs-platform
            name: acme-plat-use1-prod-${{ steps.suffix.outputs.suffix }}
            role: arn:aws:iam::202020202020:role/acme-plat-use1-prod-${{ steps.suffix.outputs.suffix }}
            ssm-path: /ecs-service/${{ steps.suffix.outputs.suffix }}/url/0
            region: us-east-1
            s3-bucket: acme-plat-use1-prod-ecs-tasks-mirror
            aws-account-id: 202020202020
            stage: prod
          sandbox:
            cluster: acme-plat-use1-sandbox-ecs-platform
            name: acme-plat-use1-sandbox-${{ steps.suffix.outputs.suffix }}
            role: arn:aws:iam::303030303030:role/acme-plat-use1-sandbox-${{ steps.suffix.outputs.suffix }}
            ssm-path: /ecs-service/${{ steps.suffix.outputs.suffix }}/url/0
            region: us-east-1
            s3-bucket: acme-plat-use1-sandbox-ecs-tasks-mirror
            aws-account-id: 303030303030
            stage: sandbox
          staging:
            cluster: acme-plat-use1-staging-ecs-platform
            name: acme-plat-use1-staging-${{ steps.suffix.outputs.suffix }}
            role: arn:aws:iam::404040404040:role/acme-plat-use1-staging-${{ steps.suffix.outputs.suffix }}
            ssm-path: /ecs-service/${{ steps.suffix.outputs.suffix }}/url/0
            region: us-east-1
            s3-bucket: acme-plat-use1-staging-ecs-tasks-mirror
            aws-account-id: 404040404040
            stage: staging
```

</details>

Then the Example App, verify that the target environment is correct. This should be in the
`.github/configs/environment.yaml` file in Example App repository.

```yaml
## file: .github/configs/environment.yaml

# assumes the same organization
environment-info-repo: infrastructure
implementation_path: .github/environments
implementation_file: ecspresso.yaml
implementation_ref: main
```

### Create a GitHub PAT

:::info Customer Requirement

This step requires access to the GitHub Organization. Customers will need to create this PAT in Jumpstart engagements.

:::

In order for the Example App workflows to read the private environment configuration, we need to pass a token to the
Composite Action.

1. Create a fine-grained PAT. Please see
   [Creating a fine-grained personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-fine-grained-personal-access-token).
2. Name this PAT whatever you would like. We recommend calling it `PRIVATE_CONFIG_READ_ACCESS`
3. Grant this PAT `read` permission on the `acme/infra-acme`
   repository:

```diff
Repository
+ Contents: Read-only
+ Metadata: Read-only
```

4. Upload this PAT to 1Password, and Cloud Posse will add it as a GitHub repository secret. Or you can create an
   organization secret now that you can reuse in future application repositories.

### Add the Example App Secrets

The GitHub Action workflows expect a few GitHub Secrets to exist to build images in AWS ECR. Add each of the following
secrets to the Example App repository:

1. `PRIVATE_CONFIG_READ_ACCESS`

This is the PAT we created above in [Create a GitHub PAT](#create-a-github-pat).

2. `ECR_REGISTRY`

This is your ECR Registry, such as `111111111111.dkr.ecr.us-east-1.amazonaws.com`.

3. `ECR_REGION`

This is the AWS region where the `ecr` component is deployed. For example, `us-east-1`

4. `ECR_IAM_ROLE`

This is the GitHub OIDC role created by the `ecr` component for accessing the registry. For this organization, this
would be
`arn:aws:iam::111111111111:role/acme-core-use1-artifacts-ecr-gha`.

Verify this value by checking the output of the `ecr` component.

5. `GHA_SECRET_OUTPUT_PASSPHRASE`

This is a random string used to encrypt and decrypt sensitive image names and tags. This can be anything.

For example, generate this with the following:

```console
openssl rand -base64 24
```

### Deploy the Example App ECS Service

Ensure you have stacks configured for the Example App in every stage of your platform.

:::info Initial Build Image

This task definition uses the `latest` ECR image for the Example App, which is built by the CI steps of the release
pipelines. However, that step hasn't been run yet!

You will need to first trigger the `main-branch` CI steps for the Example App, ignore the failure in the deploy step,
and then deploy these components.

:::

<details>
  <summary>Catalog entry for the Example App</summary>

```yaml
import:
  - catalog/ecs-services/defaults

components:
  terraform:
    ecs-services/example-app-on-ecs:
      metadata:
        component: ecs-service
        inherits:
          - ecs-services/defaults
      vars:
        name: example-app-on-ecs
        ssm_enabled: true
        github_actions_iam_role_enabled: true
        github_actions_iam_role_attributes: [ "gha" ]
        github_actions_ecspresso_enabled: true
        github_actions_allowed_repos:
          - acme/example-app-on-ecs
        cluster_attributes: [platform]
        alb_configuration: "private"
        use_lb: true
        unauthenticated_paths:
          - "/"
          - "/dashboard"
        containers:
          service:
            name: app
            image: 111111111111.dkr.ecr.us-east-1.amazonaws.com/example-app-on-ecs:latest
            log_configuration:
              logDriver: awslogs
              options: {}
            port_mappings:
              - containerPort: 8080
                hostPort: 8080
                protocol: tcp
        task:
          desired_count: 1
          task_memory: 512
          task_cpu: 256
          ignore_changes_desired_count: true
          ignore_changes_task_definition: true
```

</details>

Apply this component with the following:

```console
atmos workflow deploy/app-on-ecs -f app-on-ecs
```

## Triggering Workflows

Now that all requirements are in place, validate all workflows.

1. Clone the Example App locally

```bash
git clone git@github.com:acme/example-app-on-ecs.git
```

2. Change the demo color in `main.go`

```go
func main() {
	c := os.Getenv("COLOR")
	if len(c) == 0 {
		c = "red" // change this color to something else, such as "blue"
	}
```

3. Create a Pull Request

Creating a PR will trigger the CI build and test workflows and the QA cleanup workflows. Ensure these all pass
successfully.

4. Add the `deploy/qa1` label

Adding this label will kick-off a new workflow to build and test once again and then deploy to the `qa1` environment.
Ensure this workflow passes successfully and then validate the "Deployment URL" returned.

:::info Private Endpoints

Private endpoints require the VPN. If you're deploying a private endpoint, connect to the VPN in order to access the
deployment URL.

:::

5. Merge the Pull Request

Merging the PR will trigger two different workflows. The Feature Branch workflow will be triggered to clean up and
release the QA environment, and the Main Branch workflow will be triggered to deploy to `dev` and draft a release. Once
both workflows pass, check that the QA environment is no longer active and then validate the dev URL. Finally, make sure
a draft release was successfully created.

6. Publish a Release

Using the draft release created by the Main Branch workflow, click Edit and then Publish. This will kick off the Release
workflow and deploy to `staging` and then to `prod`. Once this workflow finishes, validate both endpoints.

## Next Steps

Workflows with `ecspresso` and `workflow` **prefixes** should be moved to a shared workflow repository that can be used
by the rest of your organization.

## FAQ

### Adding Additional Applications

This setup is a one time setup. You can add as many applications as you want to your platform. You can also add as many
environments as you want to your platform.

To add additional applications:

1. Ensure the `ecspresso` and `workflow` **prefixes** are moved to a shared workflow repository that can be used by the
   rest of your organization.
2. Create a new repository from one of the example app templates.
3. Create your Example app Configuration file in the new repository.
4. Ensure your infrastructure is deployed.