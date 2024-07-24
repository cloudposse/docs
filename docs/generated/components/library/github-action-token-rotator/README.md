---
title: github-action-token-rotator
sidebar_label: github-action-token-rotator
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/github-action-token-rotator/README.md
tags: [terraform, aws, github-action-token-rotator]
---

# Component: `github-action-token-rotator`

This component is responsible for provisioning
[Github Action Token Rotator](https://github.com/cloudposse/terraform-aws-github-action-token-rotator).

This component creates a Lambda to rotate Github Action tokens in SSM Parameter Store.

## Usage

**Stack Level**: Regional

Here's an example snippet for how to use this component. This is generally deployed once and to the automation account's
primary region.

`stacks/catalog/github-action-token-rotator.yaml` file:

```yaml
components:
  terraform:
    github-action-token-rotator:
      vars:
        enabled: true
        github_org_name: my-org
        github_app_installation_id: 11111111
        github_app_id: 222222
        parameter_store_private_key_path: /github/runners/my-org/privateKey
        parameter_store_token_path: /github/runners/my-org/registrationToken
```

Follow the manual steps using the
[guide in the upstream module](https://github.com/cloudposse/terraform-aws-github-action-token-rotator#quick-start) and
use `chamber` to add the secrets to the appropriate stage.

<!-- prettier-ignore-start -->
<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- hello terraform-docs -->
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- prettier-ignore-end -->

## References

- [cloudposse/terraform-aws-components](https://github.com/cloudposse/terraform-aws-components/tree/main/modules/github-action-token-rotator) -
  Cloud Posse's upstream component



