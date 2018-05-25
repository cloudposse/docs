---
title: "How to rollback app to previous version"
description: "How to rollback to previous version."
tags:
- helm
- geodesic
- codefresh
- faq
---

# Question

How to rollback application to previous version?

# Answer

[Helm]({{< relref "tools/helm.md" >}}) release have revisions that is list of
previously deployed versions of the release.

## Rollback with CLI

###  Start the Geodesic Shell

Run the Geodesic shell followed by `assume-role`
```shell
sh-3.2$ $CLUSTER_NAME
```

{{% include-code-block title="Run the Geodesic Shell" file="geodesic/module/examples/start-geodesic-shell.txt" %}}

Then login to AWS by running `assume-role`:

{{% include-code-block title="Assume role" file="geodesic/module/examples/assume-role.txt" %}}

### Configure `kubectl` and `helm`

When you run into the Geodesic module shell you need to export the `kubecfg` which provides the TLS client certificates necessary for `kubectl` and `helm` to authenticate with the cluster.

{{% dialog type="code-block" icon="fa fa-code" title="Export kops config" %}}
```
✅   (example-staging-admin) ~ ➤  kops export kubecfg $KOPS_CLUSTER_NAME
kops has set your kubectl context to us-west-2.staging.example.com
```
{{% /dialog %}}

### Rollback helm release

Run
```
sh-3.2 $ helm list
sh-3.2 $ helm history {release_name}
sh-3.2 $ helm rollback {release_name} {revision_number}
```

{{% include-code-block title="Helm rollback" file="faq/examples/helm-rollback.txt" %}}

## Rollback with UI

[Codefresh]({{< relref "release-engineering/codefresh.md" >}}) have nice integration
with Kubernetes and Helm and have UI that allow to rollback releases

* Open [Releases](https://g.codefresh.io/helm/releases/releases/) page
{{< img src="/assets/how-to-do-rollback-534718a5.png" title="Releases" >}}
* Find required release and click on it
{{< img src="/assets/how-to-do-rollback-f30ef835.png" title="Release page" >}}
* Open release history tab
{{< img src="/assets/how-to-do-rollback-bb9fc21b.png" title="Release history" >}}
* Click on rollback button for required revision
{{< img src="/assets/how-to-do-rollback-726fd44e.png" title="Rollback to revision" >}}
* Confirm your will to do rollback
{{< img src="/assets/how-to-do-rollback-110761f7.png" title="Confirm rollback" >}}
* Wait rollback finished
* Refresh page and check new revision appears
{{< img src="/assets/how-to-do-rollback-c23f0d87.png" title="New release appears" >}}
