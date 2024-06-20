---
title: eks-fargate-profile
sidebar_label: eks-fargate-profile
sidebar_class_name: command
description: |-
  Terraform module to provision an [AWS Fargate Profile](https://docs.aws.amazon.com/eks/latest/userguide/fargate-profile.html) 
  and Fargate Pod Execution Role for [EKS](https://aws.amazon.com/eks/).
custom_edit_url: https://github.com/cloudposse/terraform-aws-eks-fargate-profile/blob/main/README.yaml
---

# Module: `eks-fargate-profile`
Terraform module to provision an [AWS Fargate Profile](https://docs.aws.amazon.com/eks/latest/userguide/fargate-profile.html) 
and Fargate Pod Execution Role for [EKS](https://aws.amazon.com/eks/).




## Introduction

By default, this module will provision an [AWS Fargate Profile](https://docs.aws.amazon.com/eks/latest/userguide/fargate-profile.html) 
and Fargate Pod Execution Role for [EKS](https://aws.amazon.com/eks/). 

Note that in general, you only need one Fargate Pod Execution Role per AWS account, 
and it can be shared across regions. So if you are creating multiple Faragte Profiles, 
you can reuse the role created by the first one, or instantiate this module with 
`fargate_profile_enabled = false` to create the role separate from the profile. 



## Usage


For a complete example, see [examples/complete](https://github.com/cloudposse/terraform-aws-eks-fargate-profile/tree/main/examples/complete).

For automated tests of the complete example using [bats](https://github.com/bats-core/bats-core) and [Terratest](https://github.com/gruntwork-io/terratest)
(which tests and deploys the example on AWS), see [test](https://github.com/cloudposse/terraform-aws-eks-fargate-profile/tree/main/test).

```hcl
  module "label" {
    source  = "cloudposse/label/null"
    version = "0.25.0"
  
    # This is the preferred way to add attributes. It will put "cluster" last
    # after any attributes set in `var.attributes` or `context.attributes`.
    # In this case, we do not care, because we are only using this instance
    # of this module to create tags.
    attributes = ["cluster"]
  
    context = module.this.context
  }
  
  locals {
    tags = try(merge(module.label.tags, tomap("kubernetes.io/cluster/${module.label.id}", "shared")), null)
    
    eks_worker_ami_name_filter = "amazon-eks-node-${var.kubernetes_version}*"
  
    allow_all_ingress_rule = {
      key              = "allow_all_ingress"
      type             = "ingress"
      from_port        = 0
      to_port          = 0 # [sic] from and to port ignored when protocol is "-1", warning if not zero
      protocol         = "-1"
      description      = "Allow all ingress"
      cidr_blocks      = ["0.0.0.0/0"]
      ipv6_cidr_blocks = ["::/0"]
    }
  
    allow_http_ingress_rule = {
      key              = "http"
      type             = "ingress"
      from_port        = 80
      to_port          = 80
      protocol         = "tcp"
      description      = "Allow HTTP ingress"
      cidr_blocks      = ["0.0.0.0/0"]
      ipv6_cidr_blocks = ["::/0"]
    }
  
    extra_policy_arn = "arn:aws:iam::aws:policy/job-function/ViewOnlyAccess"
  }
  
  module "vpc" {
    source  = "cloudposse/vpc/aws"
    version = "1.1.0"
  
    cidr_block = var.vpc_cidr_block
    tags       = local.tags
  
    context = module.this.context
  }
  
  module "subnets" {
    source  = "cloudposse/dynamic-subnets/aws"
    version = "1.0.0"
  
    availability_zones   = var.availability_zones
    vpc_id               = module.vpc.vpc_id
    igw_id               = module.vpc.igw_id
    cidr_block           = module.vpc.vpc_cidr_block
    nat_gateway_enabled  = true
    nat_instance_enabled = false
    tags                 = local.tags
  
    context = module.this.context
  }
  
  module "ssh_source_access" {
    source  = "cloudposse/security-group/aws"
    version = "1.0.1"
  
    attributes                 = ["ssh", "source"]
    security_group_description = "Test source security group ssh access only"
    create_before_destroy      = true
    allow_all_egress           = true
  
    rules = [local.allow_all_ingress_rule]
  
    vpc_id = module.vpc.vpc_id
  
    context = module.label.context
  }
  
  module "https_sg" {
    source  = "cloudposse/security-group/aws"
    version = "1.0.1"
  
    attributes                 = ["http"]
    security_group_description = "Allow http access"
    create_before_destroy      = true
    allow_all_egress           = true
  
    rules = [local.allow_http_ingress_rule]
  
    vpc_id = module.vpc.vpc_id
  
    context = module.label.context
  }
  
  module "eks_cluster" {
    source  = "cloudposse/eks-cluster/aws"
    version = "2.2.0"
  
    region                       = var.region
    vpc_id                       = module.vpc.vpc_id
    subnet_ids                   = module.subnets.public_subnet_ids
    kubernetes_version           = var.kubernetes_version
    local_exec_interpreter       = var.local_exec_interpreter
    oidc_provider_enabled        = var.oidc_provider_enabled
    enabled_cluster_log_types    = var.enabled_cluster_log_types
    cluster_log_retention_period = var.cluster_log_retention_period
  
    # data auth has problems destroying the auth-map
    kube_data_auth_enabled = false
    kube_exec_auth_enabled = true
  
    context = module.this.context
  }
  
  module "eks_node_group" {
    source  = "cloudposse/eks-node-group/aws"
    version = "2.4.0"
  
    subnet_ids                    = module.subnets.public_subnet_ids
    cluster_name                  = module.eks_cluster.eks_cluster_id
    instance_types                = var.instance_types
    desired_size                  = var.desired_size
    min_size                      = var.min_size
    max_size                      = var.max_size
    kubernetes_version            = [var.kubernetes_version]
    kubernetes_labels             = merge(var.kubernetes_labels, { attributes = coalesce(join(module.this.delimiter, module.this.attributes), "none") })
    kubernetes_taints             = var.kubernetes_taints
    ec2_ssh_key_name              = var.ec2_ssh_key_name
    ssh_access_security_group_ids = [module.ssh_source_access.id]
    associated_security_group_ids = [module.ssh_source_access.id, module.https_sg.id]
    node_role_policy_arns         = [local.extra_policy_arn]
    update_config                 = var.update_config
  
    after_cluster_joining_userdata = var.after_cluster_joining_userdata
  
    ami_type            = var.ami_type
    ami_release_version = var.ami_release_version
  
    before_cluster_joining_userdata = [var.before_cluster_joining_userdata]
  
    context = module.this.context
  
    # Ensure ordering of resource creation to eliminate the race conditions when applying the Kubernetes Auth ConfigMap.
    # Do not create Node Group before the EKS cluster is created and the `aws-auth` Kubernetes ConfigMap is applied.
    depends_on = [module.eks_cluster, module.eks_cluster.kubernetes_config_map_id]
  
    create_before_destroy = true
  
    node_group_terraform_timeouts = [{
      create = "40m"
      update = null
      delete = "20m"
    }]
  }
  
  module "eks_fargate_profile" {
    source  = "cloudposse/eks-fargate-profile/aws"
    version = "x.x.x"
  
    subnet_ids                              = module.subnets.public_subnet_ids
    cluster_name                            = module.eks_cluster.eks_cluster_id
    kubernetes_namespace                    = var.kubernetes_namespace
    kubernetes_labels                       = var.kubernetes_labels
    iam_role_kubernetes_namespace_delimiter = var.iam_role_kubernetes_namespace_delimiter
  
    context = module.this.context
  }

```






<!-- markdownlint-disable -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 1.0.0 |
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | >= 3.71.0 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | >= 3.71.0 |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_fargate_profile_label"></a> [fargate\_profile\_label](#module\_fargate\_profile\_label) | cloudposse/label/null | 0.25.0 |
| <a name="module_role_label"></a> [role\_label](#module\_role\_label) | cloudposse/label/null | 0.25.0 |
| <a name="module_this"></a> [this](#module\_this) | cloudposse/label/null | 0.25.0 |

## Resources

| Name | Type |
|------|------|
| [aws_eks_fargate_profile.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/eks_fargate_profile) | resource |
| [aws_iam_role.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role) | resource |
| [aws_iam_role_policy_attachment.amazon_eks_fargate_pod_execution_role_policy](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_iam_policy_document.assume_role](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_partition.current](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/partition) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_additional_tag_map"></a> [additional\_tag\_map](#input\_additional\_tag\_map) | Additional key-value pairs to add to each map in `tags_as_list_of_maps`. Not added to `tags` or `id`.<br/>This is for some rare cases where resources want additional configuration of tags<br/>and therefore take a list of maps with tag key, value, and additional configuration. | `map(string)` | `{}` | no |
| <a name="input_attributes"></a> [attributes](#input\_attributes) | ID element. Additional attributes (e.g. `workers` or `cluster`) to add to `id`,<br/>in the order they appear in the list. New attributes are appended to the<br/>end of the list. The elements of the list are joined by the `delimiter`<br/>and treated as a single ID element. | `list(string)` | `[]` | no |
| <a name="input_cluster_name"></a> [cluster\_name](#input\_cluster\_name) | The name of the EKS cluster | `string` | `""` | no |
| <a name="input_context"></a> [context](#input\_context) | Single object for setting entire context at once.<br/>See description of individual variables for details.<br/>Leave string and numeric variables as `null` to use default value.<br/>Individual variable settings (non-null) override settings in context object,<br/>except for attributes, tags, and additional\_tag\_map, which are merged. | `any` | <pre>{<br/>  "additional_tag_map": {},<br/>  "attributes": [],<br/>  "delimiter": null,<br/>  "descriptor_formats": {},<br/>  "enabled": true,<br/>  "environment": null,<br/>  "id_length_limit": null,<br/>  "label_key_case": null,<br/>  "label_order": [],<br/>  "label_value_case": null,<br/>  "labels_as_tags": [<br/>    "unset"<br/>  ],<br/>  "name": null,<br/>  "namespace": null,<br/>  "regex_replace_chars": null,<br/>  "stage": null,<br/>  "tags": {},<br/>  "tenant": null<br/>}</pre> | no |
| <a name="input_delimiter"></a> [delimiter](#input\_delimiter) | Delimiter to be used between ID elements.<br/>Defaults to `-` (hyphen). Set to `""` to use no delimiter at all. | `string` | `null` | no |
| <a name="input_descriptor_formats"></a> [descriptor\_formats](#input\_descriptor\_formats) | Describe additional descriptors to be output in the `descriptors` output map.<br/>Map of maps. Keys are names of descriptors. Values are maps of the form<br/>`{<br/>   format = string<br/>   labels = list(string)<br/>}`<br/>(Type is `any` so the map values can later be enhanced to provide additional options.)<br/>`format` is a Terraform format string to be passed to the `format()` function.<br/>`labels` is a list of labels, in order, to pass to `format()` function.<br/>Label values will be normalized before being passed to `format()` so they will be<br/>identical to how they appear in `id`.<br/>Default is `{}` (`descriptors` output will be empty). | `any` | `{}` | no |
| <a name="input_enabled"></a> [enabled](#input\_enabled) | Set to false to prevent the module from creating any resources | `bool` | `null` | no |
| <a name="input_environment"></a> [environment](#input\_environment) | ID element. Usually used for region e.g. 'uw2', 'us-west-2', OR role 'prod', 'staging', 'dev', 'UAT' | `string` | `null` | no |
| <a name="input_fargate_pod_execution_role_arn"></a> [fargate\_pod\_execution\_role\_arn](#input\_fargate\_pod\_execution\_role\_arn) | ARN of the Fargate Pod Execution Role. Required if `fargate_pod_execution_role_enabled` is `false`, otherwise ignored. | `string` | `null` | no |
| <a name="input_fargate_pod_execution_role_enabled"></a> [fargate\_pod\_execution\_role\_enabled](#input\_fargate\_pod\_execution\_role\_enabled) | Set false to disable the Fargate Pod Execution Role creation | `bool` | `true` | no |
| <a name="input_fargate_pod_execution_role_name"></a> [fargate\_pod\_execution\_role\_name](#input\_fargate\_pod\_execution\_role\_name) | Fargate Pod Execution Role name. If not provided, will be derived from the context | `string` | `null` | no |
| <a name="input_fargate_profile_enabled"></a> [fargate\_profile\_enabled](#input\_fargate\_profile\_enabled) | Set false to disable the Fargate Profile creation | `bool` | `true` | no |
| <a name="input_fargate_profile_iam_role_name"></a> [fargate\_profile\_iam\_role\_name](#input\_fargate\_profile\_iam\_role\_name) | DEPRECATED (use `fargate_pod_execution_role_name` instead): Fargate profile IAM role name. If not provided, will be derived from the context | `string` | `null` | no |
| <a name="input_fargate_profile_name"></a> [fargate\_profile\_name](#input\_fargate\_profile\_name) | Fargate profile name. If not provided, will be derived from the context | `string` | `null` | no |
| <a name="input_iam_role_kubernetes_namespace_delimiter"></a> [iam\_role\_kubernetes\_namespace\_delimiter](#input\_iam\_role\_kubernetes\_namespace\_delimiter) | Delimiter for the Kubernetes namespace in the IAM Role name | `string` | `"-"` | no |
| <a name="input_id_length_limit"></a> [id\_length\_limit](#input\_id\_length\_limit) | Limit `id` to this many characters (minimum 6).<br/>Set to `0` for unlimited length.<br/>Set to `null` for keep the existing setting, which defaults to `0`.<br/>Does not affect `id_full`. | `number` | `null` | no |
| <a name="input_kubernetes_labels"></a> [kubernetes\_labels](#input\_kubernetes\_labels) | Key-value mapping of Kubernetes labels for selection | `map(string)` | `{}` | no |
| <a name="input_kubernetes_namespace"></a> [kubernetes\_namespace](#input\_kubernetes\_namespace) | Kubernetes namespace for selection | `string` | `""` | no |
| <a name="input_label_key_case"></a> [label\_key\_case](#input\_label\_key\_case) | Controls the letter case of the `tags` keys (label names) for tags generated by this module.<br/>Does not affect keys of tags passed in via the `tags` input.<br/>Possible values: `lower`, `title`, `upper`.<br/>Default value: `title`. | `string` | `null` | no |
| <a name="input_label_order"></a> [label\_order](#input\_label\_order) | The order in which the labels (ID elements) appear in the `id`.<br/>Defaults to ["namespace", "environment", "stage", "name", "attributes"].<br/>You can omit any of the 6 labels ("tenant" is the 6th), but at least one must be present. | `list(string)` | `null` | no |
| <a name="input_label_value_case"></a> [label\_value\_case](#input\_label\_value\_case) | Controls the letter case of ID elements (labels) as included in `id`,<br/>set as tag values, and output by this module individually.<br/>Does not affect values of tags passed in via the `tags` input.<br/>Possible values: `lower`, `title`, `upper` and `none` (no transformation).<br/>Set this to `title` and set `delimiter` to `""` to yield Pascal Case IDs.<br/>Default value: `lower`. | `string` | `null` | no |
| <a name="input_labels_as_tags"></a> [labels\_as\_tags](#input\_labels\_as\_tags) | Set of labels (ID elements) to include as tags in the `tags` output.<br/>Default is to include all labels.<br/>Tags with empty values will not be included in the `tags` output.<br/>Set to `[]` to suppress all generated tags.<br/>**Notes:**<br/>  The value of the `name` tag, if included, will be the `id`, not the `name`.<br/>  Unlike other `null-label` inputs, the initial setting of `labels_as_tags` cannot be<br/>  changed in later chained modules. Attempts to change it will be silently ignored. | `set(string)` | <pre>[<br/>  "default"<br/>]</pre> | no |
| <a name="input_name"></a> [name](#input\_name) | ID element. Usually the component or solution name, e.g. 'app' or 'jenkins'.<br/>This is the only ID element not also included as a `tag`.<br/>The "name" tag is set to the full `id` string. There is no tag with the value of the `name` input. | `string` | `null` | no |
| <a name="input_namespace"></a> [namespace](#input\_namespace) | ID element. Usually an abbreviation of your organization name, e.g. 'eg' or 'cp', to help ensure generated IDs are globally unique | `string` | `null` | no |
| <a name="input_permissions_boundary"></a> [permissions\_boundary](#input\_permissions\_boundary) | If provided, all IAM roles will be created with this permissions boundary attached | `string` | `null` | no |
| <a name="input_regex_replace_chars"></a> [regex\_replace\_chars](#input\_regex\_replace\_chars) | Terraform regular expression (regex) string.<br/>Characters matching the regex will be removed from the ID elements.<br/>If not set, `"/[^a-zA-Z0-9-]/"` is used to remove all characters other than hyphens, letters and digits. | `string` | `null` | no |
| <a name="input_stage"></a> [stage](#input\_stage) | ID element. Usually used to indicate role, e.g. 'prod', 'staging', 'source', 'build', 'test', 'deploy', 'release' | `string` | `null` | no |
| <a name="input_subnet_ids"></a> [subnet\_ids](#input\_subnet\_ids) | Identifiers of private EC2 Subnets to associate with the EKS Fargate Profile. These subnets must have the following resource tag: kubernetes.io/cluster/CLUSTER\_NAME (where CLUSTER\_NAME is replaced with the name of the EKS Cluster) | `list(string)` | `[]` | no |
| <a name="input_tags"></a> [tags](#input\_tags) | Additional tags (e.g. `{'BusinessUnit': 'XYZ'}`).<br/>Neither the tag keys nor the tag values will be modified by this module. | `map(string)` | `{}` | no |
| <a name="input_tenant"></a> [tenant](#input\_tenant) | ID element \_(Rarely used, not included by default)\_. A customer identifier, indicating who this instance of a resource is for | `string` | `null` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_eks_fargate_pod_execution_role_arn"></a> [eks\_fargate\_pod\_execution\_role\_arn](#output\_eks\_fargate\_pod\_execution\_role\_arn) | ARN of the EKS Fargate Pod Execution role |
| <a name="output_eks_fargate_pod_execution_role_name"></a> [eks\_fargate\_pod\_execution\_role\_name](#output\_eks\_fargate\_pod\_execution\_role\_name) | Name of the EKS Fargate Pod Execution role |
| <a name="output_eks_fargate_profile_arn"></a> [eks\_fargate\_profile\_arn](#output\_eks\_fargate\_profile\_arn) | Amazon Resource Name (ARN) of the EKS Fargate Profile |
| <a name="output_eks_fargate_profile_id"></a> [eks\_fargate\_profile\_id](#output\_eks\_fargate\_profile\_id) | EKS Cluster name and EKS Fargate Profile name separated by a colon |
| <a name="output_eks_fargate_profile_role_arn"></a> [eks\_fargate\_profile\_role\_arn](#output\_eks\_fargate\_profile\_role\_arn) | DEPRECATED (use `eks_fargate_pod_execution_role_arn` instead): ARN of the EKS Fargate Profile IAM role |
| <a name="output_eks_fargate_profile_role_name"></a> [eks\_fargate\_profile\_role\_name](#output\_eks\_fargate\_profile\_role\_name) | DEPRECATED (use `eks_fargate_pod_execution_role_name` instead): Name of the EKS Fargate Profile IAM role |
| <a name="output_eks_fargate_profile_status"></a> [eks\_fargate\_profile\_status](#output\_eks\_fargate\_profile\_status) | Status of the EKS Fargate Profile |
<!-- markdownlint-restore -->

