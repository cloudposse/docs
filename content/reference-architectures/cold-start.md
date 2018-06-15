---
title: "Cold Start"
description: "Describes the *cold start* process"
weight: 2
tags:
- cold start
- aws-vault
- geodesic
---

Here we describe the `cold start` process, when we start with just one master AWS account and provision infrastructure for different environments.

# Prerequisites

* Choose an AWS region in which to provision all the resources - we use `us-west-2` for our reference architectures

* Select the parent DNS domain name for your infrastructure - in these examples we use `cloudposse.co`

* Choose the namespace for resource naming. We recommend using your company name or abbreviation as the namespace (e.g. `cloudposse`, `cp`, `cpco`) - we use `cpco` in all the examples

* We assume you already have an AWS account. If not create an account at `https://aws.amazon.com`. This account will be the `root`

* Login to the `root` account with the root credentials and do the following:
  * Create new IAM group `admin`
  * Assign `AdministratorAccess` policy to the group
  * Create an IAM user with the name `admin`
  * Add the user to the group
  * Enable MFA for the user (we recommend using Google Authenticator as Virtual MFA device)
  * Generate `Access Key ID` and `Secret Access Key` for the user (you'll need them in the next steps)

* Install and setup [aws-vault](https://github.com/99designs/aws-vault) to store IAM credentials in your operating system's secure keystore and then generate temporary credentials from those to expose to your shell and applications

You can install manually from [aws-vault](https://github.com/99designs/aws-vault/releases). 

On MacOS, you may use `homebrew cask`:

{{% dialog type="code-block" icon="fa fa-code" title="Install aws-vault with brew" %}}
```shell
brew cask install aws-vault
```
{{% /dialog %}}

Then setup your secret credentials in `aws-vault` in the `cpco` profile (input the IAM `Access Key ID` and `Secret Access Key` when prompted)

{{% dialog type="code-block" icon="fa fa-code" title="Setup aws-vault" %}}
```shell
export AWS_VAULT_BACKEND=file
aws-vault add cpco
```
{{% /dialog %}}

{{% dialog type="info" icon="fa-info-circle" title="Note" %}}
Replace the profile name `cpco` with your own (for consistency, we recommend using the same name as the namespace in the Terraform modules).

You should set `AWS_VAULT_BACKEND=file` in your shell `rc` config (e.g. `~/.bashrc`) so it persists.
{{% /dialog %}}

* Keep in mind that AWS has limits on the number of accounts in an organization (see [Organization reference limits](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_reference_limits.html)).
If you are planning on provisioning all the accounts (`prod`, `staging`, `dev`, `audit`, `testing`), contact AWS Support and request a limit increase.


# Cold Start Process

In this example, we'll provision resources for the following two accounts:

* `root` - always in use as the Root of the AWS accounts hierarchy and also as the main account to store all the IAM users and roles to access the other accounts
* `testing` - we use it to quickly create and destroy infrastructure for testing 

The other stages (`prod`, `staging`, `dev`, `audit`) are similar (they might differ by the resources you provision), and as has been noticed before, you might not need all of them.


## Copy Cloud Posse Reference Architectures

Copy the [root](https://github.com/cloudposse/root.cloudposse.co) and [testing](https://github.com/cloudposse/testing.cloudposse.co) repos to your local workstation
into two different folders. For this example, we'll use `~/root.cloudposse.co` and `~/testing.cloudposse.co` respectively.

Update all ENV variables in the two `Dockefiles` in the repos with the values for your project:
 
 * Change `DOCKER_IMAGE`
 * Replace the namespace `cpco` with your own in all ENV vars
 * Change the domain names from `cloudposse.co` to your own
 * In root, update the account ID (`TF_VAR_account_id`) to your own `root` account ID
 * Change the IAM user names for the accounts
 * Update the account emails
 * In `testing`, select only the resources you need to provision (using `COPY --from=terraform-root-modules`)


## Add AWS Profile For `root`

We require all users to assume IAM roles to access all the accounts (including `root`).

But since we start with a new account with no users and roles created yet, in this step we use the `admin` user credentials to access the account without assuming roles.

We'll update this profile to use `role_arn` later after we provision the roles.

In `~/.aws/config` file, add this profile for the `root` account:

{{% dialog type="code-block" icon="fa fa-code" title="Add AWS Profile For `root`" %}}
```
[profile cpco-root-admin]
region=us-west-2
mfa_serial=arn:aws:iam::323330167063:mfa/admin@cloudposse.co
source_profile=cpco

# This profile is required by aws-vault where it stores the Access Key ID and Secret Access Key as explained in Prerequisites
[profile cpco]
```
{{% /dialog %}}

{{% dialog type="info" icon="fa-info-circle" title="Note" %}}
Change the namespace and profile name `cpco`, the region, the `root` account ID `323330167063` and the admin user `admin@cloudposse.co` to your own values.
{{% /dialog %}}


## Build And Start Geodesic Module For `root`

Open a terminal window and execute the following commands:

{{% dialog type="code-block" icon="fa fa-code" title="Build And Start Geodesic Module For `root`" %}}
```shell
cd ~/root.cloudposse.co

# Initialize the project's build-harness
make init

# Build docker image
make docker/build

# Install the wrapper shell
make install

# Run the shell
root.cloudposse.co

# Login to AWS as the admin user with your MFA device
assume-role
```
{{% /dialog %}}

You should see the `Docker` image built, `geodesic` shell started, and after you run the `assume-role` command, you will be logged in to the `root` account as the `admin` user:

```
# Starting new root.cloudposse.co session from cloudposse/root.cloudposse.co:latest
# Exposing port 36682
* Started EC2 metadata service at http://169.254.169.254/latest
                     _         _                 _
     _ __ ___   ___ | |_   ___| | ___  _   _  __| |_ __   ___  ___ ___  ___   ___ ___
    | '__/ _ \ / _ \| __| / __| |/ _ \| | | |/ _` | '_ \ / _ \/ __/ __|/ _ \ / __/ _ \
    | | | (_) | (_) | |_ | (__| | (_) | |_| | (_| | |_) | (_) \__ \__ \  __/| (_| (_) |
    |_|  \___/ \___/ \__(_)___|_|\___/ \__,_|\__,_| .__/ \___/|___/___/\___(_)___\___/
                                                  |_|

IMPORTANT:
* Your $HOME directory has been mounted to `/localhost`
* Use `aws-vault` to manage your sessions
* Run `assume-role` to start a session

Add your local private SSH key to the key chain. Hit ^C to skip.
Enter passphrase for /localhost/.ssh/id_rsa:
Identity added: /localhost/.ssh/id_rsa (/localhost/.ssh/id_rsa)
-> Run 'assume-role' to login to AWS
 ⧉  root.cloudposse.co
❌   (none) ~ ➤  assume-role
Enter passphrase to unlock /conf/.awsvault/keys/:
Enter token for arn:aws:iam::323330167063:mfa/admin@cloudposse.co: 172432
* Assumed role arn:aws:iam::323330167063:user/admin@cloudposse.co
* Found SSH agent config
 ⧉  root.cloudposse.co
✅   (cpco-root-admin) ~ ➤
```

## Provision `tfstate-backend` Project For `root`

We store Terraform state in an S3 bucket and use a DynamoDB table for state locking (allowing many users to work on the same project without affecting each other and corrupting the state).

But we don't have the state bucket and DynamoDB table provisioned yet, so we can't store Terraform state in them.

We will create the bucket and table using local state, and then import the state into the bucket.

Execute this sequence of steps in the `root` geodesic session:

{{% dialog type="code-block" icon="fa fa-code" title="Provision `tfstate-backend` Project For `root`" %}}
```
cd tfstate-backend

Comment out the `backend          "s3"             {}` section in `tfstate-backend/main.tf`

Run `init-terraform`

Run `terraform plan` and then `terraform apply`

Re-enable `backend          "s3"             {}` section in `tfstate-backend/main.tf`

Re-run `init-terraform`

Re-run `terraform apply`, answer `yes` when asked to import state

```
{{% /dialog %}}

{{% dialog type="info" icon="fa-info-circle" title="Note" %}}
You could use the following commands to comment out and then uncomment the `backend` section:

```shell
sed -i "s/ backend / #backend /" main.tf
sed -i "s/ #backend / backend /" main.tf
```
{{% /dialog %}}

Now we have the S3 bucket and DynamoDB table provisioned, and Terraform state stored in the bucket itself.


## Provision `iam` Project To Create `root` IAM Role

As was mentioned before, we require that all users assume roles to access the AWS accounts.

We executed the steps above using the `admin` user credentials without using roles.

Now we need to create the roles for the `root` account and update the AWS profile.

{{% dialog type="info" icon="fa-info-circle" title="Note" %}}
Update the `TF_VAR_root_account_admin_user_names` variable in `Dockerfile` for the `root` account with your own values.
{{% /dialog %}}

Execute these commands in the `root` geodesic session:

{{% dialog type="code-block" icon="fa fa-code" title="Provision `iam` Project To Create `root` IAM Role" %}}
```
cd iam

Comment out the `assume_role` section in `iam/main.tf`

Run `init-terraform`

Run `terraform plan -target=module.organization_access_group_root`

Run `terraform apply -target=module.organization_access_group_root`

Re-enable the `assume_role` section in `iam/main.tf`
```
{{% /dialog %}}

Now that we have the `root` role created, update the `root` AWS profile in `~/.aws/config` (again, make sure to change the values to your own):

{{% dialog type="code-block" icon="fa fa-code" title="Root account profile" %}}
```
[profile cpco-root-admin]
region=us-west-2
role_arn=arn:aws:iam::323330167063:role/cpco-root-admin
mfa_serial=arn:aws:iam::323330167063:mfa/admin@cloudposse.co
source_profile=cpco

# This profile is required by aws-vault where it stores the Access Key ID and Secret Access Key as explained in Prerequisites
[profile cpco]
```
{{% /dialog %}}

Exit the `root` `geodesic` shell, run it again and then execute `assume-role`:

{{% dialog type="code-block" icon="fa fa-code" title="Restart `geodesic` shell" %}}
```shell
# Run the shell
root.cloudposse.co

# Login to AWS with your MFA device
assume-role
```
{{% /dialog %}}

You should see the `cpco-root-admin` role assumed:

```
Enter passphrase for /localhost/.ssh/id_rsa:
Identity added: /localhost/.ssh/id_rsa (/localhost/.ssh/id_rsa)
-> Run 'assume-role' to login to AWS
 ⧉  root.cloudposse.co
❌   (none) ~ ➤  assume-role
Enter passphrase to unlock /conf/.awsvault/keys/:
* Assumed role arn:aws:iam::323330167063:role/cpco-root-admin
```

## Provision `organization` Project For `root`

{{% dialog type="code-block" icon="fa fa-code" title="Provision `organization` Project For `root`" %}}
```shell
cd organization
init-terraform
terraform plan
terraform apply
```
{{% /dialog %}}

{{% dialog type="info" icon="fa-info-circle" title="Note" %}}
If Organization was manually created for the `root` account (from the AWS console), you need to import it (change `o-cas6q267wf` to your organization ID):

```shell
terraform import aws_organizations_organization.default o-cas6q267wf
```
{{% /dialog %}}


## Provision `accounts` Project For `root`

{{% dialog type="code-block" icon="fa fa-code" title="Provision `accounts` Project For `root`" %}}
```shell
cd accounts
init-terraform
terraform plan -target=aws_organizations_account.testing
terraform apply -target=aws_organizations_account.testing
```
{{% /dialog %}}

{{% dialog type="info" icon="fa-info-circle" title="Note" %}}
For the purpose of this example, we create only the `testing` account. Use `-target` to add other accounts as needed.
{{% /dialog %}}

Update the `TF_VAR_testing_account_id` variable in the `root` `Dockerfile`, then rebuild and restart the `root` `geodesic` shell:

{{% dialog type="code-block" icon="fa fa-code" title="Rebuild and restart the `root` `geodesic` shell" %}}
```shell
exit
exit
make docker/build
root.cloudposse.co
assume-role
```
{{% /dialog %}}

## Provision `iam` Project In `root` To Create IAM Roles For Member Accounts

Now we have the `testing` account ID and need to finish provisioning the `root` `iam` project.

{{% dialog type="code-block" icon="fa fa-code" title="Provision `iam` Project In `root` To Create IAM Roles For Member Accounts" %}}
```shell
cd iam
init-terraform

terraform plan -target=module.organization_access_group_root \
    -target=module.organization_access_group_testing

terraform apply -target=module.organization_access_group_root \
    -target=module.organization_access_group_testing
```
{{% /dialog %}}

This will create `cpco-testing-admin` group in the `root` account and add the users (specified by `TF_VAR_testing_account_user_names`) to the group.

The group will be granted permissions to assume `OrganizationAccountAccessRole` in the member account (`testing`).

`OrganizationAccountAccessRole` is created automatically by AWS in all member accounts, and it has the administrator permissions to the accounts.

To summarize, now the users from `TF_VAR_testing_account_user_names` will be able to assume `OrganizationAccountAccessRole` and access the `testing` account.

The last thing to do to enable that is to add the `cpco-testing-admin` profile to `~/.aws/config`:

{{% dialog type="code-block" icon="fa fa-code" title="Add `cpco-testing-admin` profile" %}}
```
[profile cpco-testing-admin]
region=us-west-2
role_arn=arn:aws:iam::126450723953:role/OrganizationAccountAccessRole
mfa_serial=arn:aws:iam::323330167063:mfa/admin@cloudposse.co
source_profile=cpco

[profile cpco-root-admin]
region=us-west-2
role_arn=arn:aws:iam::323330167063:role/cpco-root-admin
mfa_serial=arn:aws:iam::323330167063:mfa/admin@cloudposse.co
source_profile=cpco

# This profile is required by aws-vault where it stores the Access Key ID and Secret Access Key as explained in Prerequisites
[profile cpco]
```
{{% /dialog %}}

## Provision `root-dns` Project In `root` To Create `parent` And `root` DNS Zones

Now we provision DNS for the `root` account, but without the `testing` Name Servers yet.

They will be provisioned later and then we'll come back to add them.

{{% dialog type="code-block" icon="fa fa-code" title="Provision `root-dns` Project In `root` To Create `parent` And `root` DNS Zones" %}}
```shell
cd root-dns
init-terraform

terraform apply -target=aws_route53_zone.parent_dns_zone -target=aws_route53_record.parent_dns_zone_soa \
    -target=aws_route53_zone.root_dns_zone -target=aws_route53_record.root_dns_zone_soa \
    -target=aws_route53_record.root_dns_zone_ns
```
{{% /dialog %}}


You should see Terraform output similar to this:

{{% dialog type="code-block" icon="fa fa-code" title="Terraform output" %}}
```
parent_name_servers = [
    ns-1154.awsdns-16.org,
    ns-1867.awsdns-41.co.uk,
    ns-54.awsdns-06.com,
    ns-704.awsdns-24.net
]
parent_zone_id = ZTNG19A4IP6XF
root_name_servers = [
    ns-1232.awsdns-26.org,
    ns-1785.awsdns-31.co.uk,
    ns-458.awsdns-57.com,
    ns-650.awsdns-17.net
]
root_zone_id = Z3AZCXQQNZKZ7E
```
{{% /dialog %}}

{{% dialog type="info" icon="fa-info-circle" title="Note" %}}
If you did not buy the `parent` domain from Route53, you need to take the `parent` Name Servers from the Terraform output and update them in the registrar.
{{% /dialog %}}


## Build And Start Geodesic Module For `testing`

Open a new terminal window and execute the following commands:

{{% dialog type="code-block" icon="fa fa-code" title="Build And Start Geodesic Module For `testing`" %}}
```shell
cd ~/testing.cloudposse.co

# Initialize the project's build-harness
make init

# Build docker image
make docker/build

# Install the wrapper shell
make install

# Run the shell
testing.cloudposse.co

# Login to AWS as the admin user with your MFA device
assume-role
```
{{% /dialog %}}

You should see the `Docker` image built, `geodesic` shell started, and after you run the `assume-role` command, you will be logged in to the `testing` account:

```
Enter passphrase for /localhost/.ssh/id_rsa:
Identity added: /localhost/.ssh/id_rsa (/localhost/.ssh/id_rsa)
-> Run 'assume-role' to login to AWS
 ⧉  testing.cloudposse.co
❌   (none) ~ ➤  assume-role
Enter passphrase to unlock /conf/.awsvault/keys/:
* Assumed role arn:aws:iam::126450723953:role/OrganizationAccountAccessRole
```


## Provision `tfstate-backend` Project For `testing`

Execute this sequence of steps in the `testing` geodesic session:

{{% dialog type="code-block" icon="fa fa-code" title="Provision `tfstate-backend` Project For `testing`" %}}
```
cd tfstate-backend

Comment out the `backend          "s3"             {}` section in `tfstate-backend/main.tf`

Run `init-terraform`

Run `terraform plan` and then `terraform apply`

Re-enable `backend          "s3"             {}` section in `tfstate-backend/main.tf`

Re-run `init-terraform`

Re-run `terraform apply`, answer `yes` when asked to import state

```
{{% /dialog %}}

{{% dialog type="info" icon="fa-info-circle" title="Note" %}}
You could use the following commands to comment out and then uncomment the `backend` section:

```shell
sed -i "s/ backend / #backend /" main.tf
sed -i "s/ #backend / backend /" main.tf
```
{{% /dialog %}}

Now we have the S3 bucket and DynamoDB table provisioned, and Terraform state stored in the bucket itself.


## Provision `account-dns` Project In `testing` To Create `testing` DNS Zone

In `testing` `geodesic` shell, execute the following commands:

{{% dialog type="code-block" icon="fa fa-code" title="Provision `account-dns` Project In `testing` To Create `testing` DNS Zone" %}}
```shell
cd account-dns
init-terraform
terraform apply
```
{{% /dialog %}}

You should see Terraform output similar to this:

{{% dialog type="code-block" icon="fa fa-code" title="Terraform output" %}}
```
name_servers = [
    ns-1416.awsdns-49.org,
    ns-1794.awsdns-32.co.uk,
    ns-312.awsdns-39.com,
    ns-619.awsdns-13.net
]
zone_id = Z3SO0TKDDQ0RGG
```
{{% /dialog %}}

Take the Name Servers from the output and update them in the `root` `Dockerfile` (variable `TF_VAR_testing_name_servers`).


## Rebuild And Restart `root` `geodesic` Shell

Rebuild and restart the `root` `geodesic` shell by executing the following commands:

{{% dialog type="code-block" icon="fa fa-code" title="Rebuild And Restart `root` `geodesic` Shell" %}}
```shell
exit
exit
make docker/build
root.cloudposse.co
assume-role
```
{{% /dialog %}}


## Finish Provisioning `root-dns` Project To Add `testing` Name Servers

{{% dialog type="info" icon="fa-info-circle" title="Note" %}}
We use DNS zone delegation since `root` and `testing` are in different AWS accounts
{{% /dialog %}}

In the `root` `geodesic` shell execute the following commands:

{{% dialog type="code-block" icon="fa fa-code" title="Finish Provisioning `root-dns` Project To Add `testing` Name Servers" %}}
```shell
cd root-dns
init-terraform

terraform apply -target=aws_route53_zone.parent_dns_zone -target=aws_route53_record.parent_dns_zone_soa \
    -target=aws_route53_zone.root_dns_zone -target=aws_route53_record.root_dns_zone_soa \
    -target=aws_route53_record.root_dns_zone_ns -target=aws_route53_record.testing_dns_zone_ns
```
{{% /dialog %}}

{{% dialog type="info" icon="fa-info-circle" title="Note" %}}
DNS for `root` and `testing` should be done at this step.

`root` account provisioning should be completed now.
{{% /dialog %}}


## Provision `acm` Project in `testing` To Request And Validate SSL Certificate

In `testing` `geodesic` shell, execute the following commands:

{{% dialog type="code-block" icon="fa fa-code" title="Provision `acm` Project in `testing` To Request And Validate SSL Certificate" %}}
```shell
cd acm
init-terraform
terraform apply
```
{{% /dialog %}}

You should see Terraform output similar to this:

{{% dialog type="code-block" icon="fa fa-code" title="Terraform output" %}}
```
certificate_arn = arn:aws:acm:us-west-2:126450723953:certificate/56897dfe-23ac-4eb3-834d-542505491f09
certificate_domain_name = testing.cloudposse.co
certificate_domain_validation_options = [
    {
        domain_name = testing.cloudposse.co,
        resource_record_name = _21b8879d14986e59b09f8e39d89ecf76.testing.cloudposse.co.,
        resource_record_type = CNAME,
        resource_record_value = _0a592ee754a4b9014464b16d382a129a.acm-validations.aws.
    },
    {
        domain_name = *.testing.cloudposse.co,
        resource_record_name = _21b8879d14986e59b09f8e39d89ecf76.testing.cloudposse.co.,
        resource_record_type = CNAME,
        resource_record_value = _0a592ee754a4b9014464b16d382a129a.acm-validations.aws.
    }
]
certificate_id = arn:aws:acm:us-west-2:126450723953:certificate/56897dfe-23ac-4eb3-834d-542505491f09
```
{{% /dialog %}}


## Provision `chamber` Project In `testing` To Create AIM User And KMS Key For Chamber

In `testing` `geodesic` shell, execute the following commands:

{{% dialog type="code-block" icon="fa fa-code" title="Provision `chamber` Project In `testing` To Create AIM User And KMS Key For Chamber" %}}
```shell
cd chamber
init-terraform
terraform apply
```
{{% /dialog %}}

You should see Terraform output similar to this:

{{% dialog type="code-block" icon="fa fa-code" title="Terraform output" %}}
```
chamber_access_key_id = XXXXXXXXXXXXXXXXXXXXXXXX
chamber_kms_key_alias_arn = arn:aws:kms:us-west-2:126450723953:alias/cpco-testing-chamber
chamber_kms_key_alias_name = alias/cpco-testing-chamber
chamber_kms_key_arn = arn:aws:kms:us-west-2:126450723953:key/31a1918c-e194-4f80-bd09-bc6057447902
chamber_kms_key_id = 31a1928c-e094-4e80-bd09-bc6057447902
chamber_secret_access_key = XXXXXXXXXXXXXXXXXXXXXXXX
chamber_user_arn = arn:aws:iam::126450723953:user/cpco-testing-chamber-codefresh
chamber_user_name = cpco-testing-chamber-codefresh
chamber_user_unique_id = AIDAJKJKFLZIQ4KDUXAJ2
```
{{% /dialog %}}

Now you'll be able to start a `geodesic` shell for any of the member accounts and provision new or update the existing resources.
