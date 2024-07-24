---
title: vpc-peering
sidebar_label: vpc-peering
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/vpc-peering/README.md
tags: [terraform, aws, vpc-peering]
---

# Component: `vpc-peering`

This component is responsible for creating a peering connection between two VPCs existing in different AWS accounts.

## Usage

**Stack Level**: Regional

Here's an example snippet for how to use this component.

Default VPC peering settings for all accounts:

```yaml
# stacks/catalog/vpc-peering/defaults.yaml
components:
  terraform:
    vpc-peering/defaults:
      settings:
        spacelift:
          workspace_enabled: true
      metadata:
        component: vpc-peering
        type: abstract
      vars:
        enabled: true
        requester_allow_remote_vpc_dns_resolution: true
        accepter_allow_remote_vpc_dns_resolution: true
```

Use case: Peering v1 accounts to v2

```yaml
# stacks/catalogs/vpc-peering/ue1-prod.yaml
import:
  - catalog/vpc-peering/defaults

components:
  terraform:
    vpc-peering-use1:
      metadata:
        component: vpc-peering
        inherits:
          - vpc-peering/defaults
      vars:
        accepter_region: us-east-1
        accepter_vpc_id: vpc-xyz
        accepter_aws_assume_role_arn: arn:aws:iam::<LEGACY ACCOUNT ID>:role/acme-vpc-peering
```

Use case: Peering v2 accounts to v2

```yaml
vpc-peering/<stage>-vpc0:
  metadata:
    component: vpc-peering
    inherits:
      - vpc-peering/defaults
  vars:
    requester_vpc_component_name: vpc
    accepter_region: us-east-1
    accepter_stage_name: <fill-in-with-accepter-stage-name>
    accepter_vpc:
      tags:
        # Fill in with your own information
        Name: acme-<tenant>-<environment>-<stage>-<name>
```

## Legacy Account Configuration

The `vpc-peering` component peers the `dev`, `prod`, `sandbox` and `staging` VPCs to a VPC in the legacy account.

The `dev`, `prod`, `sandbox` and `staging` VPCs are the requesters of the VPC peering connection, while the legacy VPC
is the accepter of the peering connection.

To provision VPC peering and all related resources with Terraform, we need the following information from the legacy
account:

- Legacy account ID
- Legacy VPC ID
- Legacy AWS region
- Legacy IAM role (the role must be created in the legacy account with permissions to create VPC peering and routes).
  The name of the role could be `acme-vpc-peering` and the ARN of the role should look like
  `arn:aws:iam::<LEGACY ACCOUNT ID>:role/acme-vpc-peering`

### Legacy Account IAM Role

In the legacy account, create IAM role `acme-vpc-peering` with the following policy:

**NOTE:** Replace `<LEGACY ACCOUNT ID>` with the ID of the legacy account.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["ec2:CreateRoute", "ec2:DeleteRoute"],
      "Resource": "arn:aws:ec2:*:<LEGACY ACCOUNT ID>:route-table/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "ec2:DescribeVpcPeeringConnections",
        "ec2:DescribeVpcs",
        "ec2:ModifyVpcPeeringConnectionOptions",
        "ec2:DescribeSubnets",
        "ec2:DescribeVpcAttribute",
        "ec2:DescribeRouteTables"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "ec2:AcceptVpcPeeringConnection",
        "ec2:DeleteVpcPeeringConnection",
        "ec2:CreateVpcPeeringConnection",
        "ec2:RejectVpcPeeringConnection"
      ],
      "Resource": [
        "arn:aws:ec2:*:<LEGACY ACCOUNT ID>:vpc-peering-connection/*",
        "arn:aws:ec2:*:<LEGACY ACCOUNT ID>:vpc/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": ["ec2:DeleteTags", "ec2:CreateTags"],
      "Resource": "arn:aws:ec2:*:<LEGACY ACCOUNT ID>:vpc-peering-connection/*"
    }
  ]
}
```

Add the following trust policy to the IAM role:

**NOTE:** Replace `<IDENTITY ACCOUNT ID>` with the ID of the `identity` account in the new infrastructure.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": ["arn:aws:iam::<IDENTITY ACCOUNT ID>:root"]
      },
      "Action": ["sts:AssumeRole", "sts:TagSession"],
      "Condition": {}
    }
  ]
}
```

The trust policy allows the `identity` account to assume the role (and provision all the resources in the legacy
account).

## Provisioning

Provision the VPC peering connections in the `dev`, `prod`, `sandbox` and `staging` accounts by executing the following
commands:

```sh
atmos terraform plan vpc-peering -s ue1-sandbox
atmos terraform apply vpc-peering -s ue1-sandbox

atmos terraform plan vpc-peering -s ue1-dev
atmos terraform apply vpc-peering -s ue1-dev

atmos terraform plan vpc-peering -s ue1-staging
atmos terraform apply vpc-peering -s ue1-staging

atmos terraform plan vpc-peering -s ue1-prod
atmos terraform apply vpc-peering -s ue1-prod
```

<!-- prettier-ignore-start -->
<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- hello terraform-docs -->
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- prettier-ignore-end -->

- [cloudposse/terraform-aws-components](https://github.com/cloudposse/terraform-aws-components/tree/main/modules/vpc-peering) -
  Cloud Posse's upstream component



