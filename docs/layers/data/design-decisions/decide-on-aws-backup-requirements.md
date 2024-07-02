---
title: "Decide on AWS Backup Requirements"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1203830920/REFARCH-489+-+Decide+on+AWS+Backup+Requirements
sidebar_position: 100
refarch_id: REFARCH-489
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/fundamentals/design-decisions/foundational-platform/decide-on-aws-backup-requirements.md
---

# Decide on AWS Backup Requirements

## Problem

## Context
We need a standardized way to implement backup services for AWS resources (S3, databases, EC2 instances, EFS, etc. etc.) to have the ability to restore data from points in time in the event of data loss or corruption.

AWS provides a managed backup service offering called AWS Backup. [https://docs.aws.amazon.com/aws-backup/latest/devguide/whatisbackup.html](https://docs.aws.amazon.com/aws-backup/latest/devguide/whatisbackup.html)

We need to determine if we are opting in or opting out using AWS Backup.

## References

- [https://www.druva.com/blog/understanding-rpo-and-rto/](https://www.druva.com/blog/understanding-rpo-and-rto/)


