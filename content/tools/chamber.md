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

