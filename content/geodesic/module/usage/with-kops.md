---
title: "Using Geodesic Module with Kops"
description: ""
---

{{% dialog type="warning" icon="fa-info-circle" title="Prerequisites" %}}
This assumes you've followed the [Geodesic Module Usage with Terraform]({{< relref "geodesic/module/usage/with-terraform.md" >}}) guide which covers all the scaffolding necessary to get started.
{{% /dialog %}}

Geodesic use [kops]({{< relref "tools/kops.md" >}}) to manage kubernetes cluster.

# Create a cluster

Provisioning a `kops` cluster takes three steps:

1. Provision a [terraform-aws-kops-state-backend]({{< relref "terraform-modules/kops-kubernetes/terraform-aws-kops-state-backend.md" >}}) which consists of an S3 bucket, cluster DNS zone, and SSH keypair to access the k8s masters and nodes.
2. Update the `Dockerfile` and rebuild/restart the `geodesic module` shell to generate a kops manifest file
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

{{% dialog type="code-block" icon="fa fa-code" title="./conf/aws-kops-backend/main.tf" %}}
```
terraform {
  required_version = ">= 0.11.2"
  backend "s3" {}
}

variable "aws_assume_role_arn" {}

variable "tfstate_namespace" {}

variable "tfstate_stage" {}

variable "tfstate_region" {}

variable "kops_cluster_name" {}

variable "parent_zone_name" {}

provider "aws" {
  assume_role {
    role_arn = "${var.aws_assume_role_arn}"
  }
}

module "kops_state_backend" {
  source           = "git::https://github.com/cloudposse/terraform-aws-kops-state-backend.git?ref=tags/0.1.3"
  namespace        = "${var.tfstate_namespace}"
  stage            = "${var.tfstate_stage}"
  name             = "kops-state"
  parent_zone_name = "${var.parent_zone_name}"
  zone_name        = "$${name}.$${parent_zone_name}"
  cluster_name     = "${var.tfstate_region}"
  region           = "${var.tfstate_region}"
}

module "ssh_key_pair" {
  source              = "git::https://github.com/cloudposse/terraform-aws-key-pair.git?ref=tags/0.2.3"
  namespace           = "${var.tfstate_namespace}"
  stage               = "${var.tfstate_stage}"
  name                = "kops-${var.tfstate_region}"
  ssh_public_key_path = "/secrets/tf/ssh"
  generate_ssh_key    = "true"
}

output "parent_zone_id" {
  value = "${module.kops_state_backend.parent_zone_id}"
}

output "parent_zone_name" {
  value = "${module.kops_state_backend.parent_zone_name}"
}

output "zone_id" {
  value = "${module.kops_state_backend.zone_id}"
}

output "zone_name" {
  value = "${module.kops_state_backend.zone_name}"
}

output "bucket_name" {
  value = "${module.kops_state_backend.bucket_name}"
}

output "bucket_region" {
  value = "${module.kops_state_backend.bucket_region}"
}

output "bucket_domain_name" {
  value = "${module.kops_state_backend.bucket_domain_name}"
}

output "bucket_id" {
  value = "${module.kops_state_backend.bucket_id}"
}

output "bucket_arn" {
  value = "${module.kops_state_backend.bucket_arn}"
}

output "ssh_key_name" {
  value = "${module.ssh_key_pair.key_name}"
}

output "ssh_public_key" {
  value = "${module.ssh_key_pair.public_key}"
}
```
{{% /dialog %}}

###  Run into the module shell

Run the Geodesic shell.
```shell
> $CLUSTER_NAME
```

{{% dialog type="code-block" icon="fa fa-code" title="Example" %}}
```
> staging.example.com
# Mounting /home/goruha into container
# Starting new staging.example.com session from cloudposse/staging.example.com:dev
# Exposing port 41179
* Started EC2 metadata service at http://169.254.169.254/latest

         _              _                                              _
     ___| |_ __ _  __ _(_)_ __   __ _    _____  ____ _ _ __ ___  _ __ | | ___
    / __| __/ _` |/ _` | | '_ \ / _` |  / _ \ \/ / _` | '_ ` _ \| '_ \| |/ _ \
    \__ \ || (_| | (_| | | | | | (_| | |  __/>  < (_| | | | | | | |_) | |  __/
    |___/\__\__,_|\__, |_|_| |_|\__, |  \___/_/\_\__,_|_| |_| |_| .__/|_|\___|
                  |___/         |___/                           |_|


IMPORTANT:
* Your $HOME directory has been mounted to `/localhost`
* Use `aws-vault` to manage your sessions
* Run `assume-role` to start a session


-> Run 'assume-role' to login to AWS
 ⧉  staging example
❌   (none) ~ ➤

```
{{% /dialog %}}

### Authorize on AWS
Assume role by running
```bash
assume-role
```

{{% dialog type="code-block" icon="fa fa-code" title="Example" %}}
```
❌   (none) tfstate-backend ➤  assume-role
Enter passphrase to unlock /conf/.awsvault/keys/:
Enter token for arn:aws:iam::xxxxxxx:mfa/goruha: 781874
* Assumed role arn:aws:iam::xxxxxxx:role/OrganizationAccountAccessRole
-> Run 'init-terraform' to use this project
 ⧉  staging example
