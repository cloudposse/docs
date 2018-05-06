---
title: "with Terraform"
excerpt: "Learn how to use Geodesic to manage Terraform resources"
weight: -1
---
# Bootstrap Process

Run this process the very first time you setup the tfstate bucket.

**IMPORTANT:** This has already been performed for this account, so this is documented here just for reference.

Ensure the following environment variables have been set in the `Dockerfile`:
```
ENV TF_BUCKET="joany-staging-terraform-state"
ENV TF_BUCKET_REGION="us-west-2"
ENV TF_DYNAMODB_TABLE="joany-staging-terraform-state-lock"
```

Then run these commands:

1. Comment out the `s3 { ... }` section in `main.tf`

2. Run `init-terraform`

3. Run `terraform apply`

4. Re-enable `s3 { ... }` section in `main.tf`

5. Re-run `init-terraform`, answer `yes` when asked to import state

{{% dialog type="warning" icon="fa-exclamation-circle" title="Prerequisites" %}}
Follow the "Use geodesic module"  to [Use](doc:use) get how to use the module shell.
{{% /dialog %}}

# Create terraform state bucket

{{% dialog type="important" icon="fa-exclamation-triangle" title="Important" %}}
To use terraform you need to create terraform state bucket.
Follow the instructions to do that.
{{% /dialog %}}

To create terraform state bucket follow this steps:


## Add tfstate-bucket backing service
Create file in `./conf/tfstate-backend/main.tf` with following content

##### ./conf/tfstate-backend/main.tf
```haml
terraform {
  required_version = ">= 0.11.2"

  backend "s3" {}
}

variable "aws_assume_role_arn" {}

variable "tfstate_namespace" {}

variable "tfstate_stage" {}

variable "tfstate_region" {}

provider "aws" {
  assume_role {
    role_arn = "${var.aws_assume_role_arn}"
  }
}

module "tfstate_backend" {
  source    = "git::https://github.com/cloudposse/terraform-aws-tfstate-backend.git?ref=tags/0.1.0"
  namespace = "${ var.tfstate_namespace }"
  stage     = "${ var.tfstate_stage }"
  region    = "${ var.tfstate_region }"
}

output "tfstate_backend_s3_bucket_domain_name" {
  value = "${module.tfstate_backend.s3_bucket_domain_name}"
}

output "tfstate_backend_s3_bucket_id" {
  value = "${module.tfstate_backend.s3_bucket_id}"
}

output "tfstate_backend_s3_bucket_arn" {
  value = "${module.tfstate_backend.s3_bucket_arn}"
}

output "tfstate_backend_dynamodb_table_name" {
  value = "${module.tfstate_backend.dynamodb_table_name}"
}

output "tfstate_backend_dynamodb_table_id" {
  value = "${module.tfstate_backend.dynamodb_table_id}"
}

output "tfstate_backend_dynamodb_table_arn" {
  value = "${module.tfstate_backend.dynamodb_table_arn}"
}

```

## Config tfstate-bucket backing service
Add to module `Dockerfile` environment variables

##### Dockerfile
```text
ENV TF_VAR_tfstate_namespace={PROJECT_NAME}
ENV TF_VAR_tfstate_stage={ENVIRONMENT_NAME}
ENV TF_VAR_tfstate_region={AWS_REGION}
```

Replace placeholders `{%}` with values specific for your project.

##### Example
```text
ENV TF_VAR_tfstate_namespace=example
ENV TF_VAR_tfstate_stage=staging
ENV TF_VAR_tfstate_region=us-west-2
```

## Rebuild module
[Rebuild](doc:use) the module
```bash
> make build
```

