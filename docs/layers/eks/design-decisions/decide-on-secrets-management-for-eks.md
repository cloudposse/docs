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

### Option 3: SOPS Operator

Use [SOPS Operator](https://github.com/isindir/sops-secrets-operator) to manage secrets in Kubernetes. SOPS Operator is a Kubernetes operator that builds on the `sops` project by Mozilla to encrypt the sensitive portions of a `Secrets` manifest into a `SopsSecret` resource, and then decrypt and provision `Secrets` in the Kubernetes cluster.

1. **Mozilla SOPS Encryption**: Mozilla SOPS (Secrets OPerationS) is a tool that encrypts Kubernetes secret manifests, allowing them to be stored securely in Git repositories. SOPS supports encryption using a variety of key management services. Most importantly, it supports AWS KMS which enables IAM capabilities for native integration with AWS.

2. **GitOps-Compatible Secret Management**: In a GitOps setup, secrets are typically stored in version-controlled repositories. However, storing plain-text secrets in Git is a security risk. With SOPS, sensitive information in Kubernetes secret manifests is encrypted, so only the encrypted version is stored in the Git repo. This ensures that the secrets are kept secure while still benefiting from GitOps practices like version control, auditability, and CI/CD pipelines.

3. **AWS KMS Integration**: If AWS KMS is used, SOPS encrypts the secrets using customer-managed keys (CMKs) in AWS KMS. This ensures that only those with appropriate permissions can decrypt and use the secrets. The encrypted secret manifests can be committed to the Git repository, while the keys used for encryption are securely managed in AWS.

4. **Kubernetes Operator**: With the [SOPS Operator](https://github.com/isindir/sops-secrets-operator), decryption and management of Kubernetes secrets is automated. It watches for changes to a `SopsSecret` resource containing encrypted secrets. When it detects a change, the operator decrypts it using AWS KMS and writes a native Kubernetes `Secret`, making them available to applications running in the cluster.

5. **Secure Secret Management**: By keeping the source of truth for secrets outside of Kubernetes (e.g., Git repositories) and only injecting decrypted secrets into the cluster as needed, this setup enhances security. If the Kubernetes cluster is destroyed or compromised, the secrets remain safely encrypted in Git. Additionally, using IAM roles and policies with AWS KMS ensures that only authorized entities can decrypt the secrets.

The SOPS Operator combines the strengths of Mozilla SOPS and AWS KMS, allowing you to:
- Encrypt secrets using KMS keys.
- Store encrypted secrets in Git repositories.
- Automatically decrypt and manage secrets in Kubernetes using the SOPS Operator.

This solution is ideal for teams following GitOps principles who require secure, external management of sensitive information while leveraging Kubernetes' secret management capabilities. But it's downside is that rotating secrets requires a redeployment, which is a heavy handed approach towards secrets rotation.

## Recommendation

We recommend using the External Secrets Operator with AWS SSM Parameter Store. This is a well-tested solution that we have used in the past. We have existing Terraform modules to support this solution.

However, we are in the process of evaluating the AWS Secrets Manager secrets with Kubernetes Secrets Store CSI Driver solution. This is the AWS supported option and may be a better long-term solution. We will build the required Terraform component to support this solution.

## Consquences

We will develop the `eks/secrets-store-csi-driver` component using the [Secrets Store CSI Driver](https://secrets-store-csi-driver.sigs.k8s.io/getting-started/installation)
