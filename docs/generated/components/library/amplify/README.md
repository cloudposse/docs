---
title: amplify
sidebar_label: amplify
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/amplify/README.md
tags: [terraform, aws, amplify]
---

# Component: `amplify`

This component is responsible for provisioning AWS Amplify apps, backend environments, branches, domain associations,
and webhooks.

## Usage

**Stack Level**: Regional

Here's an example for how to use this component:

```yaml
# stacks/catalog/amplify/defaults.yaml
components:
  terraform:
    amplify/defaults:
      metadata:
        type: abstract
      settings:
        spacelift:
          workspace_enabled: true
      vars:
        enabled: true
        # https://docs.aws.amazon.com/amplify/latest/userguide/setting-up-GitHub-access.html
        github_personal_access_token_secret_path: "/amplify/github_personal_access_token"
        platform: "WEB"
        enable_auto_branch_creation: false
        enable_basic_auth: false
        enable_branch_auto_build: true
        enable_branch_auto_deletion: false
        iam_service_role_enabled: false
        environment_variables: {}
        dns_delegated_component_name: "dns-delegated"
        dns_delegated_environment_name: "gbl"
```

```yaml
# stacks/catalog/amplify/example.yaml
import:
  - catalog/amplify/defaults

components:
  terraform:
    amplify/example:
      metadata:
        # Point to the Terraform component
        component: amplify
      inherits:
        # Inherit the default settings
        - amplify/defaults
      vars:
        name: "example"
        description: "example Amplify App"
        repository: "https://github.com/cloudposse/amplify-test2"
        platform: "WEB_COMPUTE"
        enable_auto_branch_creation: false
        enable_basic_auth: false
        enable_branch_auto_build: true
        enable_branch_auto_deletion: false
        iam_service_role_enabled: true
        # https://docs.aws.amazon.com/amplify/latest/userguide/ssr-CloudWatch-logs.html
        iam_service_role_actions:
          - "logs:CreateLogStream"
          - "logs:CreateLogGroup"
          - "logs:DescribeLogGroups"
          - "logs:PutLogEvents"
        custom_rules: []
        auto_branch_creation_patterns: []
        environment_variables:
          NEXT_PRIVATE_STANDALONE: false
          NEXT_PUBLIC_TEST: test
          _LIVE_UPDATES: '[{"pkg":"node","type":"nvm","version":"16"},{"pkg":"next-version","type":"internal","version":"13.1.1"}]'
        environments:
          main:
            branch_name: "main"
            enable_auto_build: true
            backend_enabled: false
            enable_performance_mode: false
            enable_pull_request_preview: false
            framework: "Next.js - SSR"
            stage: "PRODUCTION"
            environment_variables: {}
          develop:
            branch_name: "develop"
            enable_auto_build: true
            backend_enabled: false
            enable_performance_mode: false
            enable_pull_request_preview: false
            framework: "Next.js - SSR"
            stage: "DEVELOPMENT"
            environment_variables: {}
        domain_config:
          enable_auto_sub_domain: false
          wait_for_verification: false
          sub_domain:
            - branch_name: "main"
              prefix: "example-prod"
            - branch_name: "develop"
              prefix: "example-dev"
        subdomains_dns_records_enabled: true
        certificate_verification_dns_record_enabled: false
```

The `amplify/example` YAML configuration defines an Amplify app in AWS. The app is set up to use the `Next.js` framework
with SSR (server-side rendering) and is linked to the GitHub repository "https://github.com/cloudposse/amplify-test2".

The app is set up to have two environments: `main` and `develop`. Each environment has different configuration settings,
such as the branch name, framework, and stage. The `main` environment is set up for production, while the `develop`
environments is set up for development.

The app is also configured to have custom subdomains for each environment, with prefixes such as `example-prod` and
`example-dev`. The subdomains are configured to use DNS records, which are enabled through the
`subdomains_dns_records_enabled` variable.

The app also has an IAM service role configured with specific IAM actions, and environment variables set up for each
environment. Additionally, the app is configured to use the Atmos Spacelift workspace, as indicated by the
`workspace_enabled: true` setting.

The `amplify/example` Atmos component extends the `amplify/defaults` component.

The `amplify/example` configuration is imported into the `stacks/mixins/stage/dev.yaml` stack config file to be
provisioned in the `dev` account.

```yaml
# stacks/mixins/stage/dev.yaml
import:
  - catalog/amplify/example
```

You can execute the following command to provision the Amplify app using Atmos:

```shell
atmos terraform apply amplify/example -s <stack>
```

<!-- prettier-ignore-start -->
<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- hello terraform-docs -->
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- prettier-ignore-end -->



