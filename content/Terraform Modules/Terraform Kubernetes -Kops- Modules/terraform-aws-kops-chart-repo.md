---
title: "terraform-aws-kops-chart-repo"
excerpt: "Terraform module to provision an S3 bucket for [Helm](https://helm.sh/) chart repository, and an IAM role and policy with permissions for k8s nodes to access the bucket."
---
# Terraform AWS Kops Chart Repo 

[block:parameters]
{
  "data": {
    "0-0": "GitHub Repo",
    "1-0": "Terraform Module",
    "2-0": "Release",
    "3-0": "Build Status",
    "0-1": "https://github.com/cloudposse/terraform-aws-kops-chart-repo",
    "1-1": "terraform-aws-kops-chart-repo",
    "2-1": "[![Release](https://img.shields.io/github/release/cloudposse/terraform-aws-kops-chart-repo.svg)](https://github.com/cloudposse/terraform-aws-kops-chart-repo/releases)",
    "3-1": "[![Build Status](https://travis-ci.org/cloudposse/terraform-aws-kops-chart-repo.svg?branch=master)](https://travis-ci.org/cloudposse/terraform-aws-kops-chart-repo)"
  },
  "cols": 2,
  "rows": 4
}
[/block]

The module uses [terraform-aws-kops-metadata](https://github.com/cloudposse/terraform-aws-kops-metadata) to lookup resources within a Kops cluster for easier integration with Terraform.


# Usage
[block:code]
{
  "codes": [
    {
      "code": "module \"kops_chart_repo\" {\n  source       = \"git::https://github.com/cloudposse/terraform-aws-kops-chart-repo.git?ref=master\"\n  namespace    = \"cp\"\n  stage        = \"prod\"\n  name         = \"domain.com\"\n  nodes_name   = \"nodes\"\n\n  tags = {\n    Cluster = \"k8s.domain.com\"\n  }\n}",
      "language": "json",
      "name": "HCL"
    }
  ]
}
[/block]
# Variables
[block:parameters]
{
  "data": {
    "h-0": "Name",
    "h-1": "Default",
    "h-2": "Description",
    "h-3": "Required",
    "0-2": "Namespace (_e.g._ `cp` or `cloudposse`)",
    "1-2": "Stage (_e.g._ `prod`, `dev`, `staging`)",
    "2-2": "Name of the Kops DNS zone (_e.g._ `domain.com`)",
    "3-2": "Additional attributes (_e.g._ `policy` or `role`)",
    "4-2": "Additional tags  (_e.g._ `map(\"BusinessUnit\",\"XYZ\")`",
    "5-2": "Delimiter to be used between `namespace`, `stage`, `name`, and `attributes`",
    "6-2": "k8s nodes subdomain name in the Kops DNS zone",
    "6-1": "`nodes`",
    "6-0": "`nodes_name`",
    "5-1": "`-`",
    "4-1": "`{}`",
    "3-1": "`[]`",
    "2-1": "``",
    "1-1": "``",
    "0-1": "``",
    "5-0": "`delimiter`",
    "4-0": "`tags`",
    "3-0": "`attributes`",
    "2-0": "`name`",
    "1-0": "`stage`",
    "0-0": "`namespace`",
    "0-3": "Yes",
    "1-3": "Yes",
    "2-3": "Yes",
    "3-3": "No",
    "4-3": "No",
    "5-3": "No",
    "6-3": "No"
  },
  "cols": 4,
  "rows": 7
}
[/block]
# Outputs
[block:parameters]
{
  "data": {
    "h-0": "Name",
    "h-1": "Description",
    "0-0": "`bucket_domain_name`",
    "1-0": "`bucket_id`",
    "2-0": "`bucket_arn`",
    "3-0": "`role_name`",
    "4-0": "`role_unique_id`",
    "5-0": "`role_arn`",
    "6-0": "`policy_name`",
    "7-0": "`policy_id`",
    "8-0": "`policy_arn`",
    "8-1": "IAM policy ARN",
    "7-1": "IAM policy ID",
    "6-1": "IAM policy name",
    "5-1": "IAM role ARN",
    "4-1": "IAM role unique ID",
    "3-1": "IAM role name",
    "2-1": "S3 bucket ARN",
    "1-1": "S3 bucket ID",
    "0-1": "S3 bucket domain name"
  },
  "cols": 2,
  "rows": 9
}
[/block]