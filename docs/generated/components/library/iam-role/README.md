---
title: iam-role
sidebar_label: iam-role
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/iam-role/README.md
tags: [terraform, aws, iam-role]
---

# Component: `iam-role`

This component is responsible for provisioning simple IAM roles. If a more complicated IAM role and policy are desired
then it is better to use a separate component specific to that role.

## Usage

**Stack Level**: Global

Abstract

```yaml
# stacks/catalog/iam-role.yaml
components:
  terraform:
    iam-role/defaults:
      metadata:
        type: abstract
        component: iam-role
      settings:
        spacelift:
          workspace_enabled: true
      vars:
        enabled: true
```

Use-case: An IAM role for AWS Workspaces Directory since this service does not have a service linked role.

```yaml
# stacks/catalog/aws-workspaces/directory/iam-role.yaml
import:
  - catalog/iam-role

components:
  terraform:
    aws-workspaces/directory/iam-role:
      metadata:
        component: iam-role
        inherits:
          - iam-role/defaults
      vars:
        name: workspaces_DefaultRole
        # Added _ here to allow the _ character
        regex_replace_chars: /[^a-zA-Z0-9-_]/
        # Keep the current name casing
        label_value_case: none
        # Use the "name" without the other context inputs i.e. namespace, tenant, environment, attributes
        use_fullname: false
        role_description: |
          Used with AWS Workspaces Directory. The name of the role does not match the normal naming convention because this name is a requirement to work with the service. This role has to be used until AWS provides the respective service linked role.
        principals:
          Service:
            - workspaces.amazonaws.com
        # This will prevent the creation of a managed IAM policy
        policy_document_count: 0
        managed_policy_arns:
          - arn:aws:iam::aws:policy/AmazonWorkSpacesServiceAccess
          - arn:aws:iam::aws:policy/AmazonWorkSpacesSelfServiceAccess
```

<!-- prettier-ignore-start -->
<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- hello terraform-docs -->
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- prettier-ignore-end -->

## References

- [cloudposse/terraform-aws-components](https://github.com/cloudposse/terraform-aws-components/tree/main/modules/iam-role) -
  Cloud Posse's upstream component



