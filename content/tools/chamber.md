---
title: "Chamber"
description: 'Chamber is a CRUD tool for managing secrets stored in [AWS Systems Manager Parameter Store](https://aws.amazon.com/systems-manager/features/#Parameter_Store) and exposing those secrets as Environment Variables to processes.'
---
Chamber is a cli for managing secrets stored
in [AWS Systems Manager Parameter Store](https://aws.amazon.com/systems-manager/features/#Parameter_Store).

In the article [The Right Way to Store Secrets using Parameter Store](https://aws.amazon.com/blogs/mt/the-right-way-to-store-secrets-using-parameter-store/), `AWS` recommends using `Chamber` for secrets management.

# Configuration

{{% dialog type="warning" icon="fa-info-circle" title="Prerequisites" %}}
This assumes you've installed the [AWS KMS]({{< relref "secrets-management/aws-kms-ssm.md" >}}) guide which covers all the scaffolding necessary to get started.
{{% /dialog %}}

## Chamber with Geodesic

From the Terraform outputs [AWS KMS]({{< relref "secrets-management/aws-kms-ssm.md#provision-chamber-resources" >}}) copy the `chamber_kms_key_alias_name` into the ENV var `CHAMBER_KMS_KEY_ALIAS` in the geodesic module\`s `Dockerfile`.

{{% dialog type="code-block" icon="fa fa-code" title="Dockerfile" %}}
```
# chamber KMS config
ENV CHAMBER_KMS_KEY_ALIAS="alias/example-staging-chamber"
```
{{% /dialog %}}

Replace with values to suit your specific project.

## Chamber with Codefresh

# Usage

With Chamber you can perform all standard CRUD operations on secrets kept in [AWS SSM]({{< relref "glossary/ssm.md" >}}) and execute commands with secrets as environment variables. For a complete write up on usage, checkout the official [`README.md`](https://github.com/segmentio/chamber#usage). We'll include the cheatsheet below.

## Create or Update a Secret

To create or update a secret run `chamber write $service $key $value`. Think of the `$service` as the namespace for storing the secrets. For example, you might have one `$service` which is called `global` that contains defaults for all services and then another one called `api`, which specifically sets the secrets for accessing the API.

{{% dialog type="code-block" icon="fa fa-code" title="Example" %}}
```
✅   (example-staging-admin) ~ ➤  chamber write kops IMAGE_PULL_SECRET_PASSWORD test123
```
{{% /dialog %}}

In this example, we write to the `kops` namespace a "pull secret" called `IMAGE_PULL_SECRET_PASSWORD` for accessing a docker registry.

## View secrets

To see secret value run `chamber read $service $key`

{{% dialog type="code-block" icon="fa fa-code" title="Example" %}}
```
✅   (example-staging-admin) ~ ➤  chamber read kops IMAGE_PULL_SECRET_PASSWORD
Key                             Value           Version         LastModified    User
image_pull_secret_password      test123         1               05-21 16:43:54  arn:aws:sts::XXXXXXXXXXXX:assumed-role/OrganizationAccountAccessRole/XXXXXXXXXXXX
```
{{% /dialog %}}

It's also possible to list all secrets and their corresponding values by running the following command.

```
chamber list $service -e
```

Or to couple `chamber exec` with the `env` command.

For example, the following will run the `env` in the `kops` context.

```
chamber exec kops -- env
```

## Delete Secrets

To delete a secret just run `chamber delete $service $key`

{{% dialog type="code-block" icon="fa fa-code" title="Example" %}}
```
✅   (example-staging-admin) ~ ➤  chamber delete kops IMAGE_PULL_SECRET_PASSWORD
```
{{% /dialog %}}

## Execute Commands with Secrets

You can exec command that use secrets as enviroment variables.
Run `chamber exec $service -- $command`

You can specify multiple `services` just by delimiting them with a space.

{{% dialog type="code-block" icon="fa fa-code" title="Example" %}}
```
sh-3.2 $ chamber exec global api -- node app.js
```
{{% /dialog %}}

In this example, we export secrets from `global` and `api` prior to executing the command `node app.js`.