✅   (example-staging-admin) tfstate-backend ➤

```
{{% /dialog %}}

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

{{% dialog type="code-block" icon="fa fa-code" title="Example" %}}
```
✅   (example-staging-admin) aws-kopstate-backend ➤  terraform apply
Outputs:

bucket_arn = arn:aws:s3:::example-staging-kops-state
bucket_domain_name = example-staging-kops-state.s3.amazonaws.com
bucket_id = example-staging-kops-state
bucket_name = example-staging-kops-state
bucket_region = us-west-2
parent_zone_id = ZRD5*****TRT
parent_zone_name = staging.example.com.
shh_public_key = ******************************

ssh_key_name = example-staging-kops-us-west-2
zone_id = Z2PQD****VDAIH
zone_name = us-west-2.staging.example.com
```
{{% /dialog %}}

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

```
# https://github.com/kubernetes/kops/blob/master/channels/stable
# https://github.com/kubernetes/kops/blob/master/docs/images.md
ENV KOPS_BASE_IMAGE="kope.io/k8s-1.7-debian-jessie-amd64-hvm-ebs-2017-07-28"
ENV KOPS_BASTION_PUBLIC_NAME="bastion"
ENV KOPS_PRIVATE_SUBNETS="172.20.32.0/19,172.20.64.0/19,172.20.96.0/19,172.20.128.0/19"
ENV KOPS_UTILITY_SUBNETS="172.20.0.0/22,172.20.4.0/22,172.20.8.0/22,172.20.12.0/22"
ENV KOPS_AVAILABILITY_ZONES="us-west-2a,us-west-2b,us-west-2c"

# Instance sizes
ENV BASTION_MACHINE_TYPE "t2.medium"

# Kubernetes Master EC2 instance type (optional, required if the cluster uses Kubernetes)
ENV MASTER_MACHINE_TYPE "t2.medium"

# Kubernetes Node EC2 instance type (optional, required if the cluster uses Kubernetes)
ENV NODE_MACHINE_TYPE "t2.medium"

# Kubernetes node count (Node EC2 instance count) (optional, required if the cluster uses Kubernetes)
ENV NODE_MIN_SIZE 3
ENV NODE_MAX_SIZE 3

RUN build-kops-manifest
```

{{< dialog type="code-block" icon="fa fa-code" title="Example" >}}
Changed types of instances and count of k8s workers (minions)
```
# https://github.com/kubernetes/kops/blob/master/channels/stable
# https://github.com/kubernetes/kops/blob/master/docs/images.md
ENV KOPS_BASE_IMAGE="kope.io/k8s-1.7-debian-jessie-amd64-hvm-ebs-2017-07-28"
ENV KOPS_BASTION_PUBLIC_NAME="bastion"
ENV KOPS_PRIVATE_SUBNETS="172.20.32.0/19,172.20.64.0/19,172.20.96.0/19,172.20.128.0/19"
ENV KOPS_UTILITY_SUBNETS="172.20.0.0/22,172.20.4.0/22,172.20.8.0/22,172.20.12.0/22"
ENV KOPS_AVAILABILITY_ZONES="us-west-2a,us-west-2b,us-west-2c"

# Instance sizes
ENV BASTION_MACHINE_TYPE "t2.micro"

# Kubernetes Master EC2 instance type (optional, required if the cluster uses Kubernetes)
ENV MASTER_MACHINE_TYPE "t2.small"

# Kubernetes Node EC2 instance type (optional, required if the cluster uses Kubernetes)
ENV NODE_MACHINE_TYPE "t2.medium"

# Kubernetes node count (Node EC2 instance count) (optional, required if the cluster uses Kubernetes)
ENV NODE_MIN_SIZE 4
ENV NODE_MAX_SIZE 4

RUN build-kops-manifest
```
{{< /dialog >}}

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

{{% dialog type="code-block" icon="fa fa-code" title="Example" %}}
```
> staging.example.com
❌   (none) conf ➤  assume-role
Enter passphrase to unlock /conf/.awsvault/keys/:
Enter token for arn:aws:iam::xxxxxxx:mfa/goruha: 781874
* Assumed role arn:aws:iam::xxxxxxx:role/OrganizationAccountAccessRole
✅   (example-staging-admin) conf ➤
```
{{% /dialog %}}

### Create the cluster

Run `kops create -f /conf/kops/manifest.yaml` to create the cluster (this will just create the cluster state and store it in the S3 bucket, but not the AWS resources for the cluster).

{{% dialog type="code-block" icon="fa fa-code" title="Example" %}}
```
✅   (example-staging-admin) kops ➤  kops create -f /conf/kops/manifest.yaml

Created cluster/us-west-2.staging.example.com
Created instancegroup/bastions
Created instancegroup/master-us-west-2a
Created instancegroup/master-us-west-2b
Created instancegroup/master-us-west-2c
Created instancegroup/nodes

To deploy these resources, run: kops update cluster us-west-2.staging.example.com --yes

 ⧉  staging example
✅   (example-staging-admin) kops ➤
```
{{% /dialog %}}

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

{{% dialog type="code-block" icon="fa fa-code" title="Example" %}}

{{% /dialog %}}

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
