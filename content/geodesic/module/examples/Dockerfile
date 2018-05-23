FROM cloudposse/geodesic:0.9.16

ENV BANNER staging example

### Default AWS Profile name
ENV AWS_DEFAULT_PROFILE="example-staging-admin"

ENV AWS_REGION="us-west-2"

ENV TF_VAR_tfstate_namespace="example"
ENV TF_VAR_tfstate_stage="staging"
ENV TF_VAR_tfstate_region="${AWS_REGION}"

ENV TF_BUCKET="example-staging-terraform-state"
ENV TF_BUCKET_REGION="${AWS_REGION}"
ENV TF_DYNAMODB_TABLE="example-staging-terraform-state-lock"

ENV KOPS_CLUSTER_NAME=us-west-2.staging.example.com

ENV TF_VAR_kops_cluster_name="${KOPS_CLUSTER_NAME}"
ENV TF_VAR_parent_zone_name="staging.example.com"

RUN s3 fstab '${TF_BUCKET}' '/' '/secrets/tf'

# AWS Region of the S3 bucket to store cluster configuration
ENV KOPS_STATE_STORE "s3://example-staging-kops-state"
ENV KOPS_STATE_STORE_REGION "${AWS_REGION}"

# https://github.com/kubernetes/kops/blob/master/channels/stable
# https://github.com/kubernetes/kops/blob/master/docs/images.md
ENV KOPS_BASE_IMAGE="kope.io/k8s-1.8-debian-jessie-amd64-hvm-ebs-2018-02-08"
ENV KOPS_DNS_ZONE "${KOPS_CLUSTER_NAME}"
ENV KOPS_BASTION_PUBLIC_NAME="bastion"
ENV KOPS_PRIVATE_SUBNETS="172.20.32.0/19,172.20.64.0/19,172.20.96.0/19,172.20.128.0/19"
ENV KOPS_UTILITY_SUBNETS="172.20.0.0/22,172.20.4.0/22,172.20.8.0/22,172.20.12.0/22"

ENV KOPS_AVAILABILITY_ZONES="us-west-2a,us-west-2b,us-west-2c"
ENV KOPS_MASTERS_AVAILABILITY_ZONES="us-west-2a,us-west-2b,us-west-2c"
ENV KOPS_NODES_AVAILABILITY_ZONES="us-west-2b,us-west-2c"

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
