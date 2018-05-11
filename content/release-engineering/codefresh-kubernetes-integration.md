---
title: "CodeFresh Kubernetes Integration"
description: "Easily add Kubernetes Clusters in CodeFresh"
---

{{% dialog type="info" icon="fa-info-circle" title="Note" %}}
The "administrator" permission on CodeFresh is required to carry out these steps. Ask your CodeFresh administrator to grant these permissions on the [collaborators](https://g.codefresh.io/account/collaborators) page on CodeFresh or to carry out the following steps on your behalf.
{{% /dialog %}}

Login to CodeFresh and navigate to the [Kubernetes Integration](https://g.codefresh.io/kubernetes/services/) under account settings.

Click "Add Provider" and select the relevant cloud platform.

![Add New Kubernetes Provider to Codefresh](/assets/5f2f48b-Screen_Shot_2018-04-16_at_5.17.34_PM.png)

Then click "Add Cluster". For `kops` based clusters, select the "Custom Providers" option.

![Add Cluster](/assets/60b49ab-Screen_Shot_2018-04-16_at_5.19.13_PM.png)

Next, you'll be presented a form. In [Geodesic Overview](/geodesic) we provide a script to make this integration a little bit easier. By running the [codefresh-settings](
https://github.com/cloudposse/geodesic/blob/master/rootfs/usr/local/bin/codefresh-settings) script, it will output all the necessary information you need in order to setup the Kubernetes integration.

Enter the outputs of the script into the form and click save.

![Enter Kubernetes API Details](/assets/c5273c7-Screen_Shot_2018-04-16_at_5.20.30_PM.png)

{{% dialog type="info" icon="fa fa-book" title="Read More" %}}
The complete docs for configuring CodeFresh with Kubernetes can be found on their [documentation portal](https://docs.codefresh.io/v1.0/docs/adding-non-gke-kubernetes-cluster).
{{% /dialog %}}
