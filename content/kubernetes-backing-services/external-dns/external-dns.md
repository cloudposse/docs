---
title: "External DNS"
description: ""
---

{{% dialog type="warning" icon="fa-info-circle" title="Prerequisites" %}}
This assumes you've followed the [Geodesic Module Usage with Terraform]({{< relref "geodesic/module/with-terraform.md" >}}) guide which covers all the scaffolding necessary to get started.
{{% /dialog %}}

# Dependencies

* Kube2IAM

# Install

## Provision IAM role

Create a file in `/conf/kops-aws-platform/external-dns.tf` with following content

{{% include-github title="External DNS IAM Role" type="code-block" org="cloudposse" repo="terraform-root-modules" ref="0.1.3" file="/aws/kops-aws-platform/external-dns.tf" language="hcl" %}}

## Rebuild the Geodesic Module

[Rebuild](/geodesic/module/) the module
```shell
> make build
```

##  Start the Geodesic Shell

Run the Geodesic shell followed by `assume-role`
```shell
sh-3.2$ $CLUSTER_NAME
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

## Install chart

You can install `external-dns` in a few different ways, but we recomend to use the [Master Helmfile](https://github.com/cloudposse/geodesic/blob/master/rootfs/conf/kops/helmfile.yaml).

## Install with Master Helmfile

1. Set with chamber the `EXTERNAL_DNS_IAM_ROLE` secret to IAM role name from previous step.
2. Set with chamber the `EXTERNAL_DNS_TXT_OWNER_ID` secret to cluster name.
3. Set with chamber the `EXTERNAL_DNS_TXT_PREFIX` secret to random string.
4. Run then install `external-dns` using `helmfile sync`.

{{% dialog type="code-block" icon="fa fa-code" title="Install external-dns" %}}
```
chamber write kops EXTERNAL_DNS_IAM_ROLE example-staging-external-dns
chamber write kops EXTERNAL_DNS_TXT_OWNER_ID us-west-2.staging.example.com
chamber write kops EXTERNAL_DNS_TXT_PREFIX $(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1)
chamber exec kops -- helmfile -f /conf/kops/helmfile.yaml --selector namespace=kube-system,chart=external-dns sync
```
{{% /dialog %}}

Replace with values to suit your specific project.

## Install with Custom Helmfile

Add to your [Kubernetes Backing Services](/kubernetes-backing-services) Helmfile this code

{{% include-code-block  title="helmfile.yaml" file="kubernetes-backing-services/external-dns/examples/external-dns-helmfile.yaml" language="yaml" %}}

Then follow the instructions for running [`helmfile sync`]({{< relref "tools/helmfile.md" >}}).

# Usage
