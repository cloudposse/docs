---
title: Kops
description: ''
---

# Quick Start

These instructions are based on [Geodesic](/geodesic), which is a cluster shell that contains a mashup of tools like `kops`, `terraform`, `kubectl`.

## Building Cluster

Start a [Geodesic](/geodesic) cluster shell.

```
assume-role
kops create -f /conf/kops/manifest.yml
```

# Upgrading `kops`

To upgrade the `kops` release, there are a couple of options. First check to see if there a new release of `geodesic` with an upgraded version of `kops`. If there is one and this is the desired release, update the `FROM` image tag in the geodesic module to point to this release.

To explictly upgrade `kops`, add this to the `Dockerfile`.

```
RUN make -C /packages/install kops KOPS_VERSION=1.9.0
```

Find the latest release of kops [here](https://github.com/kubernetes/kops/releases).

Then follow the instructions for upgrading kubernetes.




# Upgrading Kubernetes Release

Upgrading `kops` cluster to a new release of kubernetes requires that we upgrade the `kubectl` client as well as select a kubernetes release that is compatible with kops.

To explictly upgrade `kubectl`, add this to the `Dockerfile`
```
RUN make -C /packages/install kubectl KUBECTL_VERSION=1.10.0
```
 The `kubectl` release version corresponds to the kubernetes release. Find the latest release of kubernetes [here](https://github.com/kubernetes/kubernetes/releases).

 Then follow the [official instructions](https://github.com/kubernetes/kops/blob/master/docs/upgrade.md) for upgrading kops.

Set the `KUBERNETES_VERSION` in the `Dockerfile`

Then follow the instructions to update the manifest and update the cluster.

# Upgrading EC2 Image for Nodes

Identify the AMI that should be used by following the [official documentation](https://github.com/kubernetes/kops/blob/master/docs/images.md).

The AMI will look something like this:
```
kope.io/k8s-1.7-debian-jessie-amd64-hvm-ebs-2017-07-28
```

Set the `KOPS_BASE_IMAGE` to the latest release AMI in the Geodesic Module's `Dockerfile` and rebuild the container.

Then [rebuild the manifest and update the cluster]({{< relref "tools/kops.md#update-manifest" >}})


# Update manifest

The `build-manifest` command will regenerate the `/conf/kops/manifest.yaml`.

Run `kops replace -f /conf/kops/manifest.yaml` to update the kops state.

Then run `kops update cluster --yes` to apply the changes.

Some changes will require rebuilding the nodes (for example, resizing nodes or changing the AMI). To do this, you'll need to run:

```
kops rolling-update cluster --yes
```

# Upgrading a Cluster

Increase node size
Rebuild Cluster

# Connecting to Bastion

The master SSH keys are by default persisted to the terraform state encrypted state bucket.

In the geodesic shell, this bucket is usually mounted to `/secrets/tf` by adding this to the `Dockerfile`.

```
# Filesystem entry for tfstate
RUN s3 fstab '${TF_BUCKET}' '/' '/secrets/tf'
```

To mount the bucket, run `mount -a` which will mount all filesystems in the `/etc/fstab`.

Add the master key to the local `ssh-agent`:

```
ssh-add /secrets/tf/*
```

Then, run `ssh admin@bastion.$KOPS_CLUSTER_NAME`


# Helpful Terraform Modules

- [terraform-aws-kops-route53]({{< relref "terraform-modules/kops-kubernetes/terraform-aws-kops-route53.md" >}})
- [terraform-aws-kops-external-dns]({{< relref "terraform-modules/kops-kubernetes/terraform-aws-kops-external-dns.md" >}})
