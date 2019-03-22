---
title: "How are we deploying Terraform?"
description: "If not using something like Atlantis, we’ve seen others use Codefresh and Jenkins."
tags:
- Atlantis
- Terraform
- infrastructure
- Codefresh
- Jenkins
---

## Question

If not using Atlantis to deploy infrastructure, how are we deploying Terraform?


## Answer

If not using something like Atlantis, we’ve seen others use Codefresh and Jenkins. We prefer to use Atlantis, because it’s very easy to deploy and we can associate it with an IAM role (which grants it whatever permissions we need). Furthermore, this ensures we’re using STS temporary credentials, which further protects the access credentials.

The alternative approaches make it more difficult to leverage AWS STS credentials, which is why we don’t recommend them.

Shy of that, Terraform infrastructure can be easily deployed by building the geodesic Docker image for the environment, then running the `terraform apply` commands from within the container as a human operator.

**Important:** We recommend using the `cloudposse/atlantis` fork because the upstream does not yet address RBAC.
