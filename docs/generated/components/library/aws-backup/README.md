---
title: aws-backup
sidebar_label: aws-backup
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/aws-backup/README.md
tags: [terraform, aws, aws-backup]
---

# Component: `aws-backup`

This component is responsible for provisioning an AWS Backup Plan. It creates a schedule for backing up given ARNs.

## Usage

**Stack Level**: Regional

Here's an example snippet for how to use this component.

### Component Abstraction and Separation

By separating the "common" settings from the component, we can first provision the IAM Role and AWS Backup Vault to
prepare resources for future use without incuring cost.

For example, `stacks/catalog/aws-backup/common`:

```yaml
# This configuration creates the AWS Backup Vault and IAM Role, and does not incur any cost on its own.
# See: https://aws.amazon.com/backup/pricing/
components:
  terraform:
    aws-backup:
      metadata:
        type: abstract
      settings:
        spacelift:
          workspace_enabled: true
      vars: {}

    aws-backup/common:
      metadata:
        component: aws-backup
        inherits:
          - aws-backup
      vars:
        enabled: true
        iam_role_enabled: true # this will be reused
        vault_enabled: true # this will be reused
        plan_enabled: false
## Please be careful when enabling backup_vault_lock_configuration,
#        backup_vault_lock_configuration:
##         `changeable_for_days` enables compliance mode and once the lock is set, the retention policy cannot be changed unless through account deletion!
#          changeable_for_days: 36500
#          max_retention_days: 365
#          min_retention_days: 1
```

Then if we would like to deploy the component into a given stacks we can import the following to deploy our backup
plans.

Since most of these values are shared and common, we can put them in a `catalog/aws-backup/` yaml file and share them
across environments.

This makes deploying the same configuration to multiple environments easy.

`stacks/catalog/aws-backup/defaults`:

```yaml
import:
  - catalog/aws-backup/common

components:
  terraform:
    aws-backup/plan-defaults:
      metadata:
        component: aws-backup
        type: abstract
      settings:
        spacelift:
          workspace_enabled: true
        depends_on:
          - aws-backup/common
      vars:
        enabled: true
        iam_role_enabled: false # reuse from aws-backup-vault
        vault_enabled: false # reuse from aws-backup-vault
        plan_enabled: true
        plan_name_suffix: aws-backup-defaults

    aws-backup/daily-plan:
      metadata:
        component: aws-backup
        inherits:
          - aws-backup/plan-defaults
      vars:
        plan_name_suffix: aws-backup-daily
        # https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/ScheduledEvents.html
        rules:
          - name: "plan-daily"
            schedule: "cron(0 5 ? * * *)"
            start_window: 320 # 60 * 8             # minutes
            completion_window: 10080 # 60 * 24 * 7 # minutes
            lifecycle:
              delete_after: 35 # 7 * 5               # days
        selection_tags:
          - type: STRINGEQUALS
            key: aws-backup/efs
            value: daily
          - type: STRINGEQUALS
            key: aws-backup/rds
            value: daily

    aws-backup/weekly-plan:
      metadata:
        component: aws-backup
        inherits:
          - aws-backup/plan-defaults
      vars:
        plan_name_suffix: aws-backup-weekly
        # https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/ScheduledEvents.html
        rules:
          - name: "plan-weekly"
            schedule: "cron(0 5 ? * SAT *)"
            start_window: 320 # 60 * 8              # minutes
            completion_window: 10080 # 60 * 24 * 7  # minutes
            lifecycle:
              delete_after: 90 # 30 * 3               # days
        selection_tags:
          - type: STRINGEQUALS
            key: aws-backup/efs
            value: weekly
          - type: STRINGEQUALS
            key: aws-backup/rds
            value: weekly

    aws-backup/monthly-plan:
      metadata:
        component: aws-backup
        inherits:
          - aws-backup/plan-defaults
      vars:
        plan_name_suffix: aws-backup-monthly
        # https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/ScheduledEvents.html
        rules:
          - name: "plan-monthly"
            schedule: "cron(0 5 1 * ? *)"
            start_window: 320 # 60 * 8              # minutes
            completion_window: 10080 # 60 * 24 * 7  # minutes
            lifecycle:
              delete_after: 2555 # 365 * 7            # days
              cold_storage_after: 90 # 30 * 3         # days
        selection_tags:
          - type: STRINGEQUALS
            key: aws-backup/efs
            value: monthly
          - type: STRINGEQUALS
            key: aws-backup/rds
            value: monthly
```

