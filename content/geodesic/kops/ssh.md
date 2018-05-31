---
title: "SSHing to Cluster"
description: "Learn how to connect via SSH to kops cluster."
tags:
- Kops
- bastion
- ssh
---

The standard kops topology deployed by Cloud Posse includes a `bastion` node (sometimes called a `kastion`).

# Configuration

## Master Keys

The master SSH keys were created and associated with the cluster when it was created. They are by default persisted to the terraform state encrypted state bucket.

In the geodesic shell, this bucket is usually mounted to `/secrets/tf` by adding this to the `Dockerfile`.

```
# Filesystem entry for tfstate
RUN s3 fstab '${TF_BUCKET}' '/' '/secrets/tf'
```

To mount the bucket, run `mount -a` which will mount all filesystems in the `/etc/fstab`.

Add the master key to the local `ssh-agent`:

```
ssh-add /secrets/tf/ssh/*
```

## ACLs

SSH access is controlled by the `spec.sshAccess` setting in the kops manifest. It defaults to `0.0.0.0/0`.

## Hostname

The bastion hostname is determined by the `KOPS_BASTION_PUBLIC_NAME` environment variable, which defaults to `bastion`. This name is concatenated with the `KOPS_CLUSTER_NAME` to form the FQHN.

## Key Rotation

Master key rotation requires a `rolling-update` of the cluster after applying the changes.

{{% dialog type="code-block" icon="fa fa-code" title="Example" %}}
```
# Mount all S3 filesystems
mount -a

# Import SSH public key
kops create secret sshpublickey admin \
  -i /secrets/tf/ssh/example-staging-kops-us-west-2.pub \
  --name us-west-2.staging.example.com
```
{{% /dialog %}}

{{< relref "geodesic/kops/update-cluster.md#rolling-update" >}}

{{% dialog type="info" icon="fa fa-book" title="Read More" %}}
<https://github.com/kubernetes/kops/blob/master/docs/rotate-secrets.md>
{{% /dialog %}}

# Connecting to Bastion

The default username is `admin`. After adding the SSH keys to your `ssh-agent`, run the following:

```
ssh -A admin@bastion.$KOPS_CLUSTER_NAME
```

# References
- <https://github.com/kubernetes/kops/blob/master/docs/bastion.md>
-
