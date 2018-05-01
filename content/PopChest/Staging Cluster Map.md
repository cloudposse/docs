---
title: "Staging Cluster Map"
excerpt: ""
---
Staging - is kubernetes cluster running on top of AWS. Functionality of cluster extended with Kubernetes backing services.
![Staging Cluster](/images/2986185-Current_Staging_cluster_-_Page_1_2.png)Staging Cluster
  * Grey - Kubernetes & AWS is [Infrastructure as a Code](doc:infrastructure-as-a-code) 
  * Blue - Kubernetes Backing Services - are [Backing Services](doc:scafflod) for extending k8s functionality
  * Red - Monitoring tools - are [Backing Services](doc:scafflod) required for monitoring and alerting
  * Yellow - Platform services - are [Backing Services](doc:scafflod) required for CI\CD and development
  * Green - [Deployable Applications](doc:deployable-application)