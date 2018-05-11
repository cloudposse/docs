---
title: terraform-aws-cloudfront-cdn
description: >-
  Terraform Module that implements a CloudFront Distribution (CDN) for a custom
  origin (e.g. website) and [ships logs to a
  bucket](https://github.com/cloudposse/terraform-aws-log-storage).
---

# Terraform AWS CloudFront CDN

|                  |                                                                                                                                                                      |
|:-----------------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| GitHub Repo      | <https://github.com/cloudposse/terraform-aws-cloudfront-cdn>                                                                                                         |
| Terraform Module | terraform-aws-cloudfront-cdn                                                                                                                                         |
| Release          | [![Release](https://img.shields.io/github/release/cloudposse/terraform-aws-cloudfront-cdn.svg)](https://github.com/cloudposse/terraform-aws-cloudfront-cdn/releases) |
| Build Status     | [![Build Status](https://travis-ci.org/cloudposse/terraform-aws-cloudfront-cdn.svg?branch=master)](https://travis-ci.org/cloudposse/terraform-aws-cloudfront-cdn)    |

If you need to accelerate an S3 bucket, we suggest using [`terraform-aws-cloudfront-s3-cdn`](https://github.com/cloudposse/terraform-aws-cloudfront-s3-cdn) instead.

# Usage

Include this module in your existing terraform code.

## HCL

```hcl
module "cdn" {
  source             = "git::https://github.com/cloudposse/terraform-aws-cloudfront-cdn.git?ref=master"
  namespace          = "cp"
  stage              = "prod"
  name               = "app"
  aliases            = ["cloudposse.com", "www.cloudposse.com"]
  parent_zone_name   = "cloudposse.com"
  origin_domain_name = "origin.cloudposse.com"
}
```

# Example 2

Here's an example of creating an S3 "website" bucket that supports CORS and frontented by a CDN.

```hcl
# S3 origin capable of serving static website content
module "origin" {
  source     = "git::https://github.com/cloudposse/terraform-aws-s3-website.git?ref=tags/0.5.1"
  namespace  = "cp"
  stage      = "prod"
  name       = "assets"
  attributes = ["cdn.cloudposse.com"]

  hostname             = "origin.cdn.cloudposse.com"
  parent_zone_name     = "cloudposse.com"
  cors_allowed_headers = ["*"]
  cors_allowed_methods = ["GET"]
  cors_allowed_origins = ["*"]
  cors_max_age_seconds = "3600"
  cors_expose_headers  = ["ETag"]
}

# CloudFront CDN fronting origin
module "cdn" {
  source     = "git::https://github.com/cloudposse/terraform-aws-cloudfront-cdn.git?ref=tags/0.4.0"
  namespace  = "cp"
  stage      = "prod"
  name       = "assets"
  attributes = ["cdn.cloudposse.com"]

  aliases                = ["cdn.cloudposse.com"]
  origin_domain_name     = "origin.cdn.cloudposse.com"
  origin_protocol_policy = "http-only"
  parent_zone_name       = "cloudposse.com"
  #acm_certificate_arn    = "..."
  forward_cookies        = "none"
  forward_headers        = ["Origin", "Access-Control-Request-Headers", "Access-Control-Request-Method"]
  default_ttl            = 60
  min_ttl                = 0
  max_ttl                = 86400
  compress               = "${var.compress}"
  cached_methods         = ["GET", "HEAD"]
  allowed_methods        = ["GET", "HEAD", "OPTIONS"]
  price_class            = "PriceClass_All"
}
```

{{% dialog type="info" icon="fa fa-info-circle" title="Note" %}}
Pass the `deployment_arns` parameter to the `terraform-aws-s3-website` module to enable a [CI/CD]({{< relref "terraform-modules/security/terraform-aws-iam-system-user.md" >}}) user to upload assets to the bucket.
{{% /dialog %}}

# More Examples

A complete example of setting up CloudFront Distribution with Cache Behaviors for a WordPress site: [`examples/wordpress`](https://github.com/cloudposse/terraform-aws-cloudfront-cdn/blob/master/examples/wordpress/main.tf)

# Generating ACM Certificate

There are two options:

1. Use our [terraform-aws-acm-request-certificate]({{< relref "terraform-modules/security/terraform-aws-iam-system-user.md" >}}) module to generate certificates.

2. Use the AWS cli to [request new ACM certifiates](http://docs.aws.amazon.com/acm/latest/userguide/gs-acm-request.html) (requires email validation)

```
aws acm request-certificate \
     --domain-name example.com \
     --subject-alternative-names a.example.com b.example.com *.c.example.com
```

# Variables

| Name                                | Default                           | Description                                                                                                                    | Required |
|:------------------------------------|:----------------------------------|:-------------------------------------------------------------------------------------------------------------------------------|:---------|
| `namespace`                         |                                   | Namespace (e.g. `cp` or `cloudposse`)                                                                                          | Yes      |
| `cached_methods`                    | `["GET", "HEAD"]`                 | List of cached methods (e.g. `GET, PUT, POST, DELETE, HEAD`)                                                                   | No       |
| `cache_behavior`                    | `[]`                              | List of cache behaviors to implement                                                                                           | No       |
| `comment`                           | `Managed by Terraform`            | Comment for the origin access identity                                                                                         | No       |
| `compress`                          | `false`                           | Compress content for web requests that include Accept-Encoding: gzip in the request header                                     | No       |
| `default_root_object`               | `index.html`                      | Object that CloudFront return when requests the root URL                                                                       | No       |
| `enabled`                           | `true`                            | State of CloudFront                                                                                                            | No       |
| `forward_cookies`                   | `none`                            | Forward cookies to the origin that is associated with this cache behavior                                                      | No       |
| `forward_cookies_whitelisted_names` | `[]`                              | List of forwarded cookies                                                                                                      | No       |
| `forward_headers`                   | `[]`                              | Specify headers that you want CloudFront to vary upon for this cache behavior. Specify `*` to include all headers.             | No       |
| `forward_query_string`              | `false`                           | Forward query strings to the origin that is associated with this cache behavior                                                | No       |
| `stage`                             |                                   | Stage (e.g. `prod`, `dev`, `staging`)                                                                                          | Yes      |
| `geo_restriction_locations`         | `[]`                              | List of country codes for which CloudFront either to distribute content (whitelist) or not distribute your content (blacklist) | No       |
| `geo_restriction_type`              | `none`                            | Method that use to restrict distribution of your content by country: `none`, `whitelist`, or `blacklist`                       | No       |
| `is_ipv6_enabled`                   | `true`                            | State of CloudFront IPv6                                                                                                       | No       |
| `log_standard_transition_days`      | `30`                              | Number of days to persist in the standard storage tier before moving to the glacier tier                                       | No       |
| `log_glacier_transition_days`       | `60`                              | Number of days to persist in the standard storage tier before moving to the infrequent access                                  | No       |
| `log_expiration_days`               | `90`                              | Number of days after which to expunge the objects                                                                              | No       |
| `log_include_cookies`               | `false`                           | Include cookies in access logs                                                                                                 | No       |
| `log_prefix`                        |                                   | Path of logs in S3 bucket                                                                                                      | No       |
| `min_ttl`                           | `0`                               | Minimum amount of time that you want objects to stay in CloudFront caches                                                      | No       |
| `default_ttl`                       | `60`                              | Default amount of time (in seconds) that an object is in a CloudFront cache                                                    | No       |
| `name`                              |                                   | Name (e.g. `bastion` or `db`)                                                                                                  | Yes      |
| `max_ttl`                           | `31536000`                        | Maximum amount of time (in seconds) that an object is in a CloudFront cache                                                    | No       |
| `price_class`                       | `PriceClass_100`                  | Price class for this distribution: `PriceClass_All`, `PriceClass_200`, `PriceClass_100`                                        | No       |
| `viewer_protocol_policy`            | `redirect-to-https`               | Element to specify the protocol: `allow-all`, `https-only`, `redirect-to-https`                                                | No       |
| `origin_path`                       |                                   | Element that causes CloudFront to request your content from a directory in your Amazon S3 bucket                               | No       |
| `origin_domain_name`                |                                   | The DNS domain name of your custom origin (e.g. website)                                                                       | Yes      |
| `origin_http_port`                  | `80`                              | The HTTP port the custom origin listens on                                                                                     | No       |
| `origin_https_port`                 | `443`                             | The HTTPS port the custom origin listens on                                                                                    | No       |
| `origin_keepalive_timeout`          | `60`                              | The Custom KeepAlive timeout, in seconds. By default, AWS enforces a limit of 60\. But you can request an increase             | No       |
| `origin_protocol_policy`            | `match-viewer`                    | The origin protocol policy to apply to your origin. One of `http-only`, `https-only`, or `match-viewer`                        | No       |
| `origin_read_timeout`               | `60`                              | The Custom Read timeout, in seconds. By default, AWS enforces a limit of 60\. But you can request an increase                  | No       |
| `attributes`                        | `[]`                              | Additional attributes (e.g. `policy` or `role`)                                                                                | No       |
| `origin_ssl_protocols`              | `["TLSv1", "TLSv1.1", "TLSv1.2"]` | The SSL/TLS protocols that you want CloudFront to use when communicating with your origin over HTTPS                           | No       |
| `parent_zone_id`                    |                                   | ID of the hosted zone to contain this record (or specify `parent_zone_name`)                                                   | Yes      |
| `parent_zone_name`                  |                                   | Name of the hosted zone to contain this record (or specify `parent_zone_id`)                                                   | Yes      |
| `tags`                              | `{}`                              | Additional tags (e.g. `map("BusinessUnit","XYZ")`                                                                              | No       |
| `acm_certificate_arn`               |                                   | Existing ACM Certificate ARN                                                                                                   | No       |
| `aliases`                           | `[]`                              | List of aliases. CAUTION! Names MUSTN'T contain trailing `.`                                                                   | Yes      |
| `custom_error_response`             | `[]`                              | List of one or more custom error response element maps                                                                         | No       |
| `allowed_methods`                   | `["*"]`                           | List of allowed methods (e.g. `GET, PUT, POST, DELETE, HEAD`) for AWS CloudFront                                               | No       |

## Outputs

| Name                        | Description                                                                     |
|:----------------------------|:--------------------------------------------------------------------------------|
| `cf_arn`                    | ID of AWS CloudFront distribution                                               |
| `cf_domain_name`            | Domain name corresponding to the distribution                                   |
| `cf_etag`                   | Current version of the distribution's information                               |
| `cf_hosted_zone_id`         | CloudFront Route 53 zone ID                                                     |
| `cf_id`                     | ID of AWS CloudFront distribution                                               |
| `cf_status`                 | Current status of the distribution                                              |
| `cf_aliases`                | Extra CNAMEs of AWS CloudFront                                                  |
| `cf_origin_access_identity` | A shortcut to the full path for the origin access identity to use in CloudFront |
