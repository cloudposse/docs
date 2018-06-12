---
title: "Step 4: Build Charts"
description: "Build helm charts pinned to docker image tags."
weight: 4
tags:
- cicd
- codefresh
---

A [helm chart](https://docs.helm.sh/developing_charts/#charts) is one of the two artifacts
that result from the CI/CD build process. The chart defines how to execute the application
on a Kubernets cluster and what services it depends on.

The [build-harness]({{< relref "release-engineering/build-harness.md" >}}) supports building charts. By default, it will look for a chart in the `charts/` folder located in a project's root folder.

Generally, the process of building a chart looks something like this:

1. Copy the `chart/` folder to a temporary directory
2. Rewrite `Chart.yaml` and `values.yaml` (using `yq`) the chart version and the docker image version, using [semantic version]({{< relref "release-engineering/cicd-process/semantic-versioning.md" >}}).
3. Fetch chart dependencies (if any)
4. Publish the chart to the [chart registry]({{< relref "kubernetes-platform-services/chart-registry/chartmuseum.md" >}})

{{% dialog type="info" icon="fa fa-info-circle" title="Note" %}}
The actual implementation can be found in the [build-harness helm module](https://github.com/cloudposse/build-harness/blob/master/modules/helm/Makefile.chart).
{{% /dialog %}}

# Dependencies

* [Semantic Versioning]({{< relref "release-engineering/cicd-process/semantic-versioning.md" >}})
* [Chart Registry]({{< relref "kubernetes-platform-services/chart-registry/chartmuseum.md" >}})

# Examples

{{% include-code-block title="Build charts with Codefresh" file="release-engineering/cicd-process/examples/build-charts-codefresh.yaml" language="yaml" %}}