Deploying to a new stack (environment) then only requires:

```yaml
import:
  - catalog/aws-backup/defaults
```

The above configuration can be used to deploy a new backup to a new region.

---

### Adding Resources to the Backup - Adding Tags

Once an `aws-backup` with a plan and `selection_tags` has been established we can begin adding resources for it to
backup by using the tagging method.

This only requires that we add tags to the resources we wish to backup, which can be done with the following snippet:

```yaml
components:
  terraform:
    <my-resource>
      vars:
        tags:
          aws-backup/resource_schedule: "daily-14day-backup"
```

Just ensure the tag key-value pair matches what was added to your backup plan and aws will take care of the rest.

### Copying across regions

If we want to create a backup vault in another region that we can copy to, then we need to create another vault, and
then specify that we want to copy to it.

To create a vault in a region simply:

```yaml
components:
  terraform:
    aws-backup:
      vars:
        plan_enabled: false # disables the plan (which schedules resource backups)
```

This will output an ARN - which you can then use as the destination in the rule object's `copy_action` (it will be
specific to that particular plan), as seen in the following snippet:

```yaml
components:
  terraform:
    aws-backup/plan-with-cross-region-replication:
      metadata:
        component: aws-backup
        inherits:
          - aws-backup/plan-defaults
      vars:
        plan_name_suffix: aws-backup-cross-region
        # https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/ScheduledEvents.html
        rules:
          - name: "plan-cross-region"
            schedule: "cron(0 5 ? * * *)"
            start_window: 320 # 60 * 8             # minutes
            completion_window: 10080 # 60 * 24 * 7 # minutes
            lifecycle:
              delete_after: 35 # 7 * 5               # days
            copy_action:
              destination_vault_arn: "arn:aws:backup:<other-region>:111111111111:backup-vault:<namespace>-<other-region>-<stage>"
              lifecycle:
                delete_after: 35
```

### Backup Lock Configuration

To enable backup lock configuration, you can use the following snippet:

- [AWS Backup Vault Lock](https://docs.aws.amazon.com/aws-backup/latest/devguide/vault-lock.html)

#### Compliance Mode

Vaults locked in compliance mode cannot be deleted once the cooling-off period ("grace time") expires. During grace
time, you can still remove the vault lock and change the lock configuration.

To enable **Compliance Mode**, set `changeable_for_days` to a value greater than 0. Once the lock is set, the retention
policy cannot be changed unless through account deletion!

```yaml
# Please be careful when enabling backup_vault_lock_configuration,
backup_vault_lock_configuration:
  #         `changeable_for_days` enables compliance mode and once the lock is set, the retention policy cannot be changed unless through account deletion!
  changeable_for_days: 36500
  max_retention_days: 365
  min_retention_days: 1
```

#### Governance Mode

Vaults locked in governance mode can have the lock removed by users with sufficient IAM permissions.

To enable **governance mode**

```yaml
backup_vault_lock_configuration:
  max_retention_days: 365
  min_retention_days: 1
```

<!-- prettier-ignore-start -->
<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- hello terraform-docs -->
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- prettier-ignore-end -->

## References

- [cloudposse/terraform-aws-components](https://github.com/cloudposse/terraform-aws-components/tree/main/modules/aws-backup) -
  Cloud Posse's upstream component



## Related How-to Guides

- [How to Enable Cross-Region Backups in AWS-Backup](https://docs.cloudposse.com/reference-architecture/how-to-guides/tutorials/how-to-enable-cross-region-backups-in-aws-backup)


