---
title: github-webhook
sidebar_label: github-webhook
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/github-webhook/README.md
tags: [terraform, aws, github-webhook]
---

# Component: `github-webhook`

This component provisions a GitHub webhook for a single GitHub repository.

You may want to use this component if you are provisioning webhooks for multiple ArgoCD deployment repositories across
GitHub organizations.

## Usage

**Stack Level**: Regional

Here's an example snippet for how to use this component. This example pulls the value of the webhook from `remote-state`

```yaml
components:
  terraform:
    webhook/cloudposse/argocd:
      metadata:
        component: github-webhook
      vars:
        github_organization: cloudposse
        github_repository: argocd-deploy-non-prod
        webhook_url: "https://argocd.ue2.dev.plat.cloudposse.org/api/webhook"

        remote_state_github_webhook_enabled: true # default value added for visibility
        remote_state_component_name: eks/argocd
```

### SSM Stored Value Example

Here's an example snippet for how to use this component with a value stored in SSM

```yaml
components:
  terraform:
    webhook/cloudposse/argocd:
      metadata:
        component: github-webhook
      vars:
        github_organization: cloudposse
        github_repository: argocd-deploy-non-prod
        webhook_url: "https://argocd.ue2.dev.plat.cloudposse.org/api/webhook"

        remote_state_github_webhook_enabled: false
        ssm_github_webhook_enabled: true
        ssm_github_webhook: "/argocd/github/webhook"
```

### Input Value Example

Here's an example snippet for how to use this component with a value stored in Terraform variables.

```yaml
components:
  terraform:
    webhook/cloudposse/argocd:
      metadata:
        component: github-webhook
      vars:
        github_organization: cloudposse
        github_repository: argocd-deploy-non-prod
        webhook_url: "https://argocd.ue2.dev.plat.cloudposse.org/api/webhook"

        remote_state_github_webhook_enabled: false
        ssm_github_webhook_enabled: false
        webhook_github_secret: "abcdefg"
```

### ArgoCD Webhooks

For usage with the `eks/argocd` component, see
[Creating Webhooks with `github-webhook`](https://github.com/cloudposse/terraform-aws-components/blob/main/modules/eks/argocd/README.md#creating-webhooks-with-github-webhook)
in that component's README.

<!-- prettier-ignore-start -->
<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- hello terraform-docs -->
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- prettier-ignore-end -->

## References

- [cloudposse/terraform-aws-components](https://github.com/cloudposse/terraform-aws-components) - Cloud Posse's upstream
  components



