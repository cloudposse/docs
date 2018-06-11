---
title: "Chamber"
description: 'Chamber is a CRUD tool for managing secrets stored in [AWS Systems Manager Parameter Store](https://aws.amazon.com/systems-manager/features/#Parameter_Store) and exposing those secrets as Environment Variables to processes.'
tags:
- tools
- ssm
- kms
- secrets
- helmfile
---

Chamber is a CLI for managing secrets stored
in [AWS Systems Manager Parameter Store](https://aws.amazon.com/systems-manager/features/#Parameter_Store).

In the article [The Right Way to Store Secrets using Parameter Store](https://aws.amazon.com/blogs/mt/the-right-way-to-store-secrets-using-parameter-store/), `AWS` recommends using `chamber` for secrets management.

# Configuration

{{% dialog type="warning" icon="fa-info-circle" title="Prerequisites" %}}
This assumes you've followed the [AWS KMS]({{< relref "secrets-management/aws-kms-ssm.md" >}}) guide which describes using Terraform to easily provision KMS+SSM resources for chamber.
{{% /dialog %}}

## Chamber with Geodesic

From the Terraform outputs [AWS KMS]({{< relref "secrets-management/aws-kms-ssm.md#provision-chamber-resources" >}}) copy the `chamber_kms_key_alias_name` into the ENV var `CHAMBER_KMS_KEY_ALIAS` in the geodesic module\`s `Dockerfile`.

{{% dialog type="code-block" icon="fa fa-code" title="Configure ENV variables for chamber" %}}
```dockerfile
# chamber KMS config
ENV CHAMBER_KMS_KEY_ALIAS="alias/example-staging-chamber"
```
{{% /dialog %}}

Update the variable with the value to reflect your specific project.


# Usage

Using chamber you can perform all standard CRUD operations on secrets stored in [AWS SSM]({{< relref "glossary/ssm.md" >}}) and execute commands with environment variables populated from the secrets. 
For a complete description, check out the [official documentation](https://github.com/segmentio/chamber#usage). 

## Create or Update a Secret

To create or update a secret, execute the command `chamber write $service $key $value`. 
Think of the `$service` as the namespace for storing the secrets. For example, you might have one `$service` which is called `global` that contains defaults for all services and then another one called `api`, which specifically sets the secrets for accessing the API.

{{% dialog type="code-block" icon="fa fa-code" title="Chamber write secret" %}}
```
✅   (example-staging-admin) ~ ➤  chamber write kops IMAGE_PULL_SECRET_PASSWORD test123
```
{{% /dialog %}}

In this example, we write to the `kops` namespace a secret called `IMAGE_PULL_SECRET_PASSWORD` for accessing a Docker registry.

## View Secrets

To read a secret run the command `chamber read $service $key`:

{{% dialog type="code-block" icon="fa fa-code" title="Chamber read secret" %}}
```
✅   (example-staging-admin) ~ ➤  chamber read kops IMAGE_PULL_SECRET_PASSWORD
Key                             Value           Version         LastModified    User
image_pull_secret_password      test123         1               05-21 16:43:54  arn:aws:sts::XXXXXXXXXXXX:assumed-role/OrganizationAccountAccessRole/XXXXXXXXXXXX
```
{{% /dialog %}}

It's also possible to list all secrets and their corresponding values by running the following command:

{{% dialog type="code-block" icon="fa fa-code" title="Chamber list secrets" %}}
```
chamber list $service -e
```
{{% /dialog %}}

## Delete Secrets

To delete a secret execute the command `chamber delete $service $key`:

{{% dialog type="code-block" icon="fa fa-code" title="Chamber delete secret" %}}
```
✅   (example-staging-admin) ~ ➤  chamber delete kops IMAGE_PULL_SECRET_PASSWORD
```
{{% /dialog %}}

## Execute Commands with Secrets

Using `chamber`, you can execute any command that requires ENV variables by running `chamber exec $service -- $command`.

For example, the following will run the `env` command in the context of `kops` namespace:

{{% dialog type="code-block" icon="fa fa-code" title="Chamber with env command" %}}
```
chamber exec kops -- env
```
{{% /dialog %}}

## Using Chamber with Multiple Namespaces

Using `chamber` with multiple namespaces allows hierarchy of secrets and provides better structure and security.

Currently, in our [Terraform root modules](https://github.com/cloudposse/terraform-root-modules) for provisioning reference architectures on AWS, we use two namespaces, `backing-services` and `kops`, each corresponding to a Terraform project:

* `backing-services` is used for all AWS services that we provision with Terraform (e.g. databases, caches, VPCs).
* `kops` is used for all `kubernetes` system services (not application-related) that we provision using [Helmfiles]({{< relref "tools/helmfile.md" >}}).

For applications deployed on `kubernetes`, we can use a namespace per application to store secrets, for example:

* `app_server` namespace to store secrets for the server app
* `app_ui` namespace to store secrets for the UI app

This way, different apps would be able to see only their own secrets, providing better separation and security.

The command `chamber write $service $key $value` will write a secret (key-value pair) into the `$service` (which is another name for namespace).

For the `app_server` app, run this command from the `geodesic` shell to store a secret in the `app_server` namespace:

{{% dialog type="code-block" icon="fa fa-code" title="Chamber write secret" %}}
```
chamber write app_server $key $value
```
{{% /dialog %}}

To read the secrets from the `app_server` namespace, populate ENV vars from the secrets and execute `$command`, run:

{{% dialog type="code-block" icon="fa fa-code" title="Chamber execute command with secrets" %}}
```
chamber exec app_server -- $command
```
{{% /dialog %}}

To read the secrets from two namespaces, run:

{{% dialog type="code-block" icon="fa fa-code" title="Chamber execute command with secrets from multiple namespaces" %}}
```
chamber exec kops app_server -- $command
```
{{% /dialog %}}

If we have secrets with the same name in both `kops` and `app_server` namespaces, the second one (from `app_server`) will override the first one.
This feature could be useful if we wanted to have a default value in `kops`, and then override it per app if a new (app-specific) value is required.

## Using Chamber with Multiple Namespaces for Unlimited Staging Environments

In some cases, using a namespace per app is not only useful/convenient, but is necessary.

For example, for `Unlimited Staging Environments` (where we deploy different versions of an app into many `kubernetes` namespaces with different external URLs), if the app implements OAuth login, 
then the OAuth tokens and callback URLs will differ for each namespace.
In this case, storing the OAuth tokens and callback URLs in one application namespace will not work.

A `chamber` namespace per `kubernetes` namespace is required.
