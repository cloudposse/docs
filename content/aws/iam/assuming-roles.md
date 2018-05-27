---
title: AWS IAM Assuming Roles
description: ''
draft: false
tags:
  - iam
  - aws
  - assume-role
---

# Assume Role via AWS Web Console
{{% dialog type="important" icon="fa fa-exclamation-triangle" title="Important" %}}
Due to the security implications, IAM policies are set up by default to **only** allow the root AWS account to assume roles into other accounts.
{{% /dialog %}}

1. Log into the AWS root acccount
{{< img src="/assets/aws-root-login.png" title="Example AWS root login" >}}

2. Click on `user@example.com @ example-root-aws` drop down at the top of the console and select `Switch Role`
  - Enter the AWS account id of the member account in the `Account` field
  - Use `OrganizationAccountAccessRole` as the `Role`
  - (Optional) Pick `Display Name` and choose a `Color` for the role

{{< img src="/assets/aws-switch-role.png" title="Example AWS switch role" >}}

# Assume Role via CLI (using aws-vault)

First, ensure that the proper profiles are setup following [Authorization]({{< relref "aws/iam/authorization.md" >}}).


## Inspect The Environment
```
$ aws-vault exec $profile -- env | grep AWS
```

## Execute a Command Using Temporary Credentials
```
$ aws-vault exec $profile -- aws s3 ls
```
