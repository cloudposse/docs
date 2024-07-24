---
title: iam-service-linked-roles
sidebar_label: iam-service-linked-roles
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/iam-service-linked-roles/README.md
tags: [terraform, aws, iam-service-linked-roles]
---

# Component: `iam-service-linked-roles`

This component is responsible for provisioning
[IAM Service-Linked Roles](https://docs.aws.amazon.com/IAM/latest/UserGuide/using-service-linked-roles.html).

## Usage

**Stack Level**: Global

```yaml
components:
  terraform:
    iam-service-linked-roles:
      settings:
        spacelift:
          workspace_enabled: true
      vars:
        enabled: true
        service_linked_roles:
          spot_amazonaws_com:
            aws_service_name: "spot.amazonaws.com"
            description: "AWSServiceRoleForEC2Spot Service-Linked Role for EC2 Spot"
          spotfleet_amazonaws_com:
            aws_service_name: "spotfleet.amazonaws.com"
            description: "AWSServiceRoleForEC2SpotFleet Service-Linked Role for EC2 Spot Fleet"
```

## Service-Linked Roles for EC2 Spot and EC2 Spot Fleet

**Note:** If you want to use EC2 Spot or Spot Fleet, you will need to provision the following Service-Linked Roles:

- Service-Linked Role for EC2 Spot
- Service-Linked Role for EC2 Spot Fleet

This is only necessary if this is the first time you're using EC2 Spot and Spot Fleet in the account.

Note that if the Service-Linked Roles already exist in the AWS account (if you used EC2 Spot or Spot Fleet before), and
you try to provision them again, you will see the following errors:

```text
An error occurred (InvalidInput) when calling the CreateServiceLinkedRole operation:
Service role name AWSServiceRoleForEC2Spot has been taken in this account, please try a different suffix

An error occurred (InvalidInput) when calling the CreateServiceLinkedRole operation:
Service role name AWSServiceRoleForEC2SpotFleet has been taken in this account, please try a different suffix
```

For more details, see:

- https://docs.aws.amazon.com/batch/latest/userguide/spot_fleet_IAM_role.html
- https://docs.aws.amazon.com/IAM/latest/UserGuide/using-service-linked-roles.html

<!-- prettier-ignore-start -->
<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- hello terraform-docs -->
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- prettier-ignore-end -->

## References

- [cloudposse/terraform-aws-components](https://github.com/cloudposse/terraform-aws-components/tree/main/modules/iam-service-linked-roles) -
  Cloud Posse's upstream component



