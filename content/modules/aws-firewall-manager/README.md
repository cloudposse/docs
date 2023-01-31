---
title: aws-firewall-manager
sidebar_label: aws-firewall-manager
sidebar_class_name: command
description: |-
  Terraform module to create and manage AWS Firewall Manager policies.
custom_edit_url: https://github.com/cloudposse/terraform-aws-firewall-manager/edit/master/README.md
---

# Component: `aws-firewall-manager`
Terraform module to create and manage AWS Firewall Manager policies.






## Usage

For a complete example, see [examples/complete](examples/complete).

For automated tests of the complete example using [bats](https://github.com/bats-core/bats-core) and [Terratest](https://github.com/gruntwork-io/terratest)
(which tests and deploys the example on AWS), see [test](test).

```hcl
module "label" {
  source = "cloudposse/label/null"
  # Cloud Posse recommends pinning every module to a specific version
  # version = "x.x.x"

  namespace = "eg"
  stage     = "prod"
  name      = "fms"
  delimiter = "-"

  tags = {
    "BusinessUnit" = "XYZ",
  }
}

module "vpc" {
  source  = "cloudposse/vpc/aws"
  # Cloud Posse recommends pinning every module to a specific version
  # version = "x.x.x"

  cidr_block = "10.0.0.0/16"

  context = module.label.context
}

provider "aws" {
  region = "us-east-2"
}

provider "aws" {
  region = "us-east-2"
  alias  = "admin"
  assume_role {
    role_arn = "arn:aws:xyz"
  }
}

module "fms" {
  source = "cloudposse/firewall-manager/aws"
  # Cloud Posse recommends pinning every module to a specific version
  # version = "x.x.x"

  providers = {
    aws.admin = aws.admin
    aws       = aws
  }

  security_groups_usage_audit_policies = [
    {
      name               = "unused-sg"
      resource_type_list = ["AWS::EC2::SecurityGroup"]

      policy_data = {
        delete_unused_security_groups      = false
        coalesce_redundant_security_groups = false
      }
    }
  ]

  security_groups_content_audit_policies = [
    {
      name               = "maxmimum-allowed"
      resource_type_list = ["AWS::EC2::SecurityGroup"]

      policy_data = {
        security_group_action = "allow"
        security_groups       = [module.vpc.security_group_id]
      }
    }
  ]

  security_groups_common_policies = [
    {
      name               = "disabled-all"
      resource_type_list = ["AWS::EC2::SecurityGroup"]

      policy_data = {
        revert_manual_security_group_changes         = false
        exclusive_resource_security_group_management = false
        apply_to_all_ec2_instance_enis               = false
        security_groups                              = [module.vpc.security_group_id]
      }
    }
  ]

  waf_v2_policies = [
    {
      name               = "linux-policy"
      resource_type_list = ["AWS::ElasticLoadBalancingV2::LoadBalancer", "AWS::ApiGateway::Stage"]

      policy_data = {
        default_action                        = "allow"
        override_customer_web_acl_association = false
        pre_process_rule_groups = [
          {
            "managedRuleGroupIdentifier" : {
              "vendorName" : "AWS",
              "managedRuleGroupName" : "AWSManagedRulesLinuxRuleSet",
              "version" : null
            },
            "overrideAction" : { "type" : "NONE" },
            "ruleGroupArn" : null,
            "excludeRules" : [],
            "ruleGroupType" : "ManagedRuleGroup"
          }
        ]
      }
    }
  ]

  context = module.label.context
}
```




## Examples

Here is an example of using this module:
- [`examples/complete`](https://github.com/cloudposse/terraform-aws-firewall-manager/examples/complete) - complete example of using this module



<!-- markdownlint-disable -->
## Makefile Targets
```text
Available targets:

  help                                Help screen
  help/all                            Display help for all targets
  help/short                          This help short screen
  lint                                Lint terraform code
  test/%                              Run Terraform commands in the examples/complete folder; e.g. make test/plan

```
<!-- markdownlint-restore -->
<!-- markdownlint-disable -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 0.15.0 |
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | >= 3.38 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | >= 3.38 |
| <a name="provider_aws.admin"></a> [aws.admin](#provider\_aws.admin) | >= 3.38 |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_dns_firewall_label"></a> [dns\_firewall\_label](#module\_dns\_firewall\_label) | cloudposse/label/null | 0.25.0 |
| <a name="module_firehose_label"></a> [firehose\_label](#module\_firehose\_label) | cloudposse/label/null | 0.25.0 |
| <a name="module_firehose_s3_bucket"></a> [firehose\_s3\_bucket](#module\_firehose\_s3\_bucket) | cloudposse/s3-bucket/aws | 0.44.1 |
| <a name="module_network_firewall_label"></a> [network\_firewall\_label](#module\_network\_firewall\_label) | cloudposse/label/null | 0.25.0 |
| <a name="module_security_groups_common_label"></a> [security\_groups\_common\_label](#module\_security\_groups\_common\_label) | cloudposse/label/null | 0.25.0 |
| <a name="module_security_groups_content_audit_label"></a> [security\_groups\_content\_audit\_label](#module\_security\_groups\_content\_audit\_label) | cloudposse/label/null | 0.25.0 |
| <a name="module_security_groups_usage_audit_label"></a> [security\_groups\_usage\_audit\_label](#module\_security\_groups\_usage\_audit\_label) | cloudposse/label/null | 0.25.0 |
| <a name="module_shield_advanced_label"></a> [shield\_advanced\_label](#module\_shield\_advanced\_label) | cloudposse/label/null | 0.25.0 |
| <a name="module_this"></a> [this](#module\_this) | cloudposse/label/null | 0.25.0 |
| <a name="module_waf_label"></a> [waf\_label](#module\_waf\_label) | cloudposse/label/null | 0.25.0 |
| <a name="module_waf_v2_label"></a> [waf\_v2\_label](#module\_waf\_v2\_label) | cloudposse/label/null | 0.25.0 |

## Resources

| Name | Type |
|------|------|
| [aws_fms_admin_account.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/fms_admin_account) | resource |
| [aws_fms_policy.dns_firewall](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/fms_policy) | resource |
| [aws_fms_policy.network_firewall](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/fms_policy) | resource |
| [aws_fms_policy.security_groups_common](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/fms_policy) | resource |
| [aws_fms_policy.security_groups_content_audit](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/fms_policy) | resource |
| [aws_fms_policy.security_groups_usage_audit](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/fms_policy) | resource |
| [aws_fms_policy.shield_advanced](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/fms_policy) | resource |
| [aws_fms_policy.waf](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/fms_policy) | resource |
| [aws_fms_policy.waf_v2](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/fms_policy) | resource |
| [aws_iam_role.firehose_role](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role) | resource |
| [aws_kinesis_firehose_delivery_stream.firehose_stream](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/kinesis_firehose_delivery_stream) | resource |
| [aws_iam_policy_document.assume_role](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_additional_tag_map"></a> [additional\_tag\_map](#input\_additional\_tag\_map) | Additional key-value pairs to add to each map in `tags_as_list_of_maps`. Not added to `tags` or `id`.<br/>This is for some rare cases where resources want additional configuration of tags<br/>and therefore take a list of maps with tag key, value, and additional configuration. | `map(string)` | `{}` | no |
| <a name="input_admin_account_enabled"></a> [admin\_account\_enabled](#input\_admin\_account\_enabled) | Resource for aws\_fms\_admin\_account is enabled and will be created or destroyed | `bool` | `true` | no |
| <a name="input_admin_account_id"></a> [admin\_account\_id](#input\_admin\_account\_id) | The AWS account ID to associate to associate with AWS Firewall Manager as the AWS Firewall Manager administrator account. This can be an AWS Organizations master account or a member account. Defaults to the current account. | `string` | `null` | no |
| <a name="input_attributes"></a> [attributes](#input\_attributes) | ID element. Additional attributes (e.g. `workers` or `cluster`) to add to `id`,<br/>in the order they appear in the list. New attributes are appended to the<br/>end of the list. The elements of the list are joined by the `delimiter`<br/>and treated as a single ID element. | `list(string)` | `[]` | no |
| <a name="input_context"></a> [context](#input\_context) | Single object for setting entire context at once.<br/>See description of individual variables for details.<br/>Leave string and numeric variables as `null` to use default value.<br/>Individual variable settings (non-null) override settings in context object,<br/>except for attributes, tags, and additional\_tag\_map, which are merged. | `any` | <pre>{<br/>  "additional_tag_map": {},<br/>  "attributes": [],<br/>  "delimiter": null,<br/>  "descriptor_formats": {},<br/>  "enabled": true,<br/>  "environment": null,<br/>  "id_length_limit": null,<br/>  "label_key_case": null,<br/>  "label_order": [],<br/>  "label_value_case": null,<br/>  "labels_as_tags": [<br/>    "unset"<br/>  ],<br/>  "name": null,<br/>  "namespace": null,<br/>  "regex_replace_chars": null,<br/>  "stage": null,<br/>  "tags": {},<br/>  "tenant": null<br/>}</pre> | no |
| <a name="input_delimiter"></a> [delimiter](#input\_delimiter) | Delimiter to be used between ID elements.<br/>Defaults to `-` (hyphen). Set to `""` to use no delimiter at all. | `string` | `null` | no |
| <a name="input_descriptor_formats"></a> [descriptor\_formats](#input\_descriptor\_formats) | Describe additional descriptors to be output in the `descriptors` output map.<br/>Map of maps. Keys are names of descriptors. Values are maps of the form<br/>`{<br/>   format = string<br/>   labels = list(string)<br/>}`<br/>(Type is `any` so the map values can later be enhanced to provide additional options.)<br/>`format` is a Terraform format string to be passed to the `format()` function.<br/>`labels` is a list of labels, in order, to pass to `format()` function.<br/>Label values will be normalized before being passed to `format()` so they will be<br/>identical to how they appear in `id`.<br/>Default is `{}` (`descriptors` output will be empty). | `any` | `{}` | no |
| <a name="input_dns_firewall_policies"></a> [dns\_firewall\_policies](#input\_dns\_firewall\_policies) | name:<br/>  The friendly name of the AWS Firewall Manager Policy.<br/>delete\_all\_policy\_resources:<br/>  Whether to perform a clean-up process.<br/>  Defaults to `true`.<br/>exclude\_resource\_tags:<br/>  A boolean value, if `true` the tags that are specified in the `resource_tags` are not protected by this policy.<br/>  If set to `false` and `resource_tags` are populated, resources that contain tags will be protected by this policy.<br/>  Defaults to `false`.<br/>remediation\_enabled:<br/>  A boolean value, indicates if the policy should automatically applied to resources that already exist in the account.<br/>  Defaults to `false`.<br/>resource\_type\_list:<br/>  A list of resource types to protect. Conflicts with `resource_type`.<br/>resource\_type:<br/>  A resource type to protect. Conflicts with `resource_type_list`.<br/>resource\_tags:<br/>  A map of resource tags, that if present will filter protections on resources based on the `exclude_resource_tags`.<br/>exclude\_account\_ids:<br/>  A list of AWS Organization member Accounts that you want to exclude from this AWS FMS Policy.<br/>include\_account\_ids:<br/>  A list of AWS Organization member Accounts that you want to include for this AWS FMS Policy.<br/>policy\_data:<br/>  pre\_process\_rule\_groups:<br/>    A list of maps of pre-proccess rule groups in the format `{ "ruleGroupId": "rslvr-frg-1", "priority": 10 }`.<br/>  post\_process\_rule\_groups:<br/>    A list of maps post-proccess rule groups in the format `{ "ruleGroupId": "rslvr-frg-1", "priority": 10 }`. | `list(any)` | `[]` | no |
| <a name="input_enabled"></a> [enabled](#input\_enabled) | Set to false to prevent the module from creating any resources | `bool` | `null` | no |
| <a name="input_environment"></a> [environment](#input\_environment) | ID element. Usually used for region e.g. 'uw2', 'us-west-2', OR role 'prod', 'staging', 'dev', 'UAT' | `string` | `null` | no |
| <a name="input_firehose_arn"></a> [firehose\_arn](#input\_firehose\_arn) | Kinesis Firehose ARN used to create a Kinesis Firehose destination for WAF\_V2 Rules. Conflicts with `firehose_enabled` | `string` | `null` | no |
| <a name="input_firehose_enabled"></a> [firehose\_enabled](#input\_firehose\_enabled) | Create a Kinesis Firehose destination for WAF\_V2 Rules. Conflicts with `firehose_arn` | `bool` | `false` | no |
| <a name="input_id_length_limit"></a> [id\_length\_limit](#input\_id\_length\_limit) | Limit `id` to this many characters (minimum 6).<br/>Set to `0` for unlimited length.<br/>Set to `null` for keep the existing setting, which defaults to `0`.<br/>Does not affect `id_full`. | `number` | `null` | no |
| <a name="input_label_key_case"></a> [label\_key\_case](#input\_label\_key\_case) | Controls the letter case of the `tags` keys (label names) for tags generated by this module.<br/>Does not affect keys of tags passed in via the `tags` input.<br/>Possible values: `lower`, `title`, `upper`.<br/>Default value: `title`. | `string` | `null` | no |
| <a name="input_label_order"></a> [label\_order](#input\_label\_order) | The order in which the labels (ID elements) appear in the `id`.<br/>Defaults to ["namespace", "environment", "stage", "name", "attributes"].<br/>You can omit any of the 6 labels ("tenant" is the 6th), but at least one must be present. | `list(string)` | `null` | no |
| <a name="input_label_value_case"></a> [label\_value\_case](#input\_label\_value\_case) | Controls the letter case of ID elements (labels) as included in `id`,<br/>set as tag values, and output by this module individually.<br/>Does not affect values of tags passed in via the `tags` input.<br/>Possible values: `lower`, `title`, `upper` and `none` (no transformation).<br/>Set this to `title` and set `delimiter` to `""` to yield Pascal Case IDs.<br/>Default value: `lower`. | `string` | `null` | no |
| <a name="input_labels_as_tags"></a> [labels\_as\_tags](#input\_labels\_as\_tags) | Set of labels (ID elements) to include as tags in the `tags` output.<br/>Default is to include all labels.<br/>Tags with empty values will not be included in the `tags` output.<br/>Set to `[]` to suppress all generated tags.<br/>**Notes:**<br/>  The value of the `name` tag, if included, will be the `id`, not the `name`.<br/>  Unlike other `null-label` inputs, the initial setting of `labels_as_tags` cannot be<br/>  changed in later chained modules. Attempts to change it will be silently ignored. | `set(string)` | <pre>[<br/>  "default"<br/>]</pre> | no |
| <a name="input_name"></a> [name](#input\_name) | ID element. Usually the component or solution name, e.g. 'app' or 'jenkins'.<br/>This is the only ID element not also included as a `tag`.<br/>The "name" tag is set to the full `id` string. There is no tag with the value of the `name` input. | `string` | `null` | no |
| <a name="input_namespace"></a> [namespace](#input\_namespace) | ID element. Usually an abbreviation of your organization name, e.g. 'eg' or 'cp', to help ensure generated IDs are globally unique | `string` | `null` | no |
| <a name="input_network_firewall_policies"></a> [network\_firewall\_policies](#input\_network\_firewall\_policies) | name:<br/>  The friendly name of the AWS Firewall Manager Policy.<br/>delete\_all\_policy\_resources:<br/>  Whether to perform a clean-up process.<br/>  Defaults to `true`.<br/>exclude\_resource\_tags:<br/>  A boolean value, if `true` the tags that are specified in the `resource_tags` are not protected by this policy.<br/>  If set to `false` and `resource_tags` are populated, resources that contain tags will be protected by this policy.<br/>  Defaults to `false`.<br/>remediation\_enabled:<br/>  A boolean value, indicates if the policy should automatically applied to resources that already exist in the account.<br/>  Defaults to `false`.<br/>resource\_type\_list:<br/>  A list of resource types to protect. Conflicts with `resource_type`.<br/>resource\_type:<br/>  A resource type to protect. Conflicts with `resource_type_list`.<br/>resource\_tags:<br/>  A map of resource tags, that if present will filter protections on resources based on the `exclude_resource_tags`.<br/>exclude\_account\_ids:<br/>  A list of AWS Organization member Accounts that you want to exclude from this AWS FMS Policy.<br/>include\_account\_ids:<br/>  A list of AWS Organization member Accounts that you want to include for this AWS FMS Policy.<br/>policy\_data:<br/>  stateless\_rule\_group\_references:<br/>    A list of maps of configuration blocks containing references to the stateful rule groups that are used in the policy.<br/>    Format: `{ "resourceARN": "arn:aws:network-firewall:us-west-1:1234567891011:stateless-rulegroup/rulegroup2", "priority": 10 }`<br/>  stateless\_default\_actions:<br/>    A list of actions to take on a packet if it does not match any of the stateless rules in the policy.<br/>    You must specify one of the standard actions including: `aws:drop`, `aws:pass`, or `aws:forward_to_sfe`.<br/>    In addition, you can specify custom actions that are compatible with your standard action choice.<br/>    If you want non-matching packets to be forwarded for stateful inspection, specify aws:forward\_to\_sfe.<br/>  stateless\_fragment\_default\_actions:<br/>    A list of actions to take on a fragmented packet if it does not match any of the stateless rules in the policy.<br/>    You must specify one of the standard actions including: `aws:drop`, `aws:pass`, or `aws:forward_to_sfe`.<br/>    In addition, you can specify custom actions that are compatible with your standard action choice.<br/>    If you want non-matching packets to be forwarded for stateful inspection, specify aws:forward\_to\_sfe.<br/>  stateless\_custom\_actions:<br/>    A list of maps describing the custom action definitions that are available for use in the firewall policy's `stateless_default_actions`.<br/>    Format: `{ "actionName": "custom1", "actionDefinition": { "publishMetricAction": { "dimensions": [ { "value": "dimension1" } ] } } }`<br/>  stateful\_rule\_group\_references\_arns:<br/>    A list of ARNs of the stateful rule groups.<br/>  orchestration\_config:<br/>    single\_firewall\_endpoint\_per\_vpc:<br/>      Whether to use single Firewall Endpoint per VPC.<br/>      Defaults to `false`.<br/>    allowed\_ipv4\_cidrs:<br/>      A list of allowed ipv4 cidrs. | `list(any)` | `[]` | no |
| <a name="input_regex_replace_chars"></a> [regex\_replace\_chars](#input\_regex\_replace\_chars) | Terraform regular expression (regex) string.<br/>Characters matching the regex will be removed from the ID elements.<br/>If not set, `"/[^a-zA-Z0-9-]/"` is used to remove all characters other than hyphens, letters and digits. | `string` | `null` | no |
| <a name="input_security_groups_common_policies"></a> [security\_groups\_common\_policies](#input\_security\_groups\_common\_policies) | name:<br/>  The friendly name of the AWS Firewall Manager Policy.<br/>delete\_all\_policy\_resources:<br/>  Whether to perform a clean-up process.<br/>  Defaults to `true`.<br/>exclude\_resource\_tags:<br/>  A boolean value, if `true` the tags that are specified in the `resource_tags` are not protected by this policy.<br/>  If set to `false` and `resource_tags` are populated, resources that contain tags will be protected by this policy.<br/>  Defaults to `false`.<br/>remediation\_enabled:<br/>  A boolean value, indicates if the policy should automatically applied to resources that already exist in the account.<br/>  Defaults to `false`.<br/>resource\_type\_list:<br/>  A list of resource types to protect. Conflicts with `resource_type`.<br/>resource\_type:<br/>  A resource type to protect. Conflicts with `resource_type_list`.<br/>resource\_tags:<br/>  A map of resource tags, that if present will filter protections on resources based on the `exclude_resource_tags`.<br/>exclude\_account\_ids:<br/>  A list of AWS Organization member Accounts that you want to exclude from this AWS FMS Policy.<br/>include\_account\_ids:<br/>  A list of AWS Organization member Accounts that you want to include for this AWS FMS Policy.<br/>policy\_data:<br/>  revert\_manual\_security\_group\_changes:<br/>    Whether to revert manual Security Group changes.<br/>    Defaults to `false`.<br/>  exclusive\_resource\_security\_group\_management:<br/>    Wheter to exclusive resource Security Group management.<br/>    Defaults to `false`.<br/>  apply\_to\_all\_ec2\_instance\_enis:<br/>    Whether to apply to all EC2 instance ENIs.<br/>    Defaults to `false`.<br/>  security\_groups:<br/>    A list of Security Group IDs. | `list(any)` | `[]` | no |
| <a name="input_security_groups_content_audit_policies"></a> [security\_groups\_content\_audit\_policies](#input\_security\_groups\_content\_audit\_policies) | name:<br/>  The friendly name of the AWS Firewall Manager Policy.<br/>delete\_all\_policy\_resources:<br/>  Whether to perform a clean-up process.<br/>  Defaults to `true`.<br/>exclude\_resource\_tags:<br/>  A boolean value, if `true` the tags that are specified in the `resource_tags` are not protected by this policy.<br/>  If set to `false` and `resource_tags` are populated, resources that contain tags will be protected by this policy.<br/>  Defaults to `false`.<br/>remediation\_enabled:<br/>  A boolean value, indicates if the policy should automatically applied to resources that already exist in the account.<br/>  Defaults to `false`.<br/>resource\_type\_list:<br/>  A list of resource types to protect. Conflicts with `resource_type`.<br/>resource\_type:<br/>  A resource type to protect. Conflicts with `resource_type_list`.<br/>resource\_tags:<br/>  A map of resource tags, that if present will filter protections on resources based on the `exclude_resource_tags`.<br/>exclude\_account\_ids:<br/>  A list of AWS Organization member Accounts that you want to exclude from this AWS FMS Policy.<br/>include\_account\_ids:<br/>  A list of AWS Organization member Accounts that you want to include for this AWS FMS Policy.<br/>policy\_data:<br/>  security\_group\_action:<br/>    For `ALLOW`, all in-scope security group rules must be within the allowed range of the policy's security group rules.<br/>    For `DENY`, all in-scope security group rules must not contain a value or a range that matches a rule value or range in the policy security group.<br/>    Possible values: `ALLOW`, `DENY`.<br/>  security\_groups:<br/>    A list of Security Group IDs. | `list(any)` | `[]` | no |
| <a name="input_security_groups_usage_audit_policies"></a> [security\_groups\_usage\_audit\_policies](#input\_security\_groups\_usage\_audit\_policies) | name:<br/>  The friendly name of the AWS Firewall Manager Policy.<br/>delete\_all\_policy\_resources:<br/>  Whether to perform a clean-up process.<br/>  Defaults to `true`.<br/>exclude\_resource\_tags:<br/>  A boolean value, if `true` the tags that are specified in the `resource_tags` are not protected by this policy.<br/>  If set to `false` and `resource_tags` are populated, resources that contain tags will be protected by this policy.<br/>  Defaults to `false`.<br/>remediation\_enabled:<br/>  A boolean value, indicates if the policy should automatically applied to resources that already exist in the account.<br/>  Defaults to `false`.<br/>resource\_type\_list:<br/>  A list of resource types to protect. Conflicts with `resource_type`.<br/>resource\_type:<br/>  A resource type to protect. Conflicts with `resource_type_list`.<br/>resource\_tags:<br/>  A map of resource tags, that if present will filter protections on resources based on the `exclude_resource_tags`.<br/>exclude\_account\_ids:<br/>  A list of AWS Organization member Accounts that you want to exclude from this AWS FMS Policy.<br/>include\_account\_ids:<br/>  A list of AWS Organization member Accounts that you want to include for this AWS FMS Policy.<br/>policy\_data:<br/>  delete\_unused\_security\_groups:<br/>    Whether to delete unused Security Groups.<br/>    Defaults to `false`.<br/>  coalesce\_redundant\_security\_groups:<br/>    Whether to coalesce redundant Security Groups.<br/>    Defaults to `false`. | `list(any)` | n/a | yes |
| <a name="input_shield_advanced_policies"></a> [shield\_advanced\_policies](#input\_shield\_advanced\_policies) | name:<br/>  The friendly name of the AWS Firewall Manager Policy.<br/>delete\_all\_policy\_resources:<br/>  Whether to perform a clean-up process.<br/>  Defaults to `true`.<br/>exclude\_resource\_tags:<br/>  A boolean value, if `true` the tags that are specified in the `resource_tags` are not protected by this policy.<br/>  If set to `false` and `resource_tags` are populated, resources that contain tags will be protected by this policy.<br/>  Defaults to `false`.<br/>remediation\_enabled:<br/>  A boolean value, indicates if the policy should automatically applied to resources that already exist in the account.<br/>  Defaults to `false`.<br/>resource\_type\_list:<br/>  A list of resource types to protect. Conflicts with `resource_type`.<br/>resource\_type:<br/>  A resource type to protect. Conflicts with `resource_type_list`.<br/>resource\_tags:<br/>  A map of resource tags, that if present will filter protections on resources based on the `exclude_resource_tags`.<br/>exclude\_account\_ids:<br/>  A list of AWS Organization member Accounts that you want to exclude from this AWS FMS Policy.<br/>include\_account\_ids:<br/>  A list of AWS Organization member Accounts that you want to include for this AWS FMS Policy. | `list(any)` | `[]` | no |
| <a name="input_stage"></a> [stage](#input\_stage) | ID element. Usually used to indicate role, e.g. 'prod', 'staging', 'source', 'build', 'test', 'deploy', 'release' | `string` | `null` | no |
| <a name="input_tags"></a> [tags](#input\_tags) | Additional tags (e.g. `{'BusinessUnit': 'XYZ'}`).<br/>Neither the tag keys nor the tag values will be modified by this module. | `map(string)` | `{}` | no |
| <a name="input_tenant"></a> [tenant](#input\_tenant) | ID element \_(Rarely used, not included by default)\_. A customer identifier, indicating who this instance of a resource is for | `string` | `null` | no |
| <a name="input_waf_policies"></a> [waf\_policies](#input\_waf\_policies) | name:<br/>  The friendly name of the AWS Firewall Manager Policy.<br/>delete\_all\_policy\_resources:<br/>  Whether to perform a clean-up process.<br/>  Defaults to `true`.<br/>exclude\_resource\_tags:<br/>  A boolean value, if `true` the tags that are specified in the `resource_tags` are not protected by this policy.<br/>  If set to `false` and `resource_tags` are populated, resources that contain tags will be protected by this policy.<br/>  Defaults to `false`.<br/>remediation\_enabled:<br/>  A boolean value, indicates if the policy should automatically applied to resources that already exist in the account.<br/>  Defaults to `false`.<br/>resource\_type\_list:<br/>  A list of resource types to protect. Conflicts with `resource_type`.<br/>resource\_type:<br/>  A resource type to protect. Conflicts with `resource_type_list`.<br/>resource\_tags:<br/>  A map of resource tags, that if present will filter protections on resources based on the `exclude_resource_tags`.<br/>exclude\_account\_ids:<br/>  A list of AWS Organization member Accounts that you want to exclude from this AWS FMS Policy.<br/>include\_account\_ids:<br/>  A list of AWS Organization member Accounts that you want to include for this AWS FMS Policy.<br/>policy\_data:<br/>  default\_action:<br/>    The action that you want AWS WAF to take.<br/>    Possible values: `ALLOW`, `BLOCK` or `COUNT`.<br/>  rule\_groups:<br/>    A list of rule groups. | `list(any)` | `[]` | no |
| <a name="input_waf_v2_policies"></a> [waf\_v2\_policies](#input\_waf\_v2\_policies) | name:<br/>  The friendly name of the AWS Firewall Manager Policy.<br/>delete\_all\_policy\_resources:<br/>  Whether to perform a clean-up process.<br/>  Defaults to `true`.<br/>exclude\_resource\_tags:<br/>  A boolean value, if `true` the tags that are specified in the `resource_tags` are not protected by this policy.<br/>  If set to `false` and `resource_tags` are populated, resources that contain tags will be protected by this policy.<br/>  Defaults to `false`.<br/>remediation\_enabled:<br/>  A boolean value, indicates if the policy should automatically applied to resources that already exist in the account.<br/>  Defaults to `false`.<br/>resource\_type\_list:<br/>  A list of resource types to protect. Conflicts with `resource_type`.<br/>resource\_type:<br/>  A resource type to protect. Conflicts with `resource_type_list`.<br/>resource\_tags:<br/>  A map of resource tags, that if present will filter protections on resources based on the `exclude_resource_tags`.<br/>exclude\_account\_ids:<br/>  A list of AWS Organization member Accounts that you want to exclude from this AWS FMS Policy.<br/>include\_account\_ids:<br/>  A list of AWS Organization member Accounts that you want to include for this AWS FMS Policy.<br/>policy\_data:<br/>  default\_action:<br/>    The action that you want AWS WAF to take.<br/>    Possible values: `ALLOW`, `BLOCK` or `COUNT`.<br/>  override\_customer\_web\_acl\_association:<br/>    Wheter to override customer Web ACL association<br/>  logging\_configuration:<br/>    The WAFv2 Web ACL logging configuration.<br/>  pre\_process\_rule\_groups:<br/>    A list of pre-proccess rule groups.<br/>  post\_process\_rule\_groups:<br/>    A list of post-proccess rule groups. | `list(any)` | `[]` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_admin_account"></a> [admin\_account](#output\_admin\_account) | AWS Account ID of the designated admin account. |
<!-- markdownlint-restore -->


