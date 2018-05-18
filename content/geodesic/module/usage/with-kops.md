---
title: "Using Geodesic Module with Kops"
description: ""
---

{{% dialog type="warning" icon="fa-info-circle" title="Prerequisites" %}}
This assumes you've followed the [Geodesic Module Usage with Terraform]({{< relref "geodesic/module/usage/with-terraform.md" >}}) guide which covers all the scaffolding necessary to get started.
{{% /dialog %}}

Geodesic uses [kops]({{< relref "tools/kops.md" >}}) to manage kubernetes clusters.

# Create a cluster
Provisioning a `kops` cluster takes three steps:

1. Provision a [`terraform-aws-kops-state-backend`]({{< relref "terraform-modules/kops-kubernetes/terraform-aws-kops-state-backend.md" >}}) which consists of an S3 bucket, cluster DNS zone, and SSH keypair to access the k8s masters and nodes.
2. Update the `Dockerfile` and rebuild the Geodesic Module to generate a kops manifest file (and restart shell)
3. Launch a kops cluster from the manifest file

## Provision the State Backend

### Config environment variables

Update the environment variables in the module's `Dockerfile`:

```
ENV KOPS_CLUSTER_NAME={KOPS_CLUSTER_NAME}

ENV TF_VAR_kops_cluster_name=${KOPS_CLUSTER_NAME}
ENV TF_VAR_parent_zone_name={KOPS_CLUSTER_PARENT_DNS_ZONE_NAME}
```

Replace Replace with values to suit your specific project. Note, the variables correspond to the outputs of the `terraform-aws-kops-state-backend` module, which follows a strict naming convention.

{{< dialog type="code-block" icon="fa fa-code" title="Example" >}}
```
ENV KOPS_CLUSTER_NAME=us-west-2.staging.example.com

ENV TF_VAR_kops_cluster_name=${KOPS_CLUSTER_NAME}
ENV TF_VAR_parent_zone_name=staging.example.com
```
{{< /dialog >}}

### Rebuild the module
[Rebuild](/geodesic/module/usage/) the module
```shell
> make build
```

### Add kops state terraform module

Create file in `./conf/aws-kops-backend/main.tf` with following content

{{% include-code-block title="./conf/aws-kops-backend/main.tf" file="geodesic/module/usage/examples/aws-kops-backend.tf" language="hcl" %}}

###  Start the shell

Run the Geodesic shell. The wrapper script is installed in `/usr/local/bin/$CLUSTER_NAME`, so you should be able to just run something like:
```shell
sh-3.2$ $CLUSTER_NAME
```

{{% include-code-block title="Run the Geodesic Shell" file="geodesic/module/usage/examples/start-geodesic-shell.txt" %}}

### Authorize on AWS
Assume role by running
```bash
assume-role
```

{{% include-code-block title="Assume role" file="geodesic/module/usage/examples/assume-role.txt" %}}

### Provision aws-kops-backend

Change directory to `/conf/aws-kops-backend` and run there commands to provision the `aws-kopstate-backend` backend (S3 bucket, DNS zone, and SSH keypair)
```bash
init-terraform
terraform plan
terraform apply
```

From the Terraform outputs, copy the `zone_name` and `bucket_name` into the ENV vars `KOPS_DNS_ZONE` and `KOPS_STATE_STORE` in the `Dockerfile`.

{{% include-code-block title="terraform apply" file="geodesic/module/usage/examples/terraform-apply-kops-state-backend.txt" %}}

In the example the bucket name is `bucket_name = example-staging-kops-state` and `zone_name = us-west-2.staging.example.com`.
The public and private SSH keys are created and stored automatically in the encrypted S3 bucket.

### Configure environment variables

Add to module `Dockerfile` environment variable

```
# AWS Region of the S3 bucket to store cluster configuration
ENV KOPS_STATE_STORE=s3://{KOPS_STATE_BUCKET_NAME}
ENV KOPS_STATE_STORE_REGION={AWS_REGION}
ENV KOPS_DNS_ZONE={KOPS_DNS_ZONE_NAME}
```

Replace placeholders `{%}` with values specific for your project.

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

### Rebuild module
[Rebuild](/geodesic/module/usage/) the module
```shell
> make build
```

