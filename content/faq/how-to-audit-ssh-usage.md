---
title: "How do we audit SSH usage?"
description: "The best way is with Teleport."
tags:
- SSH
- Teleport
- sudo
- sudosh
- Gravitational
- Helm Chart
---

## Question

How do we audit SSH usage and track what is done on a host?

## Answer

The best way is with [Teleport by Gravitational](https://github.com/gravitational/teleport). We’ve implemented this for many customers. The Helm Charts are open-sourced by us in our [charts](https://github.com/cloudposse/charts) repository and we provide [helmfiles](https://github.com/cloudposse/helmfiles) for their installation. 

We also have our own solution called [`sudosh`](https://github.com/cloudposse/sudosh), but that's subpar by comparison. It's an extremely simple wrapper for `sudo` that enables it to be used as a system login shell. We use `sudo`, which natively supports session logs and replay. The downside with this solution is the difficultly in securing and shipping the binary logs somewhere. On the other hand, Teleport handles this seamlessly in a tamper-resistant manner. In addition, the `sudo` logs are binary, so shipping them to a log store like Sumologic or Splunk is not recommended.
