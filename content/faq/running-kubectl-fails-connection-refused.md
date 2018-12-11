---
title: "Running `kubectl` fails: `The connection to the server localhost:8080 was refused`"
description: "This is most likely caused by not setting the `kubectl` context to use the kops cluster."
tags:
- kubectl
- kubernetes
- faq
- kops
---

## Question

When running `kubectl`, I get the following error:

```
kubectl get nodes
The connection to the server localhost:8080 was refused - did you specify the right host or port?
```

## Answer

This is most likely caused by not setting the `kubectl` context to use the kops cluster.

To fix this, run `kops export kubecfg` (this assumes the`$KOPS_CLUSTER_NAME` variable is already set to the cluster name)

e.g.
```
kops export kubecfg
```

This will export the `kubecfg` to `/dev/shm`, temporary flash memory storage that should get erased when the container exits.

After running that command, you should be able to call `kubectl get nodes`.

{{% dialog type="info" icon="fa-info-circle" title="Note" %}}
* You will need to re-run this command everytime you start the shell.
* This command requires that you first have a valid session. Run `assume-role` to login to AWS.
{{% /dialog %}}


