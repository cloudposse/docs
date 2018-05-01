---
title: "with Terraform"
excerpt: "Learn how to use Geodesic to manage Terraform resources"
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
[block:callout]
{
  "type": "warning",
  "title": "Prerequisites",
  "body": "Follow the \"Use geodesic module\"  to [Use](doc:use) get how to use the module shell."
}
[/block]
# Create terraform state bucket
[block:callout]
{
  "type": "danger",
  "title": "Important",
  "body": "To use terraform you need to create terraform state bucket. \nFollow the instructions to do that."
}
[/block]
To create terraform state bucket follow this steps:


## Add tfstate-bucket backing service
Create file in `./conf/tfstate-backend/main.tf` with following content
[block:code]
{
  "codes": [
    {
      "code": "terraform {\n  required_version = \">= 0.11.2\"\n\n  backend \"s3\" {}\n}\n\nvariable \"aws_assume_role_arn\" {}\n\nvariable \"tfstate_namespace\" {}\n\nvariable \"tfstate_stage\" {}\n\nvariable \"tfstate_region\" {}\n\nprovider \"aws\" {\n  assume_role {\n    role_arn = \"${var.aws_assume_role_arn}\"\n  }\n}\n\nmodule \"tfstate_backend\" {\n  source    = \"git::https://github.com/cloudposse/terraform-aws-tfstate-backend.git?ref=tags/0.1.0\"\n  namespace = \"${ var.tfstate_namespace }\"\n  stage     = \"${ var.tfstate_stage }\"\n  region    = \"${ var.tfstate_region }\"\n}\n\noutput \"tfstate_backend_s3_bucket_domain_name\" {\n  value = \"${module.tfstate_backend.s3_bucket_domain_name}\"\n}\n\noutput \"tfstate_backend_s3_bucket_id\" {\n  value = \"${module.tfstate_backend.s3_bucket_id}\"\n}\n\noutput \"tfstate_backend_s3_bucket_arn\" {\n  value = \"${module.tfstate_backend.s3_bucket_arn}\"\n}\n\noutput \"tfstate_backend_dynamodb_table_name\" {\n  value = \"${module.tfstate_backend.dynamodb_table_name}\"\n}\n\noutput \"tfstate_backend_dynamodb_table_id\" {\n  value = \"${module.tfstate_backend.dynamodb_table_id}\"\n}\n\noutput \"tfstate_backend_dynamodb_table_arn\" {\n  value = \"${module.tfstate_backend.dynamodb_table_arn}\"\n}\n",
      "language": "haml",
      "name": "./conf/tfstate-backend/main.tf"
    }
  ]
}
[/block]
## Config tfstate-bucket backing service
Add to module `Dockerfile` environment variables
[block:code]
{
  "codes": [
    {
      "code": "ENV TF_VAR_tfstate_namespace={PROJECT_NAME}\nENV TF_VAR_tfstate_stage={ENVIRONMENT_NAME}\nENV TF_VAR_tfstate_region={AWS_REGION}",
      "language": "text",
      "name": "Dockerfile"
    }
  ]
}
[/block]
Replace placeholders `{%}` with values specific for your project.
[block:code]
{
  "codes": [
    {
      "code": "ENV TF_VAR_tfstate_namespace=example\nENV TF_VAR_tfstate_stage=staging\nENV TF_VAR_tfstate_region=us-west-2",
      "language": "text",
      "name": "Example"
    }
  ]
}
[/block]
## Rebuild module
[Rebuild](doc:use) the module
```bash
> make build
```

