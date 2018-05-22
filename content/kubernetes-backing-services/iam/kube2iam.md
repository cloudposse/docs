---
title: "Kube2IAM"
description: ""
---

# Dependencies
None

# Install

## Added assume role permissions

{{% dialog type="important" icon="fa fa-exclamation-triangle" title="Important" %}}
By default Geodesic config Kubernetes nodes to assume roles.
So you can continue to [next step]({{< relref "#added-kops" >}})
{{% /dialog %}}

All Kubernetes nodes instance profile should have permissions to assume role.
To do this, kops manifest should have following `additionalPolicies`

{{% dialog type="code-block" icon="fa fa-code" title="manifest.yaml" %}}
```yaml
apiVersion: kops/v1alpha2
kind: Cluster
metadata:
  name: us-west-2.staging.example.com
spec:
  additionalPolicies:
      nodes: |
        [
          {
            "Sid": "assumeClusterRole",
            "Action": [
              "sts:AssumeRole"
            ],
            "Effect": "Allow",
            "Resource": ["*"]
          }
        ]
```
{{% /dialog %}}

Follow instructions to [apply changes to kubernetes cluster]({{< relref "geodesic/module/with-kops.md#update-a-cluster" >}})

## Added kops

You can install `kube2iam` in different ways, we recomend
to use Master Helmfile.

### Install with Master Helmfile

{{% dialog type="code-block" icon="fa fa-code" title="Install `kube-lego`" %}}
```
helmfile -f /conf/kops/helmfile.yaml --selector namespace=kube-system,chart=kube2iam sync
```
{{% /dialog %}}

This environment variables can be useful for configure:

* `AWS_REGION` - AWS region

Environment variables can be specified in Geodesic Module `Dockerfile` or in [Chamber]({{< relref "tools/chamber.md" >}}) storage.

### Install with custom Helmfile

Add to your [Kubernetes Backing Services](/kubernetes-backing-services) Helmfile this code

{{% include-code-block  title="helmfile.yaml" file="kubernetes-backing-services/iam/examples/kube2iam-helmfile.yaml" language="yaml" %}}

Then do [Helmfile]({{< relref "tools/helmfile.md" >}}) sync follow instructions

# Usage

Add annotation `iam.amazonaws.com/role: "{ROLE NAME}"` to Deployment/CronJob/ReplicaSet.

Here are some examples:

{{% include-code-block title="ingress.yaml" file="kubernetes-backing-services/iam/examples/kube2iam-usage-deployment.yaml" language="yaml" %}}

{{% include-code-block title="values.yaml" file="kubernetes-backing-services/iam/examples/kube2iam-usage-values.yaml" language="yaml" %}}

{{% include-code-block title="helmfile.yaml" file="kubernetes-backing-services/iam/examples/kube2iam-usage-helmfile.yaml" language="yaml" %}}

{{% dialog type="info" icon="fa-info-circle" title="Note" %}}
There is no unified specification for helm chart values structure. Different charts may have very different structures to values. The only way to know for sure what is supported is to refer to the chart manifests.

Provided examples are based on the `stable/chartmuseum` chart https://github.com/kubernetes/charts/blob/master/stable/chartmuseum
{{% /dialog %}}
