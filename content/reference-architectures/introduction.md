---
title: "Introduction to Reference Architectures"
description: "Introduction to Cloud Posse Reference Architectures"
weight: 1
tags:
- aws
- account
- security
- best practices
- root
- prod
- staging
- audit
- dev
---

At Cloud Posse, we use the following AWS accounts to provision infrastructure for different environments:

* [root](https://github.com/cloudposse/root.cloudposse.co) - Root account that we use to provision the IAM users to grant access to all other accounts
* [prod](https://github.com/cloudposse/prod.cloudposse.co) - main Production account
* [staging](https://github.com/cloudposse/staging.cloudposse.co) - Staging account
* [audit](https://github.com/cloudposse/audit.cloudposse.co) - Audit account
* [dev](https://github.com/cloudposse/dev.cloudposse.co) - Development account
* [testing](https://github.com/cloudposse/testing.cloudposse.co) - Testing account used for fast provisioning and destroying infrastructure for testing purposes

We provision each stage into a separate AWS account, which gives us the following benefits:

* **Complete separation of resources** - you can't affect anything in one account (e.g. `prod`) by doing something in another (e.g. `staging`)
* **Better security** - each account has its own users, roles, and permissions. Users can only access the accounts for which they have the required permissions by assuming IAM roles, and won't be able to see anything else
* **Simpler DevOps** - you can destroy everything in one account (e.g. `terraform destroy`) without affecting any resources in the other accounts
* **Easier management** - it's much easier to manage users, roles and permissions per account than try to remember the web of dependencies of who can access what in a single account
* **Simpler audit and compliance** - we provision a `CloudTrail` state bucket only in the `audit` account to collect `CloudTrail` logs from all other accounts. 
`CloudTrail` logs are automatically separated into different folders per account in the S3 bucket. Only a restricted set of users can have access to the `audit` account

{{% dialog type="info" icon="fa-info-circle" title="Note" %}}
From the operational point of view, it would be easier (and faster) to provision all the infrastructure into just one AWS account.

However, we strongly recommend using multiple accounts for the benefits described above.

At Cloud Posse, we always follow these best practices.

Depending on your requirements, you might not need all the stages (e.g. the `audit` or `dev` stage might not be required).

You also might not need to provision all the resources (e.g. `backing-services/aurora-postgres` or `acm-cloudfront`).

See [Notes on Using Multiple AWS Accounts]({{< relref "reference-architectures/notes-on-multiple-aws-accounts.md" >}}) for more details.
{{% /dialog %}}
