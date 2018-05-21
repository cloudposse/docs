---
title: "AWS KMS"
description: ""
---

# Dependencies

None

# Install

{{% dialog type="warning" icon="fa-info-circle" title="Prerequisites" %}}
This assumes you've followed the [Geodesic Module Usage with Terraform]({{< relref "geodesic/module/usage/with-terraform.md" >}}) guide which covers all the scaffolding necessary to get started.
{{% /dialog %}}

## Add aws-kms terraform module

Create file in `./conf/aws/kms.tf` with following content

{{% include-code-block title="./conf/aws/kms.tf" file="secrets-management/examples/terraform-aws-kms.tf" language="hcl" %}}

## Rebuild the module

[Rebuild](/geodesic/module/usage/) the module
```shell
> make build
```

##  Run into the module shell

Run the Geodesic shell.
```shell
> $CLUSTER_NAME
> assume-role
```
{{% include-code-block title="Run the Geodesic Shell" file="geodesic/module/usage/examples/start-geodesic-shell.txt" %}}
{{% include-code-block title="Assume role" file="geodesic/module/usage/examples/assume-role.txt" %}}

## Provision aws-kms

Change directory to `/conf/aws` and run there commands to provision the `kms` backend.
```bash
init-terraform
terraform plan
terraform apply
```

{{% include-code-block title="terraform apply" file="secrets-management/examples/terraform-apply-aws-kms.text" %}}


# Usage

Use [Chamber]({{< relref "tools/chamber.md" >}}) to manage secrets in KMS.
