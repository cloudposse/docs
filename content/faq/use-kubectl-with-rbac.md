---
title: "Can we use kubectl with RBAC?"
description: "Yes, recent releases of Kubernetes support custom authentication providers including support for AWS IAM."
tags:
- kubectl
- RBAC
- AWS
- Kubernetes
---

## Question

Can we use `kubectl` with RBAC? Does that tie in with IAM at all? At least that could give us the ability to exec into a running pod.

## Answer

Yes, recent releases of Kubernetes support custom authentication providers. With AWS, this is best achieved using the [iam-authenticator](https://github.com/kubernetes-sigs/aws-iam-authenticator) (by Heptio, acquired by VMware). This cli tool is shipped with Geodesic in our [packages distribution](https://github.com/cloudposse/packages/tree/master/vendor/aws-iam-authenticator).
