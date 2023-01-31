---
title: aws-helm-release
sidebar_label: aws-helm-release
sidebar_class_name: command
description: |-
  This `terraform-aws-helm-release` module deploys a [Helm chart](https://helm.sh/docs/topics/charts/) with
  an option to create an EKS IAM Role for a Service Account ([IRSA](https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html)).
custom_edit_url: https://github.com/cloudposse/terraform-aws-helm-release/edit/master/README.md
---

# Component: `aws-helm-release`
This `terraform-aws-helm-release` module deploys a [Helm chart](https://helm.sh/docs/topics/charts/) with
an option to create an EKS IAM Role for a Service Account ([IRSA](https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html)).






## Usage


This  module deploys a [Helm chart](https://helm.sh/docs/topics/charts/) with
an option to create an EKS IAM Role for a Service Account ([IRSA](https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html)).
It has many of the same features and limitations of Helm, and uses the
Terraform [Helm provider](https://github.com/hashicorp/terraform-provider-helm),
specifically the [helm_release](https://registry.terraform.io/providers/hashicorp/helm/latest/docs/resources/release) resource.

NOTE: This module is just a convenient wrapper, packaging up 3 concepts:
1. Deploying a Helm Chart to an EKS cluster
1. Creating a Kubernetes namespace in the EKS cluster
1. Creating an IAM role for a Kubernetes Service Account (which, in turn,
is presumably created by deploying the Helm Chart)

Many issues may arise that are due to limitations of Helm, Kubernetes, EKS,
Terraform, or the Terraform providers. Please address issues and complaints
to the project that can potentially fix them, which will usually not be this module.

### Provider requirements.

This module is unusual in that it requires you to configure 3 separate Terraform providers:
1. AWS
2. Helm
3. Kubernetes

Cloud Posse maintains a [provider-helm.tf](https://github.com/cloudposse/terraform-aws-components/blob/master/mixins/provider-helm.tf)
file "mixin" for use in Cloud Posse [components](https://github.com/cloudposse/terraform-aws-components)
which you can also use as an example of how to configure the Helm and Kubernetes providers in your own component.


### Creating a namespace

This module provides 2 options for creating the namespace the chart will be deployed to, for the
case where you are deploying the chart into its own namespace that does not already exist.

1. `create_namespace_with_kubernetes` will manage the namespace using a Terraform `kubernetes_namespace`
resource. This is the recommended way to create the namespace, because it allows you to
annotate (`kubernetes_namespace_annotations`) and label (`kubernetes_namespace_labels`) the namespace,
and it provides proper sequencing of creation and
destruction of deployments, resources, and IAM roles. When the deployment is
destroyed with `terraform destroy`, the namespace will be deleted, too. This will
delete everything else in the namespace (but never the Custom Resource Definitions,
which themselves are non-namespaced), so if this is not the desired behavior, you
should create the namespace in a separate Terraform component.
1. `create_namespace` is the obsolete way to create a namespace, by delegating the
responsibility to Helm. This is not recommended because it provides no control over
the annotations or labels of the namespace, and when the deployment is
destroyed with `terraform destroy`, the namespace will be left behind.
This can cause problems with future deployments.

Note: You may have trouble deleting a release from within Terraform if the Kubernetes cluster
has been modified outside of this module, for example if the namespace or the cluster itself has been deleted.
You can delete the Terraform state if the resources are gone, using `terraform state rm`
or even `terraform workspace delete`, or you can try using `terraform destroy`.
In some cases, it may be helpful to set `var.enabled` to `false` while destroying:

```shell
terraform destroy -var enabled=false
```


For a complete example, see [examples/complete](examples/complete).

```hcl
module "helm_release" {
  source  = "cloudposse/helm-release/aws"
  # Cloud Posse recommends pinning every module to a specific version
  # version = "x.x.x"

  name = "echo"

  repository    = "https://charts.helm.sh/incubator"
  chart         = "raw"
  chart_version = "0.2.5"

  create_namespace     = true
  kubernetes_namespace = "echo"

  atomic          = true
  cleanup_on_fail = true
  timeout         = 300
  wait            = true

  # These values will be deep merged
  # values = [
  # ]

  # Enable the IAM role
  iam_role_enabled = true

  # Add the IAM role using set()
  service_account_role_arn_annotation_enabled = true

  # Dictates which ServiceAccounts are allowed to assume the IAM Role.
  # In this case, only the "echo" ServiceAccount in the "echo" namespace
  # will be able to assume the IAM Role created by this module.
  service_account_name      = "echo"
  service_account_namespace = "echo"

  # IAM policy statements to add to the IAM role
  iam_policy_statements = {
    ListMyBucket = {
      effect     = "Allow"
      actions    = ["s3:ListBucket"]
      resources  = ["arn:aws:s3:::test"]
      conditions = []
    },
    WriteMyBucket = {
      effect     = "Allow"
      actions    = ["s3:PutObject", "s3:GetObject", "s3:DeleteObject"]
      resources  = ["arn:aws:s3:::test/*"]
      conditions = []
    },
  }
}
```

If `var.service_account_name` is set, then `var.name` can be set to "" in order to achieve a shorter name for the IAM
Role created for the ServiceAccount:

```hcl
module "helm_release" {
  source  = "cloudposse/helm-release/aws"
  # Cloud Posse recommends pinning every module to a specific version
  # version = "x.x.x"

  name = ""

  create_namespace     = true
  kubernetes_namespace = "echo"

  service_account_name      = "echo"
  service_account_namespace = "echo"

  iam_role_enabled = true

  service_account_role_arn_annotation_enabled = true

  # ...
}
```

This will result in an IAM role with a name such as: `eg-uw2-dev-echo@echo` instead of `eg-uw2-dev-echo-echo@echo`.
Additionally, if `var.name` is empty, the name used for the Helm Release will be that of `var.chart`.




## Examples

Here is an example of using this module:
- [`examples/complete`](https://github.com/cloudposse/terraform-aws-helm-release/) - complete example of using this module



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
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 1.0 |
| <a name="requirement_helm"></a> [helm](#requirement\_helm) | >= 2.2 |
| <a name="requirement_kubernetes"></a> [kubernetes](#requirement\_kubernetes) | >= 2.7.1 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_helm"></a> [helm](#provider\_helm) | >= 2.2 |
| <a name="provider_kubernetes"></a> [kubernetes](#provider\_kubernetes) | >= 2.7.1 |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_eks_iam_policy"></a> [eks\_iam\_policy](#module\_eks\_iam\_policy) | cloudposse/iam-policy/aws | 0.4.0 |
| <a name="module_eks_iam_role"></a> [eks\_iam\_role](#module\_eks\_iam\_role) | cloudposse/eks-iam-role/aws | 1.1.0 |
| <a name="module_this"></a> [this](#module\_this) | cloudposse/label/null | 0.25.0 |

## Resources

| Name | Type |
|------|------|
| [helm_release.this](https://registry.terraform.io/providers/hashicorp/helm/latest/docs/resources/release) | resource |
| [kubernetes_namespace.default](https://registry.terraform.io/providers/hashicorp/kubernetes/latest/docs/resources/namespace) | resource |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_additional_tag_map"></a> [additional\_tag\_map](#input\_additional\_tag\_map) | Additional key-value pairs to add to each map in `tags_as_list_of_maps`. Not added to `tags` or `id`.<br/>This is for some rare cases where resources want additional configuration of tags<br/>and therefore take a list of maps with tag key, value, and additional configuration. | `map(string)` | `{}` | no |
| <a name="input_atomic"></a> [atomic](#input\_atomic) | If set, installation process purges chart on fail. The wait flag will be set automatically if atomic is used. Defaults to `false`. | `bool` | `null` | no |
| <a name="input_attributes"></a> [attributes](#input\_attributes) | ID element. Additional attributes (e.g. `workers` or `cluster`) to add to `id`,<br/>in the order they appear in the list. New attributes are appended to the<br/>end of the list. The elements of the list are joined by the `delimiter`<br/>and treated as a single ID element. | `list(string)` | `[]` | no |
| <a name="input_aws_account_number"></a> [aws\_account\_number](#input\_aws\_account\_number) | AWS account number of EKS cluster owner. | `string` | `null` | no |
| <a name="input_aws_partition"></a> [aws\_partition](#input\_aws\_partition) | AWS partition: `aws`, `aws-cn`, or `aws-us-gov`. Applicable when `var.iam_role_enabled` is `true`. | `string` | `"aws"` | no |
| <a name="input_chart"></a> [chart](#input\_chart) | Chart name to be installed. The chart name can be local path, a URL to a chart, or the name of the chart if `repository` is specified. It is also possible to use the `<repository>/<chart>` format here if you are running Terraform on a system that the repository has been added to with `helm repo add` but this is not recommended. | `string` | n/a | yes |
| <a name="input_chart_version"></a> [chart\_version](#input\_chart\_version) | Specify the exact chart version to install. If this is not specified, the latest version is installed. | `string` | `null` | no |
| <a name="input_cleanup_on_fail"></a> [cleanup\_on\_fail](#input\_cleanup\_on\_fail) | Allow deletion of new resources created in this upgrade when upgrade fails. Defaults to `false`. | `bool` | `null` | no |
| <a name="input_context"></a> [context](#input\_context) | Single object for setting entire context at once.<br/>See description of individual variables for details.<br/>Leave string and numeric variables as `null` to use default value.<br/>Individual variable settings (non-null) override settings in context object,<br/>except for attributes, tags, and additional\_tag\_map, which are merged. | `any` | <pre>{<br/>  "additional_tag_map": {},<br/>  "attributes": [],<br/>  "delimiter": null,<br/>  "descriptor_formats": {},<br/>  "enabled": true,<br/>  "environment": null,<br/>  "id_length_limit": null,<br/>  "label_key_case": null,<br/>  "label_order": [],<br/>  "label_value_case": null,<br/>  "labels_as_tags": [<br/>    "unset"<br/>  ],<br/>  "name": null,<br/>  "namespace": null,<br/>  "regex_replace_chars": null,<br/>  "stage": null,<br/>  "tags": {},<br/>  "tenant": null<br/>}</pre> | no |
| <a name="input_create_namespace"></a> [create\_namespace](#input\_create\_namespace) | (Not recommended, use `create_namespace_with_kubernetes` instead)<br/>Create the namespace via Helm if it does not yet exist. Defaults to `false`.<br/>Does not support annotations or labels. May have problems when destroying.<br/>Ignored when `create_namespace_with_kubernetes` is set. | `bool` | `null` | no |
| <a name="input_create_namespace_with_kubernetes"></a> [create\_namespace\_with\_kubernetes](#input\_create\_namespace\_with\_kubernetes) | Create the namespace via Kubernetes if it does not yet exist. Defaults to `false`.<br/>Must set `true` if you want to use namespace annotations or labels. | `bool` | `null` | no |
| <a name="input_delimiter"></a> [delimiter](#input\_delimiter) | Delimiter to be used between ID elements.<br/>Defaults to `-` (hyphen). Set to `""` to use no delimiter at all. | `string` | `null` | no |
| <a name="input_dependency_update"></a> [dependency\_update](#input\_dependency\_update) | Runs helm dependency update before installing the chart. Defaults to `false`. | `bool` | `null` | no |
| <a name="input_description"></a> [description](#input\_description) | Release description attribute (visible in the history). | `string` | `null` | no |
| <a name="input_descriptor_formats"></a> [descriptor\_formats](#input\_descriptor\_formats) | Describe additional descriptors to be output in the `descriptors` output map.<br/>Map of maps. Keys are names of descriptors. Values are maps of the form<br/>`{<br/>   format = string<br/>   labels = list(string)<br/>}`<br/>(Type is `any` so the map values can later be enhanced to provide additional options.)<br/>`format` is a Terraform format string to be passed to the `format()` function.<br/>`labels` is a list of labels, in order, to pass to `format()` function.<br/>Label values will be normalized before being passed to `format()` so they will be<br/>identical to how they appear in `id`.<br/>Default is `{}` (`descriptors` output will be empty). | `any` | `{}` | no |
| <a name="input_devel"></a> [devel](#input\_devel) | Use chart development versions, too. Equivalent to version `>0.0.0-0`. If version is set, this is ignored. | `bool` | `null` | no |
| <a name="input_disable_openapi_validation"></a> [disable\_openapi\_validation](#input\_disable\_openapi\_validation) | If set, the installation process will not validate rendered templates against the Kubernetes OpenAPI Schema. Defaults to `false`. | `bool` | `null` | no |
| <a name="input_disable_webhooks"></a> [disable\_webhooks](#input\_disable\_webhooks) | Prevent hooks from running. Defaults to `false`. | `bool` | `null` | no |
| <a name="input_eks_cluster_oidc_issuer_url"></a> [eks\_cluster\_oidc\_issuer\_url](#input\_eks\_cluster\_oidc\_issuer\_url) | OIDC issuer URL for the EKS cluster (initial "https://" may be omitted). | `string` | n/a | yes |
| <a name="input_enabled"></a> [enabled](#input\_enabled) | Set to false to prevent the module from creating any resources | `bool` | `null` | no |
| <a name="input_environment"></a> [environment](#input\_environment) | ID element. Usually used for region e.g. 'uw2', 'us-west-2', OR role 'prod', 'staging', 'dev', 'UAT' | `string` | `null` | no |
| <a name="input_force_update"></a> [force\_update](#input\_force\_update) | Force resource update through delete/recreate if needed. Defaults to `false`. | `bool` | `null` | no |
| <a name="input_iam_policy_statements"></a> [iam\_policy\_statements](#input\_iam\_policy\_statements) | IAM policy for the service account. Required if `var.iam_role_enabled` is `true`. This will not do variable replacements. Please see `var.iam_policy_statements_template_path`. | `any` | `{}` | no |
| <a name="input_iam_role_enabled"></a> [iam\_role\_enabled](#input\_iam\_role\_enabled) | Whether to create an IAM role. Setting this to `true` will also replace any occurrences of `{service_account_role_arn}` in `var.values_template_path` with the ARN of the IAM role created by this module. | `bool` | `false` | no |
| <a name="input_iam_source_json_url"></a> [iam\_source\_json\_url](#input\_iam\_source\_json\_url) | IAM source json policy to download. This will be used as the `source_json` meaning the `var.iam_policy_statements` and `var.iam_policy_statements_template_path` can override it. | `string` | `null` | no |
| <a name="input_iam_source_policy_documents"></a> [iam\_source\_policy\_documents](#input\_iam\_source\_policy\_documents) | List of IAM policy documents that are merged together into the exported document. Statements defined in `source_policy_documents` or `source_json` must have unique sids. Statements with the same sid from documents assigned to the `override_json` and `override_policy_documents` arguments will override source statements. | `list(string)` | `null` | no |
| <a name="input_id_length_limit"></a> [id\_length\_limit](#input\_id\_length\_limit) | Limit `id` to this many characters (minimum 6).<br/>Set to `0` for unlimited length.<br/>Set to `null` for keep the existing setting, which defaults to `0`.<br/>Does not affect `id_full`. | `number` | `null` | no |
| <a name="input_keyring"></a> [keyring](#input\_keyring) | Location of public keys used for verification. Used only if `verify` is true. Defaults to `/.gnupg/pubring.gpg` in the location set by `home`. | `string` | `null` | no |
| <a name="input_kubernetes_namespace"></a> [kubernetes\_namespace](#input\_kubernetes\_namespace) | The namespace to install the release into. Defaults to `default`. | `string` | `null` | no |
| <a name="input_kubernetes_namespace_annotations"></a> [kubernetes\_namespace\_annotations](#input\_kubernetes\_namespace\_annotations) | Annotations to be added to the created namespace. Ignored unless `create_namespace_with_kubernetes` is `true`. | `map(string)` | `{}` | no |
| <a name="input_kubernetes_namespace_labels"></a> [kubernetes\_namespace\_labels](#input\_kubernetes\_namespace\_labels) | Labels to be added to the created namespace. Ignored unless `create_namespace_with_kubernetes` is `true`. | `map(string)` | `{}` | no |
| <a name="input_label_key_case"></a> [label\_key\_case](#input\_label\_key\_case) | Controls the letter case of the `tags` keys (label names) for tags generated by this module.<br/>Does not affect keys of tags passed in via the `tags` input.<br/>Possible values: `lower`, `title`, `upper`.<br/>Default value: `title`. | `string` | `null` | no |
| <a name="input_label_order"></a> [label\_order](#input\_label\_order) | The order in which the labels (ID elements) appear in the `id`.<br/>Defaults to ["namespace", "environment", "stage", "name", "attributes"].<br/>You can omit any of the 6 labels ("tenant" is the 6th), but at least one must be present. | `list(string)` | `null` | no |
| <a name="input_label_value_case"></a> [label\_value\_case](#input\_label\_value\_case) | Controls the letter case of ID elements (labels) as included in `id`,<br/>set as tag values, and output by this module individually.<br/>Does not affect values of tags passed in via the `tags` input.<br/>Possible values: `lower`, `title`, `upper` and `none` (no transformation).<br/>Set this to `title` and set `delimiter` to `""` to yield Pascal Case IDs.<br/>Default value: `lower`. | `string` | `null` | no |
| <a name="input_labels_as_tags"></a> [labels\_as\_tags](#input\_labels\_as\_tags) | Set of labels (ID elements) to include as tags in the `tags` output.<br/>Default is to include all labels.<br/>Tags with empty values will not be included in the `tags` output.<br/>Set to `[]` to suppress all generated tags.<br/>**Notes:**<br/>  The value of the `name` tag, if included, will be the `id`, not the `name`.<br/>  Unlike other `null-label` inputs, the initial setting of `labels_as_tags` cannot be<br/>  changed in later chained modules. Attempts to change it will be silently ignored. | `set(string)` | <pre>[<br/>  "default"<br/>]</pre> | no |
| <a name="input_lint"></a> [lint](#input\_lint) | Run the helm chart linter during the plan. Defaults to `false`. | `bool` | `null` | no |
| <a name="input_max_history"></a> [max\_history](#input\_max\_history) | Maximum number of release versions stored per release. Defaults to `0` (no limit). | `number` | `null` | no |
| <a name="input_name"></a> [name](#input\_name) | ID element. Usually the component or solution name, e.g. 'app' or 'jenkins'.<br/>This is the only ID element not also included as a `tag`.<br/>The "name" tag is set to the full `id` string. There is no tag with the value of the `name` input. | `string` | `null` | no |
| <a name="input_namespace"></a> [namespace](#input\_namespace) | ID element. Usually an abbreviation of your organization name, e.g. 'eg' or 'cp', to help ensure generated IDs are globally unique | `string` | `null` | no |
| <a name="input_permissions_boundary"></a> [permissions\_boundary](#input\_permissions\_boundary) | ARN of the policy that is used to set the permissions boundary for the role. | `string` | `null` | no |
| <a name="input_postrender_binary_path"></a> [postrender\_binary\_path](#input\_postrender\_binary\_path) | Relative or full path to command binary. | `string` | `null` | no |
| <a name="input_recreate_pods"></a> [recreate\_pods](#input\_recreate\_pods) | Perform pods restart during upgrade/rollback. Defaults to `false`. | `bool` | `null` | no |
| <a name="input_regex_replace_chars"></a> [regex\_replace\_chars](#input\_regex\_replace\_chars) | Terraform regular expression (regex) string.<br/>Characters matching the regex will be removed from the ID elements.<br/>If not set, `"/[^a-zA-Z0-9-]/"` is used to remove all characters other than hyphens, letters and digits. | `string` | `null` | no |
| <a name="input_release_name"></a> [release\_name](#input\_release\_name) | The name of the release to be installed. If omitted, use the name input, and if that's omitted, use the chart input. | `string` | `""` | no |
| <a name="input_render_subchart_notes"></a> [render\_subchart\_notes](#input\_render\_subchart\_notes) | If set, render subchart notes along with the parent. Defaults to `true`. | `bool` | `null` | no |
| <a name="input_replace"></a> [replace](#input\_replace) | Re-use the given name, even if that name is already used. This is unsafe in production. Defaults to `false`. | `bool` | `null` | no |
| <a name="input_repository"></a> [repository](#input\_repository) | Repository URL where to locate the requested chart. | `string` | `null` | no |
| <a name="input_repository_ca_file"></a> [repository\_ca\_file](#input\_repository\_ca\_file) | The Repositories CA file. | `string` | `null` | no |
| <a name="input_repository_cert_file"></a> [repository\_cert\_file](#input\_repository\_cert\_file) | The repositories cert file. | `string` | `null` | no |
| <a name="input_repository_key_file"></a> [repository\_key\_file](#input\_repository\_key\_file) | The repositories cert key file. | `string` | `null` | no |
| <a name="input_repository_password"></a> [repository\_password](#input\_repository\_password) | Password for HTTP basic authentication against the repository. | `string` | `null` | no |
| <a name="input_repository_username"></a> [repository\_username](#input\_repository\_username) | Username for HTTP basic authentication against the repository. | `string` | `null` | no |
| <a name="input_reset_values"></a> [reset\_values](#input\_reset\_values) | When upgrading, reset the values to the ones built into the chart. Defaults to `false`. | `bool` | `null` | no |
| <a name="input_reuse_values"></a> [reuse\_values](#input\_reuse\_values) | When upgrading, reuse the last release's values and merge in any overrides. If `reset_values` is specified, this is ignored. Defaults to `false`. | `bool` | `null` | no |
| <a name="input_service_account_name"></a> [service\_account\_name](#input\_service\_account\_name) | Name of the Kubernetes ServiceAccount allowed to assume the IAM role created when `var.iam_role_enabled` is set to `true`.<br/><br/>In combination with `var.service_account_namespace`, this variable is used to determine which ServiceAccounts are allowed<br/>to assume the IAM role in question.<br/><br/>It is *not* recommended to leave this variable as `null` or `""`, as this would mean ServiceAccounts of any name in the<br/>namespace specified by `var.service_account_namespace` are allowed to assume the IAM role in question. If both variables<br/>are omitted, then a ServiceAccount of any name in any namespace will be able to assume the IAM role in question, which<br/>is the least secure scenario.<br/><br/>The best practice is to set this variable to the name of the ServiceAccount created by the Helm Chart. | `string` | `null` | no |
| <a name="input_service_account_namespace"></a> [service\_account\_namespace](#input\_service\_account\_namespace) | Kubernetes Namespace of the Kubernetes ServiceAccount allowed to assume the IAM role created when `var.iam_role_enabled`<br/>is set to `true`.<br/><br/>In combination with `var.service_account_name`, this variable is used to determine which ServiceAccounts are allowed<br/>to assume the IAM role in question.<br/><br/>It is *not* recommended to leave this variable as `null` or `""`, as this would mean any ServiceAccounts matching the<br/>name specified by `var.service_account_name` in any namespace are allowed to assume the IAM role in question. If both<br/>variables are omitted, then a ServiceAccount of any name in any namespace will be able to assume the IAM role in question,<br/>which is the least secure scenario.<br/><br/>The best practice is to set this variable to the namespace of the ServiceAccount created by the Helm Chart. | `string` | `null` | no |
| <a name="input_service_account_role_arn_annotation_enabled"></a> [service\_account\_role\_arn\_annotation\_enabled](#input\_service\_account\_role\_arn\_annotation\_enabled) | Whether or not to dynamically insert an `eks.amazonaws.com/role-arn` annotation into `$var.service_account_set_key_path.annotations`<br/>(by default, `serviceAccount.annotations`), with the value being the ARN of the IAM role created when `var.iam_role_enabled`.<br/><br/>Assuming the Helm Chart follows the standard convention of rendering ServiceAccount annotations in `serviceAccount.annotations`<br/>(or a similar convention, which can be overriden by `var.service_account_set_key_path` as needed),<br/>this allows the ServiceAccount created by the Helm Chart to assume the IAM Role in question via the EKS OIDC IdP, without<br/>the consumer of this module having to set this annotation via `var.values` or `var.set`, which would involve manually<br/>rendering the IAM Role ARN beforehand.<br/><br/>Ignored if `var.iam_role_enabled` is `false`. | `bool` | `true` | no |
| <a name="input_service_account_set_key_path"></a> [service\_account\_set\_key\_path](#input\_service\_account\_set\_key\_path) | The key path used by Helm Chart values for ServiceAccount-related settings (e.g. `serviceAccount...` or `rbac.serviceAccount...`).<br/><br/>Ignored if either `var.service_account_role_arn_annotation_enabled` or `var.iam_role_enabled` are set to `false`. | `string` | `"serviceAccount.annotations.eks\\.amazonaws\\.com/role-arn"` | no |
| <a name="input_set"></a> [set](#input\_set) | Value block with custom values to be merged with the values yaml. | <pre>list(object({<br/>    name  = string<br/>    value = string<br/>    type  = string<br/>  }))</pre> | `[]` | no |
| <a name="input_set_sensitive"></a> [set\_sensitive](#input\_set\_sensitive) | Value block with custom sensitive values to be merged with the values yaml that won't be exposed in the plan's diff. | <pre>list(object({<br/>    name  = string<br/>    value = string<br/>    type  = string<br/>  }))</pre> | `[]` | no |
| <a name="input_skip_crds"></a> [skip\_crds](#input\_skip\_crds) | If set, no CRDs will be installed. By default, CRDs are installed if not already present. Defaults to `false`. | `bool` | `null` | no |
| <a name="input_stage"></a> [stage](#input\_stage) | ID element. Usually used to indicate role, e.g. 'prod', 'staging', 'source', 'build', 'test', 'deploy', 'release' | `string` | `null` | no |
| <a name="input_tags"></a> [tags](#input\_tags) | Additional tags (e.g. `{'BusinessUnit': 'XYZ'}`).<br/>Neither the tag keys nor the tag values will be modified by this module. | `map(string)` | `{}` | no |
| <a name="input_tenant"></a> [tenant](#input\_tenant) | ID element \_(Rarely used, not included by default)\_. A customer identifier, indicating who this instance of a resource is for | `string` | `null` | no |
| <a name="input_timeout"></a> [timeout](#input\_timeout) | Time in seconds to wait for any individual kubernetes operation (like Jobs for hooks). Defaults to `300` seconds. | `number` | `null` | no |
| <a name="input_values"></a> [values](#input\_values) | List of values in raw yaml to pass to helm. Values will be merged, in order, as Helm does with multiple `-f` options. | `any` | `null` | no |
| <a name="input_verify"></a> [verify](#input\_verify) | Verify the package before installing it. Helm uses a provenance file to verify the integrity of the chart; this must be hosted alongside the chart. For more information see the Helm Documentation. Defaults to `false`. | `bool` | `null` | no |
| <a name="input_wait"></a> [wait](#input\_wait) | Will wait until all resources are in a ready state before marking the release as successful. It will wait for as long as `timeout`. Defaults to `true`. | `bool` | `null` | no |
| <a name="input_wait_for_jobs"></a> [wait\_for\_jobs](#input\_wait\_for\_jobs) | If wait is enabled, will wait until all Jobs have been completed before marking the release as successful. It will wait for as long as `timeout`. Defaults to `false`. | `bool` | `null` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_metadata"></a> [metadata](#output\_metadata) | Block status of the deployed release. |
| <a name="output_service_account_name"></a> [service\_account\_name](#output\_service\_account\_name) | Kubernetes Service Account name |
| <a name="output_service_account_namespace"></a> [service\_account\_namespace](#output\_service\_account\_namespace) | Kubernetes Service Account namespace |
| <a name="output_service_account_policy_arn"></a> [service\_account\_policy\_arn](#output\_service\_account\_policy\_arn) | IAM policy ARN |
| <a name="output_service_account_policy_id"></a> [service\_account\_policy\_id](#output\_service\_account\_policy\_id) | IAM policy ID |
| <a name="output_service_account_policy_name"></a> [service\_account\_policy\_name](#output\_service\_account\_policy\_name) | IAM policy name |
| <a name="output_service_account_role_arn"></a> [service\_account\_role\_arn](#output\_service\_account\_role\_arn) | IAM role ARN |
| <a name="output_service_account_role_name"></a> [service\_account\_role\_name](#output\_service\_account\_role\_name) | IAM role name |
| <a name="output_service_account_role_unique_id"></a> [service\_account\_role\_unique\_id](#output\_service\_account\_role\_unique\_id) | IAM role unique ID |
<!-- markdownlint-restore -->