##  Run into the module shell
Run Geodesic Shell in [development mode](doc:use#section-development-mode)
```bash
> $CLUSTER_NAME
```

{{% dialog type="code-block" icon="fa-code" title="Example" %}}
```shell
> staging.example.com
# Mounting /home/goruha into container
# Starting new staging.example.com session from cloudposse/staging.example.com:dev
# Exposing port 41179
* Started EC2 metadata service at http://169.254.169.254/latest

         _              _                                              _      
     ___| |_ __ _  __ _(_)_ __   __ _    _____  ____ _ _ __ ___  _ __ | | ___
    / __| __/ _` |/ _` | | '_ \ / _` |  / _ \ \/ / _` | '_ ` _ \| '_ \| |/ _ \
    \__ \ || (_| | (_| | | | | | (_| | |  __/>  < (_| | | | | | | |_) | |  __/
    |___/\__\__,_|\__, |_|_| |_|\__, |  \___/_/\_\__,_|_| |_| |_| .__/|_|\___|
                  |___/         |___/                           |_|           


IMPORTANT:
* Your $HOME directory has been mounted to `/localhost`
* Use `aws-vault` to manage your sessions
* Run `assume-role` to start a session


-> Run 'assume-role' to login to AWS
 ⧉  staging example
❌   (none) ~ ➤  

```
{{% /dialog %}}

## Authorize on AWS
Assume role by running
```bash
assume-role
```

{{% dialog type="code-block" icon="fa-code" title="Example" %}}
```shell
❌   (none) tfstate-backend ➤  assume-role
Enter passphrase to unlock /conf/.awsvault/keys/:
Enter token for arn:aws:iam::xxxxxxx:mfa/goruha: 781874
* Assumed role arn:aws:iam::xxxxxxx:role/OrganizationAccountAccessRole
-> Run 'init-terraform' to use this project
 ⧉  staging example
✅   (example-staging-admin) tfstate-backend ➤  

```
{{% /dialog %}}

## Apply tfstate-bucket

Change directory to `/conf/tfstate-backet` and run there commands
```bash
init-terraform
terraform plan
terraform apply
```
The latest command will output id of terraform state bucket and dynamo DB table. Please copy that values because we need it for next step.

{{% dialog type="code-block" icon="fa-code" title="Example" %}}
```shell
✅   (example-staging-admin) tfstate-backend ➤  terraform apply
null_resource.default: Refreshing state... (ID: 4514126170089387416)
null_resource.default: Refreshing state... (ID: 5129624787293790468)
aws_dynamodb_table.default: Refreshing state... (ID: example-staging-terraform-state-lock)
aws_s3_bucket.default: Refreshing state... (ID: example-staging-terraform-state)

Apply complete! Resources: 0 added, 0 changed, 0 destroyed.

Outputs:

tfstate_backend_dynamodb_table_arn = arn:aws:dynamodb:us-west-2:xxxxxxx:table/example-staging-terraform-state-lock
tfstate_backend_dynamodb_table_id = example-staging-terraform-state-lock
tfstate_backend_dynamodb_table_name = example-staging-terraform-state-lock
tfstate_backend_s3_bucket_arn = arn:aws:s3:::example-staging-terraform-state
tfstate_backend_s3_bucket_domain_name = example-staging-terraform-state.s3.amazonaws.com
tfstate_backend_s3_bucket_id = example-staging-terraform-state
 ⧉  staging example
✅   (example-staging-admin) tfstate-backend ➤  

```
{{% /dialog %}}

In the example the bucket name is `example-staging-terraform-state` and dynamo DB table `example-staging-terraform-state-lock`.

## Exit the module shell
Exit from the shell by running `exit` twice

{{% dialog type="code-block" icon="fa-code" title="Example" %}}
```shell
✅   (example-staging-admin) tfstate-backend ➤  exit
logout
Goodbye
-> Run 'assume-role' to login to AWS
 ⧉  staging example
❌   (none) ~ ➤  exit
logout
Goodbye
```
{{% /dialog %}}

## Set the bucket as default bucket to store for terraform state files
Update in module `Dockerfile` environment variables
```Dockerfile
# Terraform
ENV TF_BUCKET ""
ENV TF_BUCKET_REGION "us-east-1"
ENV TF_DYNAMODB_TABLE ""
```
with terraform state bucket name and region and dynamo DB table name.

### Example
```text
# Terraform
ENV TF_BUCKET "example-staging-terraform-state"
ENV TF_BUCKET_REGION "us-west-2"
ENV TF_DYNAMODB_TABLE "example-staging-terraform-state-lock"
```

## Rebuild the module
[Rebuild](doc:use) the module
```bash
> make build
```

##  Run into the module shell and authorize on AWS
Run Geodesic Shell in [development mode](doc:use#section-development-mode)
```bash
> $CLUSTER_NAME
> assume-role
```

{{% dialog type="code-block" icon="fa-code" title="Example" %}}
```shell
> staging.example.com
# Mounting /home/goruha into container
# Starting new staging.example.com session from cloudposse/staging.example.com:dev
# Exposing port 41179
* Started EC2 metadata service at http://169.254.169.254/latest

         _              _                                              _      
     ___| |_ __ _  __ _(_)_ __   __ _    _____  ____ _ _ __ ___  _ __ | | ___
    / __| __/ _` |/ _` | | '_ \ / _` |  / _ \ \/ / _` | '_ ` _ \| '_ \| |/ _ \
    \__ \ || (_| | (_| | | | | | (_| | |  __/>  < (_| | | | | | | |_) | |  __/
    |___/\__\__,_|\__, |_|_| |_|\__, |  \___/_/\_\__,_|_| |_| |_| .__/|_|\___|
                  |___/         |___/                           |_|           


IMPORTANT:
* Your $HOME directory has been mounted to `/localhost`
* Use `aws-vault` to manage your sessions
* Run `assume-role` to start a session


-> Run 'assume-role' to login to AWS
 ⧉  staging example
❌   (none) tfstate-backend ➤  assume-role
Enter passphrase to unlock /conf/.awsvault/keys/:
Enter token for arn:aws:iam::xxxxxxx:mfa/goruha: 781874
* Assumed role arn:aws:iam::xxxxxxx:role/OrganizationAccountAccessRole
-> Run 'init-terraform' to use this project
 ⧉  staging example
✅   (example-staging-admin) tfstate-backend ➤  
```
{{% /dialog %}}

## Save `tfstate-bucket` terraform state file into the bucket
This is kind of self-reference but we need to store state in reliable storage. This is useful for the future update.


# Create Terraform Module

To provision terraform module create a directory for it in `/conf`

{{% dialog type="tip" icon="fa-hand-o-right" title="Tip" %}}
If the terraform module is named `kube2iam`, then create `/conf/kube2iam` and stick the terraform code in there.
Example of code you can find there [LINK!]
{{% /dialog %}}

# Rebuild the Geodesic Module

Rebuild the shell container with `make build` command.

{{% dialog type="tip" icon="fa-hand-o-right" title="Tip" %}}
During development, you can skip rebuilding the container and instead work from the `/localhost` folder inside of the container. The `/localhost` folder is the user's `$HOME` folder mounted into the container. Any files on this system will be persisted.
{{% /dialog %}}

# Run the shell
```bash
$CLUSTER_NAME
```

For example, to access your geodesic project shell do the following.
If `$CLUSTER_NAME=staging.example.com` simply run the command `staging.example.com`.

# Login to AWS with your MFA device
```bash
assume-role
```

# Provision terraform module

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

##### :information_source: Example
> If terraform module name is `kube2iam`.
 >`> cd /conf/kube2iam`
 >`> init-terraform`
 >`> terraform plan`
 >`> terraform apply`

## Example: Provision CloudTrail with Terraform

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

![](/images/81d14ff-cloudtrail.png)
## Example: Provision Backing Services with Terraform

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

![](/images/8dd848c-vpc_and_subnets.png)
Repeat for all other projects in the solution (`dns`, `acm`, etc.).

# Build and Release geodesic shell

Run `make docker/build` to build terraform modules in geodesic shell container.

All done. All AWS resources are now up and running.
