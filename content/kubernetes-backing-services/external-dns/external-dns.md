---
title: "External DNS"
description: "The `external-dns` controller synchronizes exposed Kubernetes `Services` and `Ingresses` with DNS providers like Route53."
---

{{% dialog type="warning" icon="fa-info-circle" title="Prerequisites" %}}
This assumes you've followed the [Geodesic Module Usage with Terraform]({{< relref "geodesic/module/with-terraform.md" >}}) guide which covers all the scaffolding necessary to get started.
{{% /dialog %}}

# Dependencies

* [Kube2IAM]({{< relref "kubernetes-backing-services/iam/kube2iam.md" >}})

# Installation

## Provision IAM Role

Create a file in `/conf/kops-aws-platform/external-dns.tf` with the following content

{{% include-github title="External DNS IAM Role" type="code-block" org="cloudposse" repo="terraform-root-modules" ref="0.1.5" file="/aws/kops-aws-platform/external-dns.tf" language="hcl" %}}

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

Change directory to `/conf/kops-aws-platform` and run there commands to provision the `external-dns` backend.
```bash
init-terraform
terraform plan
terraform apply
```

From the Terraform outputs, copy the `kops_external_dns_role_name`into the ENV var `EXTERNAL_DNS_IAM_ROLE` with [Chamber]({{< relref "tools/chamber.md" >}}).

{{% include-code-block title="terraform apply" file="kubernetes-backing-services/external-dns/examples/terraform-apply-external-dns.txt" %}}

In the example the iam role name is `kops_external_dns_role_name = example-staging-external-dns`.

## Install Chart

You can install `external-dns` in a few different ways, but we recommend using the [Helmfile](https://github.com/cloudposse/helmfiles/blob/master/helmfile.d/0100.external-dns.yaml).

## Install with Master Helmfile

1. Set with chamber the `EXTERNAL_DNS_IAM_ROLE` secret to IAM role name from previous step.
2. Set with chamber the `EXTERNAL_DNS_TXT_OWNER_ID` secret to cluster name.
3. Set with chamber the `EXTERNAL_DNS_TXT_PREFIX` secret to a random string.
4. Install `external-dns` using `helmfile sync`.

{{% dialog type="code-block" icon="fa fa-code" title="Install external-dns" %}}
```
chamber write kops EXTERNAL_DNS_IAM_ROLE example-staging-external-dns
chamber write kops EXTERNAL_DNS_TXT_OWNER_ID us-west-2.staging.example.com
chamber write kops EXTERNAL_DNS_TXT_PREFIX "$(uuidgen)-"
chamber exec kops -- helmfile --selector chart=external-dns sync
```
{{% /dialog %}}

Replace with values to suit your specific project.

## Install with Custom Helmfile

Add this code to your [Kubernetes Backing Services](/kubernetes-backing-services) Helmfile:

{{% include-code-block  title="helmfile" file="kubernetes-backing-services/external-dns/examples/external-dns-helmfile.yaml" language="yaml" %}}

Then follow the instructions for running [`helmfile sync`]({{< relref "tools/helmfile.md" >}}).

## Usage

To leverage `external-dns`, you will need to add annotations (e.g. `kubernetes.io/tls-acme: "true"`) to the `Ingress` resource.

With these in place, then `kube-lego` will handle issuing of TLS certificates from Let's Encrypt and saving them to a
Kubernetes secret specificied by the `tls` config parameter.

Here are some examples:

{{% include-code-block title="ingress.yaml" file="kubernetes-backing-services/external-dns/examples/external-dns-usage-ingress.yaml" language="yaml" %}}

{{% include-code-block title="values.yaml" file="kubernetes-backing-services/external-dns/examples/external-dns-usage-values.yaml" language="yaml" %}}

{{% include-code-block title="helmfile" file="kubernetes-backing-services/external-dns/examples/external-dns-usage-helmfile.yaml" language="yaml" %}}

{{% dialog type="info" icon="fa-info-circle" title="Note" %}}
There is no unified specification on how to structure helm chart values. Different charts may have very different structures of the value parameters. The only way to know for sure what is supported is to refer to the chart manifests.

The examples provided here are based on the `stable/chartmuseum` chart https://github.com/kubernetes/charts/blob/master/stable/chartmuseum
{{% /dialog %}}
