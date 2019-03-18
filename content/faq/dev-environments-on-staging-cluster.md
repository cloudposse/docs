---
title: "Do dev environments run on the staging cluster?"
description: "Our current story for local `dev` is the customer uses compose."
tags:
- dev
- Kubernetes
- AWS
- Minikube
---

## Question

What about `dev` environments? Do they run on the staging cluster? Why not a separate `dev` cluster?


## Answer

Our current story for local `dev` is the customer uses compose. We think that this offers a better developer experience than the Minikube approach. Minikube is significantly different from a production Kubernetes cluster, so it doesn't really add enough value to warrant the extra complexity. We would love to invest in finding a strategy for Minikube. However, that would be an R&D project.

We still provision a dev account in AWS, which is useful for provisioning resources for developers (e.g. chamber secrets, S3 buckets, and large RDS datasets). However, it's more of a sandbox than anything else. It's a place where not everything may be "Infrastructure as Code." Developers can operate with reckless abandonment and you can fix costs.

Then there are pull request(PR) environments that typically run on the staging cluster. They could run on a separate `dev` cluster, but there’s no need to have so many clusters hanging around. Iterating on development this way is too painfully slow. Every developer (including us) wants to run locally before running on the cluster.
