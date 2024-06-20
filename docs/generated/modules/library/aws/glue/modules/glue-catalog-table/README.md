---
title: glue-catalog-table
sidebar_label: glue-catalog-table
sidebar_class_name: command
description: glue-catalog-table
custom_edit_url: https://github.com/cloudposse/terraform-aws-glue/blob/main/modules/glue-catalog-table/README.md
---

# glue-catalog-table

Terraform module to provision AWS Glue Catalog Tables.

## Usage

```hcl
module "s3_bucket_source" {
  source  = "cloudposse/s3-bucket/aws"
  version = "2.0.3"

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

module "glue_catalog_database" {
  source = "cloudposse/glue/aws//modules/glue-catalog-database"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"

  catalog_database_name        = "analytics"
  catalog_database_description = "Glue Catalog database using data located in an S3 bucket"
  location_uri                 = format("s3://%s", module.s3_bucket_source.bucket_id)

  context = module.this.context
}

module "glue_catalog_table" {
  source = "cloudposse/glue/aws//modules/glue-catalog-table"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"

  catalog_table_name        = "geo"
  catalog_table_description = "region/state/county Glue Catalog table"
  database_name             = module.glue_catalog_database.name

  parameters = {
    "lakeformation.aso.status" = true
    "classification"           = "parquet"
  }

  storage_descriptor = {
    # List of reducer grouping columns, clustering columns, and bucketing columns in the table
    bucket_columns = null
    # Configuration block for columns in the table
    columns = [
      {
        name = "county",
        type = "string"
      },
      {
        name = "state",
        type = "string"
      },
      {
        name = "region",
        type = "string"
      }
    ]
    # Whether the data in the table is compressed
    compressed = false
    # Input format: SequenceFileInputFormat (binary), or TextInputFormat, or a custom format
    input_format = "org.apache.hadoop.hive.ql.io.parquet.MapredParquetInputFormat"
    # Physical location of the table. By default this takes the form of the warehouse location, followed by the database location in the warehouse, followed by the table name
    location = format("s3://%s/geo",  module.s3_bucket_source.bucket_id)
    #  Must be specified if the table contains any dimension columns
    number_of_buckets = 0
    # Output format: SequenceFileOutputFormat (binary), or IgnoreKeyTextOutputFormat, or a custom format
    output_format = "org.apache.hadoop.hive.ql.io.parquet.MapredParquetOutputFormat"
    # Configuration block for serialization and deserialization ("SerDe") information
    ser_de_info = {
      # Map of initialization parameters for the SerDe, in key-value form
      parameters = {
        "serialization.format" = "1"
      }
      # Usually the class that implements the SerDe. An example is org.apache.hadoop.hive.serde2.columnar.ColumnarSerDe
      serialization_library = "org.apache.hadoop.hive.ql.io.parquet.serde.ParquetHiveSerDe"
    }
    # Whether the table data is stored in subdirectories
    stored_as_sub_directories = false
  }

  context = module.this.context
}
```

