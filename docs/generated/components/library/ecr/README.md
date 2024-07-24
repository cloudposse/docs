---
title: ecr
sidebar_label: ecr
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/ecr/README.md
tags: [terraform, aws, ecr]
---

# Component: `ecr`

This component is responsible for provisioning repositories, lifecycle rules, and permissions for streamlined ECR usage.
This utilizes
[the roles-to-principals submodule](https://github.com/cloudposse/terraform-aws-components/tree/main/modules/account-map/modules/roles-to-principals)
to assign accounts to various roles. It is also compatible with the
[GitHub Actions IAM Role mixin](https://github.com/cloudposse/terraform-aws-components/blob/master/mixins/github-actions-iam-role/README-github-action-iam-role.md).

:::caution Older versions of our reference architecture have an`eks-iam` component that needs to be updated to provide
sufficient IAM roles to allow pods to pull from ECR repos

:::

## Usage

**Stack Level**: Regional

Here's an example snippet for how to use this component. This component is normally only applied once as the resources
it creates are globally accessible, but you may want to create ECRs in multiple regions for redundancy. This is
typically provisioned via the stack for the "artifact" account (typically `auto`, `artifact`, or `corp`) in the primary
region.

```yaml
components:
  terraform:
    ecr:
      vars:
        ecr_user_enabled: false
        enable_lifecycle_policy: true
        max_image_count: 500
        scan_images_on_push: true
        protected_tags:
          - prod
        image_tag_mutability: MUTABLE

        images:
          - infrastructure
          - microservice-a
          - microservice-b
          - microservice-c
        read_write_account_role_map:
          identity:
            - admin
            - cicd
          automation:
            - admin
        read_only_account_role_map:
          corp: ["*"]
          dev: ["*"]
          prod: ["*"]
          stage: ["*"]
```

<!-- prettier-ignore-start -->
<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- hello terraform-docs -->
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- prettier-ignore-end -->

## Related

- [Decide How to distribute Docker Images](https://docs.cloudposse.com/reference-architecture/design-decisions/foundational-platform/decide-how-to-distribute-docker-images)

- [Decide on ECR Strategy](https://docs.cloudposse.com/reference-architecture/design-decisions/foundational-platform/decide-on-ecr-strategy)

## References

- [cloudposse/terraform-aws-components](https://github.com/cloudposse/terraform-aws-components/tree/main/modules/ecr) -
  Cloud Posse's upstream component



