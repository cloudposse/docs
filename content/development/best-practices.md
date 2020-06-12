---
title: "Development Best Practices"
description: ""
slug: "development-best-practices"
tags:
  - "Best Practices"
  - "Development"
---
{{< wip >}}

![Terraform](/assets/08bcd99-terraform.png)

# Use GitHub Workflow

## Infrastructure as Code

Infrastructure as Code is essential for managing change control and as a system of record for disaster recovery. Configuration is a form of Intellectual Property. Without the code, you don’t own the IP.

## Feature Branches

Recommend using a consistent naming convention for branch names by all developers. Using a convention will help developers to navigate branches.

## Pull Requests

Pull Requests should express `## what` changed and `## why` it changed (e.g. business justification). This forces contributors to be clear about what is happening and makes it easier for others to follow along.

Attach a `terraform plan` against current master as a comment to all PRs.

## Code Reviews

## Tagging

For the same reason we tag/release regular software projects, we should practice the same rigor around infrastructure.

## Releases

For the same reason we release regular software projects, we should practice the same rigor around infrastructure. The release should include release notes where significant changes went out or a specific upgrade path is required.

## CI/CD

Using `atlantis` it’s possible to introduce the standard CI/CD process to manage infrastructure rollouts. As it relates to terraform, the integration test should involve a “make plan”, and a merge to master or other symbolic branch should trigger a `make apply`. Consider using `atlantis` as part of the workflow.
