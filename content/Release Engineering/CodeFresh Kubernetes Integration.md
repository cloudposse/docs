---
title: "CodeFresh Kubernetes Integration"
excerpt: "Easily add Kubernetes Clusters in CodeFresh"
---
[block:callout]
{
  "type": "danger",
  "title": "IMPORTANT",
  "body": "The \"administrator\" permission on CodeFresh is required to carry out these steps. Ask your CodeFresh administrator to grant these permissions on the [collaborators](https://g.codefresh.io/account/collaborators) page on CodeFresh or to carry out the following steps on your behalf."
}
[/block]
Login to CodeFresh and navigate to the [Kubernetes Integration](https://g.codefresh.io/kubernetes/services/) under account settings.

Click "Add Provider" and select the relevant cloud platform.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/5f2f48b-Screen_Shot_2018-04-16_at_5.17.34_PM.png",
        "Screen Shot 2018-04-16 at 5.17.34 PM.png",
        842,
        626,
        "#d9eaea"
      ]
    }
  ]
}
[/block]
Then click "Add Cluster". For `kops` based clusters, select the "Custom Providers" option.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/60b49ab-Screen_Shot_2018-04-16_at_5.19.13_PM.png",
        "Screen Shot 2018-04-16 at 5.19.13 PM.png",
        399,
        184,
        "#fafcfb"
      ]
    }
  ]
}
[/block]
Next, you'll be presented a form. In [Geodesic Overview](doc:geodesic) we provide a script to make this integration a little bit easier. By running the [codefresh-settings](
https://github.com/cloudposse/geodesic/blob/master/rootfs/usr/local/bin/codefresh-settings) script, it will output all the necessary information you need in order to setup the Kubernetes integration.

Enter the outputs of the script into the form and click save.
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/c5273c7-Screen_Shot_2018-04-16_at_5.20.30_PM.png",
        "Screen Shot 2018-04-16 at 5.20.30 PM.png",
        907,
        126,
        "#f4f9f9"
      ]
    }
  ]
}
[/block]

[block:callout]
{
  "type": "info",
  "title": "READ MORE",
  "body": "The complete docs for configuring CodeFresh with Kubernetes can be found on their [documentation portal](https://docs.codefresh.io/v1.0/docs/adding-non-gke-kubernetes-cluster)."
}
[/block]