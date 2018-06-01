---
title: "Deploy step"
description: ""
weight: 4
---
Deployment step use [Helmfile]({{< relref "tools/helmfile.md" >}}) to define
[releases](https://docs.helm.sh/using_helm/#three-big-concepts) and orchestrate them.

The `Helmfile` stored in application repo usually in `config` directory with
`chart.yaml` wich is template for `values.yaml` used on deploy.

{{% include-code-block title="config/helmfile.yaml" file="release-engineering/cicd-process-steps/examples/app-helmfile.yaml" language="yaml" %}}

{{% include-code-block title="config/chart.yaml" file="release-engineering/cicd-process-steps/examples/app-chart.yaml" language="yaml" %}}

This solution use [Chamber]({{< relref "tools/chamber.md" >}}) to store application secrets.

# Dependency

* [Build charts step]({{< relref "release-engineering/cicd-process-steps/step_build_charts.md" >}})
* [Chamber]({{< relref "tools/chamber.md" >}})

# Examples

{{% include-code-block title="Deploy with Codefresh" file="release-engineering/cicd-process-steps/examples/build-charts-codefresh.yaml" language="yaml" %}}
