---
title: aws-glue
sidebar_label: aws-glue
sidebar_class_name: command
description: |-
  Terraform modules for provisioning and managing AWS [Glue](https://docs.aws.amazon.com/glue/latest/dg/what-is-glue.html) resources. 

  The following Glue resources are supported:

    - [Catalog database](modules/glue-catalog-database)
    - [Catalog table](modules/glue-catalog-table)
    - [Connection](modules/glue-connection)
    - [Crawler](modules/glue-crawler)
    - [Job](modules/glue-job)
    - [Registry](modules/glue-registry)
    - [Schema](modules/glue-schema)
    - [Trigger](modules/glue-trigger)
    - [Workflow](modules/glue-workflow)

  Refer to [modules](modules) for more details.
custom_edit_url: https://github.com/cloudposse/terraform-aws-glue/edit/main/README.md
---

# Component: `aws-glue`
Terraform modules for provisioning and managing AWS [Glue](https://docs.aws.amazon.com/glue/latest/dg/what-is-glue.html) resources. 

The following Glue resources are supported:

  - [Catalog database](modules/glue-catalog-database)
  - [Catalog table](modules/glue-catalog-table)
  - [Connection](modules/glue-connection)
  - [Crawler](modules/glue-crawler)
  - [Job](modules/glue-job)
  - [Registry](modules/glue-registry)
  - [Schema](modules/glue-schema)
  - [Trigger](modules/glue-trigger)
  - [Workflow](modules/glue-workflow)

Refer to [modules](modules) for more details.






## Usage

For a complete example, see [examples/complete](examples/complete). 
The example provisions a Glue catalog database and a Glue crawler that crawls a public dataset in an S3 bucket and writes the metadata into the Glue catalog database.
It also provisions an S3 bucket with a Glue Job Python script, and a destination S3 bucket for Glue job results.
And finally, it provisions a Glue job pointing to the Python script in the S3 bucket, and a Glue trigger that triggers the Glue job on a schedule.
The Glue job processes the dataset, cleans up the data, and writes the result into the destination S3 bucket.

For an example on how to provision source and destination S3 buckets, Glue Catalog database and table, and a Glue crawler that processes 
data in the source S3 bucket and writes the result into the destination S3 bucket, 
see [examples/crawler](examples/crawler).

For automated tests of the examples using [bats](https://github.com/bats-core/bats-core) and [Terratest](https://github.com/gruntwork-io/terratest)
(which tests and deploys the examples on AWS), see [test](test).




## Examples


```hcl

locals {
  enabled          = module.this.enabled
  s3_bucket_source = module.s3_bucket_source.bucket_id
  role_arn         = module.iam_role.arn

  # The dataset used in this example consists of Medicare-Provider payment data downloaded from two Data.CMS.gov sites:
  # Inpatient Prospective Payment System Provider Summary for the Top 100 Diagnosis-Related Groups - FY2011, and Inpatient Charge Data FY 2011.
  # AWS modified the data to introduce a couple of erroneous records at the tail end of the file
  data_source = "s3://awsglue-datasets/examples/medicare/Medicare_Hospital_Provider.csv"
}

module "glue_catalog_database" {
  source = "cloudposse/glue/aws//modules/glue-catalog-database"
  # Cloud Posse recommends pinning every module to a specific version
  # version = "x.x.x"

  catalog_database_description = "Glue Catalog database for the data located in ${local.data_source}"
  location_uri                 = local.data_source

  attributes = ["payments"]
  context    = module.this.context
}

module "glue_catalog_table" {
  source = "cloudposse/glue/aws//modules/glue-catalog-table"
  # Cloud Posse recommends pinning every module to a specific version
  # version = "x.x.x"

  catalog_table_name        = "medicare"
  catalog_table_description = "Test Glue Catalog table"
  database_name             = module.glue_catalog_database.name

  storage_descriptor = {
    # Physical location of the table
    location = local.data_source
  }

  context    = module.this.context
}

resource "aws_lakeformation_permissions" "default" {
  principal   = local.role_arn
  permissions = ["ALL"]

  table {
    database_name = module.glue_catalog_database.name
    name          = module.glue_catalog_table.name
  }
}

# Crawls the data in the S3 bucket and puts the results into a database in the Glue Data Catalog.
# The crawler will read the first 2 MB of data from that file, and recognize the schema.
# After that, the crawler will sync the table `medicare` in the Glue database.
module "glue_crawler" {
  source = "cloudposse/glue/aws//modules/glue-crawler"
  # Cloud Posse recommends pinning every module to a specific version
  # version = "x.x.x"

  crawler_description = "Glue crawler that processes data in ${local.data_source} and writes the metadata into a Glue Catalog database"
  database_name       = module.glue_catalog_database.name
  role                = local.role_arn
  schedule            = "cron(0 1 * * ? *)"

  schema_change_policy = {
    delete_behavior = "LOG"
    update_behavior = null
  }

  catalog_target = [
    {
      database_name = module.glue_catalog_database.name
      tables        = [module.glue_catalog_table.name]
    }
  ]

  context = module.this.context

  depends_on = [
    aws_lakeformation_permissions.default
  ]
}

# Source S3 bucket to store Glue Job scripts
module "s3_bucket_source" {
  source  = "cloudposse/s3-bucket/aws"
  # Cloud Posse recommends pinning every module to a specific version
  # version = "x.x.x"

  acl                          = "private"
  versioning_enabled           = false
  force_destroy                = true
  allow_encrypted_uploads_only = true
  allow_ssl_requests_only      = true
  block_public_acls            = true
  block_public_policy          = true
  ignore_public_acls           = true
  restrict_public_buckets      = true

  attributes = ["source"]
  context    = module.this.context
}

resource "aws_s3_object" "job_script" {
  bucket        = local.s3_bucket_source
  key           = "data_cleaning.py"
  source        = "${path.module}/scripts/data_cleaning.py"
  force_destroy = true
  etag          = filemd5("${path.module}/scripts/data_cleaning.py")

  tags = module.this.tags
}

# Destination S3 bucket to store Glue Job results
module "s3_bucket_destination" {
  source  = "cloudposse/s3-bucket/aws"
  # Cloud Posse recommends pinning every module to a specific version
  # version = "x.x.x"

  acl                          = "private"
  versioning_enabled           = false
  force_destroy                = true
  allow_encrypted_uploads_only = true
  allow_ssl_requests_only      = true
  block_public_acls            = true
  block_public_policy          = true
  ignore_public_acls           = true
  restrict_public_buckets      = true

  attributes = ["destination"]
  context    = module.this.context
}

module "iam_role" {
  source  = "cloudposse/iam-role/aws"
  # Cloud Posse recommends pinning every module to a specific version
  # version = "x.x.x"

  principals = {
    "Service" = ["glue.amazonaws.com"]
  }

  managed_policy_arns = [
    "arn:aws:iam::aws:policy/service-role/AWSGlueServiceRole"
  ]

  policy_document_count = 0
  policy_description    = "Policy for AWS Glue with access to EC2, S3, and Cloudwatch Logs"
  role_description      = "Role for AWS Glue with access to EC2, S3, and Cloudwatch Logs"

  context = module.this.context
}

module "glue_workflow" {
  source = "cloudposse/glue/aws//modules/glue-workflow"
  # Cloud Posse recommends pinning every module to a specific version
  # version = "x.x.x"

  workflow_description = "Test Glue Workflow"
  max_concurrent_runs  = 2

  context = module.this.context
}

module "glue_job" {
  source = "cloudposse/glue/aws//modules/glue-job"
  # Cloud Posse recommends pinning every module to a specific version
  # version = "x.x.x"

  job_description   = "Glue Job that runs data_cleaning.py Python script"
  role_arn          = local.role_arn
  glue_version      = var.glue_version
  worker_type       = "Standard"
  number_of_workers = 2
  max_retries       = 2

  # The job timeout in minutes
  timeout = 20

  command = {
    # The name of the job command. Defaults to `glueetl`.
    # Use `pythonshell` for Python Shell Job Type, or `gluestreaming` for Streaming Job Type.
    name            = "glueetl"
    script_location = format("s3://%s/data_cleaning.py", local.s3_bucket_source)
    python_version  = 3
  }

  context = module.this.context
}

module "glue_trigger" {
  source = "cloudposse/glue/aws//modules/glue-trigger"
  # Cloud Posse recommends pinning every module to a specific version
  # version = "x.x.x"

  workflow_name       = module.glue_workflow.name
  trigger_enabled     = true
  start_on_creation   = true
  trigger_description = "Glue Trigger that triggers a Glue Job on a schedule"
  schedule            = "cron(15 12 * * ? *)"
  type                = "SCHEDULED"

  actions = [
    {
      job_name = module.glue_job.name
      # The job run timeout in minutes. It overrides the timeout value of the job
      timeout = 10
    }
  ]

  context = module.this.context
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
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 1.0 |
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | >= 3.74.0 |
| <a name="requirement_awsutils"></a> [awsutils](#requirement\_awsutils) | >= 0.11.1 |

## Providers

No providers.

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_this"></a> [this](#module\_this) | cloudposse/label/null | 0.25.0 |

## Resources

No resources.

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_additional_tag_map"></a> [additional\_tag\_map](#input\_additional\_tag\_map) | Additional key-value pairs to add to each map in `tags_as_list_of_maps`. Not added to `tags` or `id`.<br/>This is for some rare cases where resources want additional configuration of tags<br/>and therefore take a list of maps with tag key, value, and additional configuration. | `map(string)` | `{}` | no |
| <a name="input_attributes"></a> [attributes](#input\_attributes) | ID element. Additional attributes (e.g. `workers` or `cluster`) to add to `id`,<br/>in the order they appear in the list. New attributes are appended to the<br/>end of the list. The elements of the list are joined by the `delimiter`<br/>and treated as a single ID element. | `list(string)` | `[]` | no |
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
| <a name="input_regex_replace_chars"></a> [regex\_replace\_chars](#input\_regex\_replace\_chars) | Terraform regular expression (regex) string.<br/>Characters matching the regex will be removed from the ID elements.<br/>If not set, `"/[^a-zA-Z0-9-]/"` is used to remove all characters other than hyphens, letters and digits. | `string` | `null` | no |
| <a name="input_stage"></a> [stage](#input\_stage) | ID element. Usually used to indicate role, e.g. 'prod', 'staging', 'source', 'build', 'test', 'deploy', 'release' | `string` | `null` | no |
| <a name="input_tags"></a> [tags](#input\_tags) | Additional tags (e.g. `{'BusinessUnit': 'XYZ'}`).<br/>Neither the tag keys nor the tag values will be modified by this module. | `map(string)` | `{}` | no |
| <a name="input_tenant"></a> [tenant](#input\_tenant) | ID element \_(Rarely used, not included by default)\_. A customer identifier, indicating who this instance of a resource is for | `string` | `null` | no |

## Outputs

No outputs.
<!-- markdownlint-restore -->


