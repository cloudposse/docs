---
title: eks-workers
sidebar_label: eks-workers
sidebar_class_name: command
description: |-
  Terraform module to provision AWS resources to run EC2 worker nodes for [Elastic Kubernetes Service](https://aws.amazon.com/eks/).

  Instantiate it multiple times to create many EKS worker node pools with specific settings such as GPUs, EC2 instance types, or autoscale parameters.
custom_edit_url: https://github.com/cloudposse/terraform-aws-eks-workers/blob/main/README.yaml
---

# Module: `eks-workers`
Terraform module to provision AWS resources to run EC2 worker nodes for [Elastic Kubernetes Service](https://aws.amazon.com/eks/).

Instantiate it multiple times to create many EKS worker node pools with specific settings such as GPUs, EC2 instance types, or autoscale parameters.




## Introduction

The module provisions the following resources:

- IAM Role and Instance Profile to allow Kubernetes nodes to access other AWS services
- Security Group with rules for EKS workers to allow networking traffic
- AutoScaling Group with Launch Template to configure and launch worker instances
- AutoScaling Policies and CloudWatch Metric Alarms to monitor CPU utilization on the EC2 instances and scale the number of instance in the AutoScaling Group up or down.
If you don't want to use the provided functionality, or want to provide your own policies, disable it by setting the variable `autoscaling_policies_enabled` to `"false"`.



## Usage


For a complete example, see [examples/complete](https://github.com/cloudposse/terraform-aws-eks-workers/tree/main/examples/complete)

```hcl
  provider "aws" {
    region = var.region
  }

  locals {
    # The usage of the specific kubernetes.io/cluster/* resource tags below are required
    # for EKS and Kubernetes to discover and manage networking resources
    # https://www.terraform.io/docs/providers/aws/guides/eks-getting-started.html#base-vpc-networking
    tags = merge(var.tags, map("kubernetes.io/cluster/${var.cluster_name}", "shared"))
  }

  module "vpc" {
    source  = "cloudposse/vpc/aws"
    version = "2.1.1"

    namespace = var.namespace
    stage     = var.stage
    name      = var.name

    ipv4_primary_cidr_block = "172.16.0.0/16"
    tags                    = local.tags
  }

  module "subnets" {
    source  = "cloudposse/dynamic-subnets/aws"
    version = "2.4.1"

    namespace = var.namespace
    stage     = var.stage
    name      = var.name

    availability_zones   = var.availability_zones
    vpc_id               = module.vpc.vpc_id
    igw_id               = [module.vpc.igw_id]
    ipv4_cidr_block      = [module.vpc.vpc_cidr_block]
    nat_gateway_enabled  = false
    nat_instance_enabled = false
    tags                 = local.tags
  }

  module "eks_workers" {
    source = "cloudposse/eks-workers/aws"
    # Cloud Posse recommends pinning every module to a specific version
    # version     = "x.x.x"
    namespace                          = var.namespace
    stage                              = var.stage
    name                               = var.name
    instance_type                      = var.instance_type
    vpc_id                             = module.vpc.vpc_id
    subnet_ids                         = module.subnets.public_subnet_ids
    health_check_type                  = var.health_check_type
    min_size                           = var.min_size
    max_size                           = var.max_size
    wait_for_capacity_timeout          = var.wait_for_capacity_timeout
    cluster_name                       = var.cluster_name
    cluster_endpoint                   = var.cluster_endpoint
    cluster_certificate_authority_data = var.cluster_certificate_authority_data
    cluster_security_group_id          = var.cluster_security_group_id

    # Auto-scaling policies and CloudWatch metric alarms
    autoscaling_policies_enabled           = var.autoscaling_policies_enabled
    cpu_utilization_high_threshold_percent = var.cpu_utilization_high_threshold_percent
    cpu_utilization_low_threshold_percent  = var.cpu_utilization_low_threshold_percent
  }
```






<!-- markdownlint-disable -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 1.0 |
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | >= 5.16.0 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | >= 5.16.0 |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_autoscale_group"></a> [autoscale\_group](#module\_autoscale\_group) | cloudposse/ec2-autoscale-group/aws | 0.39.0 |
| <a name="module_label"></a> [label](#module\_label) | cloudposse/label/null | 0.25.0 |
| <a name="module_this"></a> [this](#module\_this) | cloudposse/label/null | 0.25.0 |

## Resources

| Name | Type |
|------|------|
| [aws_iam_instance_profile.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_instance_profile) | resource |
| [aws_iam_role.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role) | resource |
| [aws_iam_role_policy_attachment.amazon_ec2_container_registry_read_only](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_iam_role_policy_attachment.amazon_eks_cni_policy](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_iam_role_policy_attachment.amazon_eks_worker_node_policy](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_iam_role_policy_attachment.existing_policies_attach_to_eks_workers_role](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_security_group.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group) | resource |
| [aws_security_group_rule.egress](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group_rule) | resource |
| [aws_security_group_rule.ingress_cidr_blocks](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group_rule) | resource |
| [aws_security_group_rule.ingress_cluster](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group_rule) | resource |
| [aws_security_group_rule.ingress_security_groups](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group_rule) | resource |
| [aws_security_group_rule.ingress_self](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group_rule) | resource |
| [aws_ami.eks_worker](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/ami) | data source |
| [aws_iam_instance_profile.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_instance_profile) | data source |
| [aws_iam_policy_document.assume_role](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_partition.current](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/partition) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_additional_security_group_ids"></a> [additional\_security\_group\_ids](#input\_additional\_security\_group\_ids) | Additional list of security groups that will be attached to the autoscaling group | `list(string)` | `[]` | no |
| <a name="input_additional_tag_map"></a> [additional\_tag\_map](#input\_additional\_tag\_map) | Additional key-value pairs to add to each map in `tags_as_list_of_maps`. Not added to `tags` or `id`.<br/>This is for some rare cases where resources want additional configuration of tags<br/>and therefore take a list of maps with tag key, value, and additional configuration. | `map(string)` | `{}` | no |
| <a name="input_after_cluster_joining_userdata"></a> [after\_cluster\_joining\_userdata](#input\_after\_cluster\_joining\_userdata) | Additional commands to execute on each worker node after joining the EKS cluster (after executing the `bootstrap.sh` script). For mot info, see https://kubedex.com/90-days-of-aws-eks-in-production | `string` | `""` | no |
| <a name="input_allowed_cidr_blocks"></a> [allowed\_cidr\_blocks](#input\_allowed\_cidr\_blocks) | List of CIDR blocks to be allowed to connect to the worker nodes | `list(string)` | `[]` | no |
| <a name="input_allowed_security_groups"></a> [allowed\_security\_groups](#input\_allowed\_security\_groups) | List of Security Group IDs to be allowed to connect to the worker nodes | `list(string)` | `[]` | no |
| <a name="input_associate_public_ip_address"></a> [associate\_public\_ip\_address](#input\_associate\_public\_ip\_address) | Associate a public IP address with an instance in a VPC | `bool` | `false` | no |
| <a name="input_attributes"></a> [attributes](#input\_attributes) | ID element. Additional attributes (e.g. `workers` or `cluster`) to add to `id`,<br/>in the order they appear in the list. New attributes are appended to the<br/>end of the list. The elements of the list are joined by the `delimiter`<br/>and treated as a single ID element. | `list(string)` | `[]` | no |
| <a name="input_autoscaling_group_tags"></a> [autoscaling\_group\_tags](#input\_autoscaling\_group\_tags) | Additional tags only for the autoscaling group, e.g. "k8s.io/cluster-autoscaler/node-template/taint/dedicated" = "ci-cd:NoSchedule". | `map(string)` | `{}` | no |
| <a name="input_autoscaling_policies_enabled"></a> [autoscaling\_policies\_enabled](#input\_autoscaling\_policies\_enabled) | Whether to create `aws_autoscaling_policy` and `aws_cloudwatch_metric_alarm` resources to control Auto Scaling | `bool` | `true` | no |
| <a name="input_aws_iam_instance_profile_name"></a> [aws\_iam\_instance\_profile\_name](#input\_aws\_iam\_instance\_profile\_name) | The name of the existing instance profile that will be used in autoscaling group for EKS workers. If empty will create a new instance profile. | `string` | `""` | no |
| <a name="input_before_cluster_joining_userdata"></a> [before\_cluster\_joining\_userdata](#input\_before\_cluster\_joining\_userdata) | Additional commands to execute on each worker node before joining the EKS cluster (before executing the `bootstrap.sh` script). For mot info, see https://kubedex.com/90-days-of-aws-eks-in-production | `string` | `""` | no |
| <a name="input_block_device_mappings"></a> [block\_device\_mappings](#input\_block\_device\_mappings) | Specify volumes to attach to the instance besides the volumes specified by the AMI | <pre>list(object({<br/>    device_name  = string<br/>    no_device    = bool<br/>    virtual_name = string<br/>    ebs = object({<br/>      delete_on_termination = bool<br/>      encrypted             = bool<br/>      iops                  = number<br/>      kms_key_id            = string<br/>      snapshot_id           = string<br/>      volume_size           = number<br/>      volume_type           = string<br/>    })<br/>  }))</pre> | `[]` | no |
| <a name="input_bootstrap_extra_args"></a> [bootstrap\_extra\_args](#input\_bootstrap\_extra\_args) | Extra arguments to the `bootstrap.sh` script to enable `--enable-docker-bridge` or `--use-max-pods` | `string` | `""` | no |
| <a name="input_cluster_certificate_authority_data"></a> [cluster\_certificate\_authority\_data](#input\_cluster\_certificate\_authority\_data) | The base64 encoded certificate data required to communicate with the cluster | `string` | n/a | yes |
| <a name="input_cluster_endpoint"></a> [cluster\_endpoint](#input\_cluster\_endpoint) | EKS cluster endpoint | `string` | n/a | yes |
| <a name="input_cluster_name"></a> [cluster\_name](#input\_cluster\_name) | The name of the EKS cluster | `string` | n/a | yes |
| <a name="input_cluster_security_group_id"></a> [cluster\_security\_group\_id](#input\_cluster\_security\_group\_id) | Security Group ID of the EKS cluster | `string` | n/a | yes |
| <a name="input_cluster_security_group_ingress_enabled"></a> [cluster\_security\_group\_ingress\_enabled](#input\_cluster\_security\_group\_ingress\_enabled) | Whether to enable the EKS cluster Security Group as ingress to workers Security Group | `bool` | `true` | no |
| <a name="input_context"></a> [context](#input\_context) | Single object for setting entire context at once.<br/>See description of individual variables for details.<br/>Leave string and numeric variables as `null` to use default value.<br/>Individual variable settings (non-null) override settings in context object,<br/>except for attributes, tags, and additional\_tag\_map, which are merged. | `any` | <pre>{<br/>  "additional_tag_map": {},<br/>  "attributes": [],<br/>  "delimiter": null,<br/>  "descriptor_formats": {},<br/>  "enabled": true,<br/>  "environment": null,<br/>  "id_length_limit": null,<br/>  "label_key_case": null,<br/>  "label_order": [],<br/>  "label_value_case": null,<br/>  "labels_as_tags": [<br/>    "unset"<br/>  ],<br/>  "name": null,<br/>  "namespace": null,<br/>  "regex_replace_chars": null,<br/>  "stage": null,<br/>  "tags": {},<br/>  "tenant": null<br/>}</pre> | no |
| <a name="input_cpu_utilization_high_evaluation_periods"></a> [cpu\_utilization\_high\_evaluation\_periods](#input\_cpu\_utilization\_high\_evaluation\_periods) | The number of periods over which data is compared to the specified threshold | `number` | `2` | no |
| <a name="input_cpu_utilization_high_period_seconds"></a> [cpu\_utilization\_high\_period\_seconds](#input\_cpu\_utilization\_high\_period\_seconds) | The period in seconds over which the specified statistic is applied | `number` | `300` | no |
| <a name="input_cpu_utilization_high_statistic"></a> [cpu\_utilization\_high\_statistic](#input\_cpu\_utilization\_high\_statistic) | The statistic to apply to the alarm's associated metric. Either of the following is supported: `SampleCount`, `Average`, `Sum`, `Minimum`, `Maximum` | `string` | `"Average"` | no |
| <a name="input_cpu_utilization_high_threshold_percent"></a> [cpu\_utilization\_high\_threshold\_percent](#input\_cpu\_utilization\_high\_threshold\_percent) | The value against which the specified statistic is compared | `number` | `90` | no |
| <a name="input_cpu_utilization_low_evaluation_periods"></a> [cpu\_utilization\_low\_evaluation\_periods](#input\_cpu\_utilization\_low\_evaluation\_periods) | The number of periods over which data is compared to the specified threshold | `number` | `2` | no |
| <a name="input_cpu_utilization_low_period_seconds"></a> [cpu\_utilization\_low\_period\_seconds](#input\_cpu\_utilization\_low\_period\_seconds) | The period in seconds over which the specified statistic is applied | `number` | `300` | no |
| <a name="input_cpu_utilization_low_statistic"></a> [cpu\_utilization\_low\_statistic](#input\_cpu\_utilization\_low\_statistic) | The statistic to apply to the alarm's associated metric. Either of the following is supported: `SampleCount`, `Average`, `Sum`, `Minimum`, `Maximum` | `string` | `"Average"` | no |
| <a name="input_cpu_utilization_low_threshold_percent"></a> [cpu\_utilization\_low\_threshold\_percent](#input\_cpu\_utilization\_low\_threshold\_percent) | The value against which the specified statistic is compared | `number` | `10` | no |
| <a name="input_credit_specification"></a> [credit\_specification](#input\_credit\_specification) | Customize the credit specification of the instances | <pre>object({<br/>    cpu_credits = string<br/>  })</pre> | `null` | no |
| <a name="input_default_cooldown"></a> [default\_cooldown](#input\_default\_cooldown) | The amount of time, in seconds, after a scaling activity completes before another scaling activity can start | `number` | `300` | no |
| <a name="input_delimiter"></a> [delimiter](#input\_delimiter) | Delimiter to be used between ID elements.<br/>Defaults to `-` (hyphen). Set to `""` to use no delimiter at all. | `string` | `null` | no |
| <a name="input_descriptor_formats"></a> [descriptor\_formats](#input\_descriptor\_formats) | Describe additional descriptors to be output in the `descriptors` output map.<br/>Map of maps. Keys are names of descriptors. Values are maps of the form<br/>`{<br/>   format = string<br/>   labels = list(string)<br/>}`<br/>(Type is `any` so the map values can later be enhanced to provide additional options.)<br/>`format` is a Terraform format string to be passed to the `format()` function.<br/>`labels` is a list of labels, in order, to pass to `format()` function.<br/>Label values will be normalized before being passed to `format()` so they will be<br/>identical to how they appear in `id`.<br/>Default is `{}` (`descriptors` output will be empty). | `any` | `{}` | no |
| <a name="input_disable_api_termination"></a> [disable\_api\_termination](#input\_disable\_api\_termination) | If `true`, enables EC2 Instance Termination Protection | `bool` | `false` | no |
| <a name="input_ebs_optimized"></a> [ebs\_optimized](#input\_ebs\_optimized) | If true, the launched EC2 instance will be EBS-optimized | `bool` | `false` | no |
| <a name="input_eks_worker_ami_name_filter"></a> [eks\_worker\_ami\_name\_filter](#input\_eks\_worker\_ami\_name\_filter) | AMI name filter to lookup the most recent EKS AMI if `image_id` is not provided | `string` | `"amazon-eks-node-*"` | no |
| <a name="input_eks_worker_ami_name_regex"></a> [eks\_worker\_ami\_name\_regex](#input\_eks\_worker\_ami\_name\_regex) | A regex string to apply to the AMI list returned by AWS | `string` | `"^amazon-eks-node-[0-9,.]+-v[0-9]{8}$"` | no |
| <a name="input_elastic_gpu_specifications"></a> [elastic\_gpu\_specifications](#input\_elastic\_gpu\_specifications) | Specifications of Elastic GPU to attach to the instances | <pre>object({<br/>    type = string<br/>  })</pre> | `null` | no |
| <a name="input_enable_monitoring"></a> [enable\_monitoring](#input\_enable\_monitoring) | Enable/disable detailed monitoring | `bool` | `true` | no |
| <a name="input_enabled"></a> [enabled](#input\_enabled) | Set to false to prevent the module from creating any resources | `bool` | `null` | no |
| <a name="input_enabled_metrics"></a> [enabled\_metrics](#input\_enabled\_metrics) | A list of metrics to collect. The allowed values are `GroupMinSize`, `GroupMaxSize`, `GroupDesiredCapacity`, `GroupInServiceInstances`, `GroupPendingInstances`, `GroupStandbyInstances`, `GroupTerminatingInstances`, `GroupTotalInstances` | `list(string)` | <pre>[<br/>  "GroupMinSize",<br/>  "GroupMaxSize",<br/>  "GroupDesiredCapacity",<br/>  "GroupInServiceInstances",<br/>  "GroupPendingInstances",<br/>  "GroupStandbyInstances",<br/>  "GroupTerminatingInstances",<br/>  "GroupTotalInstances"<br/>]</pre> | no |
| <a name="input_environment"></a> [environment](#input\_environment) | ID element. Usually used for region e.g. 'uw2', 'us-west-2', OR role 'prod', 'staging', 'dev', 'UAT' | `string` | `null` | no |
| <a name="input_force_delete"></a> [force\_delete](#input\_force\_delete) | Allows deleting the autoscaling group without waiting for all instances in the pool to terminate. You can force an autoscaling group to delete even if it's in the process of scaling a resource. Normally, Terraform drains all the instances before deleting the group. This bypasses that behavior and potentially leaves resources dangling | `bool` | `false` | no |
| <a name="input_health_check_grace_period"></a> [health\_check\_grace\_period](#input\_health\_check\_grace\_period) | Time (in seconds) after instance comes into service before checking health | `number` | `300` | no |
| <a name="input_health_check_type"></a> [health\_check\_type](#input\_health\_check\_type) | Controls how health checking is done. Valid values are `EC2` or `ELB` | `string` | `"EC2"` | no |
| <a name="input_id_length_limit"></a> [id\_length\_limit](#input\_id\_length\_limit) | Limit `id` to this many characters (minimum 6).<br/>Set to `0` for unlimited length.<br/>Set to `null` for keep the existing setting, which defaults to `0`.<br/>Does not affect `id_full`. | `number` | `null` | no |
| <a name="input_image_id"></a> [image\_id](#input\_image\_id) | EC2 image ID to launch. If not provided, the module will lookup the most recent EKS AMI. See https://docs.aws.amazon.com/eks/latest/userguide/eks-optimized-ami.html for more details on EKS-optimized images | `string` | `""` | no |
| <a name="input_instance_initiated_shutdown_behavior"></a> [instance\_initiated\_shutdown\_behavior](#input\_instance\_initiated\_shutdown\_behavior) | Shutdown behavior for the instances. Can be `stop` or `terminate` | `string` | `"terminate"` | no |
| <a name="input_instance_market_options"></a> [instance\_market\_options](#input\_instance\_market\_options) | The market (purchasing) option for the instances | <pre>object({<br/>    market_type = string<br/>    spot_options = object({<br/>      block_duration_minutes         = number<br/>      instance_interruption_behavior = string<br/>      max_price                      = number<br/>      spot_instance_type             = string<br/>      valid_until                    = string<br/>    })<br/>  })</pre> | `null` | no |
| <a name="input_instance_type"></a> [instance\_type](#input\_instance\_type) | Instance type to launch | `string` | n/a | yes |
| <a name="input_key_name"></a> [key\_name](#input\_key\_name) | SSH key name that should be used for the instance | `string` | `""` | no |
| <a name="input_kubelet_extra_args"></a> [kubelet\_extra\_args](#input\_kubelet\_extra\_args) | Extra arguments to pass to kubelet, like "--register-with-taints=dedicated=ci-cd:NoSchedule --node-labels=purpose=ci-worker" | `string` | `""` | no |
| <a name="input_label_key_case"></a> [label\_key\_case](#input\_label\_key\_case) | Controls the letter case of the `tags` keys (label names) for tags generated by this module.<br/>Does not affect keys of tags passed in via the `tags` input.<br/>Possible values: `lower`, `title`, `upper`.<br/>Default value: `title`. | `string` | `null` | no |
| <a name="input_label_order"></a> [label\_order](#input\_label\_order) | The order in which the labels (ID elements) appear in the `id`.<br/>Defaults to ["namespace", "environment", "stage", "name", "attributes"].<br/>You can omit any of the 6 labels ("tenant" is the 6th), but at least one must be present. | `list(string)` | `null` | no |
| <a name="input_label_value_case"></a> [label\_value\_case](#input\_label\_value\_case) | Controls the letter case of ID elements (labels) as included in `id`,<br/>set as tag values, and output by this module individually.<br/>Does not affect values of tags passed in via the `tags` input.<br/>Possible values: `lower`, `title`, `upper` and `none` (no transformation).<br/>Set this to `title` and set `delimiter` to `""` to yield Pascal Case IDs.<br/>Default value: `lower`. | `string` | `null` | no |
| <a name="input_labels_as_tags"></a> [labels\_as\_tags](#input\_labels\_as\_tags) | Set of labels (ID elements) to include as tags in the `tags` output.<br/>Default is to include all labels.<br/>Tags with empty values will not be included in the `tags` output.<br/>Set to `[]` to suppress all generated tags.<br/>**Notes:**<br/>  The value of the `name` tag, if included, will be the `id`, not the `name`.<br/>  Unlike other `null-label` inputs, the initial setting of `labels_as_tags` cannot be<br/>  changed in later chained modules. Attempts to change it will be silently ignored. | `set(string)` | <pre>[<br/>  "default"<br/>]</pre> | no |
| <a name="input_load_balancers"></a> [load\_balancers](#input\_load\_balancers) | A list of elastic load balancer names to add to the autoscaling group. Only valid for classic load balancers. For ALBs, use `target_group_arns` instead | `list(string)` | `[]` | no |
| <a name="input_max_instance_lifetime"></a> [max\_instance\_lifetime](#input\_max\_instance\_lifetime) | The maximum amount of time, in seconds, that an instance can be in service, values must be either equal to 0 or between 604800 and 31536000 seconds | `number` | `null` | no |
| <a name="input_max_size"></a> [max\_size](#input\_max\_size) | The maximum size of the autoscale group | `number` | n/a | yes |
| <a name="input_metadata_http_endpoint_enabled"></a> [metadata\_http\_endpoint\_enabled](#input\_metadata\_http\_endpoint\_enabled) | Set false to disable the Instance Metadata Service. | `bool` | `true` | no |
| <a name="input_metadata_http_put_response_hop_limit"></a> [metadata\_http\_put\_response\_hop\_limit](#input\_metadata\_http\_put\_response\_hop\_limit) | The desired HTTP PUT response hop limit (between 1 and 64) for Instance Metadata Service requests.<br/>The default is `2` to support containerized workloads. | `number` | `2` | no |
| <a name="input_metadata_http_tokens_required"></a> [metadata\_http\_tokens\_required](#input\_metadata\_http\_tokens\_required) | Set true to require IMDS session tokens, disabling Instance Metadata Service Version 1. | `bool` | `true` | no |
| <a name="input_metrics_granularity"></a> [metrics\_granularity](#input\_metrics\_granularity) | The granularity to associate with the metrics to collect. The only valid value is 1Minute | `string` | `"1Minute"` | no |
| <a name="input_min_elb_capacity"></a> [min\_elb\_capacity](#input\_min\_elb\_capacity) | Setting this causes Terraform to wait for this number of instances to show up healthy in the ELB only on creation. Updates will not wait on ELB instance number changes | `number` | `0` | no |
| <a name="input_min_size"></a> [min\_size](#input\_min\_size) | The minimum size of the autoscale group | `number` | n/a | yes |
| <a name="input_mixed_instances_policy"></a> [mixed\_instances\_policy](#input\_mixed\_instances\_policy) | policy to used mixed group of on demand/spot of differing types. Launch template is automatically generated. https://www.terraform.io/docs/providers/aws/r/autoscaling_group.html#mixed_instances_policy-1 | <pre>object({<br/>    instances_distribution = object({<br/>      on_demand_allocation_strategy            = string<br/>      on_demand_base_capacity                  = number<br/>      on_demand_percentage_above_base_capacity = number<br/>      spot_allocation_strategy                 = string<br/>      spot_instance_pools                      = number<br/>      spot_max_price                           = string<br/>    })<br/>    override = list(object({<br/>      instance_type     = string<br/>      weighted_capacity = number<br/>    }))<br/>  })</pre> | `null` | no |
| <a name="input_name"></a> [name](#input\_name) | ID element. Usually the component or solution name, e.g. 'app' or 'jenkins'.<br/>This is the only ID element not also included as a `tag`.<br/>The "name" tag is set to the full `id` string. There is no tag with the value of the `name` input. | `string` | `null` | no |
| <a name="input_namespace"></a> [namespace](#input\_namespace) | ID element. Usually an abbreviation of your organization name, e.g. 'eg' or 'cp', to help ensure generated IDs are globally unique | `string` | `null` | no |
| <a name="input_placement"></a> [placement](#input\_placement) | The placement specifications of the instances | <pre>object({<br/>    affinity          = string<br/>    availability_zone = string<br/>    group_name        = string<br/>    host_id           = string<br/>    tenancy           = string<br/>  })</pre> | `null` | no |
| <a name="input_placement_group"></a> [placement\_group](#input\_placement\_group) | The name of the placement group into which you'll launch your instances, if any | `string` | `""` | no |
| <a name="input_protect_from_scale_in"></a> [protect\_from\_scale\_in](#input\_protect\_from\_scale\_in) | Allows setting instance protection. The autoscaling group will not select instances with this setting for terminination during scale in events | `bool` | `false` | no |
| <a name="input_regex_replace_chars"></a> [regex\_replace\_chars](#input\_regex\_replace\_chars) | Terraform regular expression (regex) string.<br/>Characters matching the regex will be removed from the ID elements.<br/>If not set, `"/[^a-zA-Z0-9-]/"` is used to remove all characters other than hyphens, letters and digits. | `string` | `null` | no |
| <a name="input_scale_down_adjustment_type"></a> [scale\_down\_adjustment\_type](#input\_scale\_down\_adjustment\_type) | Specifies whether the adjustment is an absolute number or a percentage of the current capacity. Valid values are `ChangeInCapacity`, `ExactCapacity` and `PercentChangeInCapacity` | `string` | `"ChangeInCapacity"` | no |
| <a name="input_scale_down_cooldown_seconds"></a> [scale\_down\_cooldown\_seconds](#input\_scale\_down\_cooldown\_seconds) | The amount of time, in seconds, after a scaling activity completes and before the next scaling activity can start | `number` | `300` | no |
| <a name="input_scale_down_policy_type"></a> [scale\_down\_policy\_type](#input\_scale\_down\_policy\_type) | The scalling policy type, either `SimpleScaling`, `StepScaling` or `TargetTrackingScaling` | `string` | `"SimpleScaling"` | no |
| <a name="input_scale_down_scaling_adjustment"></a> [scale\_down\_scaling\_adjustment](#input\_scale\_down\_scaling\_adjustment) | The number of instances by which to scale. `scale_down_scaling_adjustment` determines the interpretation of this number (e.g. as an absolute number or as a percentage of the existing Auto Scaling group size). A positive increment adds to the current capacity and a negative value removes from the current capacity | `number` | `-1` | no |
| <a name="input_scale_up_adjustment_type"></a> [scale\_up\_adjustment\_type](#input\_scale\_up\_adjustment\_type) | Specifies whether the adjustment is an absolute number or a percentage of the current capacity. Valid values are `ChangeInCapacity`, `ExactCapacity` and `PercentChangeInCapacity` | `string` | `"ChangeInCapacity"` | no |
| <a name="input_scale_up_cooldown_seconds"></a> [scale\_up\_cooldown\_seconds](#input\_scale\_up\_cooldown\_seconds) | The amount of time, in seconds, after a scaling activity completes and before the next scaling activity can start | `number` | `300` | no |
| <a name="input_scale_up_policy_type"></a> [scale\_up\_policy\_type](#input\_scale\_up\_policy\_type) | The scalling policy type, either `SimpleScaling`, `StepScaling` or `TargetTrackingScaling` | `string` | `"SimpleScaling"` | no |
| <a name="input_scale_up_scaling_adjustment"></a> [scale\_up\_scaling\_adjustment](#input\_scale\_up\_scaling\_adjustment) | The number of instances by which to scale. `scale_up_adjustment_type` determines the interpretation of this number (e.g. as an absolute number or as a percentage of the existing Auto Scaling group size). A positive increment adds to the current capacity and a negative value removes from the current capacity | `number` | `1` | no |
| <a name="input_service_linked_role_arn"></a> [service\_linked\_role\_arn](#input\_service\_linked\_role\_arn) | The ARN of the service-linked role that the ASG will use to call other AWS services | `string` | `""` | no |
| <a name="input_stage"></a> [stage](#input\_stage) | ID element. Usually used to indicate role, e.g. 'prod', 'staging', 'source', 'build', 'test', 'deploy', 'release' | `string` | `null` | no |
| <a name="input_subnet_ids"></a> [subnet\_ids](#input\_subnet\_ids) | A list of subnet IDs to launch resources in | `list(string)` | n/a | yes |
| <a name="input_suspended_processes"></a> [suspended\_processes](#input\_suspended\_processes) | A list of processes to suspend for the AutoScaling Group. The allowed values are `Launch`, `Terminate`, `HealthCheck`, `ReplaceUnhealthy`, `AZRebalance`, `AlarmNotification`, `ScheduledActions`, `AddToLoadBalancer`. Note that if you suspend either the `Launch` or `Terminate` process types, it can prevent your autoscaling group from functioning properly. | `list(string)` | `[]` | no |
| <a name="input_tags"></a> [tags](#input\_tags) | Additional tags (e.g. `{'BusinessUnit': 'XYZ'}`).<br/>Neither the tag keys nor the tag values will be modified by this module. | `map(string)` | `{}` | no |
| <a name="input_target_group_arns"></a> [target\_group\_arns](#input\_target\_group\_arns) | A list of aws\_alb\_target\_group ARNs, for use with Application Load Balancing | `list(string)` | `[]` | no |
| <a name="input_tenant"></a> [tenant](#input\_tenant) | ID element \_(Rarely used, not included by default)\_. A customer identifier, indicating who this instance of a resource is for | `string` | `null` | no |
| <a name="input_termination_policies"></a> [termination\_policies](#input\_termination\_policies) | A list of policies to decide how the instances in the auto scale group should be terminated. The allowed values are `OldestInstance`, `NewestInstance`, `OldestLaunchConfiguration`, `ClosestToNextInstanceHour`, `Default` | `list(string)` | <pre>[<br/>  "Default"<br/>]</pre> | no |
| <a name="input_use_custom_image_id"></a> [use\_custom\_image\_id](#input\_use\_custom\_image\_id) | If set to `true`, will use variable `image_id` for the EKS workers inside autoscaling group | `bool` | `false` | no |
| <a name="input_use_existing_aws_iam_instance_profile"></a> [use\_existing\_aws\_iam\_instance\_profile](#input\_use\_existing\_aws\_iam\_instance\_profile) | If set to `true`, will use variable `aws_iam_instance_profile_name` to run EKS workers using an existing AWS instance profile that was created outside of this module, workaround for error like `count cannot be computed` | `bool` | `false` | no |
| <a name="input_use_existing_security_group"></a> [use\_existing\_security\_group](#input\_use\_existing\_security\_group) | If set to `true`, will use variable `workers_security_group_id` to run EKS workers using an existing security group that was created outside of this module, workaround for errors like `count cannot be computed` | `bool` | `false` | no |
| <a name="input_vpc_id"></a> [vpc\_id](#input\_vpc\_id) | VPC ID for the EKS cluster | `string` | n/a | yes |
| <a name="input_wait_for_capacity_timeout"></a> [wait\_for\_capacity\_timeout](#input\_wait\_for\_capacity\_timeout) | A maximum duration that Terraform should wait for ASG instances to be healthy before timing out. Setting this to '0' causes Terraform to skip all Capacity Waiting behavior | `string` | `"10m"` | no |
| <a name="input_wait_for_elb_capacity"></a> [wait\_for\_elb\_capacity](#input\_wait\_for\_elb\_capacity) | Setting this will cause Terraform to wait for exactly this number of healthy instances in all attached load balancers on both create and update operations. Takes precedence over `min_elb_capacity` behavior | `number` | `0` | no |
| <a name="input_workers_role_policy_arns"></a> [workers\_role\_policy\_arns](#input\_workers\_role\_policy\_arns) | List of policy ARNs that will be attached to the workers default role on creation | `list(string)` | `[]` | no |
| <a name="input_workers_role_policy_arns_count"></a> [workers\_role\_policy\_arns\_count](#input\_workers\_role\_policy\_arns\_count) | Count of policy ARNs that will be attached to the workers default role on creation. Needed to prevent Terraform error `count can't be computed` | `number` | `0` | no |
| <a name="input_workers_security_group_id"></a> [workers\_security\_group\_id](#input\_workers\_security\_group\_id) | The name of the existing security group that will be used in autoscaling group for EKS workers. If empty, a new security group will be created | `string` | `""` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_autoscaling_group_arn"></a> [autoscaling\_group\_arn](#output\_autoscaling\_group\_arn) | ARN of the AutoScaling Group |
| <a name="output_autoscaling_group_default_cooldown"></a> [autoscaling\_group\_default\_cooldown](#output\_autoscaling\_group\_default\_cooldown) | Time between a scaling activity and the succeeding scaling activity |
| <a name="output_autoscaling_group_desired_capacity"></a> [autoscaling\_group\_desired\_capacity](#output\_autoscaling\_group\_desired\_capacity) | The number of Amazon EC2 instances that should be running in the group |
| <a name="output_autoscaling_group_health_check_grace_period"></a> [autoscaling\_group\_health\_check\_grace\_period](#output\_autoscaling\_group\_health\_check\_grace\_period) | Time after instance comes into service before checking health |
| <a name="output_autoscaling_group_health_check_type"></a> [autoscaling\_group\_health\_check\_type](#output\_autoscaling\_group\_health\_check\_type) | `EC2` or `ELB`. Controls how health checking is done |
| <a name="output_autoscaling_group_id"></a> [autoscaling\_group\_id](#output\_autoscaling\_group\_id) | The AutoScaling Group ID |
| <a name="output_autoscaling_group_max_size"></a> [autoscaling\_group\_max\_size](#output\_autoscaling\_group\_max\_size) | The maximum size of the AutoScaling Group |
| <a name="output_autoscaling_group_min_size"></a> [autoscaling\_group\_min\_size](#output\_autoscaling\_group\_min\_size) | The minimum size of the AutoScaling Group |
| <a name="output_autoscaling_group_name"></a> [autoscaling\_group\_name](#output\_autoscaling\_group\_name) | The AutoScaling Group name |
| <a name="output_autoscaling_group_tags"></a> [autoscaling\_group\_tags](#output\_autoscaling\_group\_tags) | A list of tag settings associated with the AutoScaling Group |
| <a name="output_launch_template_arn"></a> [launch\_template\_arn](#output\_launch\_template\_arn) | ARN of the launch template |
| <a name="output_launch_template_id"></a> [launch\_template\_id](#output\_launch\_template\_id) | The ID of the launch template |
| <a name="output_security_group_arn"></a> [security\_group\_arn](#output\_security\_group\_arn) | ARN of the worker nodes Security Group |
| <a name="output_security_group_id"></a> [security\_group\_id](#output\_security\_group\_id) | ID of the worker nodes Security Group |
| <a name="output_security_group_name"></a> [security\_group\_name](#output\_security\_group\_name) | Name of the worker nodes Security Group |
| <a name="output_workers_role_arn"></a> [workers\_role\_arn](#output\_workers\_role\_arn) | ARN of the worker nodes IAM role |
| <a name="output_workers_role_name"></a> [workers\_role\_name](#output\_workers\_role\_name) | Name of the worker nodes IAM role |
<!-- markdownlint-restore -->

