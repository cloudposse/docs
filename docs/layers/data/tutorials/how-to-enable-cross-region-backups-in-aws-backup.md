---
title: "Enable Cross-Region Backups in AWS-Backup"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1190952961/How+to+Enable+Cross-Region+Backups+in+AWS-Backup
sidebar_position: 100
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/how-to-guides/tutorials/how-to-enable-cross-region-backups-in-aws-backup.md
---

# How to Enable Cross-Region Backups in AWS-Backup

## Problem

AWS Backup is a regional component that can backup a ton of resources. It is often very helpful to save your backups in another region in case of a disaster.

## Solution

:::tip
TL;DR Create a backup vault and point to it via `destination_vault_arn` variable!

:::

Currently, this requires deploying the component into two different regions. The first is a normal aws-backup component. This includes a `plan`, a `vault`, and an `iam` role. The second aws-backup component should be deployed to the cross-region destination.

```
# <default-region>-<stage>.yaml
components:
  terraform:
    aws-backup:
      vars:
        # https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/ScheduledEvents.html
        schedule: cron(0 0 * * ? *)             # Daily At 12:00 AM UTC
        start_window: 60                        # Minutes
        completion_window: 240                  # Minutes
        cold_storage_after: null                # Days
        delete_after: 14                        # Days
        destination_vault_arn: null             # Copy to another Region's Vault
        copy_action_cold_storage_after: null    # Copy to another Region's Vault Cold Storage Config (Days)
        copy_action_delete_after: null          # Copy to another Region's Vault Persistence Config (Days)
        backup_resources: []
        selection_tags:
          - type: "STRINGEQUALS"
            key: "aws-backup/resource_schedule"
            value: "dev-daily-14day-backup"
```

```
# <default-region>-<stage>.yaml
components:
  terraform:
    aws-backup:
      vars:
        plan_enabled: false
        iam_role_enabled: false
```

:::info
This will only create a **vault**!

:::

Create the cross-region backup vault first. Grab its ARN, and set it to the value of the `destination_vault_arn`. Apply the component and you now have cross-region backups enabled.

