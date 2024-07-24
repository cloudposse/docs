---
title: github-runners
sidebar_label: github-runners
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/github-runners/README.md
tags: [terraform, aws, github-runners]
---

# Component: `github-runners`

This component is responsible for provisioning EC2 instances for GitHub runners.

:::info We also have a similar component based on
[actions-runner-controller](https://github.com/actions-runner-controller/actions-runner-controller) for Kubernetes.

:::

## Requirements

## Usage

**Stack Level**: Regional

Here's an example snippet for how to use this component.

```yaml
components:
  terraform:
    github-runners:
      vars:
        cpu_utilization_high_threshold_percent: 5
        cpu_utilization_low_threshold_percent: 1
        default_cooldown: 300
        github_scope: company
        instance_type: "t3.small"
        max_size: 10
        min_size: 1
        runner_group: default
        scale_down_cooldown_seconds: 2700
        wait_for_capacity_timeout: 10m
        mixed_instances_policy:
          instances_distribution:
            on_demand_allocation_strategy: "prioritized"
            on_demand_base_capacity: 1
            on_demand_percentage_above_base_capacity: 0
            spot_allocation_strategy: "capacity-optimized"
            spot_instance_pools: null
            spot_max_price: null
          override:
            - instance_type: "t4g.large"
              weighted_capacity: null
            - instance_type: "m5.large"
              weighted_capacity: null
            - instance_type: "m5a.large"
              weighted_capacity: null
            - instance_type: "m5n.large"
              weighted_capacity: null
            - instance_type: "m5zn.large"
              weighted_capacity: null
            - instance_type: "m4.large"
              weighted_capacity: null
            - instance_type: "c5.large"
              weighted_capacity: null
            - instance_type: "c5a.large"
              weighted_capacity: null
            - instance_type: "c5n.large"
              weighted_capacity: null
            - instance_type: "c4.large"
              weighted_capacity: null
```

## Configuration

### API Token

Prior to deployment, the API Token must exist in SSM.

To generate the token, please follow [these instructions](https://cloudposse.atlassian.net/l/c/N4dH05ud). Once
generated, write the API token to the SSM key store at the following location within the same AWS account and region
where the GitHub Actions runner pool will reside.

```
assume-role <automation-admin role>
chamber write github/runners/<github-org> registration-token ghp_secretstring
```

## Background

### Registration

Github Actions Self-Hosted runners can be scoped to the Github Organization, a Single Repository, or a group of
Repositories (Github Enterprise-Only). Upon startup, each runner uses a `REGISTRATION_TOKEN` to call the Github API to
register itself with the Organization, Repository, or Runner Group (Github Enterprise).

### Running Workflows

Once a Self-Hosted runner is registered, you will have to update your workflow with the `runs-on` attribute specify it
should run on a self-hosted runner:

```
name: Test Self Hosted Runners
on:
  push:
    branches: [main]
jobs:
  build:
    runs-on: [self-hosted]
```

### Workflow Github Permissions (GITHUB_TOKEN)

Each run of the Github Actions Workflow is assigned a GITHUB_TOKEN, which allows your workflow to perform actions
against Github itself such as cloning a repo, updating the checks API status, etc., and expires at the end of the
workflow run. The GITHUB_TOKEN has two permission "modes" it can operate in `Read and write permissions` ("Permissive"
or "Full Access") and `Read repository contents permission` ("Restricted" or "Read-Only"). By default, the GITHUB_TOKEN
is granted Full Access permissions, but you can change this via the Organization or Repo settings. If you opt for the
Read-Only permissions, you can optionally grant or revoke access to specific APIs via the workflow `yaml` file and a
full list of APIs that can be accessed can be found in the
[documentation](https://docs.github.com/en/actions/security-guides/automatic-token-authentication#permissions-for-the-github_token)
and is shown below in the table. It should be noted that the downside to this permissions model is that any user with
write access to the repository can escalate permissions for the workflow by updating the `yaml` file, however, the APIs
available via this token are limited. Most notably the GITHUB_TOKEN does not have access to the `users`, `repos`,
`apps`, `billing`, or `collaborators` APIs, so the tokens do not have access to modify sensitive settings or add/remove
users from the Organization/Repository.

<img src="/assets/refarch/cleanshot-2022-03-01-at-17.14.02-20220301-234351.png" height="664" width="720" /><br/>

> Example of using escalated permissions for the entire workflow

```
name: Pull request labeler
on: [ pull_request_target ]
permissions:
  contents: read
  pull-requests: write
jobs:
  triage:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/labeler@v2
        with:
          repo-token: ${{ secrets.GITHUB_TOKEN }}
```

> Example of using escalated permissions for a job

```
name: Create issue on commit
on: [ push ]
jobs:
  create_commit:
    runs-on: ubuntu-latest
    permissions:
      issues: write
    steps:
      - name: Create issue using REST API
        run: |
          curl --request POST \
          --url https://api.github.com/repos/${{ github.repository }}/issues \
          --header 'authorization: Bearer ${{ secrets.GITHUB_TOKEN }}' \
          --header 'content-type: application/json' \
          --data '{
            "title": "Automated issue for commit: ${{ github.sha }}",
            "body": "This issue was automatically created by the GitHub Action workflow **${{ github.workflow }}**. \n\n The commit hash was: _${{ github.sha }}_."
            }' \
          --fail
```

### Pre-Requisites for Using This Component

In order to use this component, you will have to obtain the `REGISTRATION_TOKEN` mentioned above from your Github
Organization or Repository and store it in SSM Parameter store. In addition, it is recommended that you set the
permissions “mode” for Self-hosted runners to Read-Only. The instructions for doing both are below.

#### Workflow Permissions

1. Browse to
   [https://github.com/organizations/\{Org\}/settings/actions](https://github.com/organizations/\{Org\}/settings/actions)
   (Organization) or
   [https://github.com/\{Org\}/\{Repo\}/settings/actions](https://github.com/\{Org\}/\{Repo\}/settings/actions) (Repository)

2. Set the default permissions for the GITHUB_TOKEN to Read Only

<img src="/assets/refarch/cleanshot-2022-03-01-at-16.10.02-20220302-005602.png" height="199" width="786" /><br/>

### Creating Registration Token

:::info We highly recommend using a GitHub Application with the github-action-token-rotator module to generate the
Registration Token. This will ensure that the token is rotated and that the token is stored in SSM Parameter Store
encrypted with KMS.

:::

#### GitHub Application

Follow the quickstart with the upstream module,
[cloudposse/terraform-aws-github-action-token-rotator](https://github.com/cloudposse/terraform-aws-github-action-token-rotator#quick-start),
or follow the steps below.

1. Create a new GitHub App
1. Add the following permission:

```diff
# Required Permissions for Repository Runners:
## Repository Permissions
+ Actions (read)
+ Administration (read / write)
+ Metadata (read)

# Required Permissions for Organization Runners:
## Repository Permissions
+ Actions (read)
+ Metadata (read)

## Organization Permissions
+ Self-hosted runners (read / write)
```

1. Generate a Private Key

If you are working with Cloud Posse, upload this Private Key, GitHub App ID, and Github App Installation ID to 1Password
and skip the rest. Otherwise, complete the private key setup in `core-<default-region>-auto`.

1. Convert the private key to a PEM file using the following command:
   `openssl pkcs8 -topk8 -inform PEM -outform PEM -nocrypt -in \{DOWNLOADED_FILE_NAME\}.pem -out private-key-pkcs8.key`
1. Upload PEM file key to the specified ssm path: `/github/runners/acme/private-key` in `core-<default-region>-auto`
1. Create another sensitive SSM parameter `/github/runners/acme/registration-token` in `core-<default-region>-auto` with
   any basic value, such as "foo". This will be overwritten by the rotator.
1. Update the GitHub App ID and Installation ID in the `github-action-token-rotator` catalog.

:::info

If you change the Private Key saved in SSM, redeploy `github-action-token-rotator`

:::

#### (ClickOps) Obtain the Runner Registration Token

1. Browse to
   [https://github.com/organizations/\{Org\}/settings/actions/runners](https://github.com/organizations/\{Org\}/settings/actions/runners)
   (Organization) or
   [https://github.com/\{Org\}/\{Repo\}/settings/actions/runners](https://github.com/\{Org\}/\{Repo\}/settings/actions/runners)
   (Repository)

2. Click the **New Runner** button (Organization) or **New Self Hosted Runner** button (Repository)

3. Copy the Github Runner token from the next screen. Note that this is the only time you will see this token. Note that
   if you exit the `New \{Self Hosted\} Runner` screen and then later return by clicking the `New \{Self Hosted\} Runner`
   button again, the registration token will be invalidated and a new token will be generated.

<img src="/assets/refarch/cleanshot-2022-03-01-at-16.12.26-20220302-005927.png" height="1010" width="833" /><br/>

4. Add the `REGISTRATION_TOKEN` to the `/github/token` SSM parameter in the account where Github runners are hosted
   (usually `automation`), encrypted with KMS.

```
chamber write github token <value>
```

# FAQ

## The GitHub Registration Token is not updated in SSM

The `github-action-token-rotator` runs an AWS Lambda function every 30 minutes. This lambda will attempt to use a
private key in its environment configuration to generate a GitHub Registration Token, and then store that token to AWS
SSM Parameter Store.

If the GitHub Registration Token parameter, `/github/runners/acme/registration-token`, is not updated, read through the
following tips:

1. The private key is stored at the given parameter path:
   `parameter_store_private_key_path: /github/runners/acme/private-key`
1. The private key is Base 64 encoded. If you pull the key from SSM and decode it, it should begin with
   `-----BEGIN PRIVATE KEY-----`
1. If the private key has changed, you must _redeploy_ `github-action-token-rotator`. Run a plan against the component
   to make sure there are not changes required.

## The GitHub Registration Token is valid, but the Runners are not registering with GitHub

If you first deployed the `github-action-token-rotator` component initally with an invalid configuration and then
deployed the `github-runners` component, the instance runners will have failed to register with GitHub.

After you correct `github-action-token-rotator` and have a valid GitHub Registration Token in SSM, _destroy and
recreate_ the `github-runners` component.

If you cannot see the runners registered in GitHub, check the system logs on one of EC2 Instances in AWS in
`core-<default-region>-auto`.

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

<!-- prettier-ignore-start -->
<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- hello terraform-docs -->
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- prettier-ignore-end -->

## FAQ

### Can we scope it to a github org with both private and public repos ?

Yes but this requires Github Enterprise Cloud and the usage of runner groups to scope permissions of runners to specific
repos. If you set the scope to the entire org without runner groups and if the org has both public and private repos,
then the risk of using a self-hosted runner incorrectly is a vulnerability within public repos.

[https://docs.github.com/en/actions/hosting-your-own-runners/managing-access-to-self-hosted-runners-using-groups](https://docs.github.com/en/actions/hosting-your-own-runners/managing-access-to-self-hosted-runners-using-groups)

If you do not have github enterprise cloud and runner groups cannot be utilized, then it’s best to create new github
runners per repo or use the summerwind action-runners-controller via a Github App to set the scope to specific repos.

### How can we see the current spot pricing?

Go to [ec2instances.info](http://ec2instances.info/)

### If we don’t use mixed at all does that mean we can’t do spot?

It’s possible to do spot without using mixed instances but you leave yourself open to zero instance availability with a
single instance type.

For example, if you wanted to use spot and use `t3.xlarge` in `us-east-2` and for some reason, AWS ran out of
`t3.xlarge`, you wouldn't have the option to choose another instance type and so all the GitHub Action runs would stall
until availability returned. If you use on-demand pricing, it’s more expensive, but you’re more likely to get scheduling
priority. For guaranteed availability, reserved instances are required.

### Do the overrides apply to both the on-demand and the spot instances, or only the spot instances?

Since the overrides affect the launch template, I believe they will affect both spot instances and override since
weighted capacity can be set for either or. The override terraform option is on the ASG’s `launch_template`

> List of nested arguments provides the ability to specify multiple instance types. This will override the same
> parameter in the launch template. For on-demand instances, Auto Scaling considers the order of preference of instance
> types to launch based on the order specified in the overrides list. Defined below. And in the terraform resource for
> `instances_distribution`

> `spot_max_price` - (Optional) Maximum price per unit hour that the user is willing to pay for the Spot instances.
> Default: an empty string which means the on-demand price. For a `mixed_instances_policy`, this will do purely
> on-demand

```
        mixed_instances_policy:
          instances_distribution:
            on_demand_allocation_strategy: "prioritized"
            on_demand_base_capacity: 1
            on_demand_percentage_above_base_capacity: 0
            spot_allocation_strategy: "capacity-optimized"
            spot_instance_pools: null
            spot_max_price: []
```

This will always do spot unless instances are unavailable, then switch to on-demand.

```
        mixed_instances_policy:
          instances_distribution:
            # ...
            spot_max_price: 0.05
```

If you want a single instance type, you could still use the mixed instances policy to define that like above, or you can
use these other inputs and comment out the `mixed_instances_policy`

```
        instance_type: "t3.xlarge"
        # the below is optional in order to set the spot max price
        instance_market_options:
          market_type = "spot"
          spot_options:
            block_duration_minutes: 6000
            instance_interruption_behavior: terminate
            max_price: 0.05
            spot_instance_type = persistent
            valid_until: null
```

The `overrides` will override the `instance_type` above.

## References

- [cloudposse/terraform-aws-components](https://github.com/cloudposse/terraform-aws-components/tree/main/modules/github-runners) -
  Cloud Posse's upstream component
- [AWS: Auto Scaling groups with multiple instance types and purchase options](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-mixed-instances-groups.html)
- [InstancesDistribution](https://docs.aws.amazon.com/autoscaling/ec2/APIReference/API_InstancesDistribution.html)

* [MixedInstancesPolicy](https://docs.aws.amazon.com/autoscaling/ec2/APIReference/API_MixedInstancesPolicy.html)
* [Terraform ASG `Override` Attribute](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/autoscaling_group#override)



