---
title: "Kubernetes Pods Emit Error: not authorized to perform `sts:AssumeRole`"
description: "Assuming roles are properly configured, this usually happens due to AWS API rate limiting. "
tags:
- kube2iam
- kiam
- aws
- iam
- kubernetes
---

# Question

Our pods are failing to assume role and emit the following error. Everything was working fine, but then something happened and now we get the following error. We didn't make any changes.

```
time="2018-06-19T19:58:43Z" level=error msg="Error assuming role AccessDenied: User: arn:aws:sts::957237095956:assumed-role/nodes.us-west-2.staging.example.net/i-007b0d693468102fb is not authorized to perform: sts:AssumeRole on resource: arn:aws:iam::957237095956:role/example-staging-external-dns\n\tstatus code: 403, request id: 2b14d0eb-73fb-11e8-8aaa-578a2a66ee2c" ns.name=kube-system pod.iam.role="arn:aws:iam::957237095956:role/example-staging-external-dns" req.method=GET req.path=/latest/meta-data/iam/security-credentials/example-staging-external-dns req.remote=100.96.162.129
```

# Answer

We've seen this error with `kube2iam` many times due to AWS API rate limiting. It affects even small Kubernetes clusters running `kube2iam`. For AWS, the request rate limit is account-wide and other applications deployed in the same account may be depleting the budget independently. There are fundamental [problems with the architecutre of `kube2iam`](https://medium.com/@pingles/kiam-iterating-for-security-and-reliability-5e793ab93ec3) that are addressed in [`kiam`](https://github.com/uswitch/kiam).

The only "quick fix" we've seen is to `kubectl drain` drain afflicted node and then terminate it so a new one is spawned in its place. You may need to perform this action repeatedly on all nodes. New nodes will have their rate limits reset to zero, however, this is only a temporary fix and the problem will resurface as soon as limits are exceeded.

The long-term fix is to switch to `kiam`. Our comprehensive distribution of [`helmfiles`](https://github.com/cloudposse/helmfiles) ships with support for [`kiam`](https://github.com/cloudposse/helmfiles/blob/master/helmfile.d/0020.kiam.yaml).
