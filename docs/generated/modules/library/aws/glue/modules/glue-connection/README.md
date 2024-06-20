---
title: glue-connection
sidebar_label: glue-connection
sidebar_class_name: command
description: glue-connection
custom_edit_url: https://github.com/cloudposse/terraform-aws-glue/blob/main/modules/glue-connection/README.md
---

# glue-workflow

Terraform module to provision AWS Glue Connections.

## Usage

```hcl
module "vpc" {
  source  = "cloudposse/vpc/aws"
  version = "1.1.0"

  ipv4_primary_cidr_block = "172.19.0.0/16"

  context = module.this.context
}

data "aws_subnet" "selected" {
  id = module.vpc.private_subnet_ids[0]
}

module "security_group" {
  source  = "cloudposse/security-group/aws"
  version = "1.0.1"
  
  vpc_id                = module.vpc.vpc_id
  create_before_destroy = true
  allow_all_egress      = true
  
  rules                 = [
    {
      type        = "ingress"
      from_port   = 5432
      to_port     = 5432
      protocol    = "all"
      cidr_blocks = [module.vpc.vpc_cidr_block]
    }
  ]

  context = module.this.context
}

module "glue_connection" {
  source = "cloudposse/glue/aws//modules/glue-connection"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"

  connection_name        = "geo"
  connection_description = "Glue connection to Postgres database"
  connection_type        = "JDBC"
  connection_properties  = {}

  physical_connection_requirements = {
    # List of security group IDs used by the connection
    security_group_id_list = [module.security_group.id]
    # The availability zone of the connection. This field is redundant and implied by subnet_id, but is currently an API requirement
    availability_zone = data.aws_subnet.selected.availability_zone
    # The subnet ID used by the connection
    subnet_id = module.vpc.private_subnet_ids[0]
  }
  
  context = module.this.context
}
```