## Configure kops manifest

Geodesic creates a `kops` cluster from a manifest.
[Kops manifest](https://github.com/kubernetes/kops/blob/master/docs/manifests_and_customizing_via_api.md) is yaml file that describe resources that determinates Kubernetes cluster.
`Geodesic` generates the manifest from template that support placehoders with environment variables.
The manifest template (gomplate) is located in [`/templates/kops/default.yaml`](https://github.com/cloudposse/geodesic/blob/master/rootfs/templates/kops/default.yaml)
and is compiled to `/conf/kops/manifest.yaml` by running the `build-kops-manifest` script as a `RUN` step in the
`Dockerfile`.

The geodesic module can overload the template if a different architecture is desired. All of our examples will rely on our default manifest.

### Configure environment variables

Add to the module `Dockerfile` environment variables

{{% include-code-block title="terraform apply" file="content/geodesic/module/usage/examples/Dockerfile" %}}

You might want to adjust these settings:

* `BASTION_MACHINE_TYPE` - EC2 instance type of bation node
* `MASTER_MACHINE_TYPE` - EC2 instance type of masters
* `NODE_MACHINE_TYPE` - EC2 instance type of EC2 worker nodes
* `NODE_MIN_SIZE` - minimum number of worker nodes
* `NODE_MAX_SIZE` - maximum number of worker nodes

Note, `NODE_MIN_SIZE` must be equal to or greater than the number of availability zones.

### Rebuild the module

[Rebuild](/geodesic/module/usage/) the module
```shell
> make build
```

When manifiest configured we can apply it with kops to spin up or update the cluster

## Launch the cluster

###  Run into the module shell

Run the Geodesic shell.
```shell
> $CLUSTER_NAME
> assume-role
```
{{% include-code-block title="Run the Geodesic Shell" file="geodesic/module/usage/examples/start-geodesic-shell.txt" %}}
{{% include-code-block title="Assume role" file="geodesic/module/usage/examples/assume-role.txt" %}}

### Create the cluster

Run `kops create -f /conf/kops/manifest.yaml` to create the cluster (this will just create the cluster state and store it in the S3 bucket, but not the AWS resources for the cluster).

{{% include-code-block title="Example" file="content/geodesic/module/usage/examples/kops-create.txt" %}}

### Mount all S3 filesystems
```
mount -a
```

### Import SSH public key

To add [ssh keys generated previously]({{< relref "geodesic/module/usage/with-kops.md#provision-aws-kops-backend" >}})
run the following to mount s3 bucket with SSH keys and add the SSH public key to the cluster.

{{% dialog type="code-block" icon="fa fa-code" title="Example" %}}
```
kops create secret sshpublickey admin \
  -i /secrets/tf/ssh/example-staging-kops-us-west-2.pub \
  --name us-west-2.staging.example.com
```
{{% /dialog %}}

### Provision the cluster

Run the following to provision the AWS resources for the cluster.

```
kops update cluster --name us-west-2.staging.example.com --yes
```

{{% include-code-block title="kops update cluster --name us-west-2.staging.example.com --yes" file="geodesic/module/usage/examples/terraform-update-kops-cluster-start.txt"  %}}

All done. The `kops` cluster is now up and running.

{{% dialog type="info" icon="fa fa-book" title="Read More" %}}
For more information, check out the following links:
* https://github.com/cloudposse/geodesic#creating-a-kops-cluster
* https://github.com/kubernetes/kops/blob/master/docs/manifests_and_customizing_via_api.md
* https://github.com/kubernetes/kops/blob/master/docs/security.md
* https://icicimov.github.io/blog/virtualization/Kubernetes-Cluster-in-AWS-with-Kops
{{% /dialog %}}

# Provision Platform Backing Services

A number of [Terraform Modules Overview]({{< relref "terraform-modules/overview.md" >}}) provide to provision AWS resources needed by Charts like [external-dns](/kubernetes-backing-services/external-dns/) and [chart-repo]({{<relref "helm-charts/supported-charts/chart-repo.md" >}}). See our [Terraform modules for Kubernetes (Kops)](/terraform-modules/kops-kubernetes).
