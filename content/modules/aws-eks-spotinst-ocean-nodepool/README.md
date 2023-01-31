---
title: aws-eks-spotinst-ocean-nodepool
sidebar_label: aws-eks-spotinst-ocean-nodepool
sidebar_class_name: command
description: |-
  This `terraform-aws-eks-spotinst-ocean-nodepool` module provides the scaffolding for provisioning a [Spotinst](https://spot.io/)
  [Ocean](https://spot.io/products/ocean/) connected to an AWS EKS cluster.
custom_edit_url: https://github.com/cloudposse/terraform-aws-eks-spotinst-ocean-nodepool/edit/master/README.md
---

# Component: `aws-eks-spotinst-ocean-nodepool`
This `terraform-aws-eks-spotinst-ocean-nodepool` module provides the scaffolding for provisioning a [Spotinst](https://spot.io/)
[Ocean](https://spot.io/products/ocean/) connected to an AWS EKS cluster.






## Usage

Here's how to invoke this module in your projects

```hcl
module "spotinst_oceans" {
  source = "cloudposse/eks-spotinst-ocean-nodepool/aws"
  # Cloud Posse recommends pinning every module to a specific version
  # version = "x.x.x"

  disk_size           = var.disk_size
  instance_types      = var.instance_types
  instance_profile    = var.instance_profile_name
  kubernetes_version = var.kubernetes_version
  min_size           = var.min_group_size == null ? local.so_def.min_group_size : var.min_group_size
  max_size           = var.max_group_size == null ? local.so_def.max_group_size : var.max_group_size
  desired_capacity    = var.desired_group_size == null ? local.so_def.desired_group_size : var.desired_group_size

  eks_cluster_id      = module.eks_cluster.eks_cluster_id
  ocean_controller_id = module.eks_cluster.eks_cluster_id
  region              = var.region
  subnet_ids          = module.vpc.private_subnet_ids
  security_group_ids  = [module.eks_cluster.eks_cluster_managed_security_group_id]

  context = module.this.context
}
```




## Examples

Here is an example of using this module:
- [`examples/complete`](examples/complete/) - complete example of using this module



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
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 0.13 |
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | >= 3.18 |
| <a name="requirement_kubernetes"></a> [kubernetes](#requirement\_kubernetes) | >= 1.0 |
| <a name="requirement_local"></a> [local](#requirement\_local) | >= 1.2 |
| <a name="requirement_random"></a> [random](#requirement\_random) | >= 2.2 |
| <a name="requirement_spotinst"></a> [spotinst](#requirement\_spotinst) | >= 1.56 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | >= 3.18 |
| <a name="provider_spotinst"></a> [spotinst](#provider\_spotinst) | >= 1.56 |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_this"></a> [this](#module\_this) | cloudposse/label/null | 0.25.0 |
| <a name="module_worker_label"></a> [worker\_label](#module\_worker\_label) | cloudposse/label/null | 0.25.0 |

## Resources

| Name | Type |
|------|------|
| [aws_iam_instance_profile.worker](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_instance_profile) | resource |
| [aws_iam_role.worker](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role) | resource |
| [aws_iam_role_policy_attachment.amazon_ec2_container_registry_read_only](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_iam_role_policy_attachment.amazon_eks_cni_policy](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_iam_role_policy_attachment.amazon_eks_worker_node_policy](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_iam_role_policy_attachment.existing_policies_for_eks_workers_role](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [spotinst_ocean_aws.this](https://registry.terraform.io/providers/spotinst/spotinst/latest/docs/resources/ocean_aws) | resource |
| [aws_ami.selected](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/ami) | data source |
| [aws_iam_policy_document.assume_role](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_partition.current](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/partition) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_additional_tag_map"></a> [additional\_tag\_map](#input\_additional\_tag\_map) | Additional key-value pairs to add to each map in `tags_as_list_of_maps`. Not added to `tags` or `id`.<br/>This is for some rare cases where resources want additional configuration of tags<br/>and therefore take a list of maps with tag key, value, and additional configuration. | `map(string)` | `{}` | no |
| <a name="input_after_cluster_joining_userdata"></a> [after\_cluster\_joining\_userdata](#input\_after\_cluster\_joining\_userdata) | Additional `bash` commands to execute on each worker node after joining the EKS cluster (after executing the `bootstrap.sh` script). For more info, see https://kubedex.com/90-days-of-aws-eks-in-production | `string` | `""` | no |
| <a name="input_ami_image_id"></a> [ami\_image\_id](#input\_ami\_image\_id) | AMI to use. Ignored of `launch_template_id` is supplied. | `string` | `null` | no |
| <a name="input_ami_release_version"></a> [ami\_release\_version](#input\_ami\_release\_version) | EKS AMI version to use, e.g. "1.16.13-20200821" (no "v"). Defaults to latest version for Kubernetes version. | `string` | `null` | no |
| <a name="input_ami_type"></a> [ami\_type](#input\_ami\_type) | Type of Amazon Machine Image (AMI) associated with the Ocean.<br/>Defaults to `AL2_x86_64`. Valid values: `AL2_x86_64`, `AL2_x86_64_GPU`, and `AL2_ARM_64`. | `string` | `"AL2_x86_64"` | no |
| <a name="input_associate_public_ip_address"></a> [associate\_public\_ip\_address](#input\_associate\_public\_ip\_address) | Associate a public IP address to worker nodes | `bool` | `false` | no |
| <a name="input_attributes"></a> [attributes](#input\_attributes) | ID element. Additional attributes (e.g. `workers` or `cluster`) to add to `id`,<br/>in the order they appear in the list. New attributes are appended to the<br/>end of the list. The elements of the list are joined by the `delimiter`<br/>and treated as a single ID element. | `list(string)` | `[]` | no |
| <a name="input_before_cluster_joining_userdata"></a> [before\_cluster\_joining\_userdata](#input\_before\_cluster\_joining\_userdata) | Additional `bash` commands to execute on each worker node before joining the EKS cluster (before executing the `bootstrap.sh` script). For more info, see https://kubedex.com/90-days-of-aws-eks-in-production | `string` | `""` | no |
| <a name="input_bootstrap_additional_options"></a> [bootstrap\_additional\_options](#input\_bootstrap\_additional\_options) | Additional options to bootstrap.sh. DO NOT include `--kubelet-additional-args`, use `kubelet_additional_args` var instead. | `string` | `""` | no |
| <a name="input_context"></a> [context](#input\_context) | Single object for setting entire context at once.<br/>See description of individual variables for details.<br/>Leave string and numeric variables as `null` to use default value.<br/>Individual variable settings (non-null) override settings in context object,<br/>except for attributes, tags, and additional\_tag\_map, which are merged. | `any` | <pre>{<br/>  "additional_tag_map": {},<br/>  "attributes": [],<br/>  "delimiter": null,<br/>  "descriptor_formats": {},<br/>  "enabled": true,<br/>  "environment": null,<br/>  "id_length_limit": null,<br/>  "label_key_case": null,<br/>  "label_order": [],<br/>  "label_value_case": null,<br/>  "labels_as_tags": [<br/>    "unset"<br/>  ],<br/>  "name": null,<br/>  "namespace": null,<br/>  "regex_replace_chars": null,<br/>  "stage": null,<br/>  "tags": {},<br/>  "tenant": null<br/>}</pre> | no |
| <a name="input_delimiter"></a> [delimiter](#input\_delimiter) | Delimiter to be used between ID elements.<br/>Defaults to `-` (hyphen). Set to `""` to use no delimiter at all. | `string` | `null` | no |
| <a name="input_descriptor_formats"></a> [descriptor\_formats](#input\_descriptor\_formats) | Describe additional descriptors to be output in the `descriptors` output map.<br/>Map of maps. Keys are names of descriptors. Values are maps of the form<br/>`{<br/>   format = string<br/>   labels = list(string)<br/>}`<br/>(Type is `any` so the map values can later be enhanced to provide additional options.)<br/>`format` is a Terraform format string to be passed to the `format()` function.<br/>`labels` is a list of labels, in order, to pass to `format()` function.<br/>Label values will be normalized before being passed to `format()` so they will be<br/>identical to how they appear in `id`.<br/>Default is `{}` (`descriptors` output will be empty). | `any` | `{}` | no |
| <a name="input_desired_capacity"></a> [desired\_capacity](#input\_desired\_capacity) | The number of worker nodes to launch and maintain in the Ocean cluster | `number` | `1` | no |
| <a name="input_disk_size"></a> [disk\_size](#input\_disk\_size) | Disk size in GiB for worker nodes. Defaults to 20. Ignored it `launch_template_id` is supplied.<br/>Terraform will only perform drift detection if a configuration value is provided. | `number` | `20` | no |
| <a name="input_ec2_ssh_key"></a> [ec2\_ssh\_key](#input\_ec2\_ssh\_key) | SSH key pair name to use to access the worker nodes launced by Ocean | `string` | `null` | no |
| <a name="input_eks_cluster_id"></a> [eks\_cluster\_id](#input\_eks\_cluster\_id) | EKS Cluster identifier | `string` | n/a | yes |
| <a name="input_enabled"></a> [enabled](#input\_enabled) | Set to false to prevent the module from creating any resources | `bool` | `null` | no |
| <a name="input_environment"></a> [environment](#input\_environment) | ID element. Usually used for region e.g. 'uw2', 'us-west-2', OR role 'prod', 'staging', 'dev', 'UAT' | `string` | `null` | no |
| <a name="input_existing_workers_role_policy_arns"></a> [existing\_workers\_role\_policy\_arns](#input\_existing\_workers\_role\_policy\_arns) | List of existing policy ARNs that will be attached to the workers default role on creation | `list(string)` | `[]` | no |
| <a name="input_fallback_to_ondemand"></a> [fallback\_to\_ondemand](#input\_fallback\_to\_ondemand) | If no Spot instance markets are available, enable Ocean to launch On-Demand instances instead. | `bool` | `true` | no |
| <a name="input_id_length_limit"></a> [id\_length\_limit](#input\_id\_length\_limit) | Limit `id` to this many characters (minimum 6).<br/>Set to `0` for unlimited length.<br/>Set to `null` for keep the existing setting, which defaults to `0`.<br/>Does not affect `id_full`. | `number` | `null` | no |
| <a name="input_instance_profile"></a> [instance\_profile](#input\_instance\_profile) | The AWS Instance Profile to use for Spotinst Worker instances. If not set, one will be created. | `string` | `null` | no |
| <a name="input_instance_types"></a> [instance\_types](#input\_instance\_types) | List of instance type to use for this node group. Defaults to null, which allows all instance types. | `list(string)` | `null` | no |
| <a name="input_kubelet_additional_options"></a> [kubelet\_additional\_options](#input\_kubelet\_additional\_options) | Additional flags to pass to kubelet.<br/>DO NOT include `--node-labels` or `--node-taints`,<br/>use `kubernetes_labels` and `kubernetes_taints` to specify those." | `string` | `""` | no |
| <a name="input_kubernetes_labels"></a> [kubernetes\_labels](#input\_kubernetes\_labels) | Key-value mapping of Kubernetes labels. Only labels that are applied with the EKS API are managed by this argument.<br/>Other Kubernetes labels applied to the EKS Node Group will not be managed. | `map(string)` | `{}` | no |
| <a name="input_kubernetes_taints"></a> [kubernetes\_taints](#input\_kubernetes\_taints) | Key-value mapping of Kubernetes taints. | `map(string)` | `{}` | no |
| <a name="input_kubernetes_version"></a> [kubernetes\_version](#input\_kubernetes\_version) | Kubernetes version. Required unless `ami_image_id` is provided. | `string` | `null` | no |
| <a name="input_label_key_case"></a> [label\_key\_case](#input\_label\_key\_case) | Controls the letter case of the `tags` keys (label names) for tags generated by this module.<br/>Does not affect keys of tags passed in via the `tags` input.<br/>Possible values: `lower`, `title`, `upper`.<br/>Default value: `title`. | `string` | `null` | no |
| <a name="input_label_order"></a> [label\_order](#input\_label\_order) | The order in which the labels (ID elements) appear in the `id`.<br/>Defaults to ["namespace", "environment", "stage", "name", "attributes"].<br/>You can omit any of the 6 labels ("tenant" is the 6th), but at least one must be present. | `list(string)` | `null` | no |
| <a name="input_label_value_case"></a> [label\_value\_case](#input\_label\_value\_case) | Controls the letter case of ID elements (labels) as included in `id`,<br/>set as tag values, and output by this module individually.<br/>Does not affect values of tags passed in via the `tags` input.<br/>Possible values: `lower`, `title`, `upper` and `none` (no transformation).<br/>Set this to `title` and set `delimiter` to `""` to yield Pascal Case IDs.<br/>Default value: `lower`. | `string` | `null` | no |
| <a name="input_labels_as_tags"></a> [labels\_as\_tags](#input\_labels\_as\_tags) | Set of labels (ID elements) to include as tags in the `tags` output.<br/>Default is to include all labels.<br/>Tags with empty values will not be included in the `tags` output.<br/>Set to `[]` to suppress all generated tags.<br/>**Notes:**<br/>  The value of the `name` tag, if included, will be the `id`, not the `name`.<br/>  Unlike other `null-label` inputs, the initial setting of `labels_as_tags` cannot be<br/>  changed in later chained modules. Attempts to change it will be silently ignored. | `set(string)` | <pre>[<br/>  "default"<br/>]</pre> | no |
| <a name="input_max_size"></a> [max\_size](#input\_max\_size) | The upper limit of worker nodes the Ocean cluster can scale up to | `number` | `null` | no |
| <a name="input_metadata_http_put_response_hop_limit"></a> [metadata\_http\_put\_response\_hop\_limit](#input\_metadata\_http\_put\_response\_hop\_limit) | The desired HTTP PUT response hop limit (between 1 and 64) for instance metadata requests. | `number` | `2` | no |
| <a name="input_metadata_http_tokens_required"></a> [metadata\_http\_tokens\_required](#input\_metadata\_http\_tokens\_required) | Whether or not the metadata service requires session tokens, also referred to as Instance Metadata Service Version 2. | `bool` | `true` | no |
| <a name="input_min_size"></a> [min\_size](#input\_min\_size) | The lower limit of worker nodes the Ocean cluster can scale down to | `number` | `1` | no |
| <a name="input_module_depends_on"></a> [module\_depends\_on](#input\_module\_depends\_on) | Can be any value desired. Module will wait for this value to be computed before creating node group. | `any` | `null` | no |
| <a name="input_name"></a> [name](#input\_name) | ID element. Usually the component or solution name, e.g. 'app' or 'jenkins'.<br/>This is the only ID element not also included as a `tag`.<br/>The "name" tag is set to the full `id` string. There is no tag with the value of the `name` input. | `string` | `null` | no |
| <a name="input_namespace"></a> [namespace](#input\_namespace) | ID element. Usually an abbreviation of your organization name, e.g. 'eg' or 'cp', to help ensure generated IDs are globally unique | `string` | `null` | no |
| <a name="input_ocean_controller_id"></a> [ocean\_controller\_id](#input\_ocean\_controller\_id) | Ocean Cluster identifier, used by cluster controller to target this cluster. If unset, will use EKS cluster identifier | `string` | `null` | no |
| <a name="input_regex_replace_chars"></a> [regex\_replace\_chars](#input\_regex\_replace\_chars) | Terraform regular expression (regex) string.<br/>Characters matching the regex will be removed from the ID elements.<br/>If not set, `"/[^a-zA-Z0-9-]/"` is used to remove all characters other than hyphens, letters and digits. | `string` | `null` | no |
| <a name="input_region"></a> [region](#input\_region) | AWS Region | `string` | n/a | yes |
| <a name="input_security_group_ids"></a> [security\_group\_ids](#input\_security\_group\_ids) | List of security groups that will be attached to the autoscaling group | `list(string)` | n/a | yes |
| <a name="input_stage"></a> [stage](#input\_stage) | ID element. Usually used to indicate role, e.g. 'prod', 'staging', 'source', 'build', 'test', 'deploy', 'release' | `string` | `null` | no |
| <a name="input_subnet_ids"></a> [subnet\_ids](#input\_subnet\_ids) | A list of subnet IDs to launch resources in | `list(string)` | n/a | yes |
| <a name="input_tags"></a> [tags](#input\_tags) | Additional tags (e.g. `{'BusinessUnit': 'XYZ'}`).<br/>Neither the tag keys nor the tag values will be modified by this module. | `map(string)` | `{}` | no |
| <a name="input_tenant"></a> [tenant](#input\_tenant) | ID element \_(Rarely used, not included by default)\_. A customer identifier, indicating who this instance of a resource is for | `string` | `null` | no |
| <a name="input_update_policy_batch_size_percentage"></a> [update\_policy\_batch\_size\_percentage](#input\_update\_policy\_batch\_size\_percentage) | When rolling the cluster due to an update, the percentage of the instances to deploy in each batch. | `number` | `25` | no |
| <a name="input_update_policy_should_roll"></a> [update\_policy\_should\_roll](#input\_update\_policy\_should\_roll) | If true, roll the cluster when its configuration is updated | `bool` | `true` | no |
| <a name="input_userdata_override_base64"></a> [userdata\_override\_base64](#input\_userdata\_override\_base64) | Many features of this module rely on the `bootstrap.sh` provided with Amazon Linux, and this module<br/>may generate "user data" that expects to find that script. If you want to use an AMI that is not<br/>compatible with the Amazon Linux `bootstrap.sh` initialization, then use `userdata_override_base64` to provide<br/>your own (Base64 encoded) user data. Use "" to prevent any user data from being set.<br/><br/>Setting `userdata_override_base64` disables `kubernetes_taints`, `kubelet_additional_options`,<br/>`before_cluster_joining_userdata`, `after_cluster_joining_userdata`, and `bootstrap_additional_options`. | `string` | `null` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_ocean_controller_id"></a> [ocean\_controller\_id](#output\_ocean\_controller\_id) | The ID of the Ocean controller |
| <a name="output_ocean_id"></a> [ocean\_id](#output\_ocean\_id) | The ID of the Ocean (o-123b567c), if created by this module (`local.enabled`) |
| <a name="output_worker_ami"></a> [worker\_ami](#output\_worker\_ami) | The AMI ID that the worker instance uses, if determined by this module (`var.ami_image_id == null`) |
| <a name="output_worker_instance_profile_arn"></a> [worker\_instance\_profile\_arn](#output\_worker\_instance\_profile\_arn) | The ARN of the profile for worker instances, if created by this module (`var.instance_profile == null`) |
| <a name="output_worker_instance_profile_name"></a> [worker\_instance\_profile\_name](#output\_worker\_instance\_profile\_name) | The name of the profile for worker instances, if created by this module (`var.instance_profile == null`) |
| <a name="output_worker_role_arn"></a> [worker\_role\_arn](#output\_worker\_role\_arn) | The ARN of the role for worker instances, if created by this module (`var.instance_profile == null`) |
| <a name="output_worker_role_name"></a> [worker\_role\_name](#output\_worker\_role\_name) | The name of the role for worker instances, if created by this module (`var.instance_profile == null`) |
<!-- markdownlint-restore -->


