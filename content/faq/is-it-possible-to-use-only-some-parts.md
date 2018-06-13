---
title: "Is it possible to only use some parts of the Cloud Posse solution? (For example, only leverage automated deployments)"
description: "Short answer: yes, but your mileage may vary."
---

# Question

Is it possible to only use some parts of the Cloud Posse solution? (For example, only leverage automated deployments)

# Answer

Yes, it's possible to leverage just specific parts of our strategy, however, we are only able to document and support our prescribed approach. There are simply too many permutations and variations to address that would make it very difficult for us to become SMEs in all the different ways it could be done.

For example, take our deployment strategy which depends heavily on a few things:

1. Using `helm` for packaging kubernetes apps (could be swapped out for `kit`, but then everything else is irrelevant)
2. Using `helmfile` to deploy multiple charts (could be replaced with umbrella charts)
3. Using `chamber` for Secrets (could be swapped out with HashiCorp's Vault)
4. Using `build-harness` to glue the piece above together
5. Using a container-base pipeline system like Codefresh (could be replaced by AWS CodeBuild, CircleCI, GitLab CI, Jenkins, and others)

Swapping out any one of those components is possible, but we cannot anticipate the implications of making that change.
