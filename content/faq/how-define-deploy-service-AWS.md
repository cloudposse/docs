---
title: "How do we define & deploy a service?"
description: "We've been consolidating most Terraform code in the infrastructure repos per account."
tags:
- service
- AWS
- Terraform
---

## Question

If a service depends on a new AWS resource, then how do we define & deploy it?

## Answer

Background: For example, would it be a new commit to the staging/prod TF repos, followed by a deploy with Atlantis, then a commit to the main app repos in which we start using the resource?

More or less. We've been consolidating most Terraform code in the infrastructure repos per account.

There’s some value to being able to synchronize infrastructure commits with app commits.
We've recently completed a proof-of-concept (PoC), where we create a `terraform`/subfolder nestled with the application code. However, we think this leads to infrastructure sprawl that might make it more confusing to understand where things are located.
