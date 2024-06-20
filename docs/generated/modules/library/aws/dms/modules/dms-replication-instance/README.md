---
title: dms-replication-instance
sidebar_label: dms-replication-instance
sidebar_class_name: command
description: dms-replication-instance
custom_edit_url: https://github.com/cloudposse/terraform-aws-dms/blob/main/modules/dms-replication-instance/README.md
---

# dms-replication-instance

Terraform module to provision DMS Replication Instances.

## Usage

```hcl
module "dms_iam" {
  source = "cloudposse/dms/aws//modules/dms-iam"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"

  context = module.this.context
}

module "vpc" {
  source  = "cloudposse/vpc/aws"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"

  ipv4_primary_cidr_block = "172.19.0.0/16"

  context = module.this.context
}

module "subnets" {
  source  = "cloudposse/dynamic-subnets/aws"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"

  availability_zones   = ["us-east-2a", "us-east-2b"]
  vpc_id               = local.vpc_id
  igw_id               = [module.vpc.igw_id]
  ipv4_cidr_block      = [module.vpc.vpc_cidr_block]
  nat_gateway_enabled  = false
  nat_instance_enabled = false

  context = module.this.context
}

module "dms_replication_instance" {
  source = "cloudposse/dms/aws//modules/dms-replication-instance"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"

  # If `auto_minor_version_upgrade` is enabled, 
  # then we should omit the patch part of the version or Terraform will try to revert the version upon detected drift
  engine_version               = "3.4"
  replication_instance_class   = "dms.t2.small"
  allocated_storage            = 50
  apply_immediately            = true
  auto_minor_version_upgrade   = true
  allow_major_version_upgrade  = false
  multi_az                     = false
  publicly_accessible          = false
  preferred_maintenance_window = "sun:10:30-sun:14:30"
  vpc_security_group_ids       = [module.vpc.vpc_default_security_group_id]
  subnet_ids                   = module.subnets.private_subnet_ids

  context = module.this.context

  depends_on = [
    # The required DMS roles must be present before replication instances can be provisioned
    module.dms_iam
  ]
}
```

