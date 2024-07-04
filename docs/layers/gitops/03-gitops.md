# GitOps

## Quick Start

| Steps                           |                                                        |
| :------------------------------ | :----------------------------------------------------- |
| 1. Verify Identity requirements |                                                        |
| 2. Expand GitHub OIDC           | `atmos workflow deploy/github-oidc-provider -f gitops` |
| 2. Vendor                       | `atmos workflow vendor -f gitops`                      |
| 3. Deploy                       | `atmos workflow deploy/gitops -f gitops`               |

## Requirements

### Self-Hosted Runners

Although not required, we recommend first deploying Self-Hosted GitHub runners if you need to manage any resources
inside of a VPC (e.g. RDS Users). For more information on setting up runners, see the
[GitHub Action Runner](https://docs.cloudposse.com/reference-architecture/setup/github-runners/) or
[GitHub Action Runner Controller (EKS)](https://docs.cloudposse.com/reference-architecture/setup/github-arc/) setup
documentation.

If you do not wish to use Self Hosted runners, simply change the `runs-on` option for all included workflows in
`.github/workflows`

### Set Up GitHub Variables

The `gitops` stack config depends on the following GitHub variables:
* `ATMOS_VERSION` - The version of Atmos to use
* `ATMOS_CONFIG_PATH` - The path to the Atmos config file

Please set the following GitHub variables in the repository settings:
   
1. Open the repository [settings](https://github.com/acme/infra-acme/settings/variables/actions) 
2. Set variable `ATMOS_VERSION` to the `1.63.0` value
3. Set variable `ATMOS_CONFIG_PATH` to the `./rootfs/usr/local/etc/atmos/` value 

### Authentication Prerequisites

The GitHub Action workflows expect the `gitops` AWS Team to be properly setup and connected to GitHub OIDC. Both of
these components should already be deployed with `aws-teams`/`aws-team-roles` and `github-oidc-provider` respectively,
but `github-oidc-provider` will likely need to deployed to several additional accounts. Verify the following to complete
the authentication prerequisites.

1. The `gitops` Team is defined and deployed by `aws-teams`.
2. The `gitops` team adds a trusted relationship with the given infrastructure repo, via `trusted_github_repos`.
   _Capitalization matters!_

```yaml
trusted_github_repos:
  gitops:
    - "acme/infra-acme"
```

3. The `aws-team-roles` default catalog allows the `gitops` team to assume the `terraform` role, including anywhere
   `aws-team-roles` is overwritten (`plat-dev` and `plat-sandbox`)
4. `tfstate-backend` allows `gitops` to assume the default access role from the `core-identity` account
5. `github-oidc-provider` is deployed to every account that GitHub will be able to access. This should be every account
   except `root`.
6. The workflows have adequate permission

:::info GitHub Workflow Permissions

In order to assume GitHub OIDC roles, a workflow needs the following:

```yaml
permissions:
  id-token: write # This is required for requesting the JWT
  contents: read # This is required for actions/checkout
```

In order to assume GitHub OIDC roles _and_ manage Github Issues, a workflow needs these permissions:

```yaml
permissions:
  id-token: write # This is required for requesting the JWT
  contents: write # This is required for actions/checkout and updating Issues
  issues: write # This is required for creating and updating Issues
```

:::

## How To

### Vendor

The `gitops` stack config depends on two components that may already exist in your component library (`s3-bucket` and
`dynamodb`) and adds one new component (`gitops`) to manage the GitHub OIDC access. Vendor these components either with
the included Atmos Workflows or using [Atmos Vendoring](https://atmos.tools/core-concepts/components/vendoring).

```bash
atmos workflow vendor -f gitops
```

### Deploy

Deploy three components, `gitops/s3-bucket`, `gitops/dynamodb`, and `gitops` with the following workflow:

```bash
atmos workflow deploy/gitops -f gitops
```

And that's it!

## Tips

1. Enable GitHub Actions support for any component by enabling `settings.github.actions_enabled: true` and let the
   workflow handle the rest. Keep in mind this setting is likely enabled by default for your organization stack
   configuration, `stacks/catalog/acme/_defaults.yaml`
1. The roles created by `aws-teams` or `gitops` should already be included in your workflows. Verify these roles match
   the `env` settings in `.github/workflows/atmos-terraform-*`
1. You do not need to create a GitHub App or complete additional steps to trigger these workflows

# Related Topics

- [Quickstart on GitOps](https://docs.cloudposse.com/reference-architecture/fundamentals/gitops/)