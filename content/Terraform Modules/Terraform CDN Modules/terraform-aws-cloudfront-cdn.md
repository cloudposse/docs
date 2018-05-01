---
title: "terraform-aws-cloudfront-cdn"
excerpt: "Terraform Module that implements a CloudFront Distribution (CDN) for a custom origin (e.g. website) and [ships logs to a bucket](https://github.com/cloudposse/terraform-aws-log-storage)."
---
# Terraform AWS CloudFront CDN
[block:parameters]
{
  "data": {
    "0-0": "GitHub Repo",
    "1-0": "Terraform Module",
    "2-0": "Release",
    "3-0": "Build Status",
    "0-1": "https://github.com/cloudposse/terraform-aws-cloudfront-cdn",
    "1-1": "terraform-aws-cloudfront-cdn",
    "2-1": "[![Release](https://img.shields.io/github/release/cloudposse/terraform-aws-cloudfront-cdn.svg)](https://github.com/cloudposse/terraform-aws-cloudfront-cdn/release)",
    "3-1": "[![Build Status](https://travis-ci.org/cloudposse/terraform-aws-cloudfront-cdn.svg?branch=master)](https://travis-ci.org/cloudposse/terraform-aws-cloudfront-cdn)"
  },
  "cols": 2,
  "rows": 4
}
[/block]

