---
title: "Kiam: Error Detecting ARN Prefix: AWS Metadata API Not Available"
description: "Make sure your TLS certificates match the `kiam-server` hostname and that no orphaned `iptable` rules exist for legacy IAM metadata service such as `kube2iam`"
tags:
- kiam
- iam
- kubernetes
---

# Question

When attempting to release kiam we're running into this liveness probe issue:

```
Liveness probe failed: Get http://172.20.125.153:8181/ping: dial tcp 172.20.125.153:8181: getsockopt: connection refused
```

Inspecting the logs from the `kiam-agent`, reveals the following output:
```
➤  kubectl logs kiam-agent-pzvpt
{"level":"fatal","msg":"error creating server gateway: error waiting for address being available in the balancer: context deadline exceeded","time":"2018-07-02T15:05:28Z"}
```

The `kiam-server` also has problems:
```
{"level":"info","msg":"detecting arn prefix","time":"2018-07-02T17:17:12Z"}
{"level":"fatal","msg":"error creating listener: error detecting arn prefix: aws metadata api not available","time":"2018-07-02T17:17:13Z"}
```

# Answer

Here are a few common causes of this problem:

  1. The TLS certs don't match the hostname of the `kiam-server`. If [using our script](https://github.com/cloudposse/helmfiles/tree/master/scripts/kiam) and helmfile, this should be mitigated.
  2. When upgrading from `kube2iam` to `kiam`, some `iptables` rules are orphaned that cause problems. Reboot all servers to flush orphaned `iptables` rules.
  3. Make sure any previous `kube2iam` helm release has been deleted
