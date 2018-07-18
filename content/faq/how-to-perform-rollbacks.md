---
title: "How do we perform rollbacks?"
description: "Learn how to rollback to previous releases of helm apps."
tags:
- helm
- geodesic
- codefresh
- faq
---

# Question

How to rollback application to previous version?

# Answer

[Helm]({{< relref "tools/helm.md" >}}) handles rollbacks out-of-the-box. Everytime a helm release is performed, it creates a new revision. By pinpointing a specific helm revision and performing a rollback, the previous version will be redeployed.

There are a couple ways we recommend performing rollbacks.

## Rollback using Helm Client

###  Start the Geodesic Shell

Run the Geodesic shell followed by `assume-role`
```shell
$CLUSTER_NAME
```

{{% include-code-block title="Run the Geodesic Shell" file="geodesic/module/examples/start-geodesic-shell.txt" %}}

Then login to AWS by running `assume-role`:

{{% include-code-block title="Assume role" file="geodesic/module/examples/assume-role.txt" %}}

### Configure `kubectl` and `helm`

When you start the Geodesic shell, you will need to export the `kubecfg` which provides the TLS client certificates necessary for `kubectl` and `helm` to authenticate with the cluster.

{{% dialog type="code-block" icon="fa fa-code" title="Export kops config" %}}
```
✅   (example-staging-admin) ~ ➤  kops export kubecfg
kops has set your kubectl context to us-west-2.staging.example.com
```
{{% /dialog %}}

(Note, in older versions of `kops` you will need to pass the cluster name, so run `kops export kubecfg $KOPS_CLUSTER_NAME`)

### Rollback Helm Release

Run the following commands to identify the helm release and corresponding revision that you want to rollback to. Note, we're using `$RELEASE_NAME` and `$REVISION_NUMBER` to symbolically represent the values you should enter in their place.

```
helm list
helm history $RELEASE_NAME
helm rollback $RELEASE_NAME $REVISION_NUMBER
```

{{% include-code-block title="Helm rollback" file="faq/examples/helm-rollback.txt" %}}

## Rollback using Codefresh UI

The other option is to use the Codefresh UI to perfom the rollback. The benefit with this is no console access is required.

[Codefresh]({{< relref "release-engineering/codefresh/_index.md" >}}) provides native integration
with Kubernetes and Helm. Here's an example of how you can use their UI to perform a rollback.

1. Open the [Helm Releases](https://g.codefresh.io/helm/releases/releases/) page
{{< img src="/assets/how-to-do-rollback-534718a5.png" title="List Releases" >}}

2. Find the release you want to update and click on it
{{< img src="/assets/how-to-do-rollback-f30ef835.png" title="View Release" >}}

3. Select the release "History" tab
{{< img src="/assets/how-to-do-rollback-bb9fc21b.png" title="Release History" >}}

4. Click on rollback button next to the corresponding revision you wish to restore
{{< img src="/assets/how-to-do-rollback-726fd44e.png" title="Rollback to Revision" >}}

5. Confirm the rollback
{{< img src="/assets/how-to-do-rollback-110761f7.png" title="Confirm Rollback" >}}

6. Wait until rollback finishes

7. Refresh page and check that the new revision appears
{{< img src="/assets/how-to-do-rollback-c23f0d87.png" title="Rollback Completed" >}}
