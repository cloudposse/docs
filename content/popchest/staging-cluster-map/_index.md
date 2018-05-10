---
title: Staging Cluster Map
excerpt: ''
---

Staging - is kubernetes cluster running on top of AWS. Functionality of cluster extended with Kubernetes backing services.

{{< img src="/assets/2986185-Current_Staging_cluster_-_Page_1_2.png" title="Staging Cluster" >}}

- Grey - Kubernetes & AWS is [Infrastructure as a Code]({{< relref "devops-methodology/software-lifecycle/infrastructure-as-code.md" >}})
- Blue - Kubernetes Backing Services - are [Backing Services](/kubernetes-backing-services) for extending k8s functionality
- Red - Monitoring tools - are [Backing Services](/kubernetes-backing-services) required for monitoring and alerting
- Yellow - Platform services - are [Backing Services](/kubernetes-backing-services) required for CI/CD and development
- Green - [Deployable Applications]({{< relref "devops-methodology/software-lifecycle/deployable-applications.md" >}})
