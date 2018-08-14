---
title: "ChartMuseum"
description: "Chartmuseum is an artifact storage for Helm charts."
tags:
- helm
- chart
- geodesic
- kubernetes
- kube2iam
---

[Chartmuseum](https://github.com/kubernetes-helm/chartmuseum) is an artifact storage
for [Helm]({{< relref "tools/helm.md" >}}) charts.

# Dependencies

* [Kube2IAM]({{< relref "kubernetes-backing-services/iam/kube2iam.md" >}})
* [External DNS]({{< relref "kubernetes-backing-services/external-dns/external-dns.md" >}})
* [Kube Lego]({{< relref "kubernetes-backing-services/tls-management/kube-lego-lets-encrypt.md" >}})

# Installation

## Provision S3 Bucket and IAM Role

Create a file in `/conf/kops-aws-platform/chart-repo.tf` with the following content

{{% include-github title="Chartmuseum S3 bucket and IAM role" type="code-block" org="cloudposse" repo="terraform-root-modules" ref="0.1.5" file="/aws/kops-aws-platform/chart-repo.tf" language="hcl" %}}

## Rebuild the Geodesic Module

[Rebuild]({{< relref "geodesic/module/_index.md" >}}) the module
```shell
make docker/build
```

##  Start the Geodesic Shell

Run the Geodesic shell followed by `assume-role`
```shell
$CLUSTER_NAME
```

{{% include-code-block title="Run the Geodesic Shell" file="geodesic/module/examples/start-geodesic-shell.txt" %}}

Then login to AWS by running `assume-role`:

{{% include-code-block title="Assume role" file="geodesic/module/examples/assume-role.txt" %}}

## Provision Chamber Resources

Change directory to `/conf/kops-aws-platform` and run these commands to provision the `chart-repo` backend.
```bash
init-terraform
terraform plan
terraform apply
```

From the Terraform outputs, copy the following values into the environment variables
* `kops_chart_repo_bucket_bucket_id` -> `CHARTMUSEUM_STORAGE_AMAZON_BUCKET`
* `kops_chart_repo_bucket_role_name` -> `CHARTMUSEUM_IAM_ROLE`

{{% include-code-block title="terraform apply" file="kubernetes-platform-services/artifact-storage/examples/terraform-apply-chart-repo.txt" %}}

In the example the bucket name is `kops_chart_repo_bucket_bucket_id = example-staging-chart-repo`.
IAM role is `kops_chart_repo_bucket_role_name = example-staging-chart-repo`.

## Install Chart

To install the `chartmuseum`, you will need to define the `hostname`, which is the FQHN used to access the `chartmuseum`.

In our example, we use `charts.us-west-2.staging.example.com` as the FQHN. Replace this with an appropriate value to suit your specific project.

You can install `chartmuseum` in a few different ways, but we recommend using the [Helmfile](https://github.com/cloudposse/helmfiles/blob/master/helmfile.d/0300.chartmuseum.yaml).

### Install with Master Helmfile

{{% dialog type="warning" icon="fa fa-exclamation-circle" title="Breaking changes" %}}

If you are updating Geodesic to __`>= 0.9.29`__ from previous version pay attention to

* Starting from __`0.9.29`__ using aws s3 as default storage (previously local disk used), so after update your current charts would be lost
* __`chart-repo`__ release was __depricated__, so please remove it with command

```
helm delete --purge chart-repo
```

* Naming of environment variables changed, so update the values with chamber and delete unnessasery old ones

| __prior `0.9.29`__                   | __after `0.9.29`__                  |
| ------------------------------------ | ----------------------------------- |
| `CHART_REPO_IMAGE_TAG`               | __REMOVED__                         |
| `CHART_REPO_STORAGE`                 | __REMOVED__                         |
| `CHART_REPO_DEBUG`                   | `CHARTMUSEUM_DEBUG`                 |
| `CHART_REPO_STORAGE_AMAZON_BUCKET`   | `CHARTMUSEUM_STORAGE_AMAZON_BUCKET` |
| `CHART_REPO_STORAGE_AMAZON_PREFIX`   | `CHARTMUSEUM_STORAGE_AMAZON_PREFIX` |
| `CHART_REPO_STORAGE_AMAZON_REGION`   | `CHARTMUSEUM_STORAGE_AMAZON_REGION` |
| `CHART_REPO_STORAGE_AWS_IAM_ROLE`    | `CHARTMUSEUM_IAM_ROLE`              |
| `CHART_REPO_SERVER_SECRET_NAME`      | `CHARTMUSEUM_SECRET_NAME`           |
| `CHART_REPO_SERVER_HOSTNAME`         | `CHARTMUSEUM_HOSTNAME`              |
| `CHART_REPO_SERVER_REPLICA_COUNT`    | __REMOVED__                         |
| `CHART_REPO_SERVER_TTL`              | __REMOVED__                         |
| `CHART_REPO_SERVER_BASIC_AUTH_USER`  | `CHARTMUSEUM_BASIC_AUTH_USER`       |
| `CHART_REPO_SERVER_BASIC_AUTH_PASS`  | `CHARTMUSEUM_BASIC_AUTH_PASS`       |
| `CHART_REPO_GATEWAY_HOSTNAME`        | `CHARTMUSEUM_API_HOSTNAME`          |
| `CHART_REPO_GATEWAY_INGRESS`         | __REMOVED__                         |
| `CHART_REPO_GATEWAY_REPLICA_COUNT`   | __REMOVED__                         |
| `CHART_REPO_GATEWAY_SECRET_NAME`     | `CHARTMUSEUM_API_SECRET_NAME`       |
| `CHART_REPO_GATEWAY_BASIC_AUTH_USER` | `CHARTMUSEUM_API_BASIC_AUTH_USER`   |
| `CHART_REPO_GATEWAY_BASIC_AUTH_PASS` | `CHARTMUSEUM_API_BASIC_AUTH_PASS`   |

{{% /dialog %}}

Master Helmfile provides two releases of chartmuseum:
* `charts` - Chartmuseum that serve charts
* `charts-api` - Chartmuseum that provide api gateway to publish charts.

These releases share the same environment variables.
`charts-api` gateway will be available on the subdomain `api` for the FQHN.
In our example it would be `api.charts.us-west-2.staging.example.com`.

To install releases follow these instructions:
1. Set the `CHARTMUSEUM_STORAGE_AMAZON_BUCKET` secret with chamber to the value copied from the Terraform output
2. Set the `CHARTMUSEUM_STORAGE_AMAZON_REGION` secret with chamber
3. Set the `CHARTMUSEUM_IAM_ROLE` secret with chamber to the value copied from the Terraform output
4. Set the `CHARTMUSEUM_INGRESS` secret with chamber provided by [Nginx ingress]({{< relref "kubernetes-backing-services/ingress/nginx-ingress-controller.md" >}})
5. Set the `CHARTMUSEUM_HOSTNAME` secret with chamber
6. Run the following commands to install `chartmuseum`.

{{% dialog type="code-block" icon="fa fa-code" title="Install chartmuseum" %}}
```
chamber write kops CHARTMUSEUM_STORAGE_AMAZON_BUCKET example-staging-chart-repo
chamber write kops CHARTMUSEUM_STORAGE_AMAZON_REGION us-west-2
chamber write kops CHARTMUSEUM_IAM_ROLE example-staging-chart-repo
chamber write kops CHARTMUSEUM_INGRESS ingress.us-west-2.staging.example.com
chamber write kops CHARTMUSEUM_HOSTNAME charts.us-west-2.staging.example.com
chamber exec kops -- helmfile --selector chart=chartmuseum sync
```
{{% /dialog %}}

These are the environment variables you will need to set to configure `chartmuseum`:

* `CHARTMUSEUM_BASIC_AUTH_USER` - HTTP basic authenticate username
* `CHARTMUSEUM_BASIC_AUTH_PASS` - HTTP basic authenticate password
* `CHARTMUSEUM_API_BASIC_AUTH_USER` - HTTP basic authenticate username for `charts-api`
* `CHARTMUSEUM_API_BASIC_AUTH_PASS` - HTTP basic authenticate password for `charts-api`
* `CHARTMUSEUM_SECRET_NAME` - Secret name to store TLS generated with [Kube Lego]({{< relref "kubernetes-backing-services/tls-management/kube-lego-lets-encrypt.md" >}})
* `CHARTMUSEUM_API_SECRET_NAME` - Secret name to store TLS generated with [Kube Lego]({{< relref "kubernetes-backing-services/tls-management/kube-lego-lets-encrypt.md" >}}) for `charts-api`
* `CHARTMUSEUM_STORAGE_AMAZON_PREFIX` - Prefix path to store charts in S3 bucket

Environment variables can be specified in the Geodesic Module's `Dockerfile` or using [Chamber]({{< relref "tools/chamber.md" >}}) storage, which is recommended for all secrets.

### Install with Custom Helmfile

Add this code to your [Kubernetes Backing Services](/kubernetes-backing-services) Helmfile:

{{% include-code-block  title="helmfile" file="kubernetes-platform-services/artifact-storage/examples/chart-repo-helmfile.yaml" language="yaml" %}}

Then follow the instructions for running [`helmfile sync`]({{< relref "tools/helmfile.md" >}}).

# Usage

Read [chart museum documentation](https://github.com/kubernetes-helm/chartmuseum)
for more information on `chartmuseum` usage.
