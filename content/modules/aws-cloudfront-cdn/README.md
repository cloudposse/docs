---
title: aws-cloudfront-cdn
sidebar_label: aws-cloudfront-cdn
sidebar_class_name: command
description: |-
  Terraform Module that implements a CloudFront Distribution (CDN) for a custom origin (e.g. website) and [ships logs to a bucket](https://github.com/cloudposse/terraform-aws-log-storage).

  If you need to accelerate an S3 bucket, we suggest using [`terraform-aws-cloudfront-s3-cdn`](https://github.com/cloudposse/terraform-aws-cloudfront-s3-cdn) instead.
tags:
  - aws
  - terraform
  - terraform-modules
  - cdn
  - bucket
  - cloudfront

custom_edit_url: https://github.com/cloudposse/terraform-aws-cloudfront-cdn/edit/master/README.md
---

# Component: `aws-cloudfront-cdn`
Terraform Module that implements a CloudFront Distribution (CDN) for a custom origin (e.g. website) and [ships logs to a bucket](https://github.com/cloudposse/terraform-aws-log-storage).

If you need to accelerate an S3 bucket, we suggest using [`terraform-aws-cloudfront-s3-cdn`](https://github.com/cloudposse/terraform-aws-cloudfront-s3-cdn) instead.






## Usage

For a complete example, see [examples/complete](examples/complete).

For automated tests of the complete example using [bats](https://github.com/bats-core/bats-core)
and [Terratest](https://github.com/gruntwork-io/terratest) (which tests and deploys the example on AWS), see [test](test).

```hcl
module "cdn" {
  source = "cloudposse/cloudfront-cdn/aws"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"
  namespace          = "eg"
  stage              = "prod"
  name               = "app"
  aliases            = ["www.example.net"]
  origin_domain_name = "origin.example.com"
  parent_zone_name   = "example.net"
}
```


Complete example of setting up CloudFront Distribution with Cache Behaviors for a WordPress site: [`examples/wordpress`](examples/wordpress)


### Generating ACM Certificate

Use the AWS cli to [request new ACM certifiates](http://docs.aws.amazon.com/acm/latest/userguide/gs-acm-request.html) (requires email validation)
```
aws acm request-certificate --domain-name example.com --subject-alternative-names a.example.com b.example.com *.c.example.com
```






<!-- markdownlint-disable -->
## Makefile Targets
```text
Available targets:

  help                                Help screen
  help/all                            Display help for all targets
  help/short                          This help short screen
  lint                                Lint terraform code

```
<!-- markdownlint-restore -->
<!-- markdownlint-disable -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 0.13.0 |
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | >= 4.27.0 |
| <a name="requirement_local"></a> [local](#requirement\_local) | >= 1.2 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | >= 4.27.0 |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_dns"></a> [dns](#module\_dns) | cloudposse/route53-alias/aws | 0.13.0 |
| <a name="module_logs"></a> [logs](#module\_logs) | cloudposse/s3-log-storage/aws | 0.26.0 |
| <a name="module_origin_label"></a> [origin\_label](#module\_origin\_label) | cloudposse/label/null | 0.25.0 |
| <a name="module_this"></a> [this](#module\_this) | cloudposse/label/null | 0.25.0 |

## Resources

| Name | Type |
|------|------|
| [aws_cloudfront_distribution.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudfront_distribution) | resource |
| [aws_cloudfront_origin_access_identity.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudfront_origin_access_identity) | resource |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_acm_certificate_arn"></a> [acm\_certificate\_arn](#input\_acm\_certificate\_arn) | Existing ACM Certificate ARN | `string` | `""` | no |
| <a name="input_additional_tag_map"></a> [additional\_tag\_map](#input\_additional\_tag\_map) | Additional key-value pairs to add to each map in `tags_as_list_of_maps`. Not added to `tags` or `id`.<br/>This is for some rare cases where resources want additional configuration of tags<br/>and therefore take a list of maps with tag key, value, and additional configuration. | `map(string)` | `{}` | no |
| <a name="input_aliases"></a> [aliases](#input\_aliases) | List of aliases. CAUTION! Names MUSTN'T contain trailing `.` | `list(string)` | `[]` | no |
| <a name="input_allowed_methods"></a> [allowed\_methods](#input\_allowed\_methods) | List of allowed methods (e.g. ` GET, PUT, POST, DELETE, HEAD`) for AWS CloudFront | `list(string)` | <pre>[<br/>  "DELETE",<br/>  "GET",<br/>  "HEAD",<br/>  "OPTIONS",<br/>  "PATCH",<br/>  "POST",<br/>  "PUT"<br/>]</pre> | no |
| <a name="input_attributes"></a> [attributes](#input\_attributes) | ID element. Additional attributes (e.g. `workers` or `cluster`) to add to `id`,<br/>in the order they appear in the list. New attributes are appended to the<br/>end of the list. The elements of the list are joined by the `delimiter`<br/>and treated as a single ID element. | `list(string)` | `[]` | no |
| <a name="input_cache_policy_id"></a> [cache\_policy\_id](#input\_cache\_policy\_id) | ID of the cache policy attached to the cache behavior | `string` | `null` | no |
| <a name="input_cached_methods"></a> [cached\_methods](#input\_cached\_methods) | List of cached methods (e.g. ` GET, PUT, POST, DELETE, HEAD`) | `list(string)` | <pre>[<br/>  "GET",<br/>  "HEAD"<br/>]</pre> | no |
| <a name="input_comment"></a> [comment](#input\_comment) | Comment for the origin access identity | `string` | `"Managed by Terraform"` | no |
| <a name="input_compress"></a> [compress](#input\_compress) | Whether you want CloudFront to automatically compress content for web requests that include Accept-Encoding: gzip in the request header (default: false) | `bool` | `false` | no |
| <a name="input_context"></a> [context](#input\_context) | Single object for setting entire context at once.<br/>See description of individual variables for details.<br/>Leave string and numeric variables as `null` to use default value.<br/>Individual variable settings (non-null) override settings in context object,<br/>except for attributes, tags, and additional\_tag\_map, which are merged. | `any` | <pre>{<br/>  "additional_tag_map": {},<br/>  "attributes": [],<br/>  "delimiter": null,<br/>  "descriptor_formats": {},<br/>  "enabled": true,<br/>  "environment": null,<br/>  "id_length_limit": null,<br/>  "label_key_case": null,<br/>  "label_order": [],<br/>  "label_value_case": null,<br/>  "labels_as_tags": [<br/>    "unset"<br/>  ],<br/>  "name": null,<br/>  "namespace": null,<br/>  "regex_replace_chars": null,<br/>  "stage": null,<br/>  "tags": {},<br/>  "tenant": null<br/>}</pre> | no |
| <a name="input_custom_error_response"></a> [custom\_error\_response](#input\_custom\_error\_response) | List of one or more custom error response element maps | <pre>list(object({<br/>    error_caching_min_ttl = string<br/>    error_code            = string<br/>    response_code         = string<br/>    response_page_path    = string<br/>  }))</pre> | `[]` | no |
| <a name="input_custom_header"></a> [custom\_header](#input\_custom\_header) | List of one or more custom headers passed to the origin | <pre>list(object({<br/>    name  = string<br/>    value = string<br/>  }))</pre> | `[]` | no |
| <a name="input_custom_origins"></a> [custom\_origins](#input\_custom\_origins) | One or more custom origins for this distribution (multiples allowed). See documentation for configuration options description https://www.terraform.io/docs/providers/aws/r/cloudfront_distribution.html#origin-arguments | <pre>list(object({<br/>    domain_name = string<br/>    origin_id   = string<br/>    origin_path = string<br/>    custom_headers = list(object({<br/>      name  = string<br/>      value = string<br/>    }))<br/>    custom_origin_config = object({<br/>      http_port                = number<br/>      https_port               = number<br/>      origin_protocol_policy   = string<br/>      origin_ssl_protocols     = list(string)<br/>      origin_keepalive_timeout = number<br/>      origin_read_timeout      = number<br/>    })<br/>    s3_origin_config = object({<br/>      origin_access_identity = string<br/>    })<br/>  }))</pre> | `[]` | no |
| <a name="input_default_root_object"></a> [default\_root\_object](#input\_default\_root\_object) | Object that CloudFront return when requests the root URL | `string` | `"index.html"` | no |
| <a name="input_default_ttl"></a> [default\_ttl](#input\_default\_ttl) | Default amount of time (in seconds) that an object is in a CloudFront cache | `number` | `60` | no |
| <a name="input_delimiter"></a> [delimiter](#input\_delimiter) | Delimiter to be used between ID elements.<br/>Defaults to `-` (hyphen). Set to `""` to use no delimiter at all. | `string` | `null` | no |
| <a name="input_descriptor_formats"></a> [descriptor\_formats](#input\_descriptor\_formats) | Describe additional descriptors to be output in the `descriptors` output map.<br/>Map of maps. Keys are names of descriptors. Values are maps of the form<br/>`{<br/>   format = string<br/>   labels = list(string)<br/>}`<br/>(Type is `any` so the map values can later be enhanced to provide additional options.)<br/>`format` is a Terraform format string to be passed to the `format()` function.<br/>`labels` is a list of labels, in order, to pass to `format()` function.<br/>Label values will be normalized before being passed to `format()` so they will be<br/>identical to how they appear in `id`.<br/>Default is `{}` (`descriptors` output will be empty). | `any` | `{}` | no |
| <a name="input_distribution_enabled"></a> [distribution\_enabled](#input\_distribution\_enabled) | Set to `true` if you want CloudFront to begin processing requests as soon as the distribution is created, or to false if you do not want CloudFront to begin processing requests after the distribution is created. | `bool` | `true` | no |
| <a name="input_dns_aliases_enabled"></a> [dns\_aliases\_enabled](#input\_dns\_aliases\_enabled) | Set to false to prevent dns records for aliases from being created | `bool` | `true` | no |
| <a name="input_enabled"></a> [enabled](#input\_enabled) | Set to false to prevent the module from creating any resources | `bool` | `null` | no |
| <a name="input_environment"></a> [environment](#input\_environment) | ID element. Usually used for region e.g. 'uw2', 'us-west-2', OR role 'prod', 'staging', 'dev', 'UAT' | `string` | `null` | no |
| <a name="input_forward_cookies"></a> [forward\_cookies](#input\_forward\_cookies) | Specifies whether you want CloudFront to forward cookies to the origin. Valid options are all, none or whitelist | `string` | `"none"` | no |
| <a name="input_forward_cookies_whitelisted_names"></a> [forward\_cookies\_whitelisted\_names](#input\_forward\_cookies\_whitelisted\_names) | List of forwarded cookie names | `list(string)` | `[]` | no |
| <a name="input_forward_headers"></a> [forward\_headers](#input\_forward\_headers) | Specifies the Headers, if any, that you want CloudFront to vary upon for this cache behavior. Specify `*` to include all headers. | `list(string)` | `[]` | no |
| <a name="input_forward_query_string"></a> [forward\_query\_string](#input\_forward\_query\_string) | Forward query strings to the origin that is associated with this cache behavior | `bool` | `false` | no |
| <a name="input_function_association"></a> [function\_association](#input\_function\_association) | A config block that triggers a CloudFront function with specific actions.<br/>See the [aws\_cloudfront\_distribution](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudfront_distribution#function-association)<br/>documentation for more information. | <pre>list(object({<br/>    event_type   = string<br/>    function_arn = string<br/>  }))</pre> | `[]` | no |
| <a name="input_geo_restriction_locations"></a> [geo\_restriction\_locations](#input\_geo\_restriction\_locations) | List of country codes for which CloudFront either to distribute content (whitelist) or not distribute your content (blacklist) | `list(string)` | `[]` | no |
| <a name="input_geo_restriction_type"></a> [geo\_restriction\_type](#input\_geo\_restriction\_type) | Method that use to restrict distribution of your content by country: `none`, `whitelist`, or `blacklist` | `string` | `"none"` | no |
| <a name="input_http_version"></a> [http\_version](#input\_http\_version) | The maximum HTTP version to support on the distribution. Allowed values are http1.1, http2, http2and3 and http3. | `string` | `"http2"` | no |
| <a name="input_id_length_limit"></a> [id\_length\_limit](#input\_id\_length\_limit) | Limit `id` to this many characters (minimum 6).<br/>Set to `0` for unlimited length.<br/>Set to `null` for keep the existing setting, which defaults to `0`.<br/>Does not affect `id_full`. | `number` | `null` | no |
| <a name="input_is_ipv6_enabled"></a> [is\_ipv6\_enabled](#input\_is\_ipv6\_enabled) | State of CloudFront IPv6 | `bool` | `true` | no |
| <a name="input_label_key_case"></a> [label\_key\_case](#input\_label\_key\_case) | Controls the letter case of the `tags` keys (label names) for tags generated by this module.<br/>Does not affect keys of tags passed in via the `tags` input.<br/>Possible values: `lower`, `title`, `upper`.<br/>Default value: `title`. | `string` | `null` | no |
| <a name="input_label_order"></a> [label\_order](#input\_label\_order) | The order in which the labels (ID elements) appear in the `id`.<br/>Defaults to ["namespace", "environment", "stage", "name", "attributes"].<br/>You can omit any of the 6 labels ("tenant" is the 6th), but at least one must be present. | `list(string)` | `null` | no |
| <a name="input_label_value_case"></a> [label\_value\_case](#input\_label\_value\_case) | Controls the letter case of ID elements (labels) as included in `id`,<br/>set as tag values, and output by this module individually.<br/>Does not affect values of tags passed in via the `tags` input.<br/>Possible values: `lower`, `title`, `upper` and `none` (no transformation).<br/>Set this to `title` and set `delimiter` to `""` to yield Pascal Case IDs.<br/>Default value: `lower`. | `string` | `null` | no |
| <a name="input_labels_as_tags"></a> [labels\_as\_tags](#input\_labels\_as\_tags) | Set of labels (ID elements) to include as tags in the `tags` output.<br/>Default is to include all labels.<br/>Tags with empty values will not be included in the `tags` output.<br/>Set to `[]` to suppress all generated tags.<br/>**Notes:**<br/>  The value of the `name` tag, if included, will be the `id`, not the `name`.<br/>  Unlike other `null-label` inputs, the initial setting of `labels_as_tags` cannot be<br/>  changed in later chained modules. Attempts to change it will be silently ignored. | `set(string)` | <pre>[<br/>  "default"<br/>]</pre> | no |
| <a name="input_lambda_function_association"></a> [lambda\_function\_association](#input\_lambda\_function\_association) | A config block that triggers a Lambda@Edge function with specific actions | <pre>list(object({<br/>    event_type   = string<br/>    include_body = bool<br/>    lambda_arn   = string<br/>  }))</pre> | `[]` | no |
| <a name="input_log_bucket_fqdn"></a> [log\_bucket\_fqdn](#input\_log\_bucket\_fqdn) | Optional fqdn of logging bucket, if not supplied a bucket will be generated. | `string` | `""` | no |
| <a name="input_log_expiration_days"></a> [log\_expiration\_days](#input\_log\_expiration\_days) | Number of days after which to expunge the objects | `number` | `90` | no |
| <a name="input_log_force_destroy"></a> [log\_force\_destroy](#input\_log\_force\_destroy) | Applies to log bucket created by this module only. If true, all objects will be deleted from the bucket on destroy, so that the bucket can be destroyed without error. These objects are not recoverable. | `bool` | `false` | no |
| <a name="input_log_glacier_transition_days"></a> [log\_glacier\_transition\_days](#input\_log\_glacier\_transition\_days) | Number of days after which to move the data to the glacier storage tier | `number` | `60` | no |
| <a name="input_log_include_cookies"></a> [log\_include\_cookies](#input\_log\_include\_cookies) | Include cookies in access logs | `bool` | `false` | no |
| <a name="input_log_prefix"></a> [log\_prefix](#input\_log\_prefix) | Path of logs in S3 bucket | `string` | `""` | no |
| <a name="input_log_standard_transition_days"></a> [log\_standard\_transition\_days](#input\_log\_standard\_transition\_days) | Number of days to persist in the standard storage tier before moving to the glacier tier | `number` | `30` | no |
| <a name="input_logging_enabled"></a> [logging\_enabled](#input\_logging\_enabled) | When true, access logs will be sent to a newly created s3 bucket | `bool` | `true` | no |
| <a name="input_max_ttl"></a> [max\_ttl](#input\_max\_ttl) | Maximum amount of time (in seconds) that an object is in a CloudFront cache | `number` | `31536000` | no |
| <a name="input_min_ttl"></a> [min\_ttl](#input\_min\_ttl) | Minimum amount of time that you want objects to stay in CloudFront caches | `number` | `0` | no |
| <a name="input_name"></a> [name](#input\_name) | ID element. Usually the component or solution name, e.g. 'app' or 'jenkins'.<br/>This is the only ID element not also included as a `tag`.<br/>The "name" tag is set to the full `id` string. There is no tag with the value of the `name` input. | `string` | `null` | no |
| <a name="input_namespace"></a> [namespace](#input\_namespace) | ID element. Usually an abbreviation of your organization name, e.g. 'eg' or 'cp', to help ensure generated IDs are globally unique | `string` | `null` | no |
| <a name="input_ordered_cache"></a> [ordered\_cache](#input\_ordered\_cache) | An ordered list of cache behaviors resource for this distribution. List from top to bottom in order of precedence. The topmost cache behavior will have precedence 0.<br/>The fields can be described by the other variables in this file. For example, the field 'lambda\_function\_association' in this object has<br/>a description in var.lambda\_function\_association variable earlier in this file. The only difference is that fields on this object are in ordered caches, whereas the rest<br/>of the vars in this file apply only to the default cache. Put value `""` on field `target_origin_id` to specify default s3 bucket origin. | <pre>list(object({<br/>    target_origin_id = string<br/>    path_pattern     = string<br/><br/>    allowed_methods          = list(string)<br/>    cached_methods           = list(string)<br/>    cache_policy_id          = string<br/>    origin_request_policy_id = string<br/>    compress                 = bool<br/><br/>    viewer_protocol_policy = string<br/>    min_ttl                = number<br/>    default_ttl            = number<br/>    max_ttl                = number<br/><br/>    forward_query_string  = bool<br/>    forward_header_values = list(string)<br/>    forward_cookies       = string<br/><br/>    response_headers_policy_id = string<br/><br/>    lambda_function_association = list(object({<br/>      event_type   = string<br/>      include_body = bool<br/>      lambda_arn   = string<br/>    }))<br/><br/>    function_association = list(object({<br/>      event_type   = string<br/>      function_arn = string<br/>    }))<br/>  }))</pre> | `[]` | no |
| <a name="input_origin_domain_name"></a> [origin\_domain\_name](#input\_origin\_domain\_name) | The DNS domain name of your custom origin (e.g. website) | `string` | `""` | no |
| <a name="input_origin_http_port"></a> [origin\_http\_port](#input\_origin\_http\_port) | The HTTP port the custom origin listens on | `number` | `"80"` | no |
| <a name="input_origin_https_port"></a> [origin\_https\_port](#input\_origin\_https\_port) | The HTTPS port the custom origin listens on | `number` | `443` | no |
| <a name="input_origin_keepalive_timeout"></a> [origin\_keepalive\_timeout](#input\_origin\_keepalive\_timeout) | The Custom KeepAlive timeout, in seconds. By default, AWS enforces a limit of 60. But you can request an increase. | `number` | `60` | no |
| <a name="input_origin_path"></a> [origin\_path](#input\_origin\_path) | An optional element that causes CloudFront to request your content from a directory in your Amazon S3 bucket or your custom origin. It must begin with a /. Do not add a / at the end of the path. | `string` | `""` | no |
| <a name="input_origin_protocol_policy"></a> [origin\_protocol\_policy](#input\_origin\_protocol\_policy) | The origin protocol policy to apply to your origin. One of http-only, https-only, or match-viewer | `string` | `"match-viewer"` | no |
| <a name="input_origin_read_timeout"></a> [origin\_read\_timeout](#input\_origin\_read\_timeout) | The Custom Read timeout, in seconds. By default, AWS enforces a limit of 60. But you can request an increase. | `number` | `60` | no |
| <a name="input_origin_request_policy_id"></a> [origin\_request\_policy\_id](#input\_origin\_request\_policy\_id) | ID of the origin request policy attached to the cache behavior | `string` | `null` | no |
| <a name="input_origin_shield"></a> [origin\_shield](#input\_origin\_shield) | The CloudFront Origin Shield settings | <pre>object({<br/>    enabled = bool<br/>    region  = string<br/>  })</pre> | `null` | no |
| <a name="input_origin_ssl_protocols"></a> [origin\_ssl\_protocols](#input\_origin\_ssl\_protocols) | The SSL/TLS protocols that you want CloudFront to use when communicating with your origin over HTTPS | `list(string)` | <pre>[<br/>  "TLSv1",<br/>  "TLSv1.1",<br/>  "TLSv1.2"<br/>]</pre> | no |
| <a name="input_parent_zone_id"></a> [parent\_zone\_id](#input\_parent\_zone\_id) | ID of the hosted zone to contain this record (or specify `parent_zone_name`) | `string` | `""` | no |
| <a name="input_parent_zone_name"></a> [parent\_zone\_name](#input\_parent\_zone\_name) | Name of the hosted zone to contain this record (or specify `parent_zone_id`) | `string` | `""` | no |
| <a name="input_price_class"></a> [price\_class](#input\_price\_class) | Price class for this distribution: `PriceClass_All`, `PriceClass_200`, `PriceClass_100` | `string` | `"PriceClass_100"` | no |
| <a name="input_realtime_log_config_arn"></a> [realtime\_log\_config\_arn](#input\_realtime\_log\_config\_arn) | The ARN of the real-time log configuration that is attached to this cache behavior | `string` | `null` | no |
| <a name="input_regex_replace_chars"></a> [regex\_replace\_chars](#input\_regex\_replace\_chars) | Terraform regular expression (regex) string.<br/>Characters matching the regex will be removed from the ID elements.<br/>If not set, `"/[^a-zA-Z0-9-]/"` is used to remove all characters other than hyphens, letters and digits. | `string` | `null` | no |
| <a name="input_response_headers_policy_id"></a> [response\_headers\_policy\_id](#input\_response\_headers\_policy\_id) | The identifier for a response headers policy | `string` | `""` | no |
| <a name="input_stage"></a> [stage](#input\_stage) | ID element. Usually used to indicate role, e.g. 'prod', 'staging', 'source', 'build', 'test', 'deploy', 'release' | `string` | `null` | no |
| <a name="input_tags"></a> [tags](#input\_tags) | Additional tags (e.g. `{'BusinessUnit': 'XYZ'}`).<br/>Neither the tag keys nor the tag values will be modified by this module. | `map(string)` | `{}` | no |
| <a name="input_tenant"></a> [tenant](#input\_tenant) | ID element \_(Rarely used, not included by default)\_. A customer identifier, indicating who this instance of a resource is for | `string` | `null` | no |
| <a name="input_trusted_signers"></a> [trusted\_signers](#input\_trusted\_signers) | List of AWS account IDs (or self) that you want to allow to create signed URLs for private content | `list(string)` | `[]` | no |
| <a name="input_viewer_minimum_protocol_version"></a> [viewer\_minimum\_protocol\_version](#input\_viewer\_minimum\_protocol\_version) | The minimum version of the SSL protocol that you want CloudFront to use for HTTPS connections. | `string` | `"TLSv1"` | no |
| <a name="input_viewer_protocol_policy"></a> [viewer\_protocol\_policy](#input\_viewer\_protocol\_policy) | allow-all, redirect-to-https | `string` | `"redirect-to-https"` | no |
| <a name="input_web_acl_id"></a> [web\_acl\_id](#input\_web\_acl\_id) | ID of the AWS WAF web ACL that is associated with the distribution | `string` | `""` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_cf_aliases"></a> [cf\_aliases](#output\_cf\_aliases) | Extra CNAMEs of AWS CloudFront |
| <a name="output_cf_arn"></a> [cf\_arn](#output\_cf\_arn) | ARN of CloudFront distribution |
| <a name="output_cf_domain_name"></a> [cf\_domain\_name](#output\_cf\_domain\_name) | Domain name corresponding to the distribution |
| <a name="output_cf_etag"></a> [cf\_etag](#output\_cf\_etag) | Current version of the distribution's information |
| <a name="output_cf_hosted_zone_id"></a> [cf\_hosted\_zone\_id](#output\_cf\_hosted\_zone\_id) | CloudFront Route 53 Zone ID |
| <a name="output_cf_id"></a> [cf\_id](#output\_cf\_id) | ID of CloudFront distribution |
| <a name="output_cf_origin_access_identity"></a> [cf\_origin\_access\_identity](#output\_cf\_origin\_access\_identity) | A shortcut to the full path for the origin access identity to use in CloudFront |
| <a name="output_cf_status"></a> [cf\_status](#output\_cf\_status) | Current status of the distribution |
| <a name="output_logs"></a> [logs](#output\_logs) | Logs resource |
<!-- markdownlint-restore -->


