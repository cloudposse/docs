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

The best way is with Teleport. We’ve implemented this with other clients. However, those Helm Charts are not yet open-sourced. We are working with them to make that happen; see [here](https://github.com/gravitational/teleport).

Gravitational makes a [Helm Chart available for Teleport](https://github.com/gravitational/teleport/tree/master/examples/chart/teleport). However, last we checked, it didn't work the way we'd want it to, whereby Teleport is deployed on all nodes as a `DaemonSet`.

Technically, we have our own solution called [`sudosh`](https://github.com/cloudposse/sudosh), but that's subpar by comparison. It's an extremely simple wrapper for `sudo` that enables it to be used as a system login shell. `sudo` natively supports session logs and replay. The downside with this solution is we still must store the `sudo` binary logs somewhere, so it's not as tamper-resistant as Teleport. In addition, the logs are binary, so shipping them to a log store like Sumologic or Splunk is not recommended.
