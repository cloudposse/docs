---
title: github-action-token-rotator
sidebar_label: github-action-token-rotator
sidebar_class_name: command
description: |-
  This module deploys a [lambda function](https://github.com/cloudposse/lambda-github-action-token-rotator) that runs as 
  a GitHub Application and periodically gets a new GitHub Runner Registration Token from the GitHub API. This token is 
  then stored in AWS Systems Manager Parameter Store.
custom_edit_url: https://github.com/cloudposse/terraform-aws-github-action-token-rotator/blob/main/README.yaml
---

# Module: `github-action-token-rotator`
This module deploys a [lambda function](https://github.com/cloudposse/lambda-github-action-token-rotator) that runs as 
a GitHub Application and periodically gets a new GitHub Runner Registration Token from the GitHub API. This token is 
then stored in AWS Systems Manager Parameter Store.






## Usage

```hcl
module "github_action_token_rotator" {
    source = "cloudposse/github-action-token-rotator/aws"
    # Cloud Posse recommends pinning every module to a specific version
    # version = "x.x.x"
    parameter_store_token_path       = "/github/runners/cloudposse/registrationToken"
    parameter_store_private_key_path = "/github/runners/cloudposse/privateKey"
    github_app_id                    = "111111"
    github_app_installation_id       = "22222222"
    github_org                       = "cloudposse"
}
```

## Quick Start

1. Browse to https://github.com/organizations/{YOUR_ORG}/settings/apps and click the New GitHub App button
1. Set the name to "GitHub Action Token Rotator"
1. Set the Homepage URL to `https://github.com/cloudposse/lambda-github-action-token-rotator`
1. Uncheck the Active checkbox under the Webhook heading
1. Select `Read and write` under Organization permissions -> Self-hosted runners
1. Click the Create GitHub App button at the bottom of the page
1. Under the `Client secrets` section, click the `Generate a new client secret` button
1. Copy the Client secret to a safe place, it will be needed to install the app
1. Under the `Private key` section, click the `Generate a private key` button
1. Download the private key to a safe place, it will be needed to install the app
1. Convert the private key to a PEM file using the following command:
  `openssl pkcs8 -topk8 -inform PEM -outform PEM -nocrypt -in {DOWNLOADED_FILE_NAME}.pem -out private-key-pkcs8.key`
1. Base64 encode the private key using the following command:
  `cat private-key-pkcs8.key | base64`
1. Copy the Base64 value to AWS SSM Parameter store at `/github/runners/${YOUR_GITHUB_ORG}/privateKey`




