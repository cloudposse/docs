---
title: AWS ECS cluster
sidebar_label: aws-ecs-cluster
sidebar_class_name: command
description: |-
  Terraform module to provision an [`ECS Cluster`](https://aws.amazon.com/ru/ecs/) with list of
  [`capacity providers`](https://docs.aws.amazon.com/AmazonECS/latest/userguide/cluster-capacity-providers.html).

  Supports [Amazon ECS Fargate](https://docs.aws.amazon.com/AmazonECS/latest/userguide/fargate-capacity-providers.html)
  and [EC2 Autoscaling](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/cluster-auto-scaling.html)
  capacity providers.
custom_edit_url: https://github.com/cloudposse/terraform-aws-ecs-cluster/edit/main/README.md
---

# Component: `AWS ECS cluster`
Terraform module to provision an [`ECS Cluster`](https://aws.amazon.com/ru/ecs/) with list of
[`capacity providers`](https://docs.aws.amazon.com/AmazonECS/latest/userguide/cluster-capacity-providers.html).

Supports [Amazon ECS Fargate](https://docs.aws.amazon.com/AmazonECS/latest/userguide/fargate-capacity-providers.html)
and [EC2 Autoscaling](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/cluster-auto-scaling.html)
capacity providers.






## Usage

For a complete example, see [examples/complete](examples/complete).

For automated tests of the complete example using [bats](https://github.com/bats-core/bats-core) and [Terratest](https://github.com/gruntwork-io/terratest)
(which tests and deploys the example on AWS), see [test](test).

### ECS cluster with Fargate capacity provider

```hcl
module "ecs_cluster" {
  source = "cloudposse/ecs-cluster/aws"

  namespace = "eg"
  name      = "example"

  container_insights_enabled      = true
  capacity_providers_fargate      = true
}
```

### ECS cluster with Fargate and EC2 autoscale capacity provider

```hcl
# Create a standard label resource. See [null-label](https://github.com/cloudposse/terraform-null-label/#terraform-null-label--)
module "label" {
  source  = "cloudposse/label/null"
  # Cloud Posse recommends pinning every module to a specific version, though usually you want to use the current one
  # version = "x.x.x"

  namespace = "eg"
  name      = "example"
}

module "vpc" {
  source  = "cloudposse/vpc/aws"
  version = "1.2.0"

  context                 = module.label.context
  ipv4_primary_cidr_block = "172.16.0.0/16"
}

module "subnets" {
  source  = "cloudposse/dynamic-subnets/aws"
  version = "2.0.4"

  context              = module.label.context
  availability_zones   = var.availability_zones
  vpc_id               = module.vpc.vpc_id
  igw_id               = [module.vpc.igw_id]
  ipv4_cidr_block      = [module.vpc.vpc_cidr_block]
  nat_gateway_enabled  = false
  nat_instance_enabled = false
}

module "ecs_cluster" {
  source = "cloudposse/ecs-cluster/aws"

  context = module.label.context

  container_insights_enabled      = true
  capacity_providers_fargate      = true
  capacity_providers_fargate_spot = true
  capacity_providers_ec2 = {
    default = {
      instance_type               = "t3.medium"
      security_group_ids          = [module.vpc.vpc_default_security_group_id]
      subnet_ids                  = module.subnets.private_subnet_ids
      associate_public_ip_address = false
      min_size                    = 0
      max_size                    = 2
    }
  }
}
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
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 1.3 |
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | >= 4.0 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | >= 4.0 |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_autoscale_group"></a> [autoscale\_group](#module\_autoscale\_group) | cloudposse/ec2-autoscale-group/aws | 0.31.1 |
| <a name="module_ecs_labels"></a> [ecs\_labels](#module\_ecs\_labels) | cloudposse/label/null | 0.25.0 |
| <a name="module_this"></a> [this](#module\_this) | cloudposse/label/null | 0.25.0 |

## Resources

| Name | Type |
|------|------|
| [aws_ecs_capacity_provider.ec2](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ecs_capacity_provider) | resource |
| [aws_ecs_capacity_provider.external_ec2](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ecs_capacity_provider) | resource |
| [aws_ecs_cluster.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ecs_cluster) | resource |
| [aws_ecs_cluster_capacity_providers.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ecs_cluster_capacity_providers) | resource |
| [aws_iam_instance_profile.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_instance_profile) | resource |
| [aws_iam_role.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role) | resource |
| [aws_iam_role_policy_attachment.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_iam_policy_document.assume](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_partition.current](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/partition) | data source |
| [aws_ssm_parameter.ami](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/ssm_parameter) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_additional_tag_map"></a> [additional\_tag\_map](#input\_additional\_tag\_map) | Additional key-value pairs to add to each map in `tags_as_list_of_maps`. Not added to `tags` or `id`.<br/>This is for some rare cases where resources want additional configuration of tags<br/>and therefore take a list of maps with tag key, value, and additional configuration. | `map(string)` | `{}` | no |
| <a name="input_attributes"></a> [attributes](#input\_attributes) | ID element. Additional attributes (e.g. `workers` or `cluster`) to add to `id`,<br/>in the order they appear in the list. New attributes are appended to the<br/>end of the list. The elements of the list are joined by the `delimiter`<br/>and treated as a single ID element. | `list(string)` | `[]` | no |
| <a name="input_capacity_providers_ec2"></a> [capacity\_providers\_ec2](#input\_capacity\_providers\_ec2) | EC2 autoscale groups capacity providers | <pre>map(object({<br/>    instance_type      = string<br/>    max_size           = number<br/>    min_size           = number<br/>    subnet_ids         = list(string)<br/>    security_group_ids = list(string)<br/><br/>    image_id                             = optional(string, null)<br/>    instance_initiated_shutdown_behavior = optional(string, "terminate")<br/>    key_name                             = optional(string, "")<br/>    user_data                            = optional(string, "")<br/>    enable_monitoring                    = optional(bool, true)<br/>    instance_warmup_period               = optional(number, 300)<br/>    maximum_scaling_step_size            = optional(number, 1)<br/>    minimum_scaling_step_size            = optional(number, 1)<br/>    target_capacity_utilization          = optional(number, 100)<br/>    ebs_optimized                        = optional(bool, false)<br/>    associate_public_ip_address          = optional(bool, false)<br/>    block_device_mappings = optional(list(object({<br/>      device_name  = string<br/>      no_device    = bool<br/>      virtual_name = string<br/>      ebs = object({<br/>        delete_on_termination = bool<br/>        encrypted             = bool<br/>        iops                  = number<br/>        kms_key_id            = string<br/>        snapshot_id           = string<br/>        volume_size           = number<br/>        volume_               = string<br/>      })<br/>    })), [])<br/>    instance_market_options = optional(object({<br/>      market_ = string<br/>      spot_options = object({<br/>        block_duration_minutes         = number<br/>        instance_interruption_behavior = string<br/>        max_price                      = number<br/>        spot_instance_                 = string<br/>        valid_until                    = string<br/>      })<br/>    }))<br/>    instance_refresh = optional(object({<br/>      strategy = string<br/>      preferences = object({<br/>        instance_warmup        = number<br/>        min_healthy_percentage = number<br/>      })<br/>      triggers = list(string)<br/>    }))<br/>    mixed_instances_policy = optional(object({<br/>      instances_distribution = object({<br/>        on_demand_allocation_strategy            = string<br/>        on_demand_base_capacity                  = number<br/>        on_demand_percentage_above_base_capacity = number<br/>        spot_allocation_strategy                 = string<br/>        spot_instance_pools                      = number<br/>        spot_max_price                           = string<br/>      })<br/>      }), {<br/>      instances_distribution = null<br/>    })<br/>    placement = optional(object({<br/>      affinity          = string<br/>      availability_zone = string<br/>      group_name        = string<br/>      host_id           = string<br/>      tenancy           = string<br/>    }))<br/>    credit_specification = optional(object({<br/>      cpu_credits = string<br/>    }))<br/>    elastic_gpu_specifications = optional(object({<br/>      type = string<br/>    }))<br/>    disable_api_termination   = optional(bool, false)<br/>    default_cooldown          = optional(number, 300)<br/>    health_check_grace_period = optional(number, 300)<br/>    force_delete              = optional(bool, false)<br/>    termination_policies      = optional(list(string), ["Default"])<br/>    suspended_processes       = optional(list(string), [])<br/>    placement_group           = optional(string, "")<br/>    metrics_granularity       = optional(string, "1Minute")<br/>    enabled_metrics = optional(list(string), [<br/>      "GroupMinSize",<br/>      "GroupMaxSize",<br/>      "GroupDesiredCapacity",<br/>      "GroupInServiceInstances",<br/>      "GroupPendingInstances",<br/>      "GroupStandbyInstances",<br/>      "GroupTerminatingInstances",<br/>      "GroupTotalInstances",<br/>      "GroupInServiceCapacity",<br/>      "GroupPendingCapacity",<br/>      "GroupStandbyCapacity",<br/>      "GroupTerminatingCapacity",<br/>      "GroupTotalCapacity",<br/>      "WarmPoolDesiredCapacity",<br/>      "WarmPoolWarmedCapacity",<br/>      "WarmPoolPendingCapacity",<br/>      "WarmPoolTerminatingCapacity",<br/>      "WarmPoolTotalCapacity",<br/>      "GroupAndWarmPoolDesiredCapacity",<br/>      "GroupAndWarmPoolTotalCapacity",<br/>    ])<br/>    wait_for_capacity_timeout            = optional(string, "10m")<br/>    service_linked_role_arn              = optional(string, "")<br/>    metadata_http_endpoint_enabled       = optional(bool, true)<br/>    metadata_http_put_response_hop_limit = optional(number, 2)<br/>    metadata_http_tokens_required        = optional(bool, true)<br/>    metadata_http_protocol_ipv6_enabled  = optional(bool, false)<br/>    tag_specifications_resource_types    = optional(set(string), ["instance", "volume"])<br/>    max_instance_lifetime                = optional(number, null)<br/>    capacity_rebalance                   = optional(bool, false)<br/>    update_default_version               = optional(bool, false)<br/>    warm_pool = optional(object({<br/>      pool_state                  = string<br/>      min_size                    = number<br/>      max_group_prepared_capacity = number<br/>    }))<br/>  }))</pre> | `{}` | no |
| <a name="input_capacity_providers_fargate"></a> [capacity\_providers\_fargate](#input\_capacity\_providers\_fargate) | Use FARGATE capacity provider | `bool` | `true` | no |
| <a name="input_capacity_providers_fargate_spot"></a> [capacity\_providers\_fargate\_spot](#input\_capacity\_providers\_fargate\_spot) | Use FARGATE\_SPOT capacity provider | `bool` | `false` | no |
| <a name="input_container_insights_enabled"></a> [container\_insights\_enabled](#input\_container\_insights\_enabled) | Whether or not to enable container insights | `bool` | `true` | no |
| <a name="input_context"></a> [context](#input\_context) | Single object for setting entire context at once.<br/>See description of individual variables for details.<br/>Leave string and numeric variables as `null` to use default value.<br/>Individual variable settings (non-null) override settings in context object,<br/>except for attributes, tags, and additional\_tag\_map, which are merged. | `any` | <pre>{<br/>  "additional_tag_map": {},<br/>  "attributes": [],<br/>  "delimiter": null,<br/>  "descriptor_formats": {},<br/>  "enabled": true,<br/>  "environment": null,<br/>  "id_length_limit": null,<br/>  "label_key_case": null,<br/>  "label_order": [],<br/>  "label_value_case": null,<br/>  "labels_as_tags": [<br/>    "unset"<br/>  ],<br/>  "name": null,<br/>  "namespace": null,<br/>  "regex_replace_chars": null,<br/>  "stage": null,<br/>  "tags": {},<br/>  "tenant": null<br/>}</pre> | no |
| <a name="input_default_capacity_strategy"></a> [default\_capacity\_strategy](#input\_default\_capacity\_strategy) | The capacity provider strategy to use by default for the cluster | <pre>object({<br/>    base = object({<br/>      provider = string<br/>      value    = number<br/>    })<br/>    weights = map(number)<br/>  })</pre> | <pre>{<br/>  "base": {<br/>    "provider": "FARGATE",<br/>    "value": 1<br/>  },<br/>  "weights": {}<br/>}</pre> | no |
| <a name="input_delimiter"></a> [delimiter](#input\_delimiter) | Delimiter to be used between ID elements.<br/>Defaults to `-` (hyphen). Set to `""` to use no delimiter at all. | `string` | `null` | no |
| <a name="input_descriptor_formats"></a> [descriptor\_formats](#input\_descriptor\_formats) | Describe additional descriptors to be output in the `descriptors` output map.<br/>Map of maps. Keys are names of descriptors. Values are maps of the form<br/>`{<br/>   format = string<br/>   labels = list(string)<br/>}`<br/>(Type is `any` so the map values can later be enhanced to provide additional options.)<br/>`format` is a Terraform format string to be passed to the `format()` function.<br/>`labels` is a list of labels, in order, to pass to `format()` function.<br/>Label values will be normalized before being passed to `format()` so they will be<br/>identical to how they appear in `id`.<br/>Default is `{}` (`descriptors` output will be empty). | `any` | `{}` | no |
| <a name="input_enabled"></a> [enabled](#input\_enabled) | Set to false to prevent the module from creating any resources | `bool` | `null` | no |
| <a name="input_environment"></a> [environment](#input\_environment) | ID element. Usually used for region e.g. 'uw2', 'us-west-2', OR role 'prod', 'staging', 'dev', 'UAT' | `string` | `null` | no |
| <a name="input_external_ec2_capacity_providers"></a> [external\_ec2\_capacity\_providers](#input\_external\_ec2\_capacity\_providers) | External EC2 autoscale groups capacity providers | <pre>map(object({<br/>    autoscaling_group_arn          = string<br/>    managed_termination_protection = bool<br/>    managed_scaling_status         = bool<br/>    instance_warmup_period         = optional(number, 300)<br/>    maximum_scaling_step_size      = optional(number, 1)<br/>    minimum_scaling_step_size      = optional(number, 1)<br/>    target_capacity_utilization    = optional(number, 100)<br/>  }))</pre> | `{}` | no |
| <a name="input_id_length_limit"></a> [id\_length\_limit](#input\_id\_length\_limit) | Limit `id` to this many characters (minimum 6).<br/>Set to `0` for unlimited length.<br/>Set to `null` for keep the existing setting, which defaults to `0`.<br/>Does not affect `id_full`. | `number` | `null` | no |
| <a name="input_kms_key_id"></a> [kms\_key\_id](#input\_kms\_key\_id) | The AWS Key Management Service key ID to encrypt the data between the local client and the container. | `string` | `null` | no |
| <a name="input_label_key_case"></a> [label\_key\_case](#input\_label\_key\_case) | Controls the letter case of the `tags` keys (label names) for tags generated by this module.<br/>Does not affect keys of tags passed in via the `tags` input.<br/>Possible values: `lower`, `title`, `upper`.<br/>Default value: `title`. | `string` | `null` | no |
| <a name="input_label_order"></a> [label\_order](#input\_label\_order) | The order in which the labels (ID elements) appear in the `id`.<br/>Defaults to ["namespace", "environment", "stage", "name", "attributes"].<br/>You can omit any of the 6 labels ("tenant" is the 6th), but at least one must be present. | `list(string)` | `null` | no |
| <a name="input_label_value_case"></a> [label\_value\_case](#input\_label\_value\_case) | Controls the letter case of ID elements (labels) as included in `id`,<br/>set as tag values, and output by this module individually.<br/>Does not affect values of tags passed in via the `tags` input.<br/>Possible values: `lower`, `title`, `upper` and `none` (no transformation).<br/>Set this to `title` and set `delimiter` to `""` to yield Pascal Case IDs.<br/>Default value: `lower`. | `string` | `null` | no |
| <a name="input_labels_as_tags"></a> [labels\_as\_tags](#input\_labels\_as\_tags) | Set of labels (ID elements) to include as tags in the `tags` output.<br/>Default is to include all labels.<br/>Tags with empty values will not be included in the `tags` output.<br/>Set to `[]` to suppress all generated tags.<br/>**Notes:**<br/>  The value of the `name` tag, if included, will be the `id`, not the `name`.<br/>  Unlike other `null-label` inputs, the initial setting of `labels_as_tags` cannot be<br/>  changed in later chained modules. Attempts to change it will be silently ignored. | `set(string)` | <pre>[<br/>  "default"<br/>]</pre> | no |
| <a name="input_log_configuration"></a> [log\_configuration](#input\_log\_configuration) | The log configuration for the results of the execute command actions Required when logging is OVERRIDE | <pre>object({<br/>    cloud_watch_encryption_enabled = string<br/>    cloud_watch_log_group_name     = string<br/>    s3_bucket_name                 = string<br/>    s3_key_prefix                  = string<br/>  })</pre> | `null` | no |
| <a name="input_logging"></a> [logging](#input\_logging) | The AWS Key Management Service key ID to encrypt the data between the local client and the container. (Valid values: 'NONE', 'DEFAULT', 'OVERRIDE') | `string` | `"DEFAULT"` | no |
| <a name="input_name"></a> [name](#input\_name) | ID element. Usually the component or solution name, e.g. 'app' or 'jenkins'.<br/>This is the only ID element not also included as a `tag`.<br/>The "name" tag is set to the full `id` string. There is no tag with the value of the `name` input. | `string` | `null` | no |
| <a name="input_namespace"></a> [namespace](#input\_namespace) | ID element. Usually an abbreviation of your organization name, e.g. 'eg' or 'cp', to help ensure generated IDs are globally unique | `string` | `null` | no |
| <a name="input_regex_replace_chars"></a> [regex\_replace\_chars](#input\_regex\_replace\_chars) | Terraform regular expression (regex) string.<br/>Characters matching the regex will be removed from the ID elements.<br/>If not set, `"/[^a-zA-Z0-9-]/"` is used to remove all characters other than hyphens, letters and digits. | `string` | `null` | no |
| <a name="input_stage"></a> [stage](#input\_stage) | ID element. Usually used to indicate role, e.g. 'prod', 'staging', 'source', 'build', 'test', 'deploy', 'release' | `string` | `null` | no |
| <a name="input_tags"></a> [tags](#input\_tags) | Additional tags (e.g. `{'BusinessUnit': 'XYZ'}`).<br/>Neither the tag keys nor the tag values will be modified by this module. | `map(string)` | `{}` | no |
| <a name="input_tenant"></a> [tenant](#input\_tenant) | ID element \_(Rarely used, not included by default)\_. A customer identifier, indicating who this instance of a resource is for | `string` | `null` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_arn"></a> [arn](#output\_arn) | ECS cluster arn |
| <a name="output_id"></a> [id](#output\_id) | ECS cluster id |
| <a name="output_name"></a> [name](#output\_name) | ECS cluster name |
| <a name="output_role_name"></a> [role\_name](#output\_role\_name) | IAM role name |
<!-- markdownlint-restore -->


