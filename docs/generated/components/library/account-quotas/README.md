---
title: account-quotas
sidebar_label: account-quotas
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/account-quotas/README.md
tags: [terraform, aws, account-quotas]
---

# Component: `account-quotas`

This component is responsible for requesting service quota increases. We recommend making requests here rather than in
`account-settings` because `account-settings` is a restricted component that can only be applied by SuperAdmin.

## Usage

**Stack Level**: Global and Regional (depending on quota)

Global resources must be provisioned in `us-east-1`. Put them in the `gbl` stack, but set `region: us-east-1` in the
`vars` section.

You can refer to services either by their exact full name (e.g.
`service_name: "Amazon Elastic Compute Cloud (Amazon EC2)"`) or by the service code (e.g. `service_code: "ec2"`).
Similarly, you can refer to quota names either by their exact full name (e.g. `quota_name: "EC2-VPC Elastic IPs"`) or by
the quota code (e.g. `quota_code: "L-0263D0A3"`).

You can find service codes and full names via the AWS CLI (be sure to use the correct region):

```bash
aws --region us-east-1 service-quotas list-services
```

You can find quota codes and full names, and also whether the quotas are adjustable or global, via the AWS CLI, but you
will need the service code from the previous step:

```bash
aws --region us-east-1 service-quotas list-service-quotas --service-code ec2
```

If you make a request to raise a quota, the output will show the requested value as `value` while the request is
pending.

Even though the Terraform will submit the support request, you may need to follow up with AWS support to get the request
approved, via the AWS console or email.

Here's an example snippet for how to use this component.

```yaml
components:
  terraform:
    account-quotas:
      vars:
        quotas:
          vpcs-per-region:
            service_code: vpc
            quota_name: "VPCs per Region"
            value: 10
          vpc-elastic-ips:
            service_code: ec2
            quota_name: "EC2-VPC Elastic IPs"
            value: 10
```

<!-- prettier-ignore-start -->
<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- hello terraform-docs -->
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- prettier-ignore-end -->

## References

- [AWS Service Quotas](https://docs.aws.amazon.com/general/latest/gr/aws_service_limits.html)
- AWS CLI
  [command to list service codes](https://awscli.amazonaws.com/v2/documentation/api/latest/reference/service-quotas/list-services.html):
  `aws service-quotas list-services`



