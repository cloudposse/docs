---
title: eks-node-group
sidebar_label: eks-node-group
sidebar_class_name: command
description: |-
  Terraform module to provision an EKS Node Group for [Elastic Container Service for Kubernetes](https://aws.amazon.com/eks/).

  Instantiate it multiple times to create many EKS node groups with specific settings such as GPUs, EC2 instance types, or autoscale parameters.

  **IMPORTANT:** This module provisions an `EKS Node Group` nodes globally accessible by SSH (22) port. Normally, AWS recommends that no security group allows unrestricted ingress access to port 22 .
custom_edit_url: https://github.com/cloudposse/terraform-aws-eks-node-group/blob/main/README.yaml
---

# Module: `eks-node-group`
Terraform module to provision an EKS Node Group for [Elastic Container Service for Kubernetes](https://aws.amazon.com/eks/).

Instantiate it multiple times to create many EKS node groups with specific settings such as GPUs, EC2 instance types, or autoscale parameters.

**IMPORTANT:** This module provisions an `EKS Node Group` nodes globally accessible by SSH (22) port. Normally, AWS recommends that no security group allows unrestricted ingress access to port 22 .




## Introduction





## Usage


### Major Changes (breaking and otherwise)

With the v2.0.0 (a.k.a. v0.25.0) release of this module, it has undergone major breaking
changes and added new features. Please see the [migration](https://github.com/cloudposse/terraform-aws-eks-node-group/tree/main/docs/migration-v1-v2.md)
document for details.


For a complete example, see [examples/complete](https://github.com/cloudposse/terraform-aws-eks-node-group/tree/main/examples/complete).

For automated tests of the complete example using [bats](https://github.com/bats-core/bats-core) and [Terratest](https://github.com/gruntwork-io/terratest) (which tests and deploys the example on AWS),
see [test](https://github.com/cloudposse/terraform-aws-eks-node-group/tree/main/test).

### Terraform Version

Terraform version 1.0 is out. Before that, there was Terraform version 0.15, 0.14, 0.13 and so on.
The v2.0.0 release of this module drops support for Terraform 0.13. That version is old and has lots of known issues.
There are hardly any breaking changes between Terraform 0.13 and 1.0, so please upgrade to
the latest Terraform version before raising any issues about this module.

### Sources of Information

- The code examples below are manually updated and have a tendency to fall out of sync with actual code,
particularly with respect to usage of other modules. Do not rely on them.
- The documentation on this page about this module's inputs, outputs, and compliance is all automatically
generated and is up-to-date as of the release date. After the code itself, this is your best source of information.
- The code in [examples/complete](https://github.com/cloudposse/terraform-aws-eks-node-group/tree/main/examples/complete) is automatically tested before every release,
so that is a good place to look for verified example code. Keep in mind, however, it is code for testing, so
it may not represent average use cases or best practices.
- Of course, the READMEs and `examples/complete` directories in the other modules' GitHub repos
are more authoritative with respect to how to use those modules than this README is.

#### Example Code

```hcl
provider "aws" {
  region = var.region
}

module "label" {
  source = "cloudposse/label/null"
  # Cloud Posse recommends pinning every module to a specific version
  # version  = "x.x.x"

  namespace  = var.namespace
  name       = var.name
  stage      = var.stage
  delimiter  = var.delimiter
  attributes = ["cluster"]
  tags       = var.tags
}

locals {
  # Prior to Kubernetes 1.19, the usage of the specific kubernetes.io/cluster/* resource tags below are required
  # for EKS and Kubernetes to discover and manage networking resources
  # https://www.terraform.io/docs/providers/aws/guides/eks-getting-started.html#base-vpc-networking
  tags = { "kubernetes.io/cluster/${module.label.id}" = "shared" }
}

module "vpc" {
  source = "cloudposse/vpc/aws"
  # Cloud Posse recommends pinning every module to a specific version
  # version = "1.x.x"

  cidr_block = "172.16.0.0/16"

  tags    = local.tags
  context = module.label.context
}

module "subnets" {
  source = "cloudposse/dynamic-subnets/aws"
  # Cloud Posse recommends pinning every module to a specific version
  # version = "2.x.x"

  availability_zones   = var.availability_zones
  vpc_id               = module.vpc.vpc_id
  igw_id               = [module.vpc.igw_id]
  ipv4_cidr_block      = [module.vpc.vpc_cidr_block]
  nat_gateway_enabled  = true
  nat_instance_enabled = false

  tags    = local.tags
  context = module.label.context
}

module "eks_cluster" {
  source = "cloudposse/eks-cluster/aws"
  # Cloud Posse recommends pinning every module to a specific version
  # version = "2.x.x"

  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.subnets.public_subnet_ids

  kubernetes_version    = var.kubernetes_version
  oidc_provider_enabled = true

  context = module.label.context
}

module "eks_node_group" {
  source = "cloudposse/eks-node-group/aws"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "2.x.x"

  instance_types        = [var.instance_type]
  subnet_ids            = module.subnets.public_subnet_ids
  min_size              = var.min_size
  max_size              = var.max_size
  cluster_name          = module.eks_cluster.eks_cluster_id
  create_before_destroy = true
  kubernetes_version    = var.kubernetes_version == null || var.kubernetes_version == "" ? [] : [var.kubernetes_version]

  # Enable the Kubernetes cluster auto-scaler to find the auto-scaling group
  cluster_autoscaler_enabled = var.autoscaling_policies_enabled

  context = module.label.context

  # Ensure the cluster is fully created before trying to add the node group
  module_depends_on = [module.eks_cluster.kubernetes_config_map_id]
}

```






<!-- markdownlint-disable -->
## Windows Managed Node groups

Windows managed node-groups have a few pre-requisites.

* Your cluster must contain at least one linux based worker node
* Your EKS Cluster must have the `AmazonEKSVPCResourceController` and `AmazonEKSClusterPolicy` policies attached
* Your cluster must have a config-map called amazon-vpc-cni with the following content

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
name: amazon-vpc-cni
namespace: kube-system
data:
enable-windows-ipam: "true"
```

* Windows nodes will automatically be tainted

```yaml
kubernetes_taints = [{
  key    = "WINDOWS"
  value  = "true"
  effect = "NO_SCHEDULE"
}]
```
* Any pods that target Windows will need to have the following attributes set in their manifest

```yaml
  nodeSelector:
    kubernetes.io/os: windows
    kubernetes.io/arch: amd64
```

https://docs.aws.amazon.com/eks/latest/userguide/windows-support.html
<!-- markdownlint-disable -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 1.3.0 |
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | >= 4.48 |
| <a name="requirement_random"></a> [random](#requirement\_random) | >= 2.0 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | >= 4.48 |
| <a name="provider_random"></a> [random](#provider\_random) | >= 2.0 |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_label"></a> [label](#module\_label) | cloudposse/label/null | 0.25.0 |
| <a name="module_ssh_access"></a> [ssh\_access](#module\_ssh\_access) | cloudposse/security-group/aws | 2.2.0 |
| <a name="module_this"></a> [this](#module\_this) | cloudposse/label/null | 0.25.0 |

## Resources

| Name | Type |
|------|------|
| [aws_eks_node_group.cbd](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/eks_node_group) | resource |
| [aws_eks_node_group.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/eks_node_group) | resource |
| [aws_iam_policy.ipv6_eks_cni_policy](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_policy) | resource |
| [aws_iam_role.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role) | resource |
| [aws_iam_role_policy_attachment.amazon_ec2_container_registry_read_only](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_iam_role_policy_attachment.amazon_eks_worker_node_policy](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_iam_role_policy_attachment.existing_policies_for_eks_workers_role](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_iam_role_policy_attachment.ipv6_eks_cni_policy](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_launch_template.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/launch_template) | resource |
| [random_pet.cbd](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/pet) | resource |
| [aws_ami.selected](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/ami) | data source |
| [aws_eks_cluster.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/eks_cluster) | data source |
| [aws_iam_policy_document.assume_role](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.ipv6_eks_cni_policy](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_launch_template.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/launch_template) | data source |
| [aws_partition.current](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/partition) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_additional_tag_map"></a> [additional\_tag\_map](#input\_additional\_tag\_map) | Additional key-value pairs to add to each map in `tags_as_list_of_maps`. Not added to `tags` or `id`.<br/>This is for some rare cases where resources want additional configuration of tags<br/>and therefore take a list of maps with tag key, value, and additional configuration. | `map(string)` | `{}` | no |
| <a name="input_after_cluster_joining_userdata"></a> [after\_cluster\_joining\_userdata](#input\_after\_cluster\_joining\_userdata) | Additional `bash` commands to execute on each worker node after joining the EKS cluster (after executing the `bootstrap.sh` script). For more info, see https://kubedex.com/90-days-of-aws-eks-in-production | `list(string)` | `[]` | no |
| <a name="input_ami_image_id"></a> [ami\_image\_id](#input\_ami\_image\_id) | AMI to use. Ignored if `launch_template_id` is supplied. | `list(string)` | `[]` | no |
| <a name="input_ami_release_version"></a> [ami\_release\_version](#input\_ami\_release\_version) | EKS AMI version to use, e.g. For AL2 "1.16.13-20200821" or for bottlerocket "1.2.0-ccf1b754" (no "v") or  for Windows "2023.02.14". For AL2, bottlerocket and Windows, it defaults to latest version for Kubernetes version. | `list(string)` | `[]` | no |
| <a name="input_ami_type"></a> [ami\_type](#input\_ami\_type) | Type of Amazon Machine Image (AMI) associated with the EKS Node Group.<br/>Defaults to `AL2_x86_64`. Valid values: `AL2_x86_64, AL2_x86_64_GPU, AL2_ARM_64, CUSTOM, BOTTLEROCKET_ARM_64, BOTTLEROCKET_x86_64, BOTTLEROCKET_ARM_64_NVIDIA, BOTTLEROCKET_x86_64_NVIDIA, WINDOWS_CORE_2019_x86_64, WINDOWS_FULL_2019_x86_64, WINDOWS_CORE_2022_x86_64, WINDOWS_FULL_2022_x86_64`. | `string` | `"AL2_x86_64"` | no |
| <a name="input_associate_cluster_security_group"></a> [associate\_cluster\_security\_group](#input\_associate\_cluster\_security\_group) | When true, associate the default cluster security group to the nodes. If disabled the EKS managed security group will not<br/>be associated to the nodes and you will need to provide another security group that allows the nodes to communicate with<br/>the EKS control plane. Be aware that if no `associated_security_group_ids` or `ssh_access_security_group_ids` are provided,<br/>then the nodes will have no inbound or outbound rules. | `bool` | `true` | no |
| <a name="input_associated_security_group_ids"></a> [associated\_security\_group\_ids](#input\_associated\_security\_group\_ids) | A list of IDs of Security Groups to associate the node group with, in addition to the EKS' created security group.<br/>These security groups will not be modified. | `list(string)` | `[]` | no |
| <a name="input_attributes"></a> [attributes](#input\_attributes) | ID element. Additional attributes (e.g. `workers` or `cluster`) to add to `id`,<br/>in the order they appear in the list. New attributes are appended to the<br/>end of the list. The elements of the list are joined by the `delimiter`<br/>and treated as a single ID element. | `list(string)` | `[]` | no |
| <a name="input_before_cluster_joining_userdata"></a> [before\_cluster\_joining\_userdata](#input\_before\_cluster\_joining\_userdata) | Additional `bash` commands to execute on each worker node before joining the EKS cluster (before executing the `bootstrap.sh` script). For more info, see https://kubedex.com/90-days-of-aws-eks-in-production | `list(string)` | `[]` | no |
| <a name="input_block_device_map"></a> [block\_device\_map](#input\_block\_device\_map) | Map of block device name specification, see [launch\_template.block-devices](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/launch_template#block-devices). | <pre>map(object({<br/>    no_device    = optional(bool, null)<br/>    virtual_name = optional(string, null)<br/>    ebs = optional(object({<br/>      delete_on_termination = optional(bool, true)<br/>      encrypted             = optional(bool, true)<br/>      iops                  = optional(number, null)<br/>      kms_key_id            = optional(string, null)<br/>      snapshot_id           = optional(string, null)<br/>      throughput            = optional(number, null)<br/>      volume_size           = optional(number, 20)<br/>      volume_type           = optional(string, "gp3")<br/>    }))<br/>  }))</pre> | <pre>{<br/>  "/dev/xvda": {<br/>    "ebs": {}<br/>  }<br/>}</pre> | no |
| <a name="input_block_device_mappings"></a> [block\_device\_mappings](#input\_block\_device\_mappings) | DEPRECATED: Use `block_device_map` instead.<br/>List of block device mappings for the launch template.<br/>Each list element is an object with a `device_name` key and<br/>any keys supported by the `ebs` block of `launch_template`. | `list(any)` | `null` | no |
| <a name="input_bootstrap_additional_options"></a> [bootstrap\_additional\_options](#input\_bootstrap\_additional\_options) | Additional options to bootstrap.sh. DO NOT include `--kubelet-additional-args`, use `kubelet_additional_options` var instead. | `list(string)` | `[]` | no |
| <a name="input_capacity_type"></a> [capacity\_type](#input\_capacity\_type) | Type of capacity associated with the EKS Node Group. Valid values: "ON\_DEMAND", "SPOT", or `null`.<br/>Terraform will only perform drift detection if a configuration value is provided. | `string` | `null` | no |
| <a name="input_cluster_autoscaler_enabled"></a> [cluster\_autoscaler\_enabled](#input\_cluster\_autoscaler\_enabled) | Set `true` to label the node group so that the [Kubernetes Cluster Autoscaler](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/cloudprovider/aws/README.md#auto-discovery-setup) will discover and autoscale it.<br/>Note that even when `false`, EKS will set the `k8s.io/cluster-autoscaler/enabled` label to `true` on the node group. | `bool` | `false` | no |
| <a name="input_cluster_name"></a> [cluster\_name](#input\_cluster\_name) | The name of the EKS cluster | `string` | n/a | yes |
| <a name="input_context"></a> [context](#input\_context) | Single object for setting entire context at once.<br/>See description of individual variables for details.<br/>Leave string and numeric variables as `null` to use default value.<br/>Individual variable settings (non-null) override settings in context object,<br/>except for attributes, tags, and additional\_tag\_map, which are merged. | `any` | <pre>{<br/>  "additional_tag_map": {},<br/>  "attributes": [],<br/>  "delimiter": null,<br/>  "descriptor_formats": {},<br/>  "enabled": true,<br/>  "environment": null,<br/>  "id_length_limit": null,<br/>  "label_key_case": null,<br/>  "label_order": [],<br/>  "label_value_case": null,<br/>  "labels_as_tags": [<br/>    "unset"<br/>  ],<br/>  "name": null,<br/>  "namespace": null,<br/>  "regex_replace_chars": null,<br/>  "stage": null,<br/>  "tags": {},<br/>  "tenant": null<br/>}</pre> | no |
| <a name="input_cpu_options"></a> [cpu\_options](#input\_cpu\_options) | Configuration for the [`cpu_options` Configuration Block](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/launch_template#cpu_options) of the launch template.<br/>Leave list empty for defaults. Pass list with single object with attributes matching the `cpu_options` block to configure it.<br/>Note that this configures the launch template only. Some elements will be ignored by the Auto Scaling Group<br/>that actually launches instances. Consult AWS documentation for details. | `list(any)` | `[]` | no |
| <a name="input_create_before_destroy"></a> [create\_before\_destroy](#input\_create\_before\_destroy) | Set true in order to create the new node group before destroying the old one.<br/>If false, the old node group will be destroyed first, causing downtime.<br/>Changing this setting will always cause node group to be replaced. | `bool` | `false` | no |
| <a name="input_delimiter"></a> [delimiter](#input\_delimiter) | Delimiter to be used between ID elements.<br/>Defaults to `-` (hyphen). Set to `""` to use no delimiter at all. | `string` | `null` | no |
| <a name="input_descriptor_formats"></a> [descriptor\_formats](#input\_descriptor\_formats) | Describe additional descriptors to be output in the `descriptors` output map.<br/>Map of maps. Keys are names of descriptors. Values are maps of the form<br/>`{<br/>   format = string<br/>   labels = list(string)<br/>}`<br/>(Type is `any` so the map values can later be enhanced to provide additional options.)<br/>`format` is a Terraform format string to be passed to the `format()` function.<br/>`labels` is a list of labels, in order, to pass to `format()` function.<br/>Label values will be normalized before being passed to `format()` so they will be<br/>identical to how they appear in `id`.<br/>Default is `{}` (`descriptors` output will be empty). | `any` | `{}` | no |
| <a name="input_desired_size"></a> [desired\_size](#input\_desired\_size) | Initial desired number of worker nodes (external changes ignored) | `number` | n/a | yes |
| <a name="input_detailed_monitoring_enabled"></a> [detailed\_monitoring\_enabled](#input\_detailed\_monitoring\_enabled) | The launched EC2 instance will have detailed monitoring enabled. Defaults to false | `bool` | `false` | no |
| <a name="input_ebs_optimized"></a> [ebs\_optimized](#input\_ebs\_optimized) | Set `false` to disable EBS optimization | `bool` | `true` | no |
| <a name="input_ec2_ssh_key_name"></a> [ec2\_ssh\_key\_name](#input\_ec2\_ssh\_key\_name) | SSH key pair name to use to access the worker nodes | `list(string)` | `[]` | no |
| <a name="input_enabled"></a> [enabled](#input\_enabled) | Set to false to prevent the module from creating any resources | `bool` | `null` | no |
| <a name="input_enclave_enabled"></a> [enclave\_enabled](#input\_enclave\_enabled) | Set to `true` to enable Nitro Enclaves on the instance. | `bool` | `false` | no |
| <a name="input_environment"></a> [environment](#input\_environment) | ID element. Usually used for region e.g. 'uw2', 'us-west-2', OR role 'prod', 'staging', 'dev', 'UAT' | `string` | `null` | no |
| <a name="input_force_update_version"></a> [force\_update\_version](#input\_force\_update\_version) | When updating the Kubernetes version, force Pods to be removed even if PodDisruptionBudget or taint/toleration issues would otherwise prevent them from being removed (and cause the update to fail) | `bool` | `false` | no |
| <a name="input_id_length_limit"></a> [id\_length\_limit](#input\_id\_length\_limit) | Limit `id` to this many characters (minimum 6).<br/>Set to `0` for unlimited length.<br/>Set to `null` for keep the existing setting, which defaults to `0`.<br/>Does not affect `id_full`. | `number` | `null` | no |
| <a name="input_instance_types"></a> [instance\_types](#input\_instance\_types) | Instance types to use for this node group (up to 20). Defaults to ["t3.medium"].<br/>Must be empty if the launch template configured by `launch_template_id` specifies an instance type. | `list(string)` | <pre>[<br/>  "t3.medium"<br/>]</pre> | no |
| <a name="input_kubelet_additional_options"></a> [kubelet\_additional\_options](#input\_kubelet\_additional\_options) | Additional flags to pass to kubelet.<br/>DO NOT include `--node-labels` or `--node-taints`,<br/>use `kubernetes_labels` and `kubernetes_taints` to specify those." | `list(string)` | `[]` | no |
| <a name="input_kubernetes_labels"></a> [kubernetes\_labels](#input\_kubernetes\_labels) | Key-value mapping of Kubernetes labels. Only labels that are applied with the EKS API are managed by this argument.<br/>Other Kubernetes labels applied to the EKS Node Group will not be managed. | `map(string)` | `{}` | no |
| <a name="input_kubernetes_taints"></a> [kubernetes\_taints](#input\_kubernetes\_taints) | List of `key`, `value`, `effect` objects representing Kubernetes taints.<br/>`effect` must be one of `NO_SCHEDULE`, `NO_EXECUTE`, or `PREFER_NO_SCHEDULE`.<br/>`key` and `effect` are required, `value` may be null. | <pre>list(object({<br/>    key    = string<br/>    value  = string<br/>    effect = string<br/>  }))</pre> | `[]` | no |
| <a name="input_kubernetes_version"></a> [kubernetes\_version](#input\_kubernetes\_version) | Kubernetes version. Defaults to EKS Cluster Kubernetes version. Terraform will only perform drift detection if a configuration value is provided | `list(string)` | `[]` | no |
| <a name="input_label_key_case"></a> [label\_key\_case](#input\_label\_key\_case) | Controls the letter case of the `tags` keys (label names) for tags generated by this module.<br/>Does not affect keys of tags passed in via the `tags` input.<br/>Possible values: `lower`, `title`, `upper`.<br/>Default value: `title`. | `string` | `null` | no |
| <a name="input_label_order"></a> [label\_order](#input\_label\_order) | The order in which the labels (ID elements) appear in the `id`.<br/>Defaults to ["namespace", "environment", "stage", "name", "attributes"].<br/>You can omit any of the 6 labels ("tenant" is the 6th), but at least one must be present. | `list(string)` | `null` | no |
| <a name="input_label_value_case"></a> [label\_value\_case](#input\_label\_value\_case) | Controls the letter case of ID elements (labels) as included in `id`,<br/>set as tag values, and output by this module individually.<br/>Does not affect values of tags passed in via the `tags` input.<br/>Possible values: `lower`, `title`, `upper` and `none` (no transformation).<br/>Set this to `title` and set `delimiter` to `""` to yield Pascal Case IDs.<br/>Default value: `lower`. | `string` | `null` | no |
| <a name="input_labels_as_tags"></a> [labels\_as\_tags](#input\_labels\_as\_tags) | Set of labels (ID elements) to include as tags in the `tags` output.<br/>Default is to include all labels.<br/>Tags with empty values will not be included in the `tags` output.<br/>Set to `[]` to suppress all generated tags.<br/>**Notes:**<br/>  The value of the `name` tag, if included, will be the `id`, not the `name`.<br/>  Unlike other `null-label` inputs, the initial setting of `labels_as_tags` cannot be<br/>  changed in later chained modules. Attempts to change it will be silently ignored. | `set(string)` | <pre>[<br/>  "default"<br/>]</pre> | no |
| <a name="input_launch_template_id"></a> [launch\_template\_id](#input\_launch\_template\_id) | The ID (not name) of a custom launch template to use for the EKS node group. If provided, it must specify the AMI image ID. | `list(string)` | `[]` | no |
| <a name="input_launch_template_version"></a> [launch\_template\_version](#input\_launch\_template\_version) | The version of the specified launch template to use. Defaults to latest version. | `list(string)` | `[]` | no |
| <a name="input_max_size"></a> [max\_size](#input\_max\_size) | Maximum number of worker nodes | `number` | n/a | yes |
| <a name="input_metadata_http_endpoint_enabled"></a> [metadata\_http\_endpoint\_enabled](#input\_metadata\_http\_endpoint\_enabled) | Set false to disable the Instance Metadata Service. | `bool` | `true` | no |
| <a name="input_metadata_http_put_response_hop_limit"></a> [metadata\_http\_put\_response\_hop\_limit](#input\_metadata\_http\_put\_response\_hop\_limit) | The desired HTTP PUT response hop limit (between 1 and 64) for Instance Metadata Service requests.<br/>The default is `2` to allows containerized workloads assuming the instance profile, but it's not really recomended. You should use OIDC service accounts instead. | `number` | `2` | no |
| <a name="input_metadata_http_tokens_required"></a> [metadata\_http\_tokens\_required](#input\_metadata\_http\_tokens\_required) | Set true to require IMDS session tokens, disabling Instance Metadata Service Version 1. | `bool` | `true` | no |
| <a name="input_min_size"></a> [min\_size](#input\_min\_size) | Minimum number of worker nodes | `number` | n/a | yes |
| <a name="input_module_depends_on"></a> [module\_depends\_on](#input\_module\_depends\_on) | Can be any value desired. Module will wait for this value to be computed before creating node group. | `any` | `null` | no |
| <a name="input_name"></a> [name](#input\_name) | ID element. Usually the component or solution name, e.g. 'app' or 'jenkins'.<br/>This is the only ID element not also included as a `tag`.<br/>The "name" tag is set to the full `id` string. There is no tag with the value of the `name` input. | `string` | `null` | no |
| <a name="input_namespace"></a> [namespace](#input\_namespace) | ID element. Usually an abbreviation of your organization name, e.g. 'eg' or 'cp', to help ensure generated IDs are globally unique | `string` | `null` | no |
| <a name="input_node_group_terraform_timeouts"></a> [node\_group\_terraform\_timeouts](#input\_node\_group\_terraform\_timeouts) | Configuration for the Terraform [`timeouts` Configuration Block](https://www.terraform.io/docs/language/resources/syntax.html#operation-timeouts) of the node group resource.<br/>Leave list empty for defaults. Pass list with single object with attributes matching the `timeouts` block to configure it.<br/>Leave attribute values `null` to preserve individual defaults while setting others. | <pre>list(object({<br/>    create = string<br/>    update = string<br/>    delete = string<br/>  }))</pre> | `[]` | no |
| <a name="input_node_role_arn"></a> [node\_role\_arn](#input\_node\_role\_arn) | If provided, assign workers the given role, which this module will not modify | `list(string)` | `[]` | no |
| <a name="input_node_role_cni_policy_enabled"></a> [node\_role\_cni\_policy\_enabled](#input\_node\_role\_cni\_policy\_enabled) | When true, the `AmazonEKS_CNI_Policy` will be attached to the node IAM role.<br/>This used to be required, but it is [now recommended](https://docs.aws.amazon.com/eks/latest/userguide/create-node-role.html) that this policy be<br/>attached only to the `aws-node` Kubernetes service account. However, that<br/>is difficult to do with Terraform, so this module defaults to the old pattern. | `bool` | `true` | no |
| <a name="input_node_role_permissions_boundary"></a> [node\_role\_permissions\_boundary](#input\_node\_role\_permissions\_boundary) | If provided, all IAM roles will be created with this permissions boundary attached. | `string` | `null` | no |
| <a name="input_node_role_policy_arns"></a> [node\_role\_policy\_arns](#input\_node\_role\_policy\_arns) | List of policy ARNs to attach to the worker role this module creates in addition to the default ones | `list(string)` | `[]` | no |
| <a name="input_placement"></a> [placement](#input\_placement) | Configuration for the [`placement` Configuration Block](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/launch_template#placement) of the launch template.<br/>Leave list empty for defaults. Pass list with single object with attributes matching the `placement` block to configure it.<br/>Note that this configures the launch template only. Some elements will be ignored by the Auto Scaling Group<br/>that actually launches instances. Consult AWS documentation for details. | `list(any)` | `[]` | no |
| <a name="input_regex_replace_chars"></a> [regex\_replace\_chars](#input\_regex\_replace\_chars) | Terraform regular expression (regex) string.<br/>Characters matching the regex will be removed from the ID elements.<br/>If not set, `"/[^a-zA-Z0-9-]/"` is used to remove all characters other than hyphens, letters and digits. | `string` | `null` | no |
| <a name="input_replace_node_group_on_version_update"></a> [replace\_node\_group\_on\_version\_update](#input\_replace\_node\_group\_on\_version\_update) | Force Node Group replacement when updating to a new Kubernetes version. If set to `false` (the default), the Node Groups will be updated in-place | `bool` | `false` | no |
| <a name="input_resources_to_tag"></a> [resources\_to\_tag](#input\_resources\_to\_tag) | List of auto-launched resource types to tag. Valid types are "instance", "volume", "elastic-gpu", "spot-instances-request", "network-interface". | `list(string)` | <pre>[<br/>  "instance",<br/>  "volume",<br/>  "network-interface"<br/>]</pre> | no |
| <a name="input_ssh_access_security_group_ids"></a> [ssh\_access\_security\_group\_ids](#input\_ssh\_access\_security\_group\_ids) | Set of EC2 Security Group IDs to allow SSH access (port 22) to the worker nodes. If you specify `ec2_ssh_key`, but do not specify this configuration when you create an EKS Node Group, port 22 on the worker nodes is opened to the Internet (0.0.0.0/0) | `list(string)` | `[]` | no |
| <a name="input_stage"></a> [stage](#input\_stage) | ID element. Usually used to indicate role, e.g. 'prod', 'staging', 'source', 'build', 'test', 'deploy', 'release' | `string` | `null` | no |
| <a name="input_subnet_ids"></a> [subnet\_ids](#input\_subnet\_ids) | A list of subnet IDs to launch resources in | `list(string)` | n/a | yes |
| <a name="input_tags"></a> [tags](#input\_tags) | Additional tags (e.g. `{'BusinessUnit': 'XYZ'}`).<br/>Neither the tag keys nor the tag values will be modified by this module. | `map(string)` | `{}` | no |
| <a name="input_tenant"></a> [tenant](#input\_tenant) | ID element \_(Rarely used, not included by default)\_. A customer identifier, indicating who this instance of a resource is for | `string` | `null` | no |
| <a name="input_update_config"></a> [update\_config](#input\_update\_config) | Configuration for the `eks_node_group` [`update_config` Configuration Block](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/eks_node_group#update_config-configuration-block).<br/>Specify exactly one of `max_unavailable` (node count) or `max_unavailable_percentage` (percentage of nodes). | `list(map(number))` | `[]` | no |
| <a name="input_userdata_override_base64"></a> [userdata\_override\_base64](#input\_userdata\_override\_base64) | Many features of this module rely on the `bootstrap.sh` provided with Amazon Linux, and this module<br/>may generate "user data" that expects to find that script. If you want to use an AMI that is not<br/>compatible with the Amazon Linux `bootstrap.sh` initialization, then use `userdata_override_base64` to provide<br/>your own (Base64 encoded) user data. Use "" to prevent any user data from being set.<br/><br/>Setting `userdata_override_base64` disables `kubernetes_taints`, `kubelet_additional_options`,<br/>`before_cluster_joining_userdata`, `after_cluster_joining_userdata`, and `bootstrap_additional_options`. | `list(string)` | `[]` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_eks_node_group_arn"></a> [eks\_node\_group\_arn](#output\_eks\_node\_group\_arn) | Amazon Resource Name (ARN) of the EKS Node Group |
| <a name="output_eks_node_group_cbd_pet_name"></a> [eks\_node\_group\_cbd\_pet\_name](#output\_eks\_node\_group\_cbd\_pet\_name) | The pet name of this node group, if this module generated one |
| <a name="output_eks_node_group_id"></a> [eks\_node\_group\_id](#output\_eks\_node\_group\_id) | EKS Cluster name and EKS Node Group name separated by a colon |
| <a name="output_eks_node_group_launch_template_id"></a> [eks\_node\_group\_launch\_template\_id](#output\_eks\_node\_group\_launch\_template\_id) | The ID of the launch template used for this node group |
| <a name="output_eks_node_group_launch_template_name"></a> [eks\_node\_group\_launch\_template\_name](#output\_eks\_node\_group\_launch\_template\_name) | The name of the launch template used for this node group |
| <a name="output_eks_node_group_remote_access_security_group_id"></a> [eks\_node\_group\_remote\_access\_security\_group\_id](#output\_eks\_node\_group\_remote\_access\_security\_group\_id) | The ID of the security group generated to allow SSH access to the nodes, if this module generated one |
| <a name="output_eks_node_group_resources"></a> [eks\_node\_group\_resources](#output\_eks\_node\_group\_resources) | List of objects containing information about underlying resources of the EKS Node Group |
| <a name="output_eks_node_group_role_arn"></a> [eks\_node\_group\_role\_arn](#output\_eks\_node\_group\_role\_arn) | ARN of the worker nodes IAM role |
| <a name="output_eks_node_group_role_name"></a> [eks\_node\_group\_role\_name](#output\_eks\_node\_group\_role\_name) | Name of the worker nodes IAM role |
| <a name="output_eks_node_group_status"></a> [eks\_node\_group\_status](#output\_eks\_node\_group\_status) | Status of the EKS Node Group |
| <a name="output_eks_node_group_tags_all"></a> [eks\_node\_group\_tags\_all](#output\_eks\_node\_group\_tags\_all) | A map of tags assigned to the resource, including those inherited from the provider default\_tags configuration block. |
| <a name="output_eks_node_group_windows_note"></a> [eks\_node\_group\_windows\_note](#output\_eks\_node\_group\_windows\_note) | Instructions on changes a user needs to follow or script for a windows node group in the event of a custom ami |
<!-- markdownlint-restore -->
