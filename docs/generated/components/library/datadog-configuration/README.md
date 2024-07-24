---
title: datadog-configuration
sidebar_label: datadog-configuration
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/datadog-configuration/README.md
tags: [terraform, aws, datadog-configuration]
---

# Component: `datadog-configuration`

This component is responsible for provisioning SSM or ASM entries for Datadog API keys.

It's required that the DataDog API and APP secret keys are available in the `var.datadog_secrets_source_store_account`
account in AWS SSM Parameter Store at the `/datadog/%v/datadog_app_key` paths (where `%v` are the corresponding account
names).

This component copies keys from the source account (e.g. `auto`) to the destination account where this is being
deployed. The purpose of using this formatted copying of keys handles a couple of problems.

1. The keys are needed in each account where datadog resources will be deployed.
1. The keys might need to be different per account or tenant, or any subset of accounts.
1. If the keys need to be rotated they can be rotated from a single management account.

This module also has a submodule which allows other resources to quickly use it to create a datadog provider.

See Datadog's [documentation about provisioning keys](https://docs.datadoghq.com/account_management/api-app-keys) for
more information.

## Usage

**Stack Level**: Global

This component should be deployed to every account where you want to provision datadog resources. This is usually every
account except `root` and `identity`

Here's an example snippet for how to use this component. It's suggested to apply this component to all accounts which
you want to track AWS metrics with DataDog. In this example we use the key paths `/datadog/%v/datadog_api_key` and
`/datadog/%v/datadog_app_key` where `%v` is `default`, this can be changed through `datadog_app_secret_key` &
`datadog_api_secret_key` variables. The output Keys in the deployed account will be `/datadog/datadog_api_key` and
`/datadog/datadog_app_key`.

```yaml
components:
  terraform:
    datadog-configuration:
      settings:
        spacelift:
          workspace_enabled: true
      vars:
        enabled: true
        name: datadog-configuration
        datadog_secrets_store_type: SSM
        datadog_secrets_source_store_account_stage: auto
        datadog_secrets_source_store_account_region: "us-east-2"
```

Here is a snippet of using the `datadog_keys` submodule:

```terraform
module "datadog_configuration" {
  source  = "../datadog-configuration/modules/datadog_keys"
  enabled = true
  context = module.this.context
}

provider "datadog" {
  api_key  = module.datadog_configuration.datadog_api_key
  app_key  = module.datadog_configuration.datadog_app_key
  api_url  = module.datadog_configuration.datadog_api_url
  validate = local.enabled
}
```

<!-- prettier-ignore-start -->
<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- hello terraform-docs -->
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- prettier-ignore-end -->

## References

- Datadog's [documentation about provisioning keys](https://docs.datadoghq.com/account_management/api-app-keys)
- [cloudposse/terraform-aws-components](https://github.com/cloudposse/terraform-aws-components/tree/main/modules/datadog-configuration) -
  Cloud Posse's upstream component



