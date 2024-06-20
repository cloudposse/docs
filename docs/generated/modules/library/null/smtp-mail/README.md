---
title: smtp-mail
sidebar_label: smtp-mail
sidebar_class_name: command
description: |-
  Terraform Module to send emails using an SMTP server by calling an external `email` command.
custom_edit_url: https://github.com/cloudposse/terraform-null-smtp-mail/blob/main/README.yaml
---

# Module: `smtp-mail`
Terraform Module to send emails using an SMTP server by calling an external `email` command.




## Introduction

This terraform module uses an external command using the [`local-exec`](https://www.terraform.io/docs/provisioners/local-exec.html) provisioner to send emails. It's ideally suited for sending transactional emails
related to the `apply` phase. For example, notifying a user of their [IAM user account](https://github.com/cloudposse/terraform-aws-iam-user) getting created or the deployment of a new [ECS application](https://github.com/cloudposse/terraform-aws-ecs-web-app).

**NOTE:** The `null` refers to the primary Terraform [provider](https://www.terraform.io/docs/providers/null/index.html) used in this module.

## Dependencies

  First install the latest release of the `email` cli tool here: https://github.com/wrouesnel/emailcli/releases

  Make sure it exists in your `PATH` (E.g. `/usr/local/bin`)

  We distribute an Alpine Linux package (`emailcli`) as part of our [toolchain](https://github.com/cloudposse/packages).

  ```
  curl -sSL https://apk.cloudposse.com/install.sh | sudo bash
  apk add emailcli@cloudposse
  ```



## Usage


```hcl
module "welcome" {
  source     = "git::https://github.com/cloudposse/terraform-null-smtp-mail.git?ref=master"
  host       = "smtp.mailgun.org"
  port       = "587"
  username   = "postmaster@ourdomain.com"
  password   = "changeme"
  from       = "admin@yourdomain.com"
  to         = ["example@yourdomain.com"]
  subject    = "Welcome $${first_name}"
  body       = "Your account has been created. Login here: $${homepage}"

  vars = {
    first_name = "Example"
    homepage   = "https://cloudposse.com"
  }
}
```

__NOTE:__ Use the `file(...)` interpolation function to use a template file. 






<!-- markdownlint-disable -->
## Requirements

No requirements.

## Providers

| Name | Version |
|------|---------|
| <a name="provider_null"></a> [null](#provider\_null) | n/a |
| <a name="provider_template"></a> [template](#provider\_template) | n/a |

## Modules

No modules.

## Resources

| Name | Type |
|------|------|
| [null_resource.default](https://registry.terraform.io/providers/hashicorp/null/latest/docs/resources/resource) | resource |
| [template_file.body](https://registry.terraform.io/providers/hashicorp/template/latest/docs/data-sources/file) | data source |
| [template_file.subject](https://registry.terraform.io/providers/hashicorp/template/latest/docs/data-sources/file) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_body"></a> [body](#input\_body) | Email body template | `any` | n/a | yes |
| <a name="input_enabled"></a> [enabled](#input\_enabled) | Flag to enable or disable the sending of emails | `string` | `"true"` | no |
| <a name="input_from"></a> [from](#input\_from) | From address for email | `any` | n/a | yes |
| <a name="input_host"></a> [host](#input\_host) | SMTP Host | `string` | `"smtp.mailgun.org"` | no |
| <a name="input_mail_command"></a> [mail\_command](#input\_mail\_command) | Command to execute | `string` | `"email"` | no |
| <a name="input_password"></a> [password](#input\_password) | Password to authenticate with the SMTP server | `string` | n/a | yes |
| <a name="input_port"></a> [port](#input\_port) | SMTP Port | `string` | `"587"` | no |
| <a name="input_subject"></a> [subject](#input\_subject) | Email subject template | `any` | n/a | yes |
| <a name="input_to"></a> [to](#input\_to) | Email recipients | `list(string)` | n/a | yes |
| <a name="input_username"></a> [username](#input\_username) | Username to authenticate with the SMTP server | `string` | n/a | yes |
| <a name="input_vars"></a> [vars](#input\_vars) | Parameters to pass to the body template | `map` | `{}` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_body"></a> [body](#output\_body) | Rendered body of the email |
| <a name="output_subject"></a> [subject](#output\_subject) | Rendered subject of the email |
<!-- markdownlint-restore -->

