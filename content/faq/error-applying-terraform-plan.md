---
title: "Terraform fails while applying plan: resource does not have attribute"
description: "Usually re-running `terraform apply` fixes the problem assuming that the attribute does indeed exist."
tags:
- terraform
- terraform-modules
- aws
---

# Question

While attempting to run `terraform apply`, the execution failed with the following error:

```
Error: Error applying plan:

6 error(s) occurred:

* module.aurora_postgres.module.dns_replicas.output.hostname: Resource 'aws_route53_record.default' does not have attribute 'fqdn' for variable 'aws_route53_record.default.*.fqdn'
* module.aurora_postgres.output.password: Resource 'aws_rds_cluster.default' does not have attribute 'master_password' for variable 'aws_rds_cluster.default.*.master_password'
* module.aurora_postgres.output.user: Resource 'aws_rds_cluster.default' does not have attribute 'master_username' for variable 'aws_rds_cluster.default.*.master_username'
* module.aurora_postgres.output.cluster_name: Resource 'aws_rds_cluster.default' does not have attribute 'cluster_identifier' for variable 'aws_rds_cluster.default.*.cluster_identifier'
* module.aurora_postgres.module.dns_master.output.hostname: Resource 'aws_route53_record.default' does not have attribute 'fqdn' for variable 'aws_route53_record.default.*.fqdn'
* module.aurora_postgres.output.name: Resource 'aws_rds_cluster.default' does not have attribute 'database_name' for variable 'aws_rds_cluster.default.*.database_name'
```

This was previously working and only broke after upgrading the underlying module release. 

The module had made a significant change which involved adding a `count` parameter to underlying resources.

# Answer

We've encountered this error as well, although it happens very seldom. Basically what happens is that terraform chokes because it is referencing some old `output` names from a previous generation. We don't know how to avoid it, but rerunning `terraform apply` tends to fix it. Please contact us by clicking the "Ask a Question" link, if this does not resolve your issues.

