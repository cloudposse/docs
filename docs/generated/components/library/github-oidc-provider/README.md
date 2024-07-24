---
title: github-oidc-provider
sidebar_label: github-oidc-provider
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/github-oidc-provider/README.md
tags: [terraform, aws, github-oidc-provider]
---

# Component: `github-oidc-provider`

This component is responsible for authorizing the GitHub OIDC provider as an Identity provider for an AWS account. It is
meant to be used in concert with `aws-teams` and `aws-team-roles` and/or with `github-actions-iam-role.mixin.tf`

## Usage

**Stack Level**: Global

Here's an example snippet for how to use this component.

- This must be installed in the `identity` account in order to use standard SAML roles with role chaining.
- This must be installed in each individual account where you want to provision a service role for a GitHub action that
  will be assumed directly by the action.

For security, since this component adds an identity provider, only SuperAdmin can install it.

```yaml
components:
  terraform:
    github-oidc-provider:
      vars:
        enabled: true
```

## Configuring the Github OIDC Provider

This component was created to add the Github OIDC provider so that Github Actions can safely assume roles without the
need to store static credentials in the environment. The details of the GitHub OIDC provider are hard coded in the
component, however at some point the provider's thumbprint may change, at which point you can use
[get_github_oidc_thumbprint.sh](https://github.com/cloudposse/terraform-aws-components/blob/main/modules/github-oidc-provider/scripts/get_github_oidc_thumbprint.sh)
to get the new thumbprint and add it to the list in `var.thumbprint_list`.

This script will pull one of two thumbprints. There are two possible intermediary certificates for the Actions SSL
certificate and either can be returned by the GitHub servers, requiring customers to trust both. This is a known
behavior when the intermediary certificates are cross-signed by the CA. Therefore, run this script until both values are
retrieved. Add both to `var.thumbprint_list`.

For more, see https://github.blog/changelog/2023-06-27-github-actions-update-on-oidc-integration-with-aws/

## FAQ

### I cannot assume the role from GitHub Actions after deploying

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

## References

- [cloudposse/terraform-aws-components](https://github.com/cloudposse/terraform-aws-components/tree/main/modules/github-oidc-provider) -
  Cloud Posse's upstream component



