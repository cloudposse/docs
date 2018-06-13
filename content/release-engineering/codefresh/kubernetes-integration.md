---
title: "Codefresh Kubernetes Integration"
description: "Easily add Kubernetes Clusters in Codefresh"
tags:
- Codefresh
- kubernetes
---

# Setup

{{% dialog type="info" icon="fa-info-circle" title="Note" %}}
The "administrator" permission on Codefresh is required to carry out these steps. Ask your Codefresh administrator to grant these permissions on the [collaborators](https://g.codefresh.io/account/collaborators) page on Codefresh or to carry out the following steps on your behalf.
{{% /dialog %}}


## Login

Login to Codefresh and navigate to the [Kubernetes Integration](https://g.codefresh.io/kubernetes/services/) under account settings.

## Add Cluster

Click "Add Provider" and select the relevant cloud platform.

![Add New Kubernetes Provider to Codefresh](/assets/5f2f48b-Screen_Shot_2018-04-16_at_5.17.34_PM.png)

Then click "Add Cluster". For `kops` based clusters, select the "Custom Providers" option.

![Add Cluster](/assets/60b49ab-Screen_Shot_2018-04-16_at_5.19.13_PM.png)

Next, you'll be presented a form. In [Geodesic Overview](/geodesic) we provide a script to make this integration a little bit easier. Run the [`codefresh-settings`](
https://github.com/cloudposse/geodesic/blob/master/rootfs/usr/local/bin/codefresh-settings) script to output all the necessary information you need in order to setup the Kubernetes integration.

Enter the outputs of the script into the form and click save.

{{% dialog type="info" icon="fa fa-info-circle" title="Note" %}}
We recommend naming the configuration after the cluster name (e.g. `us-west-2-staging-example-com`).
{{% /dialog %}}

## Enter Kubernetes Credentials

![Enter Kubernetes API Details](/assets/c5273c7-Screen_Shot_2018-04-16_at_5.20.30_PM.png)

{{% dialog type="info" icon="fa fa-book" title="Read More" %}}
The complete docs for configuring Codefresh with Kubernetes can be found on their [documentation portal](https://docs.codefresh.io/v1.0/docs/adding-non-gke-kubernetes-cluster).
{{% /dialog %}}

# Usage

Once you've setup the Kubernetes integration with Codefresh, you can leverage it in your `codefresh.yaml` pipelines by setting the `KUBE_CONTEXT` environment variable to the name of the connection.

For example, here's how you could create a namespace in a build step by using the [`cloudposse/build-harness`]({{< relref "release-engineering/build-harness.md" >}}) container.

```
create_namespace:
  title: Create an Example Namespace
  image: cloudposse/build-harness:0.5.4
  environment:
    - KUBE_CONTEXT=us-west-2-staging-example-com
  commands:
    - "kubectl create namespace example"
```
