---
title: "with Kops"
excerpt: ""
---

##### :warning: Prerequisites
> This assumes you've followed the [Geodesic Quick Start](doc:geodesic-quick-start) guide which covers all the scaffolding necessary to get started.

# Create a cluster

Follow the [Provision a Cluster](doc:provision-a-cluster) process

# Provision Platform Backing Services

A number of [Terraform Modules Overview](doc:terraform-modules-overview) provide to provision AWS resources needed by Charts like [external-dns](doc:external-dns) and [chart-repo](doc:chart-repo). See our [Terraform modules for Kubernetes (Kops)](doc:terraform-kubernetes-kops-modules).

# Provisioning a Kops cluster

We create a `kops` cluster from a manifest.

The manifest template is located in [`/templates/kops/default.yaml`](https://github.com/cloudposse/geodesic/blob/master/rootfs/templates/kops/default.yaml)
and is compiled by running the `build-kops-manifest` script as a `RUN` step in the `Dockerfile`.

# Synopsis

Provisioning a `kops` cluster takes three steps:

1. Provision a [terraform-aws-kops-state-backend](doc:terraform-aws-kops-state-backend) which consists of an S3 bucket, cluster DNS zone, and SSH keypair to access the k8s masters and nodes.
2. Update the `Dockerfile` and rebuild/restart the `geodesic` shell to generate a kops manifest file
3. Launch a kops cluster from the manifest file

# Provision the State Backend

Inside the `geodesic shell, change directory to `kops` folder
```bash
cd /conf/kops
```

Run Terraform to provision the `kops` backend (S3 bucket, DNS zone, and SSH keypair)
```bash
init-terraform
terraform plan
terraform apply
```

![](/images/b5e88dd-joany-staging-kops-state.png)
The public and private SSH keys are created and stored automatically in the encrypted S3 bucket.

![](/images/9d5dc1c-joany-staging-kops-state-ssh-keys.png)
From the Terraform outputs, copy the `zone_name` and `bucket_name` into the ENV vars `CLUSTER_NAME` and `KOPS_STATE_STORE` in the `Dockerfile`.

# Build Manifest

The `Dockerfile` should look something like this:

```docker
# kops config
ENV CLUSTER_NAME="us-west-2.staging.joany.net"
ENV KOPS_DNS_ZONE=${CLUSTER_NAME}
ENV KOPS_STATE_STORE="s3://cp-prod-kops-state"
ENV KOPS_STATE_STORE_REGION="us-east-1"
ENV KOPS_AVAILABILITY_ZONES="us-east-1a,us-east-1b,us-east-1c,us-east-1d,us-east-1e"
ENV KOPS_BASTION_PUBLIC_NAME="bastion"
ENV BASTION_MACHINE_TYPE="t2.medium"
ENV MASTER_MACHINE_TYPE="t2.medium"
ENV NODE_MACHINE_TYPE="t2.medium"
ENV NODE_MAX_SIZE="2"
ENV NODE_MIN_SIZE="2"
```

Exit the `geodesic` shell by typing `exit`. You might need to run it twice if you were in an assumed role.

Rebuild the Docker image
```
make docker/build
```

Run the `geodesic` shell again and assume role to login to AWS
```bash
staging.joany.net
assume-role
```

Change directory to `kops` folder, init Terraform, and list files
```bash
cd /conf/kops
init-terraform
ls
```

You will find the rendered `kops` manifest file `/conf/kops/manifest.yaml`.

# Launch Cluster

Run `kops create -f manifest.yaml` to create the cluster (this will just create the cluster state and store it in the S3 bucket, but not the AWS resources for the cluster).
![](/images/b251e2e-kops-create.png)
Run the following to add the SSH public key to the cluster.
```
kops create secret sshpublickey admin -i /secrets/tf/ssh/joany-staging-kops-us-west-2.pub \
  --name us-west-2.staging.joany.net
```

Run the following to provision the AWS resources for the cluster.
```
kops update cluster --name us-west-2.staging.joany.net --yes
```

![](/images/944178e-kops-update-cluster.png)

All done. The `kops` cluster is now up and running.

{{% dialog type="info" icon="fa-info-circle" title="Read More" %}}
For more information, check out the following links:
* https://github.com/cloudposse/geodesic#creating-a-kops-cluster
* https://github.com/kubernetes/kops/blob/master/docs/manifests_and_customizing_via_api.md
* https://github.com/kubernetes/kops/blob/master/docs/security.md
* https://icicimov.github.io/blog/virtualization/Kubernetes-Cluster-in-AWS-with-Kops
{{% /dialog %}}
