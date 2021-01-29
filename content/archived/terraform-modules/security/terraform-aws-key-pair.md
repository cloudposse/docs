---
title: terraform-aws-key-pair
description: Terraform module for generating (or importing) a SSH public key file into AWS.
---

# Terraform AWS Key Pair

|                  |                                                                                                                                                          |
|:-----------------|:---------------------------------------------------------------------------------------------------------------------------------------------------------|
| GitHub Repo      | <https://github.com/cloudposse/terraform-aws-key-pair>                                                                                                   |
| Terraform Module | terraform-aws-key-pair                                                                                                                                   |
| Release          | [![Release](https://img.shields.io/github/release/cloudposse/terraform-aws-key-pair.svg)](https://github.com/cloudposse/terraform-aws-key-pair/releases) |
| Build Status     | [![Build Status](https://travis-ci.org/cloudposse/terraform-aws-key-pair.svg)](https://travis-ci.org/cloudposse/terraform-aws-key-pair)                  |

## HCL

```hcl
module "default" {
  source                           = "git::https://github.com/cloudposse/terraform-aws-key-pair.git?ref=master"
  domain_name                      = "example.com"
  proces_domain_validation_options = "true"
  ttl                              = "300"
}
```

# Variables

| Name                    | Default        | Description                                               | Required                |
|:------------------------|:---------------|:----------------------------------------------------------|:------------------------|
| `namespace`             |                | Namespace (e.g. `cp` or `cloudposse`)                     | Yes                     |
| `stage`                 |                | Stage (e.g. `prod`, `dev`, `staging`)                     | Yes                     |
| `name`                  |                | Application Name (e.g. `bastion` or `app`)                | Yes                     |
| `ssh_public_key_path`   |                | Path to Read/Write SSH Public Key File (directory)        | Yes                     |
| `generate_ssh_key`      | `false`        | If set to `true`, new ssh key pair will be created        | No                      |
| `private_key_extension` |                | Private key file extension, _e.g._ `.pem`                 | No                      |
| `public_key_extension`  | `.pub`         | Public key file extension, _e.g._ `.pub`                  | Yes                     |
| `chmod_command`         | `chmod 600 %v` | Template of the command executed on the private key file. | Yes(Linux), No(Windows) |

# Outputs

| Name         | Description                          |
|:-------------|:-------------------------------------|
| `key_name`   | Name of SSH key                      |
| `public_key` | Contents of the generated public key |
