---
title: ssm-parameters
sidebar_label: ssm-parameters
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/ssm-parameters/README.md
tags: [terraform, aws, ssm-parameters]
---

# Component: `ssm-parameters`

This component is responsible for provisioning Parameter Store resources against AWS SSM. It supports normal parameter
store resources that can be configured directly in YAML OR pulling secret values from a local Sops file.

## Usage

**Stack Level**: Regional

Here are some example snippets for how to use this component:

`stacks/dev/us-east-1.yaml` file:

```yaml
components:
  terraform:
    ssm-parameters:
      vars:
        sops_source_file: ../../config/secrets/dev.yaml
        sops_source_key: ssm_params
        params:
          /DEV/TESTING:
            value: This is a test of the emergency broadcast system.
            description: This is a test.
            overwrite: true
            type: String
```

<!-- prettier-ignore-start -->
<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- hello terraform-docs -->
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- prettier-ignore-end -->

## References

- [cloudposse/terraform-aws-components](https://github.com/cloudposse/terraform-aws-components/tree/main/modules/ssm-parameters) -
  Cloud Posse's upstream component



