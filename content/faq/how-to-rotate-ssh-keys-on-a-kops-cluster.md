---
title: "How do we rotate the master SSH keys on a Kubernetes cluster provisioned with kops?"
description: "Learn how to rotate ssh keys on a kops cluster by generating new ones and then performing a rolling-update on the cluster to apply the changes."
tags:
- kops
- geodesic
- kubernetes
- faq
---

# Question

How do we rotate the master SSH keys on a Kubernetes cluster provisioned with `kops`?

# Answer

We provision SSH keys in geodesic using [terraform-aws-key-pair]({{< relref "terraform-modules/security/terraform-aws-key-pair.md" >}}) module.
Following this [documentation](https://www.terraform.io/docs/providers/tls/r/private_key.html#generating-a-new-key) you need to taint ssh key with terraform, then provision new one and update the cluster.

To rotate SSH keys, follow these instructions:

##  Start the Geodesic Shell

Run the Geodesic shell followed by `assume-role`
```shell
$CLUSTER_NAME
```

{{% include-code-block title="Run the Geodesic Shell" file="geodesic/module/examples/start-geodesic-shell.txt" %}}

Then login to AWS by running `assume-role`:

{{% include-code-block title="Assume role" file="geodesic/module/examples/assume-role.txt" %}}

## Configure `kubectl` and `helm`

When you start the Geodesic shell, you will need to export the `kubecfg`, which provides the TLS client certificates necessary for `kubectl` and `helm` to authenticate with the cluster.

{{% dialog type="code-block" icon="fa fa-code" title="Export kops config" %}}
```
✅   (example-staging-admin) ~ ➤  kops export kubecfg
kops has set your kubectl context to us-west-2.staging.example.com
```
{{% /dialog %}}

(Note, in older versions of `kops` you will need to pass the cluster name, so run `kops export kubecfg $KOPS_CLUSTER_NAME`)

## Recreate SSH Key

```shell
cd /conf/kops
init-terraform
terraform taint --module ssh_key_pair tls_private_key.default
terraform apply
```


## Update Kubernetes Cluster

According to the [instrunctions](https://github.com/kubernetes/kops/blob/master/docs/security.md),
execute the following commands to apply the new SSH key to the Kubernetes cluster:

```shell
s3 mount
kops delete secret --name us-west-2.staging.example.com \
  sshpublickey admin
kops create secret sshpublickey admin \
  -i /secrets/tf/ssh/example-staging-kops-us-west-2.pub \
  --name us-west-2.staging.example.com
kops update cluster --yes
kops rolling-update cluster --yes
```
