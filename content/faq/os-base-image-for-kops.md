---
title: "Which OS base image would your team bias towards deploying?"
description: "We recommend to use the most popular (default) OS, as it will be the best-supported option (e.g. Debian) to keep things simple."
tags:
- OS
- kops
- CoreOS
- Kubernetes
---

## Question

Which OS base image for `kops` would your team bias towards deploying?


## Answer

We used CoreOS extensively in the past. However, with the advent of `kops`, we basically treat Kubernetes more like an appliance and therefore are less concerned about the host OS (since we're typically not interacting with it).

That said, `kops` supports CoreOS. At least one of our community members uses it, as well as other customers. See [here](https://github.com/nikiai/geodesic/blob/master/Dockerfile#L58) for more information.

The future of CoreOS is really up in the air. The company was first acquired by RedHat, who has their own lightweight container OS (Atomic). RedHat was then acquired by IBM. We love the CoreOS model, and RedHat said that it wasn't going away. We just don't know how much certainty to put on it.

It’s our opinion that with Kubernetes (just like with containers), we have the privilege to be less concerned about those low-level implementation details, since we can run pretty much anything on top of it.

That’s all a long way of saying that you may decide which Linux flavor to deploy with `kops`, so long as it’s supported by the upstream maintainers. CoreOS is supported. 

We recommend to use the most popular (default) OS, as it will be the best-supported option (e.g. Debian) to keep things simple. Note that Debian does not ship with unattended upgrades the way that CoreOS does. Also, it doesn’t make sense when using AMIs (e.g. autoscaling).
