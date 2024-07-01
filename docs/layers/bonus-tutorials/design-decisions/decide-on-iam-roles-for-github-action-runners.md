---
title: "Decide on IAM Roles for GitHub Action Runners"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1175978160/REFARCH-305+-+Decide+on+IAM+Roles+for+GitHub+Action+Runners
sidebar_position: 100
refarch_id: REFARCH-305
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/fundamentals/design-decisions/foundational-platform/decide-on-iam-roles-for-github-action-runners.md
---

# Decide on IAM Roles for GitHub Action Runners

## Problem
In order for GitHub Actions runners to be able to access AWS resources, they need to be able to assume an IAM role.
The trust relationship of this IAM role depends on how the Runners are hosted:

- GitHub-hosted Runners: [Need to GitHub's OIDC Provider](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect)

- Self-hosted Runners on EKS: Need to use the EKS OIDC Provider (See: [IRSA](https://docs.aws.amazon.com/emr/latest/EMR-on-EKS-DevelopmentGuide/setting-up-enable-IAM.html))

- Self-hosted Runners on EC2: Need to have an Instance Profile

Regardless of the trust relationship, the IAM roles themselves need to be defined.GitHub Action Workflows regularly use third-party actions. These actions execute on the self-hosted runners and have whatever access the runners have, including VPC connectivity and IAM permissions.

## Considered Options
Some possible configurations (and combinations thereof) include:

- A Runner without any IAM roles (e.g. for unit tests in a CI pipeline).

- A Runner with access to `dev` and/or `sandbox` (e.g. for integration tests).

- A Runner with access to ECR in the `artifacts` account.

- A Runner with access to S3 buckets in SDLC accounts, and those S3 buckets allowing the role via an S3 bucket policy.

- A Runner with access to EKS (e.g. if ArgoCD is not used and push-based deployments are required).

## Related Decisions

- [Decide on IAM Roles for GitHub Action Runners](/reference-architecture/fundamentals/design-decisions/foundational-platform/decide-on-iam-roles-for-github-action-runners)
- [Decide on Self-Hosted GitHub Runner Strategy](/reference-architecture/fundamentals/design-decisions/foundational-release-engineering/decide-on-self-hosted-github-runner-strategy)
- [Decide on Strategy for Continuous Integration](/reference-architecture/fundamentals/design-decisions/foundational-release-engineering/decide-on-strategy-for-continuous-integration)
- [Decide on GitHub Actions Workflow Organization Strategy](/reference-architecture/fundamentals/design-decisions/foundational-release-engineering/decide-on-github-actions-workflow-organization-strategy)


