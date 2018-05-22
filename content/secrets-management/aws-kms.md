---
title: "AWS KMS"
description: "Use Terraform to easily provision all KMS+SSM resources for Chamber."
---

{{% dialog type="warning" icon="fa-info-circle" title="Prerequisites" %}}
This assumes you've followed the [Geodesic Module Usage with Terraform]({{< relref "geodesic/module/usage/with-terraform.md" >}}) guide which covers all the scaffolding necessary to get started.
{{% /dialog %}}

# Dependencies

None

# Install

## Add aws-kms terraform module

Create a file in `/conf/chamber/kms.tf` with following content

{{% include-github title="/conf/chamber/kms-key.tf" type="code-block" org="cloudposse" repo="terraform-root-modules" ref="0.1.1" file="/aws/chamber/kms-key.tf" language="hcl" %}}

## Rebuild the module

[Rebuild](/geodesic/module/usage/) the module
```shell
> make build
```

##  Start the Geodesic Shell

Run the Geodesic shell followed by `assume-role`
```shell
sh-3.2$ $CLUSTER_NAME
```

{{% include-code-block title="Run the Geodesic Shell" file="geodesic/module/usage/examples/start-geodesic-shell.txt" %}}

Then login to AWS by running `assume-role`:

{{% include-code-block title="Assume role" file="geodesic/module/usage/examples/assume-role.txt" %}}

## Provision Chamber Resources

Change directory to `/conf/chamber` and run there commands to provision the `kms` backend.
```bash
init-terraform
terraform plan
terraform apply
```

{{% include-code-block title="terraform apply" file="secrets-management/examples/terraform-apply-aws-kms.text" %}}

# Usage

Use [Chamber]({{< relref "tools/chamber.md" >}}) to manage secrets in KMS.
