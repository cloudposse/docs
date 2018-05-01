---
title: "terraform-aws-cloudfront-s3-cdn"
excerpt: "Terraform module to easily provision an AWS CloudFront CDN with an S3 or custom origin."
---
# Terraform AWS CloudFront S3 CDN
[block:parameters]
{
  "data": {
    "0-0": "GitHub Repo",
    "1-0": "Terraform Module",
    "2-0": "Release",
    "3-0": "Build Status",
    "0-1": "https://github.com/cloudposse/terraform-aws-cloudfront-s3-cdn",
    "1-1": "terraform-aws-cloudfront-s3-cdn",
    "2-1": "[![Release](https://img.shields.io/github/release/cloudposse/terraform-aws-cloudfront-s3-cdn.svg)](https://github.com/cloudposse/terraform-aws-cloudfront-s3-cdn/release)",
    "3-1": "[![Build Status](https://travis-ci.org/cloudposse/terraform-aws-cloudfront-s3-cdn.svg?branch=master)](https://travis-ci.org/cloudposse/terraform-aws-cloudfront-s3-cdn)"
  },
  "cols": 2,
  "rows": 4
}
[/block]

# Usage

Include this module in your existing terraform code.
[block:code]
{
  "codes": [
    {
      "code": "module \"cdn\" {\n  source                           = \"git::https://github.com/cloudposse/terraform-aws-cloudfront-s3-cdn.git?ref=master\"\n  domain_name                      = \"example.com\"\n  proces_domain_validation_options = \"true\"\n  ttl                              = \"300\"\n}",
      "language": "json",
      "name": "HCL"
    }
  ]
}
[/block]
# Generating ACM Certificate

