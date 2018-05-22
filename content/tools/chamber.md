---
title: "Chamber"
description: 'Chamber is a cli for managing secrets stored in [AWS Systems Manager Parameter Store](https://aws.amazon.com/systems-manager/features/#Parameter_Store)'
---
Chamber is a cli for managing secrets stored
in [AWS Systems Manager Parameter Store](https://aws.amazon.com/systems-manager/features/#Parameter_Store).

In the article [The Right Way to Store Secrets using Parameter Store](https://aws.amazon.com/blogs/mt/the-right-way-to-store-secrets-using-parameter-store/) `AWS` recommends using `Chamber` for secrets managment.


# Config

{{% dialog type="warning" icon="fa-info-circle" title="Prerequisites" %}}
This assumes you've installed the [AWS KMS]({{< relref "secrets-management/aws-kms.md" >}}) guide which covers all the scaffolding necessary to get started.
{{% /dialog %}}

## Chamber with Geodesic

From the Terraform outputs [AWS KMS]({{< relref "secrets-management/aws-kms.md#provision-chamber-resources" >}}) copy the `chamber_kms_key_alias_name` into the ENV var `CHAMBER_KMS_KEY_ALIAS` in the geodesic module\`s `Dockerfile`.

{{% dialog type="code-block" icon="fa fa-code" title="Dockerfile" %}}
```
# chamber KMS config
ENV CHAMBER_KMS_KEY_ALIAS="alias/example-staging-chamber"
```
{{% /dialog %}}

Replace with values to suit your specific project.

## Chamber with Codefresh

# Usage

With Chamber you can create\\update\\delete secrets in [AWS SSM]({{< relref "glossary/ssm.md" >}}) and execute
commands with secrets as environment variables.

Group of secrets called - `service`

## Create or update secret

To create or update secret run `chamber write {service} {key} {value}`

{{% dialog type="code-block" icon="fa fa-code" title="Example" %}}
```
✅   (example-staging-admin) ~ ➤  chamber write kops IMAGE_PULL_SECRET_PASSWORD test123
```
{{% /dialog %}}

## View secrets

To see secret value run `chamber read {service} {key}`

{{% dialog type="code-block" icon="fa fa-code" title="Example" %}}
```
✅   (example-staging-admin) ~ ➤  chamber read kops IMAGE_PULL_SECRET_PASSWORD
Key                             Value           Version         LastModified    User
image_pull_secret_password      test123         1               05-21 16:43:54  arn:aws:sts::XXXXXXXXXXXX:assumed-role/OrganizationAccountAccessRole/XXXXXXXXXXXX
```
{{% /dialog %}}

## Delete secrets

To delete secret run `chamber delete {service} {key}`

{{% dialog type="code-block" icon="fa fa-code" title="Example" %}}
```
✅   (example-staging-admin) ~ ➤  chamber delete kops IMAGE_PULL_SECRET_PASSWORD
```
{{% /dialog %}}

## Exec command with secrets

You can exec command that use secrets as enviroment variables.
Run `chamber exec {service} -- {command}`

You can specify secrets from multiple `services` my specifying them as a list

{{% dialog type="code-block" icon="fa fa-code" title="Example" %}}
```
sh-3.2 $ chamber exec kops staging_1 -- node app.js
```
{{% /dialog %}}
