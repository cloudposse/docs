---
title: datadog-lambda-forwarder
sidebar_label: datadog-lambda-forwarder
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/datadog-lambda-forwarder/README.md
tags: [terraform, aws, datadog-lambda-forwarder]
---

# Component: `datadog-lambda-forwarder`

This component is responsible for provision all the necessary infrastructure to deploy
[Datadog Lambda forwarders](https://github.com/DataDog/datadog-serverless-functions/tree/master/aws/logs_monitoring). It
depends on the `datadog-configuration` component to get the Datadog API keys.

## Usage

**Stack Level**: Global

Here's an example snippet for how to use this component:

```yaml
components:
  terraform:
    datadog-lambda-forwarder:
      settings:
        spacelift:
          workspace_enabled: true
      vars:
        enabled: true
        name: datadog-lambda-forwarder
        # Set `forwarder_rds_enabled`  to `true` and configure `rds-enhanced-monitoring` Log Group when:
        # 1. The account has RDS instances provisioned
        # 2. RDS Enhanced Monitoring is enabled
        # 3. CloudWatch Log Group `RDSOSMetrics` exists (it will be created by AWS automatically when RDS Enhanced Monitoring is enabled)
        forwarder_rds_enabled: true
        forwarder_log_enabled: true
        forwarder_vpc_logs_enabled: true
        cloudwatch_forwarder_log_groups:
          rds-enhanced-monitoring:
            name: "RDSOSMetrics"
            filter_pattern: ""
          eks-cluster:
            # Use either `name` or `name_prefix` with `name_suffix`
            # If `name_prefix` with `name_suffix` are used, the final `name` will be constructed using `name_prefix` + context + `name_suffix`,
            # e.g. "/aws/eks/eg-ue2-prod-eks-cluster/cluster"
            name_prefix: "/aws/eks/"
            name_suffix: "eks-cluster/cluster"
            filter_pattern: ""
          transfer-sftp:
            name: "/aws/transfer/s-xxxxxxxxxxxx"
            filter_pattern: ""
```

<!-- prettier-ignore-start -->
<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- hello terraform-docs -->
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- prettier-ignore-end -->

## References

- Datadog's [documentation about provisioning keys](https://docs.datadoghq.com/account_management/api-app-keys
- [cloudposse/terraform-aws-components](https://github.com/cloudposse/terraform-aws-components/tree/main/modules/datadog-lambda-forwarder) -
  Cloud Posse's upstream component



## CHANGELOG

### PR [#814](https://github.com/cloudposse/terraform-aws-components/pull/814)

#### Fix for `enabled = false` or Destroy and Recreate

Previously, when `enabled = false` was set, the component would not necessarily function as desired (deleting any
existing resources and not creating any new ones). Also, previously, when deleting the component, there was a race
condition where the log group could be deleted before the lambda function was deleted, causing the lambda function to
trigger automatic recreation of the log group. This would result in re-creation failing because Terraform would try to
create the log group but it already existed.

These issues have been fixed in this PR.

