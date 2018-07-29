---
title: "Using Geodesic with Kops"
description: "Learn how to provision kops clusters using Geodesic Modules."
weight: 4
---

{{% dialog type="warning" icon="fa-info-circle" title="Prerequisites" %}}
This assumes you've followed the [Geodesic Module Usage with Terraform]({{< relref "geodesic/module/with-terraform.md" >}}) guide which covers all the scaffolding necessary to get started.
{{% /dialog %}}

Geodesic uses [kops]({{< relref "tools/kops.md" >}}) to manage kubernetes clusters.

# Create Cluster

Provisioning a `kops` cluster takes three steps:

1. Provision a [`terraform-aws-kops-state-backend`]({{< relref "terraform-modules/kops-kubernetes/terraform-aws-kops-state-backend.md" >}}) which consists of an S3 bucket, cluster DNS zone, and SSH keypair to access the k8s masters and nodes.
2. Update the `Dockerfile` and rebuild the Geodesic Module to generate a kops manifest file (and restart shell)
3. Launch a kops cluster from the manifest file

## Provision State Backend

### Configure Environment Variables

Update the environment variables in the module's `Dockerfile`:

{{% dialog type="code-block" icon="fa fa-code" title="Example" %}}
```
ENV KOPS_CLUSTER_NAME=us-west-2.staging.example.com

ENV TF_VAR_kops_cluster_name=${KOPS_CLUSTER_NAME}
ENV TF_VAR_parent_zone_name=staging.example.com
```
{{% /dialog %}}

Replace with values to suit your specific project. Note, the variables correspond to the outputs of the `terraform-aws-kops-state-backend` module, which follows a strict naming convention.


### Rebuild Module

[Rebuild]({{< relref "geodesic/module/_index.md" >}}) the module
```shell
make docker/build
```

### Add Kops State Terraform Module

Create a file in `./conf/aws-kops-backend/main.tf` with following content

{{% include-code-block title="./conf/aws-kops-backend/main.tf" file="geodesic/module/examples/aws-kops-backend.tf" language="hcl" %}}

###  Start the Shell

Run the Geodesic shell. The wrapper script is installed in `/usr/local/bin/$CLUSTER_NAME`, so you should be able to just run something like:
```shell
$CLUSTER_NAME
```

{{% include-code-block title="Run the Geodesic Shell" file="geodesic/module/examples/start-geodesic-shell.txt" %}}

### Authorize on AWS
Assume role by running
```bash
assume-role
```

{{% include-code-block title="Assume role" file="geodesic/module/examples/assume-role.txt" %}}

### Provision aws-kops-backend

Change directory to `/conf/aws-kops-backend` and run there commands to provision the `aws-kopstate-backend` backend (S3 bucket, DNS zone, and SSH keypair)
```bash
init-terraform
terraform plan
terraform apply
```

From the Terraform outputs, copy the `zone_name` and `bucket_name` into the ENV vars `KOPS_DNS_ZONE` and `KOPS_STATE_STORE` in the `Dockerfile`.

{{% include-code-block title="terraform apply" file="geodesic/module/examples/terraform-apply-kops-state-backend.txt" %}}

In the example the bucket name is `bucket_name = example-staging-kops-state` and `zone_name = us-west-2.staging.example.com`.
The public and private SSH keys are created and stored automatically in the encrypted S3 bucket.

### Configure Environment Variables

Add to module's `Dockerfile` the following environment variables

{{% dialog type="code-block" icon="fa fa-code" title="Example" %}}
```
# AWS Region of the S3 bucket to store cluster configuration
ENV KOPS_STATE_STORE=s3://example-staging-kops-state
ENV KOPS_STATE_STORE_REGION=us-west-2
ENV KOPS_DNS_ZONE=us-west-2.staging.example.com

## Config /etc/fstab to mount s3 bucket that containes generated ssh key
RUN s3 fstab '${TF_BUCKET}' '/' '/secrets/tf'
```
{{% /dialog %}}

Replace with values to suit your specific project.

### Rebuild Module
[Rebuild]({{< relref "geodesic/module/_index.md" >}}) the module
```shell
make docker/build
```

## Configure Kops Manifest

