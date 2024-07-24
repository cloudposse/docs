---
title: github-oidc-role
sidebar_label: github-oidc-role
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/github-oidc-role/README.md
tags: [terraform, aws, github-oidc-role]
---

# Component: `github-oidc-role`

This component is responsible for creating IAM roles for GitHub Actions to assume.

## Usage

**Stack Level**: Global

Here's an example snippet for how to use this component.

```yaml
# stacks/catalog/github-oidc-role/defaults.yaml
components:
  terraform:
    github-oidc-role/defaults:
      metadata:
        type: abstract
      vars:
        enabled: true
        name: gha-iam
        # Note: inherited lists are not merged, they are replaced
        github_actions_allowed_repos:
          - MyOrg/* ## allow all repos in MyOrg
```

Example using for gitops (predefined policy):

```yaml
# stacks/catalog/github-oidc-role/gitops.yaml
import:
  - catalog/github-oidc-role/defaults

components:
  terraform:
    github-oidc-role/gitops:
      metadata:
        component: github-oidc-role
        inherits:
          - github-oidc-role/defaults
      vars:
        enabled: true
        # Note: inherited lists are not merged, they are replaced
        github_actions_allowed_repos:
          - "MyOrg/infrastructure"
        attributes: ["gitops"]
        iam_policies:
          - gitops
        gitops_policy_configuration:
          s3_bucket_component_name: gitops/s3-bucket
          dynamodb_component_name: gitops/dynamodb
```

Example using for lambda-cicd (predefined policy):

```yaml
# stacks/catalog/github-oidc-role/lambda-cicd.yaml
import:
  - catalog/github-oidc-role/defaults

components:
  terraform:
    github-oidc-role/lambda-cicd:
      metadata:
        component: github-oidc-role
        inherits:
          - github-oidc-role/defaults
      vars:
        enabled: true
        github_actions_allowed_repos:
          - MyOrg/example-app-on-lambda-with-gha
        attributes: ["lambda-cicd"]
        iam_policies:
          - lambda-cicd
        lambda_cicd_policy_configuration:
          enable_ssm_access: true
          enable_s3_access: true
          s3_bucket_component_name: s3-bucket/github-action-artifacts
          s3_bucket_environment_name: gbl
          s3_bucket_stage_name: artifacts
          s3_bucket_tenant_name: core
```

Example Using an AWS Managed policy and a custom inline policy:

```yaml
# stacks/catalog/github-oidc-role/custom.yaml
import:
  - catalog/github-oidc-role/defaults

components:
  terraform:
    github-oidc-role/custom:
      metadata:
        component: github-oidc-role
        inherits:
          - github-oidc-role/defaults
      vars:
        enabled: true
        github_actions_allowed_repos:
          - MyOrg/example-app-on-lambda-with-gha
        attributes: ["custom"]
        iam_policies:
          - arn:aws:iam::aws:policy/AdministratorAccess
        iam_policy:
          - version: "2012-10-17"
            statements:
              - effect: "Allow"
                actions:
                  - "ec2:*"
                resources:
                  - "*"
```

### Adding Custom Policies

There are two methods for adding custom policies to the IAM role.

1. Through the `iam_policy` input which you can use to add inline policies to the IAM role.
2. By defining policies in Terraform and then attaching them to roles by name.

#### Defining Custom Policies in Terraform

1. Give the policy a unique name, e.g. `docker-publish`. We will use `NAME` as a placeholder for the name in the
   instructions below.
2. Create a file in the component directory (i.e. `github-oidc-role`) with the name `policy_NAME.tf`.
3. In that file, conditionally (based on need) create a policy document as follows:

   ```hcl
   locals {
     NAME_policy_enabled = contains(var.iam_policies, "NAME")
     NAME_policy         = local.NAME_policy_enabled ? one(data.aws_iam_policy_document.NAME.*.json) : null
   }

   data "aws_iam_policy_document" "NAME" {
     count = local.NAME_policy_enabled ? 1 : 0

     # Define the policy here
   }
   ```

   Note that you can also add input variables and outputs to this file if desired. Just make sure that all inputs are
   optional.

4. Create a file named `additional-policy-map_override.tf` in the component directory (if it does not already exist).
   This is a [terraform override file](https://developer.hashicorp.com/terraform/language/files/override), meaning its
   contents will be merged with the main terraform file, and any locals defined in it will override locals defined in
   other files. Having your code in this separate override file makes it possible for the component to provide a
   placeholder local variable so that it works without customization, while allowing you to customize the component and
   still update it without losing your customizations.
5. In that file, redefine the local variable `overridable_additional_custom_policy_map` map as follows:

   ```hcl
   locals {
     overridable_additional_custom_policy_map = {
       "NAME" = local.NAME_policy
     }
   }
   ```

   If you have multiple custom policies, using just this one file, add each policy document to the map in the form
   `NAME = local.NAME_policy`.

6. With that done, you can now attach that policy by adding the name to the `iam_policies` list. For example:

   ```yaml
   iam_policies:
     - "arn:aws:iam::aws:policy/job-function/ViewOnlyAccess"
     - "NAME"
   ```

<!-- prettier-ignore-start -->
<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- hello terraform-docs -->
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- prettier-ignore-end -->

## References

- [cloudposse/terraform-aws-components](https://github.com/cloudposse/terraform-aws-components/tree/main/modules/github-oidc-role) -
  Cloud Posse's upstream component



