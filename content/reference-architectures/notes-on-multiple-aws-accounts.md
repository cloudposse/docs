---
title: "Notes on Using Multiple AWS Accounts"
description: "Describes why Cloud Posse recommends using multiple AWS accounts to provision infrastructure into different environments"
weight: 3
tags:
- account
- cold start
- infrastructure
- environment
---

We strongly recommend using multiple AWS accounts and provision a stage (e.g. `prod`, `staging`, `audit`, `dev`) per account.

However, in some cases it might be not possible for operational, organizational or other reasons. 

Here are three typical use-cases we've seen:

1. We are in control of the master account and can create Organization on top of it and member accounts in it
2. We are given one account (not the master) and we can’t create Organization, but we can create (or request) more accounts under the same Organization
3. We have only one account in total

All three cases are covered by our Reference Architectures and the Cold Start process described in [Cold Start]({{< relref "reference-architectures/cold-start.md" >}}).

1. This use-case is completely covered by [Cold Start]({{< relref "reference-architectures/cold-start.md" >}})

2. One of the member accounts will be named `root` and will behave as a root from the DevOps point of view, but not the root of the accounts hierarchy in an Organization.
The other accounts will be named by the stage names (`prod`, `staging`. etc.).
We just don’t provision Organization.

3. In case of only one account, the `root` will be a virtual root, not the root of the Organization hierarchy.
We still work in a `geodesic` shell per virtual account.
Since we use the `label` pattern, resource naming should not be a problem and will not create any naming conflicts.
We don’t provision Organization and member accounts.
In `~/.aws/config` we use profiles with the same names (e.g. `cpco-testing-admin`, `cpco-root-admin`).
The only difference is that we use the same account ID and don’t use `OrganizationAccountAccessRole`.

For example, instead of this profile configuration:

{{% dialog type="code-block" icon="fa fa-code" title="~/.aws/config" %}}
```
[profile cpco-testing-admin]
region=us-west-2
role_arn=arn:aws:iam::126450723953:role/OrganizationAccountAccessRole
mfa_serial=arn:aws:iam::323330167063:mfa/admin@cloudposse.co
source_profile=cpco

[profile cpco-root-admin]
region=us-west-2
role_arn=arn:aws:iam::323330167063:role/cpco-root-admin
mfa_serial=arn:aws:iam::323330167063:mfa/admin@cloudposse.co
source_profile=cpco
```
{{% /dialog %}}

We use this:

{{% dialog type="code-block" icon="fa fa-code" title="~/.aws/config" %}}
```
[profile cpco-testing-admin]
region=us-west-2
role_arn=arn:aws:iam::323330167063:role/cpco-root-admin
mfa_serial=arn:aws:iam::323330167063:mfa/admin@cloudposse.co
source_profile=cpco

[profile cpco-root-admin]
region=us-west-2
role_arn=arn:aws:iam::323330167063:role/cpco-root-admin
mfa_serial=arn:aws:iam::323330167063:mfa/admin@cloudposse.co
source_profile=cpco
```
{{% /dialog %}}

From different `geodesic` shells (`root` and `testing`) we login to the same AWS account under the same IAM role.


## Learn More

To learn more about AWS multi-account architectures, we recommend checking out these YouTube videos from AWS Re:invent:

[AWS re:Invent 2017: Architecting Security and Governance Across a Multi-Account Strategy](https://www.youtube.com/watch?v=71fD8Oenwxc&feature=youtu.be)

{{< youtube id="71fD8Oenwxc" >}}

[AWS re:Invent 2016: Architecting Security and Governance Across a Multi-Account Strategy](https://www.youtube.com/watch?v=pqq39mZKQXU&feature=youtu.be)

{{< youtube id="pqq39mZKQXU" >}}

<br>
