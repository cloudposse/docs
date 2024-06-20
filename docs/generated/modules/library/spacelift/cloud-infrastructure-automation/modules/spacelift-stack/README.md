---
title: spacelift-stack
sidebar_label: spacelift-stack
sidebar_class_name: command
description: |-
  Terraform module to provisions a [Spacelift](https://docs.spacelift.io/concepts/spaces/index.html) space.
custom_edit_url: https://github.com/cloudposse/terraform-spacelift-cloud-infrastructure-automation/blob/main/modules/spacelift-stack/README.yaml
---

# Module: `spacelift-stack`
Terraform module to provisions a [Spacelift](https://docs.spacelift.io/concepts/spaces/index.html) space.






## Usage

Here's how to invoke this module in your project:
```hcl
provider "spacelift" {}

module "stack" {
  source  = "cloudposse/cloud-infrastructure-automation/spacelift//modules/spacelift-space"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"

  atmos_stack_name  = "plat-ue1-prod-test-component"
  stack_name        = "plat-ue1-prod-test-component"
  component_name    = "test-component"
  component_root    = "examples/test-component"
  repository        = "spacelift-demo"
  branch            = "main"
  autodeploy        = true
  terraform_version = "1.4.6"
```




## Examples

Here is an example of using this module:
- [`../../examples/spacelift-stack`](https://github.com/cloudposse/terraform-spacelift-cloud-infrastructure-automation/tree/master/examples/spacelift-stack) - complete example of using this module



<!-- markdownlint-disable -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 0.13.0 |
| <a name="requirement_spacelift"></a> [spacelift](#requirement\_spacelift) | >= 0.1.31 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_spacelift"></a> [spacelift](#provider\_spacelift) | >= 0.1.31 |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_this"></a> [this](#module\_this) | cloudposse/label/null | 0.25.0 |

## Resources

| Name | Type |
|------|------|
| [spacelift_aws_role.this](https://registry.terraform.io/providers/spacelift-io/spacelift/latest/docs/resources/aws_role) | resource |
| [spacelift_context_attachment.this](https://registry.terraform.io/providers/spacelift-io/spacelift/latest/docs/resources/context_attachment) | resource |
| [spacelift_drift_detection.this](https://registry.terraform.io/providers/spacelift-io/spacelift/latest/docs/resources/drift_detection) | resource |
| [spacelift_environment_variable.component_env_vars](https://registry.terraform.io/providers/spacelift-io/spacelift/latest/docs/resources/environment_variable) | resource |
| [spacelift_environment_variable.component_name](https://registry.terraform.io/providers/spacelift-io/spacelift/latest/docs/resources/environment_variable) | resource |
| [spacelift_environment_variable.stack_name](https://registry.terraform.io/providers/spacelift-io/spacelift/latest/docs/resources/environment_variable) | resource |
| [spacelift_mounted_file.stack_config](https://registry.terraform.io/providers/spacelift-io/spacelift/latest/docs/resources/mounted_file) | resource |
| [spacelift_policy_attachment.this](https://registry.terraform.io/providers/spacelift-io/spacelift/latest/docs/resources/policy_attachment) | resource |
| [spacelift_run.this](https://registry.terraform.io/providers/spacelift-io/spacelift/latest/docs/resources/run) | resource |
| [spacelift_stack.this](https://registry.terraform.io/providers/spacelift-io/spacelift/latest/docs/resources/stack) | resource |
| [spacelift_stack_dependency.default](https://registry.terraform.io/providers/spacelift-io/spacelift/latest/docs/resources/stack_dependency) | resource |
| [spacelift_stack_destructor.this](https://registry.terraform.io/providers/spacelift-io/spacelift/latest/docs/resources/stack_destructor) | resource |
| [spacelift_webhook.this](https://registry.terraform.io/providers/spacelift-io/spacelift/latest/docs/resources/webhook) | resource |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_additional_tag_map"></a> [additional\_tag\_map](#input\_additional\_tag\_map) | Additional key-value pairs to add to each map in `tags_as_list_of_maps`. Not added to `tags` or `id`.<br/>This is for some rare cases where resources want additional configuration of tags<br/>and therefore take a list of maps with tag key, value, and additional configuration. | `map(string)` | `{}` | no |
| <a name="input_administrative"></a> [administrative](#input\_administrative) | Whether this stack can manage other stacks | `bool` | `false` | no |
| <a name="input_after_apply"></a> [after\_apply](#input\_after\_apply) | List of after-apply scripts | `list(string)` | `[]` | no |
| <a name="input_after_destroy"></a> [after\_destroy](#input\_after\_destroy) | List of after-destroy scripts | `list(string)` | `[]` | no |
| <a name="input_after_init"></a> [after\_init](#input\_after\_init) | List of after-init scripts | `list(string)` | `[]` | no |
| <a name="input_after_perform"></a> [after\_perform](#input\_after\_perform) | List of after-perform scripts | `list(string)` | `[]` | no |
| <a name="input_after_plan"></a> [after\_plan](#input\_after\_plan) | List of after-plan scripts | `list(string)` | `[]` | no |
| <a name="input_atmos_stack_name"></a> [atmos\_stack\_name](#input\_atmos\_stack\_name) | The name of the atmos stack | `string` | n/a | yes |
| <a name="input_attributes"></a> [attributes](#input\_attributes) | ID element. Additional attributes (e.g. `workers` or `cluster`) to add to `id`,<br/>in the order they appear in the list. New attributes are appended to the<br/>end of the list. The elements of the list are joined by the `delimiter`<br/>and treated as a single ID element. | `list(string)` | `[]` | no |
| <a name="input_autodeploy"></a> [autodeploy](#input\_autodeploy) | Controls the Spacelift 'autodeploy' option for a stack | `bool` | `false` | no |
| <a name="input_autoretry"></a> [autoretry](#input\_autoretry) | Controls the Spacelift 'autoretry' option for a stack | `bool` | `false` | no |
| <a name="input_aws_role_arn"></a> [aws\_role\_arn](#input\_aws\_role\_arn) | ARN of the AWS IAM role to assume and put its temporary credentials in the runtime environment | `string` | `null` | no |
| <a name="input_aws_role_enabled"></a> [aws\_role\_enabled](#input\_aws\_role\_enabled) | Flag to enable/disable Spacelift to use AWS STS to assume the supplied IAM role and put its temporary credentials in the runtime environment | `bool` | `false` | no |
| <a name="input_aws_role_external_id"></a> [aws\_role\_external\_id](#input\_aws\_role\_external\_id) | Custom external ID (works only for private workers). See https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-user_externalid.html for more details | `string` | `null` | no |
| <a name="input_aws_role_generate_credentials_in_worker"></a> [aws\_role\_generate\_credentials\_in\_worker](#input\_aws\_role\_generate\_credentials\_in\_worker) | Flag to enable/disable generating AWS credentials in the private worker after assuming the supplied IAM role | `bool` | `true` | no |
| <a name="input_azure_devops"></a> [azure\_devops](#input\_azure\_devops) | Azure DevOps VCS settings | `map(any)` | `null` | no |
| <a name="input_before_apply"></a> [before\_apply](#input\_before\_apply) | List of before-apply scripts | `list(string)` | `[]` | no |
| <a name="input_before_destroy"></a> [before\_destroy](#input\_before\_destroy) | List of before-destroy scripts | `list(string)` | `[]` | no |
| <a name="input_before_init"></a> [before\_init](#input\_before\_init) | List of before-init scripts | `list(string)` | `[]` | no |
| <a name="input_before_perform"></a> [before\_perform](#input\_before\_perform) | List of before-perform scripts | `list(string)` | `[]` | no |
| <a name="input_before_plan"></a> [before\_plan](#input\_before\_plan) | List of before-plan scripts | `list(string)` | `[]` | no |
| <a name="input_bitbucket_cloud"></a> [bitbucket\_cloud](#input\_bitbucket\_cloud) | Bitbucket Cloud VCS settings | `map(any)` | `null` | no |
| <a name="input_bitbucket_datacenter"></a> [bitbucket\_datacenter](#input\_bitbucket\_datacenter) | Bitbucket Datacenter VCS settings | `map(any)` | `null` | no |
| <a name="input_branch"></a> [branch](#input\_branch) | Specify which branch to use within your infrastructure repo | `string` | `"main"` | no |
| <a name="input_cloudformation"></a> [cloudformation](#input\_cloudformation) | CloudFormation-specific configuration. Presence means this Stack is a CloudFormation Stack. | `map(any)` | `null` | no |
| <a name="input_commit_sha"></a> [commit\_sha](#input\_commit\_sha) | The commit SHA for which to trigger a run. Requires `var.spacelift_run_enabled` to be set to `true` | `string` | `null` | no |
| <a name="input_component_env"></a> [component\_env](#input\_component\_env) | Map of component ENV variables | `any` | `{}` | no |
| <a name="input_component_name"></a> [component\_name](#input\_component\_name) | The name of the concrete component (typically a directory name) | `string` | n/a | yes |
| <a name="input_component_root"></a> [component\_root](#input\_component\_root) | The path, relative to the root of the repository, where the component can be found | `string` | n/a | yes |
| <a name="input_component_vars"></a> [component\_vars](#input\_component\_vars) | All Terraform values to be applied to the stack via a mounted file | `any` | `{}` | no |
| <a name="input_context"></a> [context](#input\_context) | Single object for setting entire context at once.<br/>See description of individual variables for details.<br/>Leave string and numeric variables as `null` to use default value.<br/>Individual variable settings (non-null) override settings in context object,<br/>except for attributes, tags, and additional\_tag\_map, which are merged. | `any` | <pre>{<br/>  "additional_tag_map": {},<br/>  "attributes": [],<br/>  "delimiter": null,<br/>  "descriptor_formats": {},<br/>  "enabled": true,<br/>  "environment": null,<br/>  "id_length_limit": null,<br/>  "label_key_case": null,<br/>  "label_order": [],<br/>  "label_value_case": null,<br/>  "labels_as_tags": [<br/>    "unset"<br/>  ],<br/>  "name": null,<br/>  "namespace": null,<br/>  "regex_replace_chars": null,<br/>  "stage": null,<br/>  "tags": {},<br/>  "tenant": null<br/>}</pre> | no |
| <a name="input_context_attachments"></a> [context\_attachments](#input\_context\_attachments) | A list of context IDs to attach to this stack | `list(string)` | `[]` | no |
| <a name="input_delimiter"></a> [delimiter](#input\_delimiter) | Delimiter to be used between ID elements.<br/>Defaults to `-` (hyphen). Set to `""` to use no delimiter at all. | `string` | `null` | no |
| <a name="input_description"></a> [description](#input\_description) | Specify description of stack | `string` | `null` | no |
| <a name="input_descriptor_formats"></a> [descriptor\_formats](#input\_descriptor\_formats) | Describe additional descriptors to be output in the `descriptors` output map.<br/>Map of maps. Keys are names of descriptors. Values are maps of the form<br/>`{<br/>   format = string<br/>   labels = list(string)<br/>}`<br/>(Type is `any` so the map values can later be enhanced to provide additional options.)<br/>`format` is a Terraform format string to be passed to the `format()` function.<br/>`labels` is a list of labels, in order, to pass to `format()` function.<br/>Label values will be normalized before being passed to `format()` so they will be<br/>identical to how they appear in `id`.<br/>Default is `{}` (`descriptors` output will be empty). | `any` | `{}` | no |
| <a name="input_drift_detection_enabled"></a> [drift\_detection\_enabled](#input\_drift\_detection\_enabled) | Flag to enable/disable drift detection on the infrastructure stacks | `bool` | `false` | no |
| <a name="input_drift_detection_reconcile"></a> [drift\_detection\_reconcile](#input\_drift\_detection\_reconcile) | Flag to enable/disable infrastructure stacks drift automatic reconciliation. If drift is detected and `reconcile` is turned on, Spacelift will create a tracked run to correct the drift | `bool` | `false` | no |
| <a name="input_drift_detection_schedule"></a> [drift\_detection\_schedule](#input\_drift\_detection\_schedule) | List of cron expressions to schedule drift detection for the infrastructure stacks | `list(string)` | <pre>[<br/>  "0 4 * * *"<br/>]</pre> | no |
| <a name="input_drift_detection_timezone"></a> [drift\_detection\_timezone](#input\_drift\_detection\_timezone) | Timezone in which the schedule is expressed. Defaults to UTC. | `string` | `"UTC"` | no |
| <a name="input_enabled"></a> [enabled](#input\_enabled) | Set to false to prevent the module from creating any resources | `bool` | `null` | no |
| <a name="input_environment"></a> [environment](#input\_environment) | ID element. Usually used for region e.g. 'uw2', 'us-west-2', OR role 'prod', 'staging', 'dev', 'UAT' | `string` | `null` | no |
| <a name="input_github_enterprise"></a> [github\_enterprise](#input\_github\_enterprise) | GitHub Enterprise (self-hosted) VCS settings | `map(any)` | `null` | no |
| <a name="input_gitlab"></a> [gitlab](#input\_gitlab) | GitLab VCS settings | `map(any)` | `null` | no |
| <a name="input_id_length_limit"></a> [id\_length\_limit](#input\_id\_length\_limit) | Limit `id` to this many characters (minimum 6).<br/>Set to `0` for unlimited length.<br/>Set to `null` for keep the existing setting, which defaults to `0`.<br/>Does not affect `id_full`. | `number` | `null` | no |
| <a name="input_label_key_case"></a> [label\_key\_case](#input\_label\_key\_case) | Controls the letter case of the `tags` keys (label names) for tags generated by this module.<br/>Does not affect keys of tags passed in via the `tags` input.<br/>Possible values: `lower`, `title`, `upper`.<br/>Default value: `title`. | `string` | `null` | no |
| <a name="input_label_order"></a> [label\_order](#input\_label\_order) | The order in which the labels (ID elements) appear in the `id`.<br/>Defaults to ["namespace", "environment", "stage", "name", "attributes"].<br/>You can omit any of the 6 labels ("tenant" is the 6th), but at least one must be present. | `list(string)` | `null` | no |
| <a name="input_label_value_case"></a> [label\_value\_case](#input\_label\_value\_case) | Controls the letter case of ID elements (labels) as included in `id`,<br/>set as tag values, and output by this module individually.<br/>Does not affect values of tags passed in via the `tags` input.<br/>Possible values: `lower`, `title`, `upper` and `none` (no transformation).<br/>Set this to `title` and set `delimiter` to `""` to yield Pascal Case IDs.<br/>Default value: `lower`. | `string` | `null` | no |
| <a name="input_labels"></a> [labels](#input\_labels) | A list of labels for the stack | `list(string)` | `[]` | no |
| <a name="input_labels_as_tags"></a> [labels\_as\_tags](#input\_labels\_as\_tags) | Set of labels (ID elements) to include as tags in the `tags` output.<br/>Default is to include all labels.<br/>Tags with empty values will not be included in the `tags` output.<br/>Set to `[]` to suppress all generated tags.<br/>**Notes:**<br/>  The value of the `name` tag, if included, will be the `id`, not the `name`.<br/>  Unlike other `null-label` inputs, the initial setting of `labels_as_tags` cannot be<br/>  changed in later chained modules. Attempts to change it will be silently ignored. | `set(string)` | <pre>[<br/>  "default"<br/>]</pre> | no |
| <a name="input_local_preview_enabled"></a> [local\_preview\_enabled](#input\_local\_preview\_enabled) | Indicates whether local preview runs can be triggered on this Stack | `bool` | `false` | no |
| <a name="input_manage_state"></a> [manage\_state](#input\_manage\_state) | Flag to enable/disable manage\_state setting in stack | `bool` | `true` | no |
| <a name="input_name"></a> [name](#input\_name) | ID element. Usually the component or solution name, e.g. 'app' or 'jenkins'.<br/>This is the only ID element not also included as a `tag`.<br/>The "name" tag is set to the full `id` string. There is no tag with the value of the `name` input. | `string` | `null` | no |
| <a name="input_namespace"></a> [namespace](#input\_namespace) | ID element. Usually an abbreviation of your organization name, e.g. 'eg' or 'cp', to help ensure generated IDs are globally unique | `string` | `null` | no |
| <a name="input_policy_ids"></a> [policy\_ids](#input\_policy\_ids) | List of Rego policy IDs to attach to this stack | `list(string)` | `[]` | no |
| <a name="input_protect_from_deletion"></a> [protect\_from\_deletion](#input\_protect\_from\_deletion) | Flag to enable/disable deletion protection. | `bool` | `false` | no |
| <a name="input_pulumi"></a> [pulumi](#input\_pulumi) | Pulumi-specific configuration. Presence means this Stack is a Pulumi Stack. | `map(any)` | `null` | no |
| <a name="input_regex_replace_chars"></a> [regex\_replace\_chars](#input\_regex\_replace\_chars) | Terraform regular expression (regex) string.<br/>Characters matching the regex will be removed from the ID elements.<br/>If not set, `"/[^a-zA-Z0-9-]/"` is used to remove all characters other than hyphens, letters and digits. | `string` | `null` | no |
| <a name="input_repository"></a> [repository](#input\_repository) | The name of your infrastructure repo | `string` | n/a | yes |
| <a name="input_runner_image"></a> [runner\_image](#input\_runner\_image) | The full image name and tag of the Docker image to use in Spacelift | `string` | `null` | no |
| <a name="input_showcase"></a> [showcase](#input\_showcase) | Showcase settings | `map(any)` | `null` | no |
| <a name="input_space_id"></a> [space\_id](#input\_space\_id) | Place the stack in the specified space\_id. | `string` | `"root"` | no |
| <a name="input_spacelift_run_enabled"></a> [spacelift\_run\_enabled](#input\_spacelift\_run\_enabled) | Enable/disable creation of the `spacelift_run` resource | `bool` | `false` | no |
| <a name="input_spacelift_stack_dependency_enabled"></a> [spacelift\_stack\_dependency\_enabled](#input\_spacelift\_stack\_dependency\_enabled) | If enabled, the `spacelift_stack_dependency` Spacelift resource will be used to create dependencies between stacks instead of using the `depends-on` labels. The `depends-on` labels will be removed from the stacks and the trigger policies for dependencies will be detached | `bool` | `false` | no |
| <a name="input_stack_destructor_enabled"></a> [stack\_destructor\_enabled](#input\_stack\_destructor\_enabled) | Flag to enable/disable the stack destructor to destroy the resources of the stack before deleting the stack itself | `bool` | `false` | no |
| <a name="input_stack_name"></a> [stack\_name](#input\_stack\_name) | The name of the Spacelift stack | `string` | n/a | yes |
| <a name="input_stage"></a> [stage](#input\_stage) | ID element. Usually used to indicate role, e.g. 'prod', 'staging', 'source', 'build', 'test', 'deploy', 'release' | `string` | `null` | no |
| <a name="input_tags"></a> [tags](#input\_tags) | Additional tags (e.g. `{'BusinessUnit': 'XYZ'}`).<br/>Neither the tag keys nor the tag values will be modified by this module. | `map(string)` | `{}` | no |
| <a name="input_tenant"></a> [tenant](#input\_tenant) | ID element \_(Rarely used, not included by default)\_. A customer identifier, indicating who this instance of a resource is for | `string` | `null` | no |
| <a name="input_terraform_smart_sanitization"></a> [terraform\_smart\_sanitization](#input\_terraform\_smart\_sanitization) | Whether or not to enable [Smart Sanitization](https://docs.spacelift.io/vendors/terraform/resource-sanitization) which will only sanitize values marked as sensitive. | `bool` | `false` | no |
| <a name="input_terraform_version"></a> [terraform\_version](#input\_terraform\_version) | Specify the version of Terraform to use for the stack | `string` | `null` | no |
| <a name="input_terraform_workflow_tool"></a> [terraform\_workflow\_tool](#input\_terraform\_workflow\_tool) | Defines the tool that will be used to execute the workflow. This can be one of OPEN\_TOFU, TERRAFORM\_FOSS or CUSTOM. Defaults to TERRAFORM\_FOSS. | `string` | `"TERRAFORM_FOSS"` | no |
| <a name="input_terraform_workspace"></a> [terraform\_workspace](#input\_terraform\_workspace) | Specify the Terraform workspace to use for the stack | `string` | `null` | no |
| <a name="input_webhook_enabled"></a> [webhook\_enabled](#input\_webhook\_enabled) | Flag to enable/disable the webhook endpoint to which Spacelift sends the POST requests about run state changes | `bool` | `false` | no |
| <a name="input_webhook_endpoint"></a> [webhook\_endpoint](#input\_webhook\_endpoint) | Webhook endpoint to which Spacelift sends the POST requests about run state changes | `string` | `null` | no |
| <a name="input_webhook_secret"></a> [webhook\_secret](#input\_webhook\_secret) | Webhook secret used to sign each POST request so you're able to verify that the requests come from Spacelift | `string` | `null` | no |
| <a name="input_worker_pool_id"></a> [worker\_pool\_id](#input\_worker\_pool\_id) | The immutable ID (slug) of the worker pool | `string` | `null` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_id"></a> [id](#output\_id) | The stack id |
| <a name="output_stack"></a> [stack](#output\_stack) | The created stack |
<!-- markdownlint-restore -->

