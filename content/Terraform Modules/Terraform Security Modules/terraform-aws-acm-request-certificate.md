---
title: "terraform-aws-acm-request-certificate"
excerpt: "Terraform module to request an ACM certificate for a domain and add a CNAME record to the DNZ zone to complete certificate validation."
---
# Terraform AWS ACM Request Certificate
[block:parameters]
{
  "data": {
    "0-0": "GitHub Repo",
    "1-0": "Terraform Module",
    "2-0": "Release",
    "3-0": "Build Status",
    "0-1": "https://github.com/cloudposse/terraform-aws-acm-request-certificate",
    "1-1": "terraform-aws-acm-request-certificate",
    "2-1": "[![Release](https://img.shields.io/github/release/cloudposse/terraform-aws-acm-request-certificate.svg)](https://github.com/cloudposse/terraform-aws-acm-request-certificate/releases)",
    "3-1": "[![Build Status](https://travis-ci.org/cloudposse/terraform-aws-acm-request-certificate.svg?branch=master)](https://travis-ci.org/cloudposse/terraform-aws-acm-request-certificate)"
  },
  "cols": 2,
  "rows": 4
}
[/block]

# Usage

This example will request an SSL certificate for `example.com` domain
[block:code]
{
  "codes": [
    {
      "code": "module \"acm_request_certificate\" {\n  source                           = \"git::https://github.com/cloudposse/terraform-aws-acm-request-certificate.git?ref=master\"\n  domain_name                      = \"example.com\"\n  proces_domain_validation_options = \"true\"\n  ttl                              = \"300\"\n}",
      "language": "json",
      "name": "HCL"
    }
  ]
}
[/block]

This example will request an SSL certificate for `example.com` domain and all its subdomains `*.example.com`
[block:code]
{
  "codes": [
    {
      "code": "module \"acm_request_certificate\" {\n  source                           = \"git::https://github.com/cloudposse/terraform-aws-acm-request-certificate.git?ref=master\"\n  domain_name                      = \"example.com\"\n  proces_domain_validation_options = \"true\"\n  ttl                              = \"300\"\n  subject_alternative_names        = [\"*.example.com\"]\n}",
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
    "0-0": "`domain_name'",
    "0-1": "``",
    "0-2": "A domain name for which the certificate should be issued",
    "0-3": "Yes",
    "1-3": "No",
    "2-3": "No",
    "3-3": "No",
    "4-3": "No",
    "5-3": "No",
    "1-2": "Which method to use for validation, DNS or EMAIL",
    "2-2": "Flag to enable/disable processing of the record to add to the DNS zone to complete certificate validation",
    "3-2": "The TTL of the record to add to the DNS zone to complete certificate validation",
    "4-2": "Additional tags (e.g. map(\"BusinessUnit\",\"XYZ\")",
    "5-2": "A list of domains that should be SANs in the issued certificate",
    "1-1": "DNS",
    "2-1": "true",
    "3-1": "300",
    "4-1": "{}",
    "5-1": "[]",
    "1-0": "`validation_method",
    "2-0": "`proces_domain_validation_options",
    "3-0": "`ttl",
    "4-0": "`tags",
    "5-0": "`subject_alternative_names"
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
    "0-0": "`id`",
    "1-0": "`arn`",
    "2-0": "`domain_validation_options`",
    "0-1": "The ARN of the certificate",
    "1-1": "The ARN of the certificate",
    "2-1": "CNAME records that are added to the DNS zone to complete certificate validation"
  },
  "cols": 2,
  "rows": 3
}
[/block]