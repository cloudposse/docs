---
title: "Decide on Secrets Management for EKS"
sidebar_label: "Secrets Management for EKS"
description: Decide on the secrets management strategy for EKS.
---
import Intro from '@site/src/components/Intro';
import KeyPoints from '@site/src/components/KeyPoints';

<Intro>
We need to decide on a secrets management strategy for EKS. We prefer storing secrets externally, like in AWS SSM Parameter Store, to keep clusters more disposable. If we decide on this, we'll need a way to pull these secrets into Kubernetes.
</Intro>

## Problem

We aim to design our Kubernetes clusters to be disposable and ephemeral, treating them like cattle rather than pets. This influences how we manage secrets. Ideally, Kubernetes should not be the sole source of truth for secrets, though we still want to leverage Kubernetes’ native `Secret` resource. If the cluster experiences a failure, storing secrets exclusively within Kubernetes risks losing access to them. Additionally, keeping secrets only in Kubernetes limits integration with other services.

To address this, several solutions allow secrets to be stored externally (as the source of truth) while still utilizing Kubernetes' `Secret` resources. These solutions, including some open-source tools and recent offerings from Amazon, enhance resilience and interoperability. Any approach must respect IAM permissions and ensure secure secret management for applications running on EKS. We have several options to consider that balance external secret storage with Kubernetes-native functionality.

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

2. **GitOps-Compatible Secret Management**: In a GitOps setup, storing plain-text secrets in Git poses security risks. Using SOPS, we can encrypt sensitive data in Kubernetes secret manifests while keeping the rest of the manifest in clear text. This allows us to store encrypted secrets in Git, track changes with diffs, and maintain security while benefiting from GitOps practices like version control, auditability, and CI/CD pipelines.

3. **AWS KMS Integration**: SOPS uses AWS KMS to encrypt secrets with customer-managed keys (CMKs), ensuring only authorized users—based on IAM policies—can decrypt them. The encrypted secret manifests can be safely committed to Git, with AWS securely managing the keys. Since it's IAM-based, it integrates seamlessly with STS tokens, allowing secrets to be decrypted inside the cluster without hardcoded credentials.

4. **Kubernetes Operator**: The [SOPS Secrets Operator](https://github.com/isindir/sops-secrets-operator) automates the decryption and management of Kubernetes secrets. It monitors a `SopsSecret` resource containing encrypted secrets. When a change is detected, the operator decrypts the secrets using AWS KMS and generates a native Kubernetes `Secret`, making them available to applications in the cluster. AWS KMS uses envelope encryption to manage the encryption keys, ensuring that secrets remain securely encrypted at rest.

5. **Improved Disaster Recovery and Security**: By storing the source of truth for secrets outside of Kubernetes (e.g., in Git), this setup enhances disaster recovery, ensuring secrets remain accessible even if the cluster is compromised or destroyed. While secrets are duplicated across multiple locations, security is maintained by using IAM for encryption and decryption outside Kubernetes, and Kubernetes' native Role-Based Access Control (RBAC) model for managing access within the cluster. This ensures that only authorized entities, both external and internal to Kubernetes, can access the secrets.

The SOPS Operator combines the strengths of Mozilla SOPS and AWS KMS, allowing you to:
- Encrypt secrets using KMS keys.
- Store encrypted secrets in Git repositories.
- Automatically decrypt and manage secrets in Kubernetes using the SOPS Operator.

This solution is ideal for teams following GitOps principles, offering secure, external management of sensitive information while utilizing Kubernetes' secret management capabilities. However, the redeployment required for secret rotation can be heavy-handed, potentially leading to a period where services are still using outdated or invalid secrets. This could cause services to fail until the new secrets are fully rolled out.

## Recommendation

We recommend using the External Secrets Operator with AWS SSM Parameter Store. This is a well-tested solution that we have used in the past. We have existing Terraform modules to support this solution.

However, we are in the process of evaluating the AWS Secrets Manager secrets with Kubernetes Secrets Store CSI Driver solution. This is the AWS supported option and may be a better long-term solution. We will build the required Terraform component to support this solution.

## Consequences

We will develop the `eks/secrets-store-csi-driver` component using the [Secrets Store CSI Driver](https://secrets-store-csi-driver.sigs.k8s.io/getting-started/installation)
