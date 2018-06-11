---
title: "Kubernetes Backing Services"
description: "Kubernetes Backing Services are foundational services that other services in the cluster depend on such as IAM, ingress, external dns, TLS certificates, etc."
icon: "fa fa-database"
---
{{% dialog type="warning" icon="fa-info-circle" title="Prerequisites" %}}
This assumes you've followed the [Helm server-side install]({{< relref "tools/helm.md" >}}) guide which covers all the necessary steps to get started.
{{% /dialog %}}

We provide a number of [Terraform Modules]({{< relref "terraform-modules/overview.md" >}}) to provision AWS resources needed by Kubernetes backing service like [external-dns](/kubernetes-backing-services/external-dns/) and [chart-repo]({{<relref "helm-charts/supported-charts/chart-repo.md" >}}).

See our [Terraform modules for Kubernetes (Kops)](/terraform-modules/kops-kubernetes) for modules specific to kops.
