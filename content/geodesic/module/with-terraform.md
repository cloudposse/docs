---
title: "Using Geodesic with Terraform"
description: "Learn how to use a Geodesic Module to manage resources using Terraform"
weight: 3
---
{{% dialog type="warning" icon="fa fa-exclamation-circle" title="Prerequisites" %}}
Make sure you have [created a Geodesic Module](/geodesic/module/) before continuing with these steps.
{{% /dialog %}}

{{% dialog type="important" icon="fa fa-exclamation-triangle" title="Important" %}}
Before provisioning any terraform resources, it's essential to provision a Terraform state backend (aka tfstate backend). A terraform state backend consists of an S3 bucket and a DynamoDB lock table.
{{% /dialog %}}

# Provisioning a Terraform State Backend

To create terraform state bucket and lock table, follow these steps:

## Configure Environment Variables

Update your geodesic module's `Dockerfile` with the following environment variables:

{{< dialog type="code-block" icon="fa fa-code" title="Example" >}}
```
ENV TF_VAR_tfstate_namespace=example
ENV TF_VAR_tfstate_stage=staging
ENV TF_VAR_tfstate_region=us-west-2
ENV TF_BUCKET_REGION=us-west-2
```
{{< /dialog >}}

Replace with values to suit your specific project.

## Rebuild the Module

[Rebuild]({{< relref "geodesic/module/_index.md" >}}) the module
```shell
make build
```

## Add tfstate-bucket backing service

Create a file in `./conf/tfstate-backend/main.tf` with following content

{{% include-code-block title="./conf/tfstate-backend/main.tf" file="geodesic/module/examples/tfstate-backend.tf" language="hcl" %}}

##  Start the Geodesic Shell

Run the Geodesic Module shell.
```shell
$CLUSTER_NAME
```

{{% include-code-block title="Run the Geodesic Shell" file="geodesic/module/examples/start-geodesic-shell.txt" %}}

## Log into AWS

Assume role by running
```bash
assume-role
```

{{% include-code-block title="Assume role" file="geodesic/module/examples/assume-role.txt" %}}

## Save terraform state to local

Comment in `./conf/tfstate-backend/main.tf` with `vim`

```text
#  backend "s3" {}
```

{{% dialog type="code-block" icon="fa fa-code" title="Example" %}}
```
⧉  staging example
✅   (example-staging-admin) ~ ➤  vim /conf/tfstate-backend/main.tf
```
{{% /dialog %}}

## Apply tfstate-bucket

Change directory to `/conf/tfstate-backet` and run there commands
```shell
init-terraform
terraform plan
terraform apply
```

When `terraform apply` completes, it output the value of the terraform state bucket and DynamoDB table. Take note of these values because we will need them in the following steps.

{{% include-code-block title="terraform apply" file="geodesic/module/examples/terraform-apply-tfstate-backend.txt" %}}

In the example the bucket name is `example-staging-terraform-state` and dynamo DB table `example-staging-terraform-state-lock`.

## Save terraform state to s3

Uncomment in `./conf/tfstate-backend/main.tf` with `vim`

```text
  backend "s3" {}
```

{{% dialog type="code-block" icon="fa fa-code" title="Example" %}}
```
⧉  staging example
✅   (example-staging-admin) ~ ➤  vim /conf/tfstate-backend/main.tf
```
{{% /dialog %}}

Change directory to `/conf/tfstate-backet` and run there commands
```shell
export TF_BUCKET={TERRAFORM_STATE_BUCKET_NAME}
terraform apply
```

{{% dialog type="code-block" icon="fa fa-code" title="Example" %}}
```
export TF_BUCKET=example-staging-terraform-state
terraform apply
```
{{% /dialog %}}

## Exit the module shell

Exit from the shell by running `exit` twice

{{% include-code-block title="Exit the shell" file="geodesic/module/examples/exit-geodesic-shell.txt" language="" %}}

## Config environment variables

Update the geodesic module's `Dockerfile` with the following environment variables.

{{< dialog type="code-block" icon="fa fa-code" title="Example" >}}
```
ENV TF_BUCKET=example-staging-terraform-state
ENV TF_DYNAMODB_TABLE=example-staging-terraform-state-lock
```
{{< /dialog >}}

Update the values based on the outputs from the previous step.

## Rebuild module

[Rebuild]({{< relref "geodesic/module/_index.md" >}}) the module.

```shell
make docker/build
```

Now that we have provisioned all the nessary resources to operate terraform, we're ready to provision the other terraform modules needed by kops.

# Use with other terraform modules

Using our terraform modules you can now provision any other terraform projects using the `init-terraform` script.



## Create terraform module
To provision terraform module create a directory for it in `/conf`

{{% dialog type="tip" icon="fa fa-hand-o-right" title="Tip" %}}
If the terraform module is named `kube2iam`, then create `/conf/kube2iam` and stick the terraform code in there.
Example of code you can find there [LINK!]
{{% /dialog %}}

## Rebuild the Geodesic Module

Rebuild the shell container with `make build` command.

{{% dialog type="tip" icon="fa fa-hand-o-right" title="Tip" %}}
During development, you can skip rebuilding the container and instead work from the `/localhost` folder inside of the container. The `/localhost` folder is the user's `$HOME` folder mounted into the container. Any files on this system will be persisted.
{{% /dialog %}}

## Start the Shell

```bash
$CLUSTER_NAME
```

For example, to access your geodesic project shell do the following.
If `$CLUSTER_NAME=staging.example.com` simply run the command `staging.example.com`.

## Login to AWS with your MFA device
```bash
assume-role
```
{{% include-code-block title="Assume role" file="geodesic/module/examples/assume-role.txt" %}}

## Provision terraform module

Change directory to the required resources folder
```bash
cd /conf/{module_name}
```
Run Terraform
```bash
init-terraform
terraform plan
terraform apply
```

{{% dialog type="code-block" icon="fa fa-code" title="Example" %}}
If terraform module name is `kube2iam`.
```
cd /conf/kube2iam
init-terraform
terraform plan
terraform apply
```
{{% /dialog %}}

## Examples

### Provision CloudTrail with Terraform

Change directory to the required resources folder
```bash
cd /conf/cloudtrail
```

Run Terraform
```bash
init-terraform
terraform plan
terraform apply
```

![Terraform Plan Output of Cloud Trail](/assets/81d14ff-cloudtrail.png)

### Provision Backing Services with Terraform
Change directory to the required resources folder
```bash
cd /conf/backing-services
```

Run Terraform
```bash
init-terraform
terraform plan
terraform apply
```

![Terraform Plan Output of VPC and Subnets](/assets/8dd848c-vpc_and_subnets.png)
Repeat for all other projects in the solution (`dns`, `acm`, etc.).

# Build and Release geodesic shell

Run `make docker/build` to build terraform modules in geodesic shell container.

All done. All AWS resources are now up and running.
