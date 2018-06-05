---
title: "Helm Quick Start"
description: ""
---
Helm is a package manager for kubernetes.

There are a vast number of public charts available: under the official kubernetes project on GitHub: <https://github.com/kubernetes/charts/>

{{% dialog type="info" icon="fa fa-info-circle" title="Official Documentation" %}}
Visit the [Helm Documentation Portal](https://docs.helm.sh/) for excellent documentation
{{% /dialog %}}

# Example Chart Scaffolding

We maintain an advanced helm chart that we use as the basis for many of the charts we write. This is a great reference chart to use as it leverages the most common patterns for writing charts.

- https://github.com/cloudposse/helm-chart-scaffolding

# Values File

We recommend using [helmfile]({{< relref "tools/helmfile.md" >}}) to install the chart.

Any parameters (e.g. secrets, API keys, etc) should be passed as environment variables. Then follow the [example of using helmfile with chamber]({{< relref "tools/helmfile.md#example-helmfile-with-chamber" >}}) to install the chart.

# Searching for Packages

Helm makes it easy to search for available packages. For example, to search repository for a package called `datadog`, we would run:

```
helm search datadog
```

#### Installing GitHub Authorized Keys

Install GitHub Authorized Keys if you want to enable users to login to the cluster via SSH using their GitHub Usernames & GitHub SSH keys.

To install [`github-authorized-keys`](https://github.com/cloudposse/github-authorized-keys/) on all nodes (including master nodes), you can run the following commands.

**NOTE**: The [Kops]({{< relref "tools/kops.md" >}}) `bastion` is not part of the kubernetes cluster, thus `DaemonSets` cannot be deployed to this instance. One alternative is to deploy a [`bastion`](https://github.com/cloudposse/charts/tree/master/incubator/bastion) helm chart.

Simply run,
```
source /secrets/github
helm install --name ghk --namespace=kube-system \
  --set "githubAPIToken=${GITHUB_API_TOKEN}" \
  --set "githubOrganization=${GITHUB_ORGANIZATION}" \
  --set "githubTeam=${GITHUB_TEAM}" \
    "cloudposse-incubator/github-authorized-keys"
```

View all settings:
```
helm get values ghk
```

Now you can edit those values by running:
```
helm edit ghk
```
