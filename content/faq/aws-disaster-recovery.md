---
title: "Is AWS disaster recover automated or manual?"
description: "The process is mostly automated, but involves many manual steps that must be started."
tags:
- AWS
- disaster recovery
- DR/BCP
- updates
---

## Question

Is AWS disaster recovery (master/cluster failures, account provisioning, and end-to-end redeployment options) automated or manual?


## Answer

DR/BCP for catastrophic cluster failure rebuilds from scratch rather than attempting to recover. The process is mostly automated, but involves many manual steps that must be started. We've not invested massively into automating the cold-start process, since it's seldom performed. By manual, we mean more of a runbook such as:
```
1. Run this Terraform command.
2. Set this input somewhere.
3. Run this kops command to build the cluster.
4. Wait for cluster to come up.
5. Associate cluster with Codefresh.
6. Deploy the release to the cluster.
```

There are solutions to back up the `kubernetes` state and restore from state backups, such as by [StackPointCloud](https://stackpointcloud.com/community/tutorial/using-the-kubernetes-cloud-backup#install-the-kubernetes-state-cloud-backup) and [Heptio](https://github.com/heptio/ark) (both acquired). We've not used them.

You should be able to easily replay the complete runbook of commands without assistance.
