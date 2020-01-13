---
title: "How do we control SSH access?"
description: "There are a few recommended approaches. We recommend to always use a bastion."
tags:
- SSH
- Gravitational Teleport
- kops
- bastion
---

## Question

How do we control who has SSH access?

## Answer

There are a few recommended approaches. First and foremost is to use Gravitational Teleport, which supports SSO/OIDC.

The alternative approach is to use our [github-authorized-keys service](https://github.com/cloudposse/github-authorized-keys), which automatically provisions users on servers using a combination of their GitHub team membership and public key to authorize them.

We recommend to always use a bastion. With `kops`, a bastion is provisioned automatically. Similarly, with Teleport, a proxy gateway acts as a bastion. Lastly, we provide a [bastion container](https://github.com/cloudposse/bastion) that can be used for other use cases.
