---
title: "How should we modify the host OS?"
description: "There are a couple of patterns; but doing this all for “Day 1” isn't necessarily recommended."
tags:
- host
- OS
- kops
- AMI
---

## Question

How should we modify the host OS for `kops`?


## Answer

There are a couple of patterns; but doing this all for “Day 1” isn't necessarily recommended, as it considerably increases the maintenance overhead.

There is a straightforward path to achieving it (e.g. the ability to gracefully roll out new AMIs). High level involves creating a packer configuration based on one of the upstream AMIs. See [here](https://github.com/kubernetes/kops/blob/master/docs/images.md) for more information.
