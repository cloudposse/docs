---
title: "init-terraform"
description: 'The `init-terraform` script is a helper for configuring and then initializing terraform remote state in combination with the terraform-aws-tfstate-backend module.'
terms:
- init-terraform
tags:
- tfstate
---

{{% dialog type="info" icon="fa fa-book" title="Read More" %}}
- This [`init-terraform`](https://github.com/cloudposse/geodesic/blob/master/rootfs/usr/local/bin/init-terraform) script is provided as part of geodesic.
- The [terraform-aws-tfstate-backend]({{< relref "terraform-modules/supported/terraform-aws-tfstate-backend.md" >}}) module provides an encrypted S3 bucket for persisting state and a DynamoDB table for state locking.
{{% /dialog %}}
