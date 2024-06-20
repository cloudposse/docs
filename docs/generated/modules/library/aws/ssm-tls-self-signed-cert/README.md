---
title: ssm-tls-self-signed-cert
sidebar_label: ssm-tls-self-signed-cert
sidebar_class_name: command
description: |-
  This module creates a self-signed certificate and writes it alongside with its key to SSM Parameter Store (or alternatively AWS Secrets Manager).
custom_edit_url: https://github.com/cloudposse/terraform-aws-ssm-tls-self-signed-cert/blob/main/README.yaml
---

# Module: `ssm-tls-self-signed-cert`
This module creates a self-signed certificate and writes it alongside with its key to SSM Parameter Store (or alternatively AWS Secrets Manager).






## Usage

For a complete example, see [examples/complete](https://github.com/cloudposse/terraform-aws-ssm-tls-self-signed-cert/tree/main/examples/complete).

```hcl
module "self_signed_cert" {
  source = "cloudposse/ssm-tls-self-signed-cert/aws"
  # Cloud Posse recommends pinning every module to a specific version
  # version = "x.x.x"

  namespace = "eg"
  stage     = "dev"
  name      = "self-signed-cert"

  subject = {
    common_name         = "example"
    organization        = "Cloud Posse"
    organizational_unit = "Engineering"
  }

  validity = {
    duration_hours      = 730
    early_renewal_hours = 24
  }

  allowed_uses = [
    "key_encipherment",
    "digital_signature",
    "server_auth"
  ]

  subject_alt_names = {
    ip_addresses = ["10.10.10.10"]
    dns_names    = ["example.com"]
    uris         = ["https://example.com"]
  }
}
```




## Examples

Here is an example of using this module:
- [`examples/complete`](https://github.com/cloudposse/terraform-aws-ssm-tls-self-signed-cert/tree/main/examples/complete) - complete example of using this module.



<!-- markdownlint-disable -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 0.13.0 |
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | >= 3.0 |
| <a name="requirement_tls"></a> [tls](#requirement\_tls) | >= 4.0.0 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | >= 3.0 |
| <a name="provider_tls"></a> [tls](#provider\_tls) | >= 4.0.0 |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_this"></a> [this](#module\_this) | cloudposse/label/null | 0.25.0 |

## Resources

| Name | Type |
|------|------|
| [aws_acm_certificate.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/acm_certificate) | resource |
| [aws_secretsmanager_secret.certificate](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/secretsmanager_secret) | resource |
| [aws_secretsmanager_secret.private_key](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/secretsmanager_secret) | resource |
| [aws_secretsmanager_secret_version.certificate](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/secretsmanager_secret_version) | resource |
| [aws_secretsmanager_secret_version.private_key](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/secretsmanager_secret_version) | resource |
| [aws_ssm_parameter.certificate](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ssm_parameter) | resource |
| [aws_ssm_parameter.private_key](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ssm_parameter) | resource |
| [tls_cert_request.default](https://registry.terraform.io/providers/hashicorp/tls/latest/docs/resources/cert_request) | resource |
| [tls_locally_signed_cert.default](https://registry.terraform.io/providers/hashicorp/tls/latest/docs/resources/locally_signed_cert) | resource |
| [tls_private_key.default](https://registry.terraform.io/providers/hashicorp/tls/latest/docs/resources/private_key) | resource |
| [tls_self_signed_cert.default](https://registry.terraform.io/providers/hashicorp/tls/latest/docs/resources/self_signed_cert) | resource |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_additional_tag_map"></a> [additional\_tag\_map](#input\_additional\_tag\_map) | Additional key-value pairs to add to each map in `tags_as_list_of_maps`. Not added to `tags` or `id`.<br/>This is for some rare cases where resources want additional configuration of tags<br/>and therefore take a list of maps with tag key, value, and additional configuration. | `map(string)` | `{}` | no |
| <a name="input_allowed_uses"></a> [allowed\_uses](#input\_allowed\_uses) | List of keywords each describing a use that is permitted for the issued certificate.<br/>Must be one of of the values outlined in [self\_signed\_cert.allowed\_uses](https://registry.terraform.io/providers/hashicorp/tls/latest/docs/resources/self_signed_cert#allowed_uses). | `list(string)` | n/a | yes |
| <a name="input_asm_recovery_window_in_days"></a> [asm\_recovery\_window\_in\_days](#input\_asm\_recovery\_window\_in\_days) | Number of days that AWS Secrets Manager waits before it can delete the secret. This value can be `0` to force deletion without recovery or range from `7` to `30` days.<br/><br/>This value is ignored if `var.certificate_backends` is not `ASM`, or if `var.certificate_backend_enabled` is `false`. | `number` | `30` | no |
| <a name="input_attributes"></a> [attributes](#input\_attributes) | ID element. Additional attributes (e.g. `workers` or `cluster`) to add to `id`,<br/>in the order they appear in the list. New attributes are appended to the<br/>end of the list. The elements of the list are joined by the `delimiter`<br/>and treated as a single ID element. | `list(string)` | `[]` | no |
| <a name="input_basic_constraints"></a> [basic\_constraints](#input\_basic\_constraints) | The [basic constraints](https://datatracker.ietf.org/doc/html/rfc5280#section-4.2.1.9) of the issued certificate.<br/>Currently, only the `CA` constraint (which identifies whether the subject of the certificate is a CA) can be set.<br/><br/>Defaults to this certificate not being a CA. | <pre>object({<br/>    ca = bool<br/>  })</pre> | <pre>{<br/>  "ca": false<br/>}</pre> | no |
| <a name="input_certificate_backend_kms_key_id"></a> [certificate\_backend\_kms\_key\_id](#input\_certificate\_backend\_kms\_key\_id) | The KMD Key ID (ARN or ID) to use when encrypting either the AWS SSM Parameters or AWS Secrets Manager Secrets relating to the certificate.<br/><br/>If not specified, the Amazon-managed Key `alias/aws/ssm` will be used if `var.certificate_backends` contains `SSM`,<br/>and `alias/aws/secretsmanager` will be used if `var.certificate_backends` is `ASM`. | `string` | `null` | no |
| <a name="input_certificate_backends"></a> [certificate\_backends](#input\_certificate\_backends) | The certificate backend to use when writing secrets related to the self-signed certificate.<br/>The value specified can either be `SSM` (AWS Systems Manager Parameter Store), `ASM` (AWS Secrets Manager), <br/>and/or `ACM` (AWS Certificate Manager).<br/><br/>Defaults to `SSM`. | `set(string)` | <pre>[<br/>  "SSM"<br/>]</pre> | no |
| <a name="input_certificate_backends_base64_enabled"></a> [certificate\_backends\_base64\_enabled](#input\_certificate\_backends\_base64\_enabled) | Enable or disable base64 encoding of secrets before writing them to the secrets store. | `bool` | `false` | no |
| <a name="input_certificate_backends_enabled"></a> [certificate\_backends\_enabled](#input\_certificate\_backends\_enabled) | Enable or disable writing to the secrets store. | `bool` | `true` | no |
| <a name="input_certificate_chain"></a> [certificate\_chain](#input\_certificate\_chain) | When using ACM as a certificate backend, some certificates store a certificate chain from a CA. This CA will come from another resource. | <pre>object({<br/>    cert_pem        = string<br/>    private_key_pem = string<br/>  })</pre> | `null` | no |
| <a name="input_context"></a> [context](#input\_context) | Single object for setting entire context at once.<br/>See description of individual variables for details.<br/>Leave string and numeric variables as `null` to use default value.<br/>Individual variable settings (non-null) override settings in context object,<br/>except for attributes, tags, and additional\_tag\_map, which are merged. | `any` | <pre>{<br/>  "additional_tag_map": {},<br/>  "attributes": [],<br/>  "delimiter": null,<br/>  "descriptor_formats": {},<br/>  "enabled": true,<br/>  "environment": null,<br/>  "id_length_limit": null,<br/>  "label_key_case": null,<br/>  "label_order": [],<br/>  "label_value_case": null,<br/>  "labels_as_tags": [<br/>    "unset"<br/>  ],<br/>  "name": null,<br/>  "namespace": null,<br/>  "regex_replace_chars": null,<br/>  "stage": null,<br/>  "tags": {},<br/>  "tenant": null<br/>}</pre> | no |
| <a name="input_delimiter"></a> [delimiter](#input\_delimiter) | Delimiter to be used between ID elements.<br/>Defaults to `-` (hyphen). Set to `""` to use no delimiter at all. | `string` | `null` | no |
| <a name="input_descriptor_formats"></a> [descriptor\_formats](#input\_descriptor\_formats) | Describe additional descriptors to be output in the `descriptors` output map.<br/>Map of maps. Keys are names of descriptors. Values are maps of the form<br/>`{<br/>   format = string<br/>   labels = list(string)<br/>}`<br/>(Type is `any` so the map values can later be enhanced to provide additional options.)<br/>`format` is a Terraform format string to be passed to the `format()` function.<br/>`labels` is a list of labels, in order, to pass to `format()` function.<br/>Label values will be normalized before being passed to `format()` so they will be<br/>identical to how they appear in `id`.<br/>Default is `{}` (`descriptors` output will be empty). | `any` | `{}` | no |
| <a name="input_enabled"></a> [enabled](#input\_enabled) | Set to false to prevent the module from creating any resources | `bool` | `null` | no |
| <a name="input_environment"></a> [environment](#input\_environment) | ID element. Usually used for region e.g. 'uw2', 'us-west-2', OR role 'prod', 'staging', 'dev', 'UAT' | `string` | `null` | no |
| <a name="input_id_length_limit"></a> [id\_length\_limit](#input\_id\_length\_limit) | Limit `id` to this many characters (minimum 6).<br/>Set to `0` for unlimited length.<br/>Set to `null` for keep the existing setting, which defaults to `0`.<br/>Does not affect `id_full`. | `number` | `null` | no |
| <a name="input_label_key_case"></a> [label\_key\_case](#input\_label\_key\_case) | Controls the letter case of the `tags` keys (label names) for tags generated by this module.<br/>Does not affect keys of tags passed in via the `tags` input.<br/>Possible values: `lower`, `title`, `upper`.<br/>Default value: `title`. | `string` | `null` | no |
| <a name="input_label_order"></a> [label\_order](#input\_label\_order) | The order in which the labels (ID elements) appear in the `id`.<br/>Defaults to ["namespace", "environment", "stage", "name", "attributes"].<br/>You can omit any of the 6 labels ("tenant" is the 6th), but at least one must be present. | `list(string)` | `null` | no |
| <a name="input_label_value_case"></a> [label\_value\_case](#input\_label\_value\_case) | Controls the letter case of ID elements (labels) as included in `id`,<br/>set as tag values, and output by this module individually.<br/>Does not affect values of tags passed in via the `tags` input.<br/>Possible values: `lower`, `title`, `upper` and `none` (no transformation).<br/>Set this to `title` and set `delimiter` to `""` to yield Pascal Case IDs.<br/>Default value: `lower`. | `string` | `null` | no |
| <a name="input_labels_as_tags"></a> [labels\_as\_tags](#input\_labels\_as\_tags) | Set of labels (ID elements) to include as tags in the `tags` output.<br/>Default is to include all labels.<br/>Tags with empty values will not be included in the `tags` output.<br/>Set to `[]` to suppress all generated tags.<br/>**Notes:**<br/>  The value of the `name` tag, if included, will be the `id`, not the `name`.<br/>  Unlike other `null-label` inputs, the initial setting of `labels_as_tags` cannot be<br/>  changed in later chained modules. Attempts to change it will be silently ignored. | `set(string)` | <pre>[<br/>  "default"<br/>]</pre> | no |
| <a name="input_name"></a> [name](#input\_name) | ID element. Usually the component or solution name, e.g. 'app' or 'jenkins'.<br/>This is the only ID element not also included as a `tag`.<br/>The "name" tag is set to the full `id` string. There is no tag with the value of the `name` input. | `string` | `null` | no |
| <a name="input_namespace"></a> [namespace](#input\_namespace) | ID element. Usually an abbreviation of your organization name, e.g. 'eg' or 'cp', to help ensure generated IDs are globally unique | `string` | `null` | no |
| <a name="input_private_key_algorithm"></a> [private\_key\_algorithm](#input\_private\_key\_algorithm) | The name of the algorithm for the private key of the certificate. Currently only RSA and ECDSA are supported.<br/><br/>If a preexisting private key is supplied via `var.private_key_contents`, this value must match that key's algorithm.<br/><br/>Defaults to RSA as it is a more widely adopted algorithm, although ECDSA provides the same level of security and with shorter keys. | `string` | `"RSA"` | no |
| <a name="input_private_key_contents"></a> [private\_key\_contents](#input\_private\_key\_contents) | The contents of the private key to use for the certificate.<br/>If supplied, this module will not create a private key and use these contents instead for the private key.<br/><br/>Defaults to `null`, which means a private key will be created. | `string` | `null` | no |
| <a name="input_private_key_ecdsa_curve"></a> [private\_key\_ecdsa\_curve](#input\_private\_key\_ecdsa\_curve) | When `var.cert_key_algorithm` is `ECDSA`, the name of the elliptic curve to use. May be any one of `P224`, `P256`, `P384` or `P521`.<br/><br/>Ignored if `var.cert_key_algorithm` is not `ECDSA`, or if a preexisting private key is supplied via `var.private_key_contents`.<br/><br/>Defaults to the `tls` provider default. | `string` | `"P224"` | no |
| <a name="input_private_key_rsa_bits"></a> [private\_key\_rsa\_bits](#input\_private\_key\_rsa\_bits) | When `var.cert_key_algorithm` is `RSA`, the size of the generated RSA key in bits.<br/><br/>Ignored if `var.cert_key_algorithm` is not `RSA`, or if a preexisting private key is supplied via `var.private_key_contents`.<br/><br/>Defaults to the `tls` provider default. | `number` | `2048` | no |
| <a name="input_regex_replace_chars"></a> [regex\_replace\_chars](#input\_regex\_replace\_chars) | Terraform regular expression (regex) string.<br/>Characters matching the regex will be removed from the ID elements.<br/>If not set, `"/[^a-zA-Z0-9-]/"` is used to remove all characters other than hyphens, letters and digits. | `string` | `null` | no |
| <a name="input_secret_extensions"></a> [secret\_extensions](#input\_secret\_extensions) | The extensions use when writing secrets to the certificate backend.<br/><br/>Please refer to `var.secret_path_format` for information on how secret paths are computed. | <pre>object({<br/>    certificate = string<br/>    private_key = string<br/>  })</pre> | <pre>{<br/>  "certificate": "pem",<br/>  "private_key": "key"<br/>}</pre> | no |
| <a name="input_secret_path_format"></a> [secret\_path\_format](#input\_secret\_path\_format) | The path format to use when writing secrets to the certificate backend.<br/><br/>The certificate secret path will be computed as `format(var.secret_path_format, var.name, var.secret_extensions.certificate)`<br/>and the private key path as `format(var.secret_path_format, var.name, var.secret_extensions.private_key)`.<br/><br/>Thus by default, if `var.name`=`example-self-signed-cert`, then the resulting secret paths for the self-signed certificate's<br/>PEM file and private key will be `/example-self-signed-cert.pem` and `/example-self-signed-cert.key`, respectively.<br/><br/>This variable can be overridden in order to create more specific certificate backend paths. | `string` | `"/%s.%s"` | no |
| <a name="input_skid_enabled"></a> [skid\_enabled](#input\_skid\_enabled) | Whether or not the subject key identifier (SKID) should be included in the certificate. | `bool` | `false` | no |
| <a name="input_stage"></a> [stage](#input\_stage) | ID element. Usually used to indicate role, e.g. 'prod', 'staging', 'source', 'build', 'test', 'deploy', 'release' | `string` | `null` | no |
| <a name="input_subject"></a> [subject](#input\_subject) | The subject configuration for the certificate.<br/>This should be a map that is compatible with [tls\_cert\_request.subject](https://registry.terraform.io/providers/hashicorp/tls/latest/docs/resources/cert_request#subject).<br/><br/>If `common_name` is omitted, it will be set as `module.this.id`. | `any` | `{}` | no |
| <a name="input_subject_alt_names"></a> [subject\_alt\_names](#input\_subject\_alt\_names) | The subject alternative name (SAN) configuration for the certificate. This configuration consists of several lists, each of which can also be set to `null` or `[]`.<br/><br/>`dns_names`: List of DNS names for which a certificate is being requested.<br/>`ip_addresses`: List of IP addresses for which a certificate is being requested.<br/>`uris`: List of URIs for which a certificate is being requested.<br/><br/>Defaults to no SANs. | <pre>object({<br/>    dns_names    = list(string)<br/>    ip_addresses = list(string)<br/>    uris         = list(string)<br/>  })</pre> | <pre>{<br/>  "dns_names": null,<br/>  "ip_addresses": null,<br/>  "uris": null<br/>}</pre> | no |
| <a name="input_tags"></a> [tags](#input\_tags) | Additional tags (e.g. `{'BusinessUnit': 'XYZ'}`).<br/>Neither the tag keys nor the tag values will be modified by this module. | `map(string)` | `{}` | no |
| <a name="input_tenant"></a> [tenant](#input\_tenant) | ID element \_(Rarely used, not included by default)\_. A customer identifier, indicating who this instance of a resource is for | `string` | `null` | no |
| <a name="input_use_locally_signed"></a> [use\_locally\_signed](#input\_use\_locally\_signed) | Create a locally signed certificate/key pair instead of a self-signed one. This is useful it a previously created certificate chain is to be used to sign a certificate. | `bool` | `false` | no |
| <a name="input_validity"></a> [validity](#input\_validity) | Validity settings for the issued certificate:<br/><br/>`duration_hours`: The number of hours from issuing the certificate until it becomes invalid.<br/>`early_renewal_hours`: If set, the resource will consider the certificate to have expired the given number of hours before its actual expiry time (see: [self\_signed\_cert.early\_renewal\_hours](https://registry.terraform.io/providers/hashicorp/tls/latest/docs/resources/self_signed_cert#early_renewal_hours)).<br/><br/>Defaults to 10 years and no early renewal hours. | <pre>object({<br/>    duration_hours      = number<br/>    early_renewal_hours = number<br/>  })</pre> | <pre>{<br/>  "duration_hours": 87600,<br/>  "early_renewal_hours": null<br/>}</pre> | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_certificate_arn"></a> [certificate\_arn](#output\_certificate\_arn) | ARN of certificate stored in ACM that other services may need to refer to. This is useful when the certificate is stored in ACM. |
| <a name="output_certificate_key_path"></a> [certificate\_key\_path](#output\_certificate\_key\_path) | Secrets store path containing the certificate private key file. |
| <a name="output_certificate_pem"></a> [certificate\_pem](#output\_certificate\_pem) | Contents of the certificate PEM. |
| <a name="output_certificate_pem_path"></a> [certificate\_pem\_path](#output\_certificate\_pem\_path) | Secrets store path containing the certificate PEM file. |
<!-- markdownlint-restore -->

