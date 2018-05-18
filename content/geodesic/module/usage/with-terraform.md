---
title: "Using Geodesic Module with Terraform"
description: "Learn how to use Geodesic Module to manage Terraform resources"
weight: -1
---
{{% dialog type="warning" icon="fa fa-exclamation-circle" title="Prerequisites" %}}
Follow the "Use geodesic module"  to [Use](/geodesic/module/usage/) get how to use the module shell.
{{% /dialog %}}

{{% dialog type="important" icon="fa fa-exclamation-triangle" title="Important" %}}
To use terraform you need to create terraform state bucket.
Follow the instructions to do that.
{{% /dialog %}}

# Create terraform state bucket

To create terraform state bucket follow this steps:

## Config environment variables
Add to module `Dockerfile` environment variables

```
ENV TF_VAR_tfstate_namespace={PROJECT_NAME}
ENV TF_VAR_tfstate_stage={ENVIRONMENT_NAME}
ENV TF_VAR_tfstate_region={AWS_REGION}
ENV TF_BUCKET_REGION={AWS_REGION}
```

Replace placeholders `{%}` with values specific for your project.

{{< dialog type="code-block" icon="fa fa-code" title="Example" >}}
```
ENV TF_VAR_tfstate_namespace=example
ENV TF_VAR_tfstate_stage=staging
ENV TF_VAR_tfstate_region=us-west-2
ENV TF_BUCKET_REGION=us-west-2
```
{{< /dialog >}}

## Rebuild module
[Rebuild](/geodesic/module/usage/) the module
```shell
> make build
```

## Add tfstate-bucket backing service
Create file in `./conf/tfstate-backend/main.tf` with following content

{{% include-code-block title="./conf/tfstate-backend/main.tf" file="geodesic/module/usage/examples/tfstate-backend.tf" language="hcl" %}}

e##  Run into the module shell

Run the Geodesic Module shell.
```shell
> $CLUSTER_NAME
```

{{% include-code-block title="Run the Geodesic Shell" file="geodesic/module/usage/examples/start-geodesic-shell.txt" %}}

## Authorize on AWS
Assume role by running
```bash
assume-role
```

{{% include-code-block title="Assume role" file="geodesic/module/usage/examples/assume-role.txt" %}}

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
The latest command will output id of terraform state bucket and dynamo DB table. Please copy that values because we need it for next steps.

{{% include-code-block title="terraform apply" file="geodesic/module/usage/examples/terraform-apply-tfstate-backend.txt" %}}

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

{{% include-code-block title="Exit the shell" file="geodesic/module/usage/examples/exit-geodesic-shell.txt" language="" %}}

## Config environment variables
Add to module `Dockerfile` environment variable

```
ENV TF_BUCKET={TERRAFORM_STATE_BUCKET_NAME}
ENV TF_DYNAMODB_TABLE={TERRAFORM_STATE_LOCK_NAME}
```

Replace placeholders `{%}` with values specific for your project.

{{< dialog type="code-block" icon="fa fa-code" title="Example" >}}
```
ENV TF_BUCKET=example-staging-terraform-state
ENV TF_DYNAMODB_TABLE=example-staging-terraform-state-lock
```
{{< /dialog >}}

## Rebuild module
[Rebuild](/geodesic/module/usage/) the module
```shell
> make build
```

Now `tfstate-bucket` created you and the module configured to use it for the other terraform modules and kops

# Use with other terraform modules

With terraform modules you can provision any types of resources.
That modules will store terraform state on s3 `tfstate-bucket` prefixed with `name` of module.
Follow to create a terraform module and provision resources with it.

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

## Run the shell
```bash
$CLUSTER_NAME
```

For example, to access your geodesic project shell do the following.
If `$CLUSTER_NAME=staging.example.com` simply run the command `staging.example.com`.

## Login to AWS with your MFA device
```bash
assume-role
```
{{% include-code-block title="Assume role" file="geodesic/module/usage/examples/assume-role.txt" %}}

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
