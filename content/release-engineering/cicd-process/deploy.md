---
title: "Step 6: Deploy to Cluster"
description: "Deploy helm charts to cluster with helmfile and chamber"
weight: 6
tags:
- cicd
- Codefresh
- deployment
---

The deployment step leverages [`helmfile`]({{< relref "tools/helmfile.md" >}}) to define
[releases](https://docs.helm.sh/using_helm/#three-big-concepts) and orchestrate the deployment to the cluster with `helm`.

We typically store the `helmfile.yaml` in the application repo under the `config/` directory. If a chart depends on some values, then we store these values in `config/chart.yaml`, which is an `envsubst` formatted template rendered upon deployment.

Here's an example of what a typical `helmfile` looks like:

{{% include-code-block title="helmfile" file="release-engineering/cicd-process/examples/app-helmfile.yaml" language="yaml" %}}

Here's an example of what a typical `envsubst` parameterized helm values file looks like:

{{% include-code-block title="config/chart.yaml" file="release-engineering/cicd-process/examples/app-chart.yaml" language="yaml" %}}

When we need to pass secrets, we advise using [chamber]({{< relref "tools/chamber.md" >}}) to store application secrets. Our strategy for that is documented under [secrets management for CI/CD]{{< relref "secrets-management/cicd.md" >}})

# Dependencies

* [Build Helm Charts]({{< relref "release-engineering/cicd-process/build-charts.md" >}})
* [Chamber for Secrets]({{< relref "tools/chamber.md" >}})
* [Helmfile for Chart Deployment]({{< relref "tools/chamber.md" >}})

# Examples

{{% include-code-block title="Deploy with Codefresh" file="release-engineering/cicd-process/examples/build-charts-codefresh.yaml" language="yaml" %}}
