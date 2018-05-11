---
title: "terraform-aws-cloudfront-s3-cdn"
description: "Terraform module to easily provision an AWS CloudFront CDN with an S3 or custom origin."
---
# Terraform AWS CloudFront S3 CDN

|                  |                                                                                                                                                                            |
|:-----------------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| GitHub Repo      | https://github.com/cloudposse/terraform-aws-cloudfront-s3-cdn                                                                                                              |
| Terraform Module | terraform-aws-cloudfront-s3-cdn                                                                                                                                            |
| Release          | [![Release](https://img.shields.io/github/release/cloudposse/terraform-aws-cloudfront-s3-cdn.svg)](https://github.com/cloudposse/terraform-aws-cloudfront-s3-cdn/releases) |
| Build Status     | [![Build Status](https://travis-ci.org/cloudposse/terraform-aws-cloudfront-s3-cdn.svg?branch=master)](https://travis-ci.org/cloudposse/terraform-aws-cloudfront-s3-cdn)    |


# Usage

Include this module in your existing terraform code.

##### HCL
```hcl
module "cdn" {
  source                           = "git::https://github.com/cloudposse/terraform-aws-cloudfront-s3-cdn.git?ref=master"
  domain_name                      = "example.com"
  proces_domain_validation_options = "true"
  ttl                              = "300"
}
```

# Generating ACM Certificate

Use the AWS cli to [request new ACM certifiates](http://docs.aws.amazon.com/acm/latest/userguide/gs-acm-request.html) (requires email validation)
```
aws acm request-certificate --domain-name example.com --subject-alternative-names a.example.com b.example.com *.c.example.com
```

{{% dialog type="info" icon="fa fa-info-circle" title="Note" %}}
* Although AWS Certificate Manager is supported in many AWS regions, to use an SSL certificate with CloudFront, it should be requested only in US East (N. Virginia) region.
<https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cnames-and-https-requirements.html>

* If you want to require HTTPS between viewers and CloudFront, you must change the AWS region to US East (N. Virginia) in the AWS Certificate Manager console before you request or import a certificate.
<https://docs.aws.amazon.com/acm/latest/userguide/acm-regions.html>

* To use an ACM Certificate with Amazon CloudFront, you must request or import the certificate in the US East (N. Virginia) region. ACM Certificates in this region that are associated with a CloudFront distribution are distributed to all the geographic locations configured for that distribution. This is a fundamental requirement of CloudFront, and you will need to request the certificate in `us-east-1` region.
{{% /dialog %}}

# Variables

| Name                           | Default                | Description                                                                                                                                                       | Required |
|:-------------------------------|:-----------------------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------|:---------|
| `namespace`                    | ``                     | Namespace (e.g. `cp` or `cloudposse`)                                                                                                                             | Yes      |
| `comment`                      | `Managed by Terraform` | Comment for the origin access identity                                                                                                                            | No       |
| `compress`                     | `false`                | Compress content for web requests that include Accept-Encoding: gzip in the request header                                                                        | No       |
| `cors_allowed_headers`         | `["*"]`                | List of allowed headers  for S3 bucket                                                                                                                            | No       |
| `cors_allowed_methods`         | `["GET"]`              | List of allowed methods (e.g. ` GET, PUT, POST, DELETE, HEAD`) for S3 bucket                                                                                      | No       |
| `cors_allowed_origins`         | `["*"]`                | List of allowed origins (e.g. ` example.com, test.com`) for S3 bucket                                                                                             | No       |
| `cors_max_age_seconds`         | `3600`                 | Time in seconds that browser can cache the response for S3 bucket                                                                                                 | No       |
| `cors_expose_headers`          | `["ETag"]`             | List of expose header in the response for S3 bucket                                                                                                               | No       |
| `bucket_domain_format`         | `%s.s3.amazonaws.com`  | Format of bucket domain name                                                                                                                                      | No       |
| `default_root_object`          | `index.html`           | Object that CloudFront return when requests the root URL                                                                                                          | No       |
| `enabled`                      | `true`                 | State of CloudFront                                                                                                                                               | No       |
| `stage`                        | ``                     | Stage (e.g. `prod`, `dev`, `staging`)                                                                                                                             | Yes      |
| `forward_cookies`              | `none`                 | Forward cookies to the origin that is associated with this cache behavior                                                                                         | No       |
| `forward_query_string`         | `false`                | Forward query strings to the origin that is associated with this cache behavior                                                                                   | No       |
| `geo_restriction_locations`    | `[]`                   | List of country codes for which  CloudFront either to distribute content (whitelist) or not distribute your content (blacklist)                                   | No       |
| `geo_restriction_type`         | `none`                 | Method that use to restrict distribution of your content by country: `none`, `whitelist`, or `blacklist`                                                          | No       |
| `is_ipv6_enabled`              | `true`                 | State of CloudFront IPv6                                                                                                                                          | No       |
| `log_standard_transition_days` | `30`                   | Number of days to persist in the standard storage tier before moving to the glacier tier                                                                          | No       |
| `log_glacier_transition_days`  | `60`                   | Number of days to persist in the standard storage tier before moving to the infrequent access                                                                     | No       |
| `log_expiration_days`          | `90`                   | Number of days after which to expunge the objects                                                                                                                 | No       |
| `log_include_cookies`          | `false`                | Include cookies in access logs                                                                                                                                    | No       |
| `log_prefix`                   | ``                     | Path of logs in S3 bucket                                                                                                                                         | No       |
| `name`                         | ``                     | Name  (e.g. `bastion` or `db`)                                                                                                                                    | Yes      |
| `min_ttl`                      | `0`                    | Minimum amount of time that you want objects to stay in CloudFront caches                                                                                         | No       |
| `default_ttl`                  | `60`                   | Default amount of time (in seconds) that an object is in a CloudFront cache                                                                                       | No       |
| `max_ttl`                      | `31536000`             | Maximum amount of time (in seconds) that an object is in a CloudFront cache                                                                                       | No       |
| `null`                         | ``                     | Empty string                                                                                                                                                      | No       |
| `price_class`                  | `PriceClass_100`       | Price class for this distribution: `PriceClass_All`, `PriceClass_200`, `PriceClass_100`                                                                           | No       |
| `viewer_protocol_policy`       | `redirect-to-https`    | Element to specify the protocol: `allow-all`, `https-only`, `redirect-to-https`                                                                                   | No       |
| `null`                         | ``                     | Empty string                                                                                                                                                      | No       |
| `origin_force_destroy`         | ``                     | Delete all objects from the bucket  so that the bucket can be destroyed without error (e.g. `true` or `false`)                                                    | No       |
| `origin_bucket`                | ``                     | Name of S3 bucket                                                                                                                                                 | No       |
| `origin_path`                  | ``                     | Element that causes CloudFront to request your content from a directory in your Amazon S3 bucket. Begins with `/`. CAUTION! Do not use bare `/` as `origin_path`. | No       |
| `attributes`                   | `[]`                   | Additional attributes (e.g. `policy` or `role`)                                                                                                                   | No       |
| `parent_zone_id`               | ``                     | ID of the hosted zone to contain this record  (or specify `parent_zone_name`)                                                                                     | Yes      |
| `parent_zone_name`             | ``                     | Name of the hosted zone to contain this record (or specify `parent_zone_id`)                                                                                      | Yes      |
| `tags`                         | `{}`                   | Additional tags  (e.g. `map("BusinessUnit","XYZ")`                                                                                                                | No       |
| `acm_certificate_arn`          | ``                     | Existing ACM Certificate ARN                                                                                                                                      | No       |
| `aliases`                      | `[]`                   | List of aliases as a FQDN (e.g. `["www.example.com"]`)                                                                                                            | Yes      |
| `allowed_methods`              | `["*"]`                | List of allowed methods (e.g. ` GET, PUT, POST, DELETE, HEAD`) for AWS CloudFront                                                                                 | No       |
| `cached_methods`               | `["GET", "HEAD"]`      | List of cached methods (e.g. ` GET, PUT, POST, DELETE, HEAD`)                                                                                                     | No       |

# Outputs

| Name                    | Description                                       |
|:------------------------|:--------------------------------------------------|
| `cf_arn`                | ID of AWS CloudFront distribution                 |
| `cf_domain_name`        | Domain name corresponding to the distribution     |
| `cf_etag`               | Current version of the distribution's information |
| `cf_hosted_zone_id`     | CloudFront Route 53 zone ID                       |
| `cf_id`                 | ID of AWS CloudFront distribution                 |
| `cf_status`             | Current status of the distribution                |
| `s3_bucket`             | Name of S3 bucket                                 |
| `s3_bucket_domain_name` | Domain of S3 bucket                               |
