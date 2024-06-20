---
title: "Decide on AWS Account Flavors and Organizational Units"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1175978074/REFARCH-55+-+Decide+on+AWS+Account+Flavors+and+Organizational+Units
sidebar_position: 100
refarch_id: REFARCH-55
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/fundamentals/design-decisions/cold-start/decide-on-aws-account-flavors-and-organizational-units.md
---

# Decide on AWS Account Flavors and Organizational Units

## Context and Problem Statement

The [AWS Well-Architected Framework](https://docs.aws.amazon.com/wellarchitected/latest/userguide/wellarchitected-ug.pdf) recommends splitting workloads across multiple AWS accounts.

When moving to an infrastructure-as-code (IaC) model of infrastructure provisioning, many of the same best practices that apply to regular software development should apply to IaC. Part of that is not making changes to a production environment that hasn't been tested in a staging environment. If the production and staging environments are in the same account, then there are insufficient assurances/guarantees/protections in place to prevent breaking production.

Constructs like VPCs only provide network-level isolation, but not IAM-level isolation. And within a single AWS account, there’s no practical way to manage IAM-level boundaries between multiple stages like dev/staging/prod. For example, to provision most terraform modules, “administrative” level access is required because provisioning any IAM roles requires admin privileges. That would mean that a developer needs to be an “admin” in order to iterate on a module.

Leveraging multiple AWS accounts within an AWS Organization is the _only way_ to satisfy these requirements. Guardrails can be be in place to restrict what can happen in an account and by whom.

We must decide how to organize the flat account structure into organizational units. Organizational units can then leverage things like Service Control Policies to restrict what can happen inside the accounts.

Multiple AWS accounts should be used to provide a higher degree of isolation by segmenting/isolating workloads. There is no additional cost for operating multiple AWS accounts.  It does add additional overhead to manage as a standard set of components will to manage the account. AWS support only applies to one account, so it may need to be purchased for each account unless the organization upgrades to Enterprise Support.

Multiple AWS accounts are all managed underneath an AWS Organization and organized into multiple organizational units (OUs). Service Control Policies can restrict what runs in an account and place boundaries around an account that even account-level administrators cannot bypass.

## Considered Options

### AWS Well-Architected Account Designations

Here are some common account designations. Not all are required.

:::tip
This is our recommended approach.

:::

:::note
It is advised to keep the names of accounts as short as possible because of resources with low max character limits [AWS Resources Limitations](/reference-architecture/reference/aws/aws-feature-requests-and-limitations)

:::

|**OU** | **Name (aka stage)** | **Description**|
| ----- | ----- | ----- |
|core | **root** | The "root" (parent, billing) account creates all child accounts. <br/><br/>The root account has special capabilities not found in any other account:<br/><br/>- An administrator in the `root` account by default has the `OrganizationAccountAccessRole` to all other accounts (admin access)<br/><br/><br/>- Organizational CloudTrails can only be provisioned in this account<br/><br/><br/>- It’s the only account that can have member accounts associated with it<br/><br/><br/>- Service Control Policies can only be set in this account<br/><br/><br/>- It’s the only account that can manage the AWS Organization|
|plat | **prod**<br/><br/>(e.g. `prd`) | The "production" is the account where you run your most mission-critical applications|
|plat | **staging**<br/><br/>(e.g. `stg`, `stage`) | The “staging” account is where QA and integration tests will run for public consumption. This is production for QA engineers and partners doing integration tests. It must be stable for third-parties to test. It runs a kubernetes cluster.|
|plat | **sandbox**<br/>(e.g. `sbx01`, `sbx02`) | The "sandbox" account is where you let your developers have fun and break things.  Developers get admin. This is where changes happen first. It will be used by developers who need the bleeding edge. Only DevOps work here or developers trying to get net-new applications added to tools like slice.|
|plat | **dev** | The "dev" account is where to run automated tests, load tests infrastructure code. This is where the entire engineering organization operates daily. It needs to be stable for developers. This environment is Production for developers to develop code.|
|plat | **uat, qa, etc** | Additional or alternative platform accounts|
|core | **audit** | The "audit" account is where all logs end up|
|core | **corp**<br/><br/>(e.g. `it`, `tools`, `gov`) | The "corp" account is where you run the shared platform services for the company<br/><br/>Google calls it “corp”|
|core | **security**<br/><br/>(e.g. `sec`) | The "security" account is where to run automated security scanning software that might operate in a read-only fashion against the audit account.|
|core | **identity** | The "identity" account is where to add users and delegate access to the other accounts and is where users log in|
|core | **network**<br/><br/>(e.g. `net`) | The “network” account is where the transit gateway is managed and all inter-account routing|
|core | **dns** | The “dns” account is the owner for all zones (may have a legal role with `Route53Registrar.*` permissions). Cannot touch zones or anything else. Includes billing.<br/><br/>Use-cases<br/><br/>- Legal team needs to manage DNS and it’s easier to give them access to an account specific to DNS rather than multiple set of resources.|
|core | **automation**<br/><br/>(e.g. `auto`) | The “automation” account is where any gitops automation will live. Some automation (like Spacelift) has “god” mode in this account. <br/><br/><br/><br/>:::caution<br/>The network account will typically have transit gateway access to all other accounts, therefore we want to limit what is deployed in the automation account to only those services which need it.<br/><br/><br/>:::|
|core | **artifacts** | This “artifacts” account is where we recommend centralizing and storing artifacts (e.g. ECR, assets, etc) for CI/CD|
|core | **public**<br/><br/>(e.g. `pub`) | For public S3 buckets, public ECRs, public AMIs, anything public. This will be the only account that doesn’t have a SCP that blocks public s3 buckets.<br/><br/>Use-cases<br/><br/>- All s3 buckets are private by default using a SCP in every account except for the `public` account|
|data | **prod** | The "data" account is where the quants live =) Runs systems like Airflow, Jupyterhub, Batch processing, Redshift|
|data | **staging**<br/><br/>(e.g. `stg`, `stage`) | |
|data | **dev** | |
| | **$tenant** | The “$tenant” account is a symbolic account representing dedicated account environment. It’s architecture will likely resemble prod. This relates to [https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1171718320](https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1171718320)|

