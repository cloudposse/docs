---
title: "Step 3: Build Charts"
description: ""
weight: 3
tags:
- cicd
- codefresh
---

[Helm Chart](https://docs.helm.sh/developing_charts/#charts) is one of two artifacts
that are the result of CI/CD build. The chart defines how to execute application
on Kubernets cluster and what services it depends of.

[Build Harness]({{< relref "release-engineering/build-harness.md" >}}) support
building charts.

The chart are build from a basic chart that stored in application source.

In common case chart build step just process this steps:

* Copy base chart to result directory
* Set chart version and docker image version to [generated version]({{< relref "release-engineering/cicd-process-steps/step_versioning.md" >}})
* Fetch chart dependencies
* Publish chart in [artifact storage]({{< relref "kubernetes-platform-services/chart-registry/chartmuseum.md" >}})

# Dependency

* [Semantic Versioning Step]({{< relref "release-engineering/cicd-process/semantic-versioning.md" >}})
* [Chart Registry]({{< relref "kubernetes-platform-services/chart-registry/chartmuseum.md" >}})

# Examples

{{% include-code-block title="Build charts with Codefresh" file="release-engineering/cicd-process/examples/build-charts-codefresh.yaml" language="yaml" %}}
