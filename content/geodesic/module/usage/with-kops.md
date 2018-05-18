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

1. Provision a [terraform-aws-kops-state-backend]({{< relref "terraform-modules/kops-kubernetes/terraform-aws-kops-state-backend.md" >}}) which consists of an S3 bucket, cluster DNS zone, and SSH keypair to access the k8s masters and nodes.
2. Update the `Dockerfile` and rebuild the Geodesic Module to generate a kops manifest file (and restart shell)
3. Launch a kops cluster from the manifest file

## Provision the State Backend

### Config environment variables
Add to the module `Dockerfile` environment variables

```
ENV KOPS_CLUSTER_NAME={KOPS_CLUSTER_NAME}

ENV TF_VAR_kops_cluster_name=${KOPS_CLUSTER_NAME}
ENV TF_VAR_parent_zone_name={KOPS_CLUSTER_PARENT_DNS_ZONE_NAME}
```

Replace placeholders `{%}` with values specific for your project.

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

Run the Geodesic shell.
```shell
> $CLUSTER_NAME
```

{{% include-code-block file="geodesic/module/usage/examples/start-geodesic-shell.txt" title="Run the Geodesic Shell" %}}

### Authorize on AWS
Assume role by running
```bash
assume-role
```

{{% include-code-block file="geodesic/module/usage/examples/assume-role.txt" title="Assume role"%}}

### Provision aws-kops-backend

Change directory to `/conf/aws-kops-backend` and run there commands to provision the `aws-kopstate-backend` backend (S3 bucket, DNS zone, and SSH keypair)
```bash
init-terraform
terraform plan
terraform apply
```

```shell
init-terraform
terraform plan
terraform apply
```

From the Terraform outputs, copy the `zone_name` and `bucket_name` into the ENV vars `KOPS_DNS_ZONE` and `KOPS_STATE_STORE` in the `Dockerfile`.

{{% include-code-block title="terraform apply" file="geodesic/module/usage/examples/terraform-apply-kops-state-backend.txt" %}}

In the example the bucket name is `bucket_name = example-staging-kops-state` and `zone_name = us-west-2.staging.example.com`.
The public and private SSH keys are created and stored automatically in the encrypted S3 bucket.

### Config environment variables
Add to module `Dockerfile` environment variable

```
# AWS Region of the S3 bucket to store cluster configuration
ENV KOPS_STATE_STORE=s3://{KOPS_STATE_BUCKET_NAME}
ENV KOPS_STATE_STORE_REGION={AWS_REGION}
ENV KOPS_DNS_ZONE={KOPS_DNS_ZONE_NAME}
```

Replace placeholders `{%}` with values specific for your project.

{{< dialog type="code-block" icon="fa fa-code" title="Example" >}}
```
# AWS Region of the S3 bucket to store cluster configuration
ENV KOPS_STATE_STORE=s3://example-staging-kops-state
ENV KOPS_STATE_STORE_REGION=us-west-2
ENV KOPS_DNS_ZONE=us-west-2.staging.example.com

## Config /etc/fstab to mount s3 bucket that containes generated ssh key
RUN s3 fstab '${TF_BUCKET}' '/' '/secrets/tf'
```
{{< /dialog >}}

### Rebuild module
[Rebuild](/geodesic/module/usage/) the module
```shell
> make build
```

## Configure kops manifest

Geodesic creates a `kops` cluster from a manifest.
[Kops manifest](https://github.com/kubernetes/kops/blob/master/docs/manifests_and_customizing_via_api.md) is yaml file that describe resources that determinates Kubernetes cluster.
`Geodesic` generates the manifest from template that support placehoders with environment variables.
The manifest template is located in [`/templates/kops/default.yaml`](https://github.com/cloudposse/geodesic/blob/master/rootfs/templates/kops/default.yaml) in the
and is compiled into `/conf/kops/manifest.yaml` by running the `build-kops-manifest` script as a `RUN` step in the `Dockerfile`.

The Geodesic module can overload template if structure of cluster differs from default one.
In provided example we will relay on default structure.

### Config environment variables
Add to the module `Dockerfile` environment variables

{{% include-code-block title="terraform apply" file="content/geodesic/module/usage/examples/Dockerfile" %}}

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
{{% include-code-block file="geodesic/module/usage/examples/start-geodesic-shell.txt" title="Run the Geodesic Shell" %}}
{{% include-code-block file="geodesic/module/usage/examples/assume-role.txt" title="Assume role"%}}

### Create the cluster

Run `kops create -f /conf/kops/manifest.yaml` to create the cluster (this will just create the cluster state and store it in the S3 bucket, but not the AWS resources for the cluster).

{{% include-code-block title="Example" file="content/geodesic/module/usage/examples/kops-create.txt" %}}

### Add ssh keys

To add [ssh keys generated previously]({{< relref "geodesic/module/usage/with-kops.md#provision-aws-kops-backend" >}})
run the following to mount s3 bucket with SSH keys and add the SSH public key to the cluster.

{{% dialog type="code-block" icon="fa fa-code" title="Example" %}}
```
mount -a
kops create secret sshpublickey admin -i /secrets/tf/ssh/example-staging-kops-us-west-2.pub \
  --name us-west-2.staging.example.com
```
{{% /dialog %}}

### Provision the cluster

Run the following to provision the AWS resources for the cluster.

```
kops update cluster --name us-west-2.staging.example.com --yes
```

{{% include-code-block file="geodesic/module/usage/examples/terraform-update-kops-cluster-start.txt" title="kops update cluster --name us-west-2.staging.example.com --yes" %}}

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