|**OUs** | **Accounts**|
| ----- | ----- |
|platform (e.g., plat) | prod, staging, dev, sandbox|
|mgmt or core | security, corp, audit, network, dns, identity, automation, artifacts|
|data | |

### Multi-Account (Production, Staging, Dev)

:::caution
Not recommended because there’s not enough isolation.

:::

- Strict, enforceable boundaries between multiple environments (aka stages) at the IAM layer

- Ability to create a release process whereby we stage changes in one account before applying them to the next account

- Ability to grant developers administrative access to sandbox account (dev) so that they can develop/iterate on IAM policies. These policies then are committed as code and submitted as part of a Pull Request, where they get code reviewed.

- API limits are scoped to an account. A bug in staging can't take out production.

### Single-account Strategy (Production=Staging=Dev) - NOT RECOMMENDED

- Editing live IAM permissions in the mono account is the equivalent "cowboy coding" in production; we don't do this with our software, so we should not do this with our infrastructure

- No strict separation between stages; copying and pasting infrastructure could accidentally lead to catastrophic outcomes

- Very difficult to write/manage complex IAM policies (especially without a staging organization!)

- No way to grant someone IAM permissions to create/manage policies while also restricting access to other production resources using IAM policies. This makes it very slow/tedious for developers to work on AWS and puts all the burden to develop IAM policies on a select few individuals, which often leads to a bottleneck

- VPCs only provide network-level isolation. We need IAM level isolation.

- AWS API limits are at the account level. A bug in staging/dev can directly DoS production services.

## Related Components

- [account](/components/library/aws/account/)

## Related Issues

## References

Here are some great videos for context

- Re:invent (2016) [https://www.youtube.com/watch?v=pqq39mZKQXU](https://www.youtube.com/watch?v=pqq39mZKQXU)

- Re:invent (2017) [https://www.youtube.com/watch?v=71fD8Oenwxc](https://www.youtube.com/watch?v=71fD8Oenwxc)


