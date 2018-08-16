---
title: "Kube2IAM"
description: ""
---

# Dependencies
None

# Install

## Enable Assumed Roles

{{% dialog type="important" icon="fa fa-exclamation-triangle" title="Important" %}}
By default, the kops manifest that ships with Geodesic is configured to permit nodes to assume roles.
So you can continue to [next step]({{< relref "#kops-integration" >}})
{{% /dialog %}}

All Kubernetes nodes instance profile should have permissions to assume role.

To do this, kops manifest should define following `additionalPolicies`. By default, we include this in the [`manifest.yaml`](https://github.com/cloudposse/geodesic/blob/master/rootfs/templates/kops/default.yaml#L6-L17) that ships with geodesic.

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

Follow the instructions to [apply changes to the kops cluster]({{< relref "geodesic/module/with-kops.md#update-cluster" >}})

## Kops Integration

Now to leverage IAM Roles with your `kops` cluster, you'll need to install `kube2iam`. There are a number of ways to go about this, but we recommend to use our [Helmfiles](https://github.com/cloudposse/helmfiles).

### Install with Helmfile

{{% dialog type="code-block" icon="fa fa-code" title="Install `kube2iam`" %}}
```
helmfile --selector chart=kube2iam sync
```
{{% /dialog %}}

This service depends on the following environment variables:

* `AWS_REGION` - AWS region

Environment variables can be specified in Geodesic Module's `Dockerfile` or using [Chamber]({{< relref "tools/chamber.md" >}}) storage.

### Install with Custom Helmfile

Add to your [Kubernetes Backing Services](/kubernetes-backing-services) Helmfile this code snippet.

{{% include-code-block  title="helmfile.yaml" file="kubernetes-backing-services/iam/examples/kube2iam-helmfile.yaml" language="yaml" %}}

Then run [`helmfile sync`]({{< relref "tools/helmfile.md" >}}) to install.

# Usage

Add an annotation login `iam.amazonaws.com/role: "some-aws-role"` to the kubernetes resource (e.g. `Deployment`, `CronJob`, `ReplicaSet`, `Pod`, etc). Replace `some-aws-role` with an IAM role that you've previously provisioned.

We recommend provisioning all IAM roles using terraform modules like this one (`terraform-aws-kops-external-dns`)[https://github.com/cloudposse/terraform-aws-kops-external-dns] for provisioning IAM roles to access Route53.

Here are some examples:

{{% include-code-block title="ingress.yaml" file="kubernetes-backing-services/iam/examples/kube2iam-usage-deployment.yaml" language="yaml" %}}

{{% include-code-block title="values.yaml" file="kubernetes-backing-services/iam/examples/kube2iam-usage-values.yaml" language="yaml" %}}

{{% include-code-block title="helmfile" file="kubernetes-backing-services/iam/examples/kube2iam-usage-helmfile.yaml" language="yaml" %}}

{{% dialog type="info" icon="fa-info-circle" title="Note" %}}
There is no unified specification for the structure of helm chart values. Different charts may have very different structures to values. The only way to know for sure what is supported is to refer to the chart manifests. Additionally, there's no schema validation for `values.yaml`, so specifying an incorrect structure will not raise any alarms.

The examples provided here are based on the `stable/chartmuseum` chart https://github.com/kubernetes/charts/blob/master/stable/chartmuseum
{{% /dialog %}}
