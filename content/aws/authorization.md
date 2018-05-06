---
title: AWS IAM Authorization
excerpt: ''
---

You can access AWS by Web console or AWS CLI.

# Authorization via Web Console

# Authorization using AWS CLI

Then set up your AWS credentials in `~/.aws/credentials`. This should be shared by all AWS accounts in the Organization.

```bash
[example]
aws_access_key_id = XXXXXXXXXXXXXXXXXXXX
aws_secret_access_key = XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

Following [IAM Best Practices]({{< relref "aws/iam/best-practices.md" >}}) users have minimum permissions by default, but they can assume [IAM Roles]({{< relref "aws/iam/assuming-roles.md" >}}) that provides wide access to AWS.

To config assume role access add AWS profile in `~/.aws/config`. Make sure to change username to your own.

```bash
[profile example-staging-admin]
region=us-west-2
role_arn=arn:aws:iam::XXXXXXXXXXXX:role/OrganizationAccountAccessRole
mfa_serial=arn:aws:iam::XXXXXXXXXXXX:mfa/erik@cloudposse.com
source_profile=example
```

In provided example: `example` - source profile name `example-staging-admin` - name of profile with assumed role `role_arn` - ARN of role to assume `mfa_serial` - use MFA ARN `source_profile` = name of credentials to use. specified in `~/.aws/credentials`

We recommend authorizing with assumed role profile using [AWS Vault]({{< relref "tools/aws-vault.md" >}}). AWS vault is included in [Geodesic Overview](/geodesic) so you can use it in the geodesic shell