`Geodesic` creates a `kops` cluster from a manifest.
[Kops manifest](https://github.com/kubernetes/kops/blob/master/docs/manifests_and_customizing_via_api.md) is yaml file that describe resources that determinates Kubernetes cluster.
`Geodesic` generates the manifest from a template that supports [`gomplate`](https://github.com/hairyhenderson/gomplate) interpolation for environment variables.

The manifest template (gomplate) is located in [`/templates/kops/default.yaml`](https://github.com/cloudposse/geodesic/blob/master/rootfs/templates/kops/default.yaml)
and is compiled to `/conf/kops/manifest.yaml` by running the `build-kops-manifest` script as a `RUN` step in the `Dockerfile`.

The geodesic module can overload the template if a different architecture is desired. All of our examples will rely on our default manifest.

### Configure Environment Variables

Add to the module `Dockerfile` environment variables

{{% include-code-block title="Dockerfile" file="content/geodesic/module/examples/Dockerfile" %}}

You might want to adjust these settings:

* `BASTION_MACHINE_TYPE` - EC2 instance type of bation node
* `MASTER_MACHINE_TYPE` - EC2 instance type of masters
* `NODE_MACHINE_TYPE` - EC2 instance type of EC2 worker nodes
* `NODE_MIN_SIZE` - minimum number of worker nodes
* `NODE_MAX_SIZE` - maximum number of worker nodes

Note, `NODE_MIN_SIZE` must be equal to or greater than the number of availability zones.

### Rebuild Module

[Rebuild]({{< relref "geodesic/module/_index.md" >}}) the module
```shell
make docker/build
```

After building the manifest, we can apply it with kops to spin up or update the cluster.

## Launch Cluster

### Start Geodesic Shell

Run the Geodesic shell.
```shell
$CLUSTER_NAME
assume-role
```

{{% include-code-block title="Run the Geodesic Shell" file="geodesic/module/examples/start-geodesic-shell.txt" %}}
{{% include-code-block title="Assume role" file="geodesic/module/examples/assume-role.txt" %}}

### Create Cluster

Run `kops create -f /conf/kops/manifest.yaml` to create the cluster (this will just create the cluster state and store it in the S3 bucket, but not the AWS resources for the cluster).

{{% include-code-block title="Example" file="content/geodesic/module/examples/kops-create.txt" %}}

### Add SSH Keys

To add [ssh keys generated previously]({{< relref "geodesic/module/with-kops.md#provision-aws-kops-backend" >}}), run the following command to mount the s3 bucket containing the SSH keys and register the SSH public key with the cluster.

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

### Provision Cluster

Run the following to provision the AWS resources for the cluster. The `--yes` will apply the changes non-interactively.

```
kops update cluster --name us-west-2.staging.example.com --yes
```

{{% include-code-block title="kops update cluster --name us-west-2.staging.example.com --yes" file="geodesic/module/examples/kops-update-cluster-initial.txt"  %}}

All done. At this point, the `kops` cluster is now up and running (though it might take 5-10 minutes before all nodes come online).

{{% dialog type="info" icon="fa fa-book" title="Read More" %}}
For more information, check out the following links:
* https://github.com/cloudposse/geodesic#creating-a-kops-cluster
* https://github.com/kubernetes/kops/blob/master/docs/manifests_and_customizing_via_api.md
* https://github.com/kubernetes/kops/blob/master/docs/security.md
* https://icicimov.github.io/blog/virtualization/Kubernetes-Cluster-in-AWS-with-Kops
{{% /dialog %}}


# Update Cluster

Run `kops replace -f /conf/kops/manifest.yaml` to update the cluster. This will just update the cluster state in the S3 bucket, but not modify any of the underlying AWS resources for the cluster.

## Apply the Updates

Run the following command to update the AWS resources for the cluster. The `--yes` will apply the changes non-interactively.

```
kops update cluster --name us-west-2.staging.example.com --yes
```

All done. At this point, the `kops` cluster is now updated and running.

# Export `kubecfg`

When you run into the Geodesic module shell you need to export the `kubecfg` which provides the TLS client certificates necessary for `kubectl` to authenticate with the cluster.

Run `kops export kubecfg` to export the `kubecfg`. This will export the `kubecfg` to the location set in the `KUBECONFIG` environment variable.

(Note, in older versions of `kops` you will need to pass the cluster name, so run `kops export kubecfg $KOPS_CLUSTER_NAME`)

```
✅   (example-staging-admin) ~ ➤  kops export kubecfg
kops has set your kubectl context to us-west-2.staging.example.com
```

By default, geodesic exports `KUBECONFIG=/dev/shm` to ensure this config does not pesist.


# Provision Platform Backing Services

We provide a number of well-tested [Terraform Modules]({{< relref "terraform-modules/overview.md" >}}) to provision essential AWS resources needed by Helm Charts like [external-dns](/kubernetes-backing-services/external-dns/) and [chart-repo]({{<relref "helm-charts/supported-charts/chart-repo.md" >}}). See our [Terraform modules for Kubernetes (Kops)](/terraform-modules/kops-kubernetes).