If you need to accelerate an S3 bucket, we suggest using [`terraform-aws-cloudfront-s3-cdn`](https://github.com/cloudposse/terraform-aws-cloudfront-s3-cdn) instead.


# Usage

Include this module in your existing terraform code.
[block:code]
{
  "codes": [
    {
      "code": "module \"cdn\" {\n  source             = \"git::https://github.com/cloudposse/terraform-aws-cloudfront-cdn.git?ref=master\"\n  namespace          = \"cp\"\n  stage              = \"prod\"\n  name               = \"app\"\n  aliases            = [\"cloudposse.com\", \"www.cloudposse.com\"]\n  parent_zone_name   = \"cloudposse.com\"\n  origin_domain_name = \"origin.cloudposse.com\"\n}",
      "language": "json",
      "name": "HCL"
    }
  ]
}
[/block]

# Example 2

Here's an example of creating an S3 "website" bucket that supports CORS and frontented by a CDN.


[block:code]
{
  "codes": [
    {
      "code": "# S3 origin capable of serving static website content\nmodule \"origin\" {\n  source     = \"git::https://github.com/cloudposse/terraform-aws-s3-website.git?ref=tags/0.5.1\"\n  namespace  = \"cp\"\n  stage      = \"prod\"\n  name       = \"assets\"\n  attributes = [\"cdn.cloudposse.com\"]\n\n  hostname             = \"origin.cdn.cloudposse.com\"\n  parent_zone_name     = \"cloudposse.com\"\n  cors_allowed_headers = [\"*\"]\n  cors_allowed_methods = [\"GET\"]\n  cors_allowed_origins = [\"*\"]\n  cors_max_age_seconds = \"3600\"\n  cors_expose_headers  = [\"ETag\"]\n}\n\n# CloudFront CDN fronting origin \nmodule \"cdn\" {\n  source     = \"git::https://github.com/cloudposse/terraform-aws-cloudfront-cdn.git?ref=tags/0.4.0\"\n  namespace  = \"cp\"\n  stage      = \"prod\"\n  name       = \"assets\"\n  attributes = [\"cdn.cloudposse.com\"]\n\n  aliases                = [\"cdn.cloudposse.com\"]\n  origin_domain_name     = \"origin.cdn.cloudposse.com\"\n  origin_protocol_policy = \"http-only\"\n  parent_zone_name       = \"cloudposse.com\"\n  #acm_certificate_arn    = \"...\"\n  forward_cookies        = \"none\"\n  forward_headers        = [\"Origin\", \"Access-Control-Request-Headers\", \"Access-Control-Request-Method\"]\n  default_ttl            = 60\n  min_ttl                = 0\n  max_ttl                = 86400\n  compress               = \"${var.compress}\"\n  cached_methods         = [\"GET\", \"HEAD\"]\n  allowed_methods        = [\"GET\", \"HEAD\", \"OPTIONS\"]\n  price_class            = \"PriceClass_All\"\n}",
      "language": "json"
    }
  ]
}
[/block]

[block:callout]
{
  "type": "info",
  "title": "NOTE",
  "body": "Pass the `deployment_arns` parameter to the `terraform-aws-s3-website` module to enable a  [CI/CD](doc:terraform-aws-iam-system-user) user to upload assets to the bucket."
}
[/block]

# More Examples

A complete example of setting up CloudFront Distribution with Cache Behaviors for a WordPress site: [`examples/wordpress`](examples/wordpress/main.tf)


# Generating ACM Certificate

There are two options:

1. Use our [terraform-aws-acm-request-certificate](doc:terraform-aws-acm-request-certificate) module to generate certificates.

2. Use the AWS cli to [request new ACM certifiates](http://docs.aws.amazon.com/acm/latest/userguide/gs-acm-request.html) (requires email validation)

```
aws acm request-certificate \
     --domain-name example.com \
     --subject-alternative-names a.example.com b.example.com *.c.example.com
```


# Variables 
[block:parameters]
{
  "data": {
    "h-0": "Name",
    "h-1": "Default",
    "h-2": "Description",
    "h-3": "Required",
    "0-0": "`namespace`",
    "0-1": "``",
    "1-1": "``",
    "2-1": "``",
    "5-1": "``",
    "1-0": "`stage`",
    "2-0": "`name`",
    "3-0": "`attributes`",
    "4-0": "`tags`",
    "5-0": "`acm_certificate_arn`",
    "6-0": "`aliases`",
    "7-0": "`custom_error_response`",
    "8-0": "`allowed_methods`",
    "9-0": "`cached_methods`",
    "10-0": "`cache_behavior`",
    "11-0": "`comment`",
    "12-0": "`compress`",
    "13-0": "`default_root_object`",
    "14-0": "`enabled`",
    "15-0": "`forward_cookies`",
    "15-1": "`none`",
    "14-1": "`true`",
    "13-1": "`index.html`",
    "12-1": "`false`",
    "11-1": "`Managed by Terraform`",
    "10-1": "`[]`",
    "9-1": "`[\"GET\", \"HEAD\"]`",
    "8-1": "`[\"*\"]`",
    "7-1": "`[]`",
    "6-1": "`[]`",
    "3-1": "`[]`",
    "4-1": "`{}`",
    "0-2": "Namespace (e.g. `cp` or `cloudposse`)",
    "1-2": "Stage (e.g. `prod`, `dev`, `staging`)",
    "2-2": "Name  (e.g. `bastion` or `db`)",
    "3-2": "Additional attributes (e.g. `policy` or `role`)",
    "3-3": "No",
    "0-3": "Yes",
    "1-3": "Yes",
    "2-3": "Yes",
    "6-3": "Yes",
    "4-3": "No",
    "5-3": "No",
    "4-2": "Additional tags  (e.g. `map(\"BusinessUnit\",\"XYZ\")`",
    "5-2": "Existing ACM Certificate ARN",
    "6-2": "List of aliases. CAUTION! Names MUSTN'T contain trailing `.`",
    "7-2": "List of one or more custom error response element maps",
    "8-2": "List of allowed methods (e.g. ` GET, PUT, POST, DELETE, HEAD`) for AWS CloudFront",
    "9-2": "List of cached methods (e.g. ` GET, PUT, POST, DELETE, HEAD`)",
    "10-2": "List of cache behaviors to implement",
    "7-3": "No",
    "8-3": "No",
    "9-3": "No",
    "10-3": "No",
    "11-3": "No",
    "12-3": "No",
    "13-3": "No",
    "14-3": "No",
    "15-3": "No",
    "16-3": "No",
    "17-3": "No",
    "18-3": "No",
    "19-3": "No",
    "20-3": "No",
    "21-3": "No",
    "22-3": "No",
    "23-3": "No",
    "24-3": "No",
    "25-3": "No",
    "11-2": "Comment for the origin access identity",
    "12-2": "Compress content for web requests that include Accept-Encoding: gzip in the request header",
    "13-2": "Object that CloudFront return when requests the root URL",
    "14-2": "State of CloudFront",
    "15-2": "Forward cookies to the origin that is associated with this cache behavior",
    "16-2": "List of forwarded cookies",
    "17-2": "Specify headers that you want CloudFront to vary upon for this cache behavior. Specify `*` to include all headers.",
    "18-2": "Forward query strings to the origin that is associated with this cache behavior",
    "19-2": "List of country codes for which  CloudFront either to distribute content (whitelist) or not distribute your content (blacklist)",
    "20-2": "Method that use to restrict distribution of your content by country: `none`, `whitelist`, or `blacklist`",
    "21-2": "State of CloudFront IPv6",
    "22-2": "Number of days to persist in the standard storage tier before moving to the glacier tier",
    "23-2": "Number of days to persist in the standard storage tier before moving to the infrequent access",
    "24-2": "Number of days after which to expunge the objects",
    "25-2": "Include cookies in access logs",
    "25-1": "`false`",
    "25-0": "`log_include_cookies`",
    "24-0": "`log_expiration_days`",
    "23-0": "`log_glacier_transition_days`",
    "23-1": "`60`",
    "24-1": "`90`",
    "22-1": "`30`",
    "21-1": "`true`",
    "20-1": "`none`",
    "16-1": "`[]`",
    "17-1": "`[]`",
    "19-1": "`[]`",
    "18-1": "`false`",
    "22-0": "`log_standard_transition_days",
    "21-0": "`is_ipv6_enabled`",
    "20-0": "`geo_restriction_type`",
    "19-0": "`geo_restriction_locations`",
    "18-0": "`forward_query_string`",
    "17-0": "`forward_headers`",
    "16-0": "`forward_cookies_whitelisted_names`",
    "26-2": "Path of logs in S3 bucket",
    "27-2": "Minimum amount of time that you want objects to stay in CloudFront caches",
    "28-2": "Default amount of time (in seconds) that an object is in a CloudFront cache",
    "29-2": "Maximum amount of time (in seconds) that an object is in a CloudFront cache",
    "30-2": "Price class for this distribution: `PriceClass_All`, `PriceClass_200`, `PriceClass_100`",
    "31-2": "Element to specify the protocol: `allow-all`, `https-only`, `redirect-to-https`",
    "32-2": "Element that causes CloudFront to request your content from a directory in your Amazon S3 bucket",
    "33-2": "The DNS domain name of your custom origin (e.g. website)",
    "34-2": "The HTTP port the custom origin listens on",
    "35-2": "The HTTPS port the custom origin listens on",
    "36-2": "The Custom KeepAlive timeout, in seconds. By default, AWS enforces a limit of 60. But you can request an increase",
    "37-2": "The origin protocol policy to apply to your origin. One of `http-only`, `https-only`, or `match-viewer`",
    "38-2": "The Custom Read timeout, in seconds. By default, AWS enforces a limit of 60. But you can request an increase",
    "39-2": "The SSL/TLS protocols that you want CloudFront to use when communicating with your origin over HTTPS",
    "40-2": "ID of the hosted zone to contain this record  (or specify `parent_zone_name`)",
    "41-2": "Name of the hosted zone to contain this record (or specify `parent_zone_id`)",
    "41-3": "Yes",
    "40-3": "Yes",
    "39-3": "No",
    "38-3": "No",
    "37-3": "No",
    "36-3": "No",
    "35-3": "No",
    "34-3": "No",
    "33-3": "Yes",
    "32-3": "No",
    "31-3": "No",
    "30-3": "No",
    "29-3": "No",
    "28-3": "No",
    "27-3": "No",
    "26-3": "No",
    "42-1": "",
    "41-1": "``",
    "40-1": "``",
    "39-1": "`[\"TLSv1\", \"TLSv1.1\", \"TLSv1.2\"]`",
    "38-1": "`60`",
    "37-1": "`match-viewer`",
    "36-1": "`60`",
    "35-1": "`443`",
    "35-0": "`origin_https_port`",
    "36-0": "`origin_keepalive_timeout`",
    "37-0": "`origin_protocol_policy`",
    "38-0": "`origin_read_timeout`",
    "39-0": "`origin_ssl_protocols`",
    "40-0": "`parent_zone_id`",
    "41-0": "`parent_zone_name`",
    "34-1": "`80`",
    "33-1": "``",
    "32-1": "``",
    "31-1": "`redirect-to-https`",
    "30-1": "`PriceClass_100`",
    "29-1": "`31536000`",
    "28-1": "`60`",
    "27-1": "`0`",
    "34-0": "`origin_http_port`",
    "33-0": "`origin_domain_name`",
    "32-0": "`origin_path`",
    "31-0": "`viewer_protocol_policy`",
    "30-0": "`price_class`",
    "29-0": "`max_ttl`",
    "28-0": "`default_ttl`",
    "27-0": "`min_ttl`",
    "26-0": "`log_prefix`",
    "26-1": "``"
  },
  "cols": 4,
  "rows": 42
}
[/block]
## Outputs
[block:parameters]
{
  "data": {
    "h-0": "Name",
    "h-1": "Description",
    "0-0": "`cf_arn`",
    "1-0": "`cf_domain_name`",
    "2-0": "`cf_etag`",
    "3-0": "`cf_hosted_zone_id`",
    "4-0": "`cf_id`",
    "6-1": "Extra CNAMEs of AWS CloudFront",
    "5-0": "`cf_status`",
    "6-0": "`cf_aliases`",
    "0-1": "ID of AWS CloudFront distribution",
    "7-0": "`cf_origin_access_identity`",
    "7-1": "A shortcut to the full path for the origin access identity to use in CloudFront",
    "5-1": "Current status of the distribution",
    "4-1": "ID of AWS CloudFront distribution",
    "3-1": "CloudFront Route 53 zone ID",
    "2-1": "Current version of the distribution's information",
    "1-1": "Domain name corresponding to the distribution"
  },
  "cols": 2,
  "rows": 8
}
[/block]