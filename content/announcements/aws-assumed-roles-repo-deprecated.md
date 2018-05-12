---
title: "AWS Assumed Roles Repo Deprecated"
description: "We've decided to deprecate our [`aws-assume-role`](https://github.com/cloudposse/aws-assumed-role) repo in favor of using [`aws-vault`](https://github.com/99designs/aws-vault) by 99 Designs."
publishDate: "2018-03-31 19:59:58"
tags:
- "aws-assumed-roles"
- "iam"
- "geodesic"
---
We've decided to deprecate our [`aws-assume-role`](https://github.com/cloudposse/aws-assumed-role) repo in favor of using [`aws-vault`](https://github.com/99designs/aws-vault) by 99 Designs. This offers an outstanding, ultra-secure experience for working with IAM assumed roles for local development.

## AWS Vault Features:

 * Encrypted vault for IAM credentials (OSX KeyChain or file)
 * IAM Metadata server
 * MFA Token
 * Variable Session TTLs

This has been incorporated into our latest release of [geodesic]({{< relref "announcements/new-major-release-of-geodesic.md" >}}).
