---
title: "How do we SSH into a kops Kubernetes cluster? "
description: "There's the way it works out of the box and then there's the fancy way, which is recommended."
tags:
- kops
- SSH
- Kubernetes
- Gravitational Teleport
---

## Question

How do we SSH into nodes and pods in a `kops` Kubernetes cluster?

## Answer

There's the way it works out of the box and then there's the fancy way, which is recommended.

Out of the box, there's a set of master keys that are required when provisioning the `kops` cluster. These can be used as a last resort to access the nodes. The downside is that these keys must be shared, and rotating them is painful and time consuming, requiring a rolling update of all nodes in the cluster.

The fancier way (aka the “recommended way”) is with Gravitational Teleport. It provides an enterprise-grade SSH PKI with session logs, pretty YouTube-style session replays, bastions, and event hooks. This is what our customers who are serious about security and compliance use.

In our experience, you basically never need to access the raw Kubernetes nodes. This wasn’t the case back in the day (when we ran our own homespun solutions on CoreOS). However, `kops` is very turnkey, and the need for SSH is nearly eliminated.
