---
title: "Staging Cluster Map"
excerpt: ""
---
Staging - is kubernetes cluster running on top of AWS. Functionality of cluster extended with Kubernetes backing services.
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/2986185-Current_Staging_cluster_-_Page_1_2.png",
        "Current Staging cluster - Page 1 (2).png",
        1780,
        398,
        "#c6c6c2"
      ],
      "caption": "Staging Cluster"
    }
  ]
}
[/block]
  * Grey - Kubernetes & AWS is [Infrastructure as a Code](doc:infrastructure-as-a-code) 
  * Blue - Kubernetes Backing Services - are [Backing Services](doc:scafflod) for extending k8s functionality
  * Red - Monitoring tools - are [Backing Services](doc:scafflod) required for monitoring and alerting
  * Yellow - Platform services - are [Backing Services](doc:scafflod) required for CI\CD and development
  * Green - [Deployable Applications](doc:deployable-application)