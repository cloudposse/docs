---
title: "S3 Filesystem"
description: "Geodesic provides an easy way for mounting encrypted S3 buckets to the local container."
---

The geodesic base image ships with a number of utility scripts:

- [`/usr/local/bin/s3`](https://github.com/cloudposse/geodesic/blob/master/rootfs/usr/local/bin/s3) - makes it easier to manage S3 filesystems in `/etc/fstab`
- [`/usr/bin/s3fs`](https://github.com/cloudposse/geodesic/blob/master/rootfs/usr/bin/s3fs) - a thin wrapper around `goofys` for mounting S3 filesystems with a local cache in `/dev/shm`. It's the command executed by `mount` (e.g. the `s3fs#/...` part in `/etc/fstab`)

# Use-cases

A few common use-cases have arrisen for mounting S3 buckets inside of the geodesic shell.

1. **Master SSH Keys**. When using [terraform-aws-key-pair](https://github.com/cloudposse/terraform-aws-key-pair) to generate a set of SSH keys, those keys need to be securely stored somewhere. A private, versioned, encrypted S3 bucket is as good a place as any. The [terraform-aws-tfstate-backend](https://github.com/cloudposse/terraform-aws-tfstate-backend) provide a bucket suitable for this purpose.
2. **Manipulating Terraform State**. Sometimes we move projects around and need to rename state folders. It's easy to change directory to the S3 bucket and move files around. Othertimes, in extreme cases we've needed to edit the `.tfstate` file. Being able to do this using `jq` is nice.
3. **Storing Helmfile Values**. When deploying charts with `helm` or `helmfile`, you may need a large `values.yaml` file for a particular service. Othertimes, that `values.yaml` may contain sensitive values like TLS private keys. Storing that file in an encrypted S3 bucket works well.

# Configuring S3 Bucket Mount Points

Add the following to your `Dockerfile` to make it easy to mount S3 buckets inside of a geodesic shell.

```
# Filesystem entry for tfstate
RUN s3 fstab '${TF_BUCKET}' '/' '/secrets/tf'
```

This calls the `s3` wrapper command to append an `fstab` entry to `/etc/fstab`.

For refernce only, here's what that `fstab` entry looks like:

```
s3fs#${TF_BUCKET} /secrets/tf fuse _netdev,allow_other,rw,nosuid,nodev,relatime,user_id=0,group_id=0,default_permissions 0 0
```

{{% dialog type="info" icon="fa fa-info-circle" title="Note" %}}
The `${TF_BUCKET}` is evaluated (interpolated) at runtime by the `s3fs` command called by `mount`. This allows it to be highly dynamic. Under certain circumstances this may not be wanted. By removing the single quotes around `'${TF_BUCKET}'` in the `s3 fstab` command, it will be evaluated at `docker build` time rather than at run time.
{{% /dialog %}}

# Mounting Buckets

To mount buckets, just run `mount -a` after having assumed roles. This is the same as calling `s3 mount`.

{{% dialog type="info" icon="fa fa-info-circle" title="Note" %}}
The `init-terraform` automatically command calls `s3 mount` before initializing terraform state.
{{% /dialog %}}
