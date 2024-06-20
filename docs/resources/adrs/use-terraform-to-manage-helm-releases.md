---
title: "Use Terraform to Manage Helm Releases"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1223360698/Use+Terraform+to+Manage+Helm+Releases
sidebar_position: 100
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/reference/adrs/use-terraform-to-manage-helm-releases.md
---

# Use Terraform to Manage Helm Releases
**Date**: **14 Dec 2021**

:::info Needs Update!

The content in this ADR may be out-of-date and needing an update. For questions, please reach out to Cloud Posse

- Cloud Posse recommends using the `helm-release` module to manage operators and other infrastructure setup requirements but does not recommend using Terraform for application deployment.

:::

## Status

**DRAFT**

## Problem

Provisioning helm releases with `helmfile` has worked for a long time, but has a number of shortcomings:

- No integration with Spacelift

- No turnkey workflow for github actions (continuous delivery)

- No way to provision IAM roles needed by services

to solve these problems, we switched to using the Terraform `helm` provider, but this introduced a new set of problems:

- Manual changes made to cluster resources were not detected as drift

- Changes made to helm template files also were not detected as drift

We want to be able to provision helm releases and all dependencies with terraform and GitOps while not compromising on drift detection.

### Related Issues

- [https://github.com/databus23/helm-diff/issues/176](https://github.com/databus23/helm-diff/issues/176)

- [https://github.com/hashicorp/terraform-provider-helm/pull/702](https://github.com/hashicorp/terraform-provider-helm/pull/702)

- [https://github.com/databus23/helm-diff/issues/176#issuecomment-572952711](https://github.com/databus23/helm-diff/issues/176#issuecomment-572952711)

- [https://github.com/databus23/helm-diff/pull/304](https://github.com/databus23/helm-diff/pull/304)
(this might fix the problem in helm-diff but it was not accepted)

## Context

|**Architecture** | **Detect Changes to Non-chart YAML Values?** | **Detect Changes to Local Chart Files?** | **Detect Manual Changes to Deployed Resources?**<br/>(e.g. `kubctl edit`)|
| ----- | ----- | ----- | ----- |
|`helm_release` with `manifest=true` | Yes | Yes | No|
|`helm_release` without `manifest=true` | Yes | No | No|
|`kubernetes_manifest` | Yes | No | No|
|`helmfile_release` | Yes | No | No|

### Testing Methodology

:::caution
Note, changing the port in a running service is not a good test as it fails even with `kubectl apply`

:::

#### Part 1: `echo-server`

- Modify any value from any of the local template files (YAML files within `echo-server/charts/echo-server/`). Then, check that that change is detected by terraform.

- Modify any value in `default.auto.tfvars`. Then, check that that change is detected by terraform.

- Modify any deployed resource via `kubectl edit` and observe that that change is <ins>not</ins> detected by Terraform.

#### Part 2: `cert-manager` (using the `cert-manager` component from the `>v0.185.1` releases of `cloudposse/terraform-aws-components`)

- With `letsencrypt_enabled: true` and `cert_manager_issuer_selfsigned_enabled: false`, modify any value in `cert-manager-issuer/templates/letsencrypt-issuer.yaml`. Then, check that that change is detected by terraform.

- With `letsencrypt_enabled: true` and `cert_manager_issuer_selfsigned_enabled: false`, modify any value in either `cert-manager-issuer/templates/selfsigning-certificate.yaml` or `cert-manager-issuer/templates/selfsigning-issuer.yaml`. Then, check that the change is <ins>not</ins> detected by Terraform, because these files will not be rendered in the deployed helm component (due to the if statements at the top of them).

- Modify any value in `default.auto.tfvars`. Then, check that that change is detected by terraform.

- Modify any deployed resource via `kubectl edit` and observe that that change is <ins>not</ins> detected by Terraform.

## Considered Options

### Option 1: Helm Provider

`manifest=true`

### Option 2: Helm Provider with Kubernetes Provider

### Option 3: Helmfile Provider

### Option 4: ArgoCD Provider (experimental)

### Option 5: Helm Provider with Git Provider and ArgoCD (experimental)

### Option 6: Stop using Helm? 🙂

## Decision

**DECIDED**: Use the Terraform `helm` provider with the `manifest=true` flag.

## Consequences

- We now have solved all the problems that motivated this design choice, and we have not sacrificed any drift detection, relative to using helmfiles for deployment.

## References

- [https://github.com/cloudposse/terraform-aws-components/pull/381](https://github.com/cloudposse/terraform-aws-components/pull/381)


