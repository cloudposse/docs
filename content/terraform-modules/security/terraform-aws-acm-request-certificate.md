---
title: terraform-aws-acm-request-certificate
description: >-
  Terraform module to request an ACM certificate for a domain and add a CNAME
  record to the DNZ zone to complete certificate validation.
---

# Terraform AWS ACM Request Certificate

|                  |                                                                                                                                                                                        |
|:-----------------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| GitHub Repo      | <https://github.com/cloudposse/terraform-aws-acm-request-certificate>                                                                                                                  |
| Terraform Module | terraform-aws-acm-request-certificate                                                                                                                                                  |
| Release          | [![Release](https://img.shields.io/github/release/cloudposse/terraform-aws-acm-request-certificate.svg)](https://github.com/cloudposse/terraform-aws-acm-request-certificate/releases) |
| Build Status     | [![Build Status](https://travis-ci.org/cloudposse/terraform-aws-acm-request-certificate.svg?branch=master)](https://travis-ci.org/cloudposse/terraform-aws-acm-request-certificate)    |

# Usage

This example will request an SSL certificate for `example.com` domain

## HCL

```hcl
module "acm_request_certificate" {
  source                           = "git::https://github.com/cloudposse/terraform-aws-acm-request-certificate.git?ref=master"
  domain_name                      = "example.com"
  proces_domain_validation_options = "true"
  ttl                              = "300"
}
```

This example will request an SSL certificate for `example.com` domain and all its subdomains `*.example.com`

## HCL

```hcl
module "acm_request_certificate" {
  source                           = "git::https://github.com/cloudposse/terraform-aws-acm-request-certificate.git?ref=master"
  domain_name                      = "example.com"
  proces_domain_validation_options = "true"
  ttl                              = "300"
  subject_alternative_names        = ["*.example.com"]
}
```

# Variables

| Name                              | Default | Description                                                                                               | Required |
|:----------------------------------|:--------|:----------------------------------------------------------------------------------------------------------|:---------|
| `domain_name'                     | ``      | A domain name for which the certificate should be issued                                                  | Yes      |
| `validation_method                | DNS     | Which method to use for validation, DNS or EMAIL                                                          | No       |
| `proces_domain_validation_options | true    | Flag to enable/disable processing of the record to add to the DNS zone to complete certificate validation | No       |
| `ttl                              | 300     | The TTL of the record to add to the DNS zone to complete certificate validation                           | No       |
| `tags                             | {}      | Additional tags (e.g. map("BusinessUnit","XYZ")                                                           | No       |
| `subject_alternative_names        | []      | A list of domains that should be SANs in the issued certificate                                           | No       |

# Outputs

| Name                        | Description                                                                     |
|:----------------------------|:--------------------------------------------------------------------------------|
| `id`                        | The ARN of the certificate                                                      |
| `arn`                       | The ARN of the certificate                                                      |
| `domain_validation_options` | CNAME records that are added to the DNS zone to complete certificate validation |
