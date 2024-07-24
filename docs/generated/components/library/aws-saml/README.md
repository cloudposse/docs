---
title: aws-saml
sidebar_label: aws-saml
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/aws-saml/README.md
tags: [terraform, aws, aws-saml]
---

# Component: `aws-saml`

This component is responsible for provisioning SAML metadata into AWS IAM as new SAML providers. Additionally, for an
Okta integration (`okta` must be mentioned in the key given to the `saml_providers` input) it creates an Okta API user
and corresponding Access Key pair which is pushed into AWS SSM.

## Usage

**Stack Level**: Global, in the account to which users will log in, typically only `identity`

Here's an example snippet for how to use this component.

**IMPORTANT**: The given SAML metadata files must exist at the root of the module.

```yaml
components:
  terraform:
    aws-saml:
      vars:
        enabled: true
        saml_providers:
          enabled: true
          example-okta: Okta_metadata_example.xml
          example-gsuite: GoogleIDPMetadata-example.com.xml
```

<!-- prettier-ignore-start -->
<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- hello terraform-docs -->
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- prettier-ignore-end -->

## References

- [cloudposse/terraform-aws-components](https://github.com/cloudposse/terraform-aws-components/tree/main/modules/sso) -
  Cloud Posse's upstream component



