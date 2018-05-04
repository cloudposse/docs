---
title: "terraform-aws-efs"
excerpt: "Terraform module to provision an AWS [`EFS`](https://aws.amazon.com/efs/) Network File System."
---
# Terraform AWS EFS

|||
|------|------|
|GitHub Repo|https://github.com/cloudposse/terraform-aws-efs|
|Terraform Module|terraform-aws-efs|
|Release|[![Release](https://img.shields.io/github/release/cloudposse/terraform-aws-efs.svg)](https://github.com/cloudposse/terraform-aws-efs/releases)|
|Build Status|[![Build Status](https://travis-ci.org/cloudposse/terraform-aws-efs.svg)](https://travis-ci.org/cloudposse/terraform-aws-efs)|


# Usage

Include this repository as a module in your existing terraform code:


##### HCL
```json
module "efs" {
  source                           = "git::https://github.com/cloudposse/terraform-aws-efs.git?ref=master"
  domain_name                      = "example.com"
  proces_domain_validation_options = "true"
  ttl                              = "300"
}
```

# Variables

|Name|Default|Description|Required|
|------|------|------|------|
|namespace|`global`|Namespace (_e.g._ `cp` or `cloudposse`)|
|attributes|`[]`|Additional attributes (e.g. `policy` or `role`)|
|tags|`{}`|Additional tags  (e.g. `map("BusinessUnit","XYZ")`|
|delimiter|`-`|Delimiter to be used between `name`, `namespace`, `stage`, etc.|
|stage|`default`|Stage (_e.g._ `prod`, `dev`, `staging`)|
|name|`app`|Name (_e.g._ `app` or `wordpress`)|
|security_groups|`[]`|AWS security group IDs to allow to connect to the EFS|
|aws_region|__REQUIRED__|AWS region ID|
|vpc_id|__REQUIRED__|AWS VPC ID|
|subnets|__REQUIRED__|AWS subnet IDs|
|availability_zones|__REQUIRED__|Availability Zone IDs|
|zone_id|__REQUIRED__|Route53 dns zone ID|

# Outputs

|Name|Description|
|------|------|
|id|EFS id|
|host|Assigned DNS-record for the EFS|
|mount_target_ids|List of IDs of the EFS mount targets (one per Availability Zone)|
|mount_target_ips|List of IPs of the EFS mount targets (one per Availability|