Use the AWS cli to [request new ACM certifiates](http://docs.aws.amazon.com/acm/latest/userguide/gs-acm-request.html) (requires email validation)
```
aws acm request-certificate --domain-name example.com --subject-alternative-names a.example.com b.example.com *.c.example.com
```
[block:callout]
{
  "type": "info",
  "title": "NOTE",
  "body": "Although AWS Certificate Manager is supported in many AWS regions, to use an SSL certificate with CloudFront, it should be requested only in US East (N. Virginia) region.\n\nhttps://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cnames-and-https-requirements.html\n> If you want to require HTTPS between viewers and CloudFront, you must change the AWS region to US East (N. Virginia) in the AWS Certificate Manager console before you request or import a certificate.\n\nhttps://docs.aws.amazon.com/acm/latest/userguide/acm-regions.html\n> To use an ACM Certificate with Amazon CloudFront, you must request or import the certificate in the US East (N. Virginia) region. ACM Certificates in this region that are associated with a CloudFront distribution are distributed to all the geographic locations configured for that distribution.\n\nThis is a fundamental requirement of CloudFront, and you will need to request the certificate in `us-east-1` region."
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
    "0-3": "Yes",
    "1-3": "Yes",
    "2-3": "Yes",
    "3-3": "No",
    "4-3": "No",
    "5-3": "No",
    "6-3": "Yes",
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
    "26-3": "No",
    "27-3": "No",
    "28-3": "No",
    "29-3": "No",
    "30-3": "No",
    "31-3": "No",
    "32-3": "No",
    "33-3": "No",
    "34-3": "No",
    "35-3": "No",
    "36-3": "No",
    "37-3": "No",
    "38-3": "No",
    "39-3": "Yes",
    "40-3": "Yes",
    "0-0": "`namespace`",
    "1-0": "`stage`",
    "2-0": "`name`",
    "3-0": "`attributes`",
    "4-0": "`tags`",
    "5-0": "`acm_certificate_arn`",
    "6-0": "`aliases`",
    "7-0": "`allowed_methods`",
    "8-0": "`cached_methods`",
    "9-0": "`comment`",
    "10-0": "`compress`",
    "11-0": "`cors_allowed_headers`",
    "12-0": "`cors_allowed_methods`",
    "13-0": "`cors_allowed_origins`",
    "14-0": "`cors_max_age_seconds`",
    "15-0": "`cors_expose_headers`",
    "16-0": "`bucket_domain_format`",
    "17-0": "`default_root_object`",
    "18-0": "`enabled`",
    "19-0": "`forward_cookies`",
    "20-0": "`forward_query_string`",
    "21-0": "`geo_restriction_locations`",
    "22-0": "`geo_restriction_type`",
    "23-0": "`is_ipv6_enabled`",
    "24-0": "`log_standard_transition_days`",
    "25-0": "`log_glacier_transition_days`",
    "26-0": "`log_expiration_days`",
    "27-0": "`log_include_cookies`",
    "28-0": "`log_prefix`",
    "29-0": "`min_ttl`",
    "30-0": "`default_ttl`",
    "31-0": "`max_ttl`",
    "32-0": "`null`",
    "33-0": "`price_class`",
    "34-0": "`viewer_protocol_policy`",
    "35-0": "`null`",
    "36-0": "`origin_force_destroy`",
    "37-0": "`origin_bucket`",
    "38-0": "`origin_path`",
    "39-0": "`parent_zone_id`",
    "40-0": "`parent_zone_name`",
    "40-1": "``",
    "39-1": "``",
    "38-1": "``",
    "37-1": "``",
    "36-1": "``",
    "35-1": "``",
    "34-1": "`redirect-to-https`",
    "33-1": "`PriceClass_100`",
    "31-1": "`31536000`",
    "30-1": "`60`",
    "29-1": "`0`",
    "28-1": "``",
    "32-1": "``",
    "27-1": "`false`",
    "26-1": "`90`",
    "25-1": "`60`",
    "24-1": "`30`",
    "23-1": "`true`",
    "22-1": "`none`",
    "21-1": "`[]`",
    "20-1": "`false`",
    "19-1": "`none`",
    "18-1": "`true`",
    "17-1": "`index.html`",
    "16-1": "`%s.s3.amazonaws.com`",
    "15-1": "`[\"ETag\"]`",
    "14-1": "`3600`",
    "13-1": "`[\"*\"]`",
    "12-1": "`[\"GET\"]`",
    "11-1": "`[\"*\"]`",
    "10-1": "`false`",
    "9-1": "`Managed by Terraform`",
    "8-1": "`[\"GET\", \"HEAD\"]`",
    "7-1": "`[\"*\"]`",
    "6-1": "`[]`",
    "5-1": "``",
    "0-1": "``",
    "1-1": "``",
    "2-1": "``",
    "4-1": "`{}`",
    "3-1": "`[]`",
    "0-2": "Namespace (e.g. `cp` or `cloudposse`)",
    "1-2": "Stage (e.g. `prod`, `dev`, `staging`)",
    "2-2": "Name  (e.g. `bastion` or `db`)",
    "3-2": "Additional attributes (e.g. `policy` or `role`)",
    "4-2": "Additional tags  (e.g. `map(\"BusinessUnit\",\"XYZ\")`",
    "5-2": "Existing ACM Certificate ARN",
    "6-2": "List of aliases as a FQDN (e.g. `[\"www.example.com\"]`)",
    "7-2": "List of allowed methods (e.g. ` GET, PUT, POST, DELETE, HEAD`) for AWS CloudFront",
    "8-2": "List of cached methods (e.g. ` GET, PUT, POST, DELETE, HEAD`)",
    "9-2": "Comment for the origin access identity",
    "10-2": "Compress content for web requests that include Accept-Encoding: gzip in the request header",
    "11-2": "List of allowed headers  for S3 bucket",
    "12-2": "List of allowed methods (e.g. ` GET, PUT, POST, DELETE, HEAD`) for S3 bucket",
    "13-2": "List of allowed origins (e.g. ` example.com, test.com`) for S3 bucket",
    "14-2": "Time in seconds that browser can cache the response for S3 bucket",
    "15-2": "List of expose header in the response for S3 bucket",
    "16-2": "Format of bucket domain name",
    "17-2": "Object that CloudFront return when requests the root URL",
    "18-2": "State of CloudFront",
    "19-2": "Forward cookies to the origin that is associated with this cache behavior",
    "20-2": "Forward query strings to the origin that is associated with this cache behavior",
    "21-2": "List of country codes for which  CloudFront either to distribute content (whitelist) or not distribute your content (blacklist)",
    "22-2": "Method that use to restrict distribution of your content by country: `none`, `whitelist`, or `blacklist`",
    "23-2": "State of CloudFront IPv6",
    "24-2": "Number of days to persist in the standard storage tier before moving to the glacier tier",
    "25-2": "Number of days to persist in the standard storage tier before moving to the infrequent access",
    "26-2": "Number of days after which to expunge the objects",
    "27-2": "Include cookies in access logs",
    "28-2": "Path of logs in S3 bucket",
    "29-2": "Minimum amount of time that you want objects to stay in CloudFront caches",
    "30-2": "Default amount of time (in seconds) that an object is in a CloudFront cache",
    "31-2": "Maximum amount of time (in seconds) that an object is in a CloudFront cache",
    "32-2": "Empty string",
    "33-2": "Price class for this distribution: `PriceClass_All`, `PriceClass_200`, `PriceClass_100`",
    "34-2": "Element to specify the protocol: `allow-all`, `https-only`, `redirect-to-https`",
    "35-2": "Empty string",
    "36-2": "Delete all objects from the bucket  so that the bucket can be destroyed without error (e.g. `true` or `false`)",
    "37-2": "Name of S3 bucket",
    "38-2": "Element that causes CloudFront to request your content from a directory in your Amazon S3 bucket. Begins with `/`. CAUTION! Do not use bare `/` as `origin_path`.",
    "39-2": "ID of the hosted zone to contain this record  (or specify `parent_zone_name`)",
    "40-2": "Name of the hosted zone to contain this record (or specify `parent_zone_id`)"
  },
  "cols": 4,
  "rows": 41
}
[/block]
# Outputs
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
    "5-0": "`cf_status`",
    "6-0": "`s3_bucket`",
    "7-0": "`s3_bucket_domain_name`",
    "7-1": "Domain of S3 bucket",
    "6-1": "Name of S3 bucket",
    "5-1": "Current status of the distribution",
    "4-1": "ID of AWS CloudFront distribution",
    "3-1": "CloudFront Route 53 zone ID",
    "2-1": "Current version of the distribution's information",
    "1-1": "Domain name corresponding to the distribution",
    "0-1": "ID of AWS CloudFront distribution"
  },
  "cols": 2,
  "rows": 8
}
[/block]