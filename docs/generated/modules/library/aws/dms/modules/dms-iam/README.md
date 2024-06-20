---
title: dms-iam
sidebar_label: dms-iam
sidebar_class_name: command
description: dms-iam
custom_edit_url: https://github.com/cloudposse/terraform-aws-dms/blob/main/modules/dms-iam/README.md
---

# dms-iam

Terraform module to provision IAM roles required for DMS.

## Usage

```hcl
# Database Migration Service requires
# the below IAM Roles to be created before
# replication instances can be created.
# The roles should be provisioned only once per account.
# https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Security.html
# https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Security.html#CHAP_Security.APIRole
# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/dms_replication_instance
#  * dms-vpc-role
#  * dms-cloudwatch-logs-role
#  * dms-access-for-endpoint
module "dms_iam" {
  source = "cloudposse/dms/aws//modules/dms-iam"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"

  context = module.this.context
}

module "vpc" {
  source = "cloudposse/vpc/aws"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"

  ipv4_primary_cidr_block = "172.19.0.0/16"

  context = module.this.context
}

module "subnets" {
  source = "cloudposse/dynamic-subnets/aws"
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

## DMS IAM Roles

Two IAM roles that you need to create are `dms-vpc-role` and `dms-cloudwatch-logs-role`. 
If you use Amazon Redshift as a target database, you must also create and add the IAM role `dms-access-for-endpoint` to your AWS account. 

See [Creating the IAM roles to use with the AWS CLI and AWS DMS API](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Security.html) for more information.

