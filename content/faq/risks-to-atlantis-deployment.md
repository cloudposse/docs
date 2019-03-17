---
title: "Are there any risks/downsides to deploying Atlantis?"
description: "All things being equal, we strongly bias towards it to get the human operator out of the TF deploys equation."
tags:
- Atlantis
- cluster
- Helm chart
- Kubernetes
- AWS
---

## Question

Are there any risks/downsides to deploying Atlantis? Which cluster would it be deployed to?


## Answer

It can be deployed as a Helm Chart under Kubernetes with Kiam to give it AWS administrator privileges. We’ve deployed it with ECS fargate, so it's "out of phase" with the `kops` Kubernetes cluster. Our reasoning for this is that it enables us to use Atlantis to apply changes to Kubernetes with the `kops` command without destabilizing the Atlantis server in the process.

We prefer to deploy Atlantis once per AWS account to "share nothing." We note that this is strictly unnecessary, because it's possible to deploy Atlantis in fewer accounts and instead `assume-role` into the other accounts. We haven’t deployed it that way, and it might take some tinkering to get everything to work. We also don’t like this because it considerably extends the blast radius .

All things being equal, we strongly bias towards it to get the human operator out of the TF deploys equation.
