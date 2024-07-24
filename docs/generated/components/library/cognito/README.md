---
title: cognito
sidebar_label: cognito
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/cognito/README.md
tags: [terraform, aws, cognito]
---

# Component: `cognito`

This component is responsible for provisioning and managing AWS Cognito resources.

This component can provision the following resources:

- [Cognito User Pools](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-identity-pools.html)
- [Cognito User Pool Clients](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-client-apps.html)
- [Cognito User Pool Domains](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-add-custom-domain.html)
- [Cognito User Pool Identity Providers](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-identity-provider.html)
- [Cognito User Pool Resource Servers](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-define-resource-servers.html)
- [Cognito User Pool User Groups](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-user-groups.html)

## Usage

**Stack Level**: Global

Here's an example snippet for how to use this component:

```yaml
components:
  terraform:
    cognito:
      settings:
        spacelift:
          workspace_enabled: true
      vars:
        enabled: true
        # The full name of the User Pool will be: <namespace>-<environment>-<stage>-<name>
        name: cognito
        schemas:
          - name: "email"
            attribute_data_type: "String"
            developer_only_attribute: false
            mutable: false
            required: true
```

<!-- prettier-ignore-start -->
<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- hello terraform-docs -->
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- prettier-ignore-end -->

## References

- [cloudposse/terraform-aws-components](https://github.com/cloudposse/terraform-aws-components/tree/main/modules/cognito) -
  Cloud Posse's upstream component



