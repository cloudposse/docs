---
title: "Decide on Secrets Management for EKS"
sidebar_label: "Secrets Management for EKS"
description: Decide on the secrets management strategy for EKS.
---
import Intro from '@site/src/components/Intro';
import KeyPoints from '@site/src/components/KeyPoints';

<Intro>
We need to decide on the secrets management strategy for EKS. We prefer storing secrets in AWS SSM Parameter Store, but we need some way to pull these secrets into Kubernetes.
</Intro>

## Problem

We need someway to store and manage secrets for the applications running on EKS clusters. We have a few options to choose from.

### Option 1: External Secrets Operator

Use [External Secrets Operator](https://external-secrets.io/latest/) with AWS SSM Parameter Store.

External Secrets Operator is a Kubernetes operator that manages and stores sensitive information in external secret management systems like AWS Secrets Manager, GCP Secret Manager, Azure Key Vault, HashiCorp Vault, and more. It allows you to use these external secret management systems to securely add secrets in your Kubernetes cluster.

Cloud Posse historically recommends using External Secrets Operator with AWS SSM Parameter Store and has existing Terraform modules to support this solution. See the [eks/external-secrets-operator](/components/library/aws/eks/external-secrets-operator/) component.

### Option 2: AWS Secrets Manager secrets with Kubernetes Secrets Store CSI Driver

Use [AWS Secrets and Configuration Provider (ASCP) for the Kubernetes Secrets Store CSI Driver](https://docs.aws.amazon.com/secretsmanager/latest/userguide/integrating_csi_driver.html). This option allows you to use AWS Secrets Manager secrets as Kubernetes secrets that can be accessed by Pods as environment variables or files mounted in the pods. The ASCP also works with [Parameter Store parameters](https://docs.aws.amazon.com/systems-manager/latest/userguide/integrating_csi_driver.html)

However, Cloud Posse does not have existing Terraform modules for this solution. We would need to build this support.

## Recommendation

We recommend using the External Secrets Operator with AWS SSM Parameter Store. This is a well-tested solution that we have used in the past. We have existing Terraform modules to support this solution.

However, we are in the process of evaluating the AWS Secrets Manager secrets with Kubernetes Secrets Store CSI Driver solution. This is the AWS supported option and may be a better long-term solution. We will build the required Terraform component to support this solution.

## Consquences

We will build the `eks/secrets-store-csi-driver` component using the [Secrets Store CSI Driver](https://secrets-store-csi-driver.sigs.k8s.io/getting-started/installation)
