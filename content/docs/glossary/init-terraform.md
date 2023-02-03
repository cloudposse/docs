---
title: "init-terraform"
description: 'The `init-terraform` script is a helper for configuring and then initializing terraform remote state in combination with the terraform-aws-tfstate-backend module.'
terms:
- init-terraform
tags:
- tfstate
---
The `init-terraform` script is a helper for configuring and then initializing terraform remote state in combination with the terraform-aws-tfstate-backend module.

:::info
- This [`init-terraform`](https://github.com/cloudposse/geodesic/blob/master/rootfs/usr/local/bin/init-terraform) script is provided as part of geodesic.
- The [terraform-aws-tfstate-backend](https://github.com/cloudposse/terraform-aws-tfstate-backend) module provides an encrypted S3 bucket for persisting state and a DynamoDB table for state locking.
:::