##  Run into the module shell
Run <<glossary:Module>> shell in [development mode](doc:use#section-development-mode)
```bash
> $CLUSTER_NAME --dev
```
[block:code]
{
  "codes": [
    {
      "code": "> staging.example.com --dev\n# Mounting /home/goruha into container\n# Starting new staging.example.com session from cloudposse/staging.example.com:dev\n# Exposing port 41179\n* Started EC2 metadata service at http://169.254.169.254/latest\n\n         _              _                                              _      \n     ___| |_ __ _  __ _(_)_ __   __ _    _____  ____ _ _ __ ___  _ __ | | ___ \n    / __| __/ _` |/ _` | | '_ \\ / _` |  / _ \\ \\/ / _` | '_ ` _ \\| '_ \\| |/ _ \\\n    \\__ \\ || (_| | (_| | | | | | (_| | |  __/>  < (_| | | | | | | |_) | |  __/\n    |___/\\__\\__,_|\\__, |_|_| |_|\\__, |  \\___/_/\\_\\__,_|_| |_| |_| .__/|_|\\___|\n                  |___/         |___/                           |_|           \n\n\nIMPORTANT:\n* Your $HOME directory has been mounted to `/localhost`\n* Use `aws-vault` to manage your sessions\n* Run `assume-role` to start a session\n\n\n-> Run 'assume-role' to login to AWS\n ⧉  staging example\n❌   (none) ~ ➤  \n",
      "language": "shell",
      "name": "Example"
    }
  ]
}
[/block]
## Authorize on AWS
Assume role by running
```bash
assume-role
```
[block:code]
{
  "codes": [
    {
      "code": "❌   (none) tfstate-backend ➤  assume-role\nEnter passphrase to unlock /conf/.awsvault/keys/: \nEnter token for arn:aws:iam::xxxxxxx:mfa/goruha: 781874\n* Assumed role arn:aws:iam::xxxxxxx:role/OrganizationAccountAccessRole\n-> Run 'init-terraform' to use this project\n ⧉  staging example\n✅   (example-staging-admin) tfstate-backend ➤  \n",
      "language": "shell",
      "name": "Example"
    }
  ]
}
[/block]
## Apply tfstate-bucket 

Change directory to `/conf/tfstate-backet` and run there commands
```bash
init-terraform
terraform plan
terraform apply
```
The latest command will output id of terraform state bucket and dynamo DB table. Please copy that values because we need it for next step.
[block:code]
{
  "codes": [
    {
      "code": "✅   (example-staging-admin) tfstate-backend ➤  terraform apply\nnull_resource.default: Refreshing state... (ID: 4514126170089387416)\nnull_resource.default: Refreshing state... (ID: 5129624787293790468)\naws_dynamodb_table.default: Refreshing state... (ID: example-staging-terraform-state-lock)\naws_s3_bucket.default: Refreshing state... (ID: example-staging-terraform-state)\n\nApply complete! Resources: 0 added, 0 changed, 0 destroyed.\n\nOutputs:\n\ntfstate_backend_dynamodb_table_arn = arn:aws:dynamodb:us-west-2:xxxxxxx:table/example-staging-terraform-state-lock\ntfstate_backend_dynamodb_table_id = example-staging-terraform-state-lock\ntfstate_backend_dynamodb_table_name = example-staging-terraform-state-lock\ntfstate_backend_s3_bucket_arn = arn:aws:s3:::example-staging-terraform-state\ntfstate_backend_s3_bucket_domain_name = example-staging-terraform-state.s3.amazonaws.com\ntfstate_backend_s3_bucket_id = example-staging-terraform-state\n ⧉  staging example\n✅   (example-staging-admin) tfstate-backend ➤  \n",
      "language": "shell",
      "name": "Example"
    }
  ]
}
[/block]
In the example the bucket name is `example-staging-terraform-state` and dynamo DB table `example-staging-terraform-state-lock`.

## Exit the module shell
Exit from the shell by running `exit` twice
[block:code]
{
  "codes": [
    {
      "code": "✅   (example-staging-admin) tfstate-backend ➤  exit\nlogout\nGoodbye\n-> Run 'assume-role' to login to AWS\n ⧉  staging example\n❌   (none) ~ ➤  exit\nlogout\nGoodbye\n",
      "language": "shell",
      "name": "Example"
    }
  ]
}
[/block]
## Set the bucket as default bucket to store for terraform state files
Update in module `Dockerfile` environment variables
```Dockerfile
# Terraform
ENV TF_BUCKET ""
ENV TF_BUCKET_REGION "us-east-1"
ENV TF_DYNAMODB_TABLE ""
```
with terraform state bucket name and region and dynamo DB table name.
[block:code]
{
  "codes": [
    {
      "code": "# Terraform\nENV TF_BUCKET \"example-staging-terraform-state\"\nENV TF_BUCKET_REGION \"us-west-2\"\nENV TF_DYNAMODB_TABLE \"example-staging-terraform-state-lock\"",
      "language": "text",
      "name": "Example"
    }
  ]
}
[/block]
## Rebuild the module
[Rebuild](doc:use) the module
```bash
> make build
```

##  Run into the module shell and authorize on AWS
Run <<glossary:Module>> shell in [development mode](doc:use#section-development-mode)
```bash
> $CLUSTER_NAME --dev
> assume-role
```
[block:code]
{
  "codes": [
    {
      "code": "> staging.example.com --dev\n# Mounting /home/goruha into container\n# Starting new staging.example.com session from cloudposse/staging.example.com:dev\n# Exposing port 41179\n* Started EC2 metadata service at http://169.254.169.254/latest\n\n         _              _                                              _      \n     ___| |_ __ _  __ _(_)_ __   __ _    _____  ____ _ _ __ ___  _ __ | | ___ \n    / __| __/ _` |/ _` | | '_ \\ / _` |  / _ \\ \\/ / _` | '_ ` _ \\| '_ \\| |/ _ \\\n    \\__ \\ || (_| | (_| | | | | | (_| | |  __/>  < (_| | | | | | | |_) | |  __/\n    |___/\\__\\__,_|\\__, |_|_| |_|\\__, |  \\___/_/\\_\\__,_|_| |_| |_| .__/|_|\\___|\n                  |___/         |___/                           |_|           \n\n\nIMPORTANT:\n* Your $HOME directory has been mounted to `/localhost`\n* Use `aws-vault` to manage your sessions\n* Run `assume-role` to start a session\n\n\n-> Run 'assume-role' to login to AWS\n ⧉  staging example\n❌   (none) tfstate-backend ➤  assume-role\nEnter passphrase to unlock /conf/.awsvault/keys/: \nEnter token for arn:aws:iam::xxxxxxx:mfa/goruha: 781874\n* Assumed role arn:aws:iam::xxxxxxx:role/OrganizationAccountAccessRole\n-> Run 'init-terraform' to use this project\n ⧉  staging example\n✅   (example-staging-admin) tfstate-backend ➤  ",
      "language": "shell",
      "name": "Example"
    }
  ]
}
[/block]
## Save `tfstate-bucket` terraform state file into the bucket
This is kind of self-reference but we need to store state in reliable storage. This is useful for the future update.


# Create terraform module



To provision terraform module create a directory for it in `/conf`
[block:callout]
{
  "type": "info",
  "title": "Example",
  "body": "If terraform module name is `kube2iam`.\nCreate `/conf/kube2iam` and put there terraform code.\nExample of code you can find there [LINK!]"
}
[/block]
# Rebuild the shell container

Rebuild the shell container with `make build` command.
[block:callout]
{
  "type": "info",
  "title": "Notice",
  "body": "If you run the shell in development mode (with flag `--dev`) you can skip rebuild container"
}
[/block]
# Run the shell
```bash 
> $CLUSTER_NAME
```

to access your geodesic project shell
[block:callout]
{
  "type": "info",
  "title": "Example",
  "body": "If `$CLUSTER_NAME=staging.example.com` run \n`> staging.example.com`"
}
[/block]

[block:callout]
{
  "type": "warning",
  "title": "Development mode",
  "body": "You can add `--dev` flag when running the shell. \nThis flag makes project's `/conf` directory be mounted inside of the shell container.\nThis simplifies development loop, skipping the shell container rebuild step."
}
[/block]

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
[block:callout]
{
  "type": "info",
  "title": "Example",
  "body": "If terraform module name is `kube2iam`.\n`> cd /conf/kube2iam`\n`> init-terraform`\n`> terraform plan`\n`> terraform apply`"
}
[/block]
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

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/81d14ff-cloudtrail.png",
        "cloudtrail.png",
        1692,
        2152,
        "#080808"
      ]
    }
  ]
}
[/block]
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

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/8dd848c-vpc_and_subnets.png",
        "vpc_and_subnets.png",
        1346,
        1888,
        "#f7f8f6"
      ]
    }
  ]
}
[/block]
Repeat for all other projects in the solution (`dns`, `acm`, etc.).

# Build and Release geodesic shell

Run `make docker/build` to build terraform modules in geodesic shell container.

All done. All AWS resources are now up and running.