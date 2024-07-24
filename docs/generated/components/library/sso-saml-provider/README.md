---
title: sso-saml-provider
sidebar_label: sso-saml-provider
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/sso-saml-provider/README.md
tags: [terraform, aws, sso-saml-provider]
---

# Component: `sso-saml-provider`

This component reads sso credentials from SSM Parameter store and provides them as outputs

## Usage

**Stack Level**: Regional

Use this in the catalog or use these variables to overwrite the catalog values.

```yaml
components:
  terraform:
    sso-saml-provider:
      settings:
        spacelift:
          workspace_enabled: true
      vars:
        enabled: true
        ssm_path_prefix: "/sso/saml/google"
```

<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- hello terraform-docs -->
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->


