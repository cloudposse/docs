terraform {
  required_version = ">= 0.11.2"
  backend "s3" {}
}

variable "aws_assume_role_arn" {}

variable "tfstate_namespace" {}

variable "tfstate_stage" {}

variable "tfstate_region" {}

provider "aws" {
  assume_role {
    role_arn = "${var.aws_assume_role_arn}"
  }
}

module "tfstate_backend" {
  source    = "git::https://github.com/cloudposse/terraform-aws-tfstate-backend.git?ref=tags/0.1.0"
  namespace = "${ var.tfstate_namespace }"
  stage     = "${ var.tfstate_stage }"
  region    = "${ var.tfstate_region }"
}

output "tfstate_backend_s3_bucket_domain_name" {
  value = "${module.tfstate_backend.s3_bucket_domain_name}"
}

output "tfstate_backend_s3_bucket_id" {
  value = "${module.tfstate_backend.s3_bucket_id}"
}

output "tfstate_backend_s3_bucket_arn" {
  value = "${module.tfstate_backend.s3_bucket_arn}"
}

output "tfstate_backend_dynamodb_table_name" {
  value = "${module.tfstate_backend.dynamodb_table_name}"
}

output "tfstate_backend_dynamodb_table_id" {
  value = "${module.tfstate_backend.dynamodb_table_id}"
}

output "tfstate_backend_dynamodb_table_arn" {
  value = "${module.tfstate_backend.dynamodb_table_arn}"
}
