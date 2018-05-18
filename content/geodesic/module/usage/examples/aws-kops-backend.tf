terraform {
  required_version = ">= 0.11.2"
  backend "s3" {}
}

variable "aws_assume_role_arn" {}

variable "tfstate_namespace" {}

variable "tfstate_stage" {}

variable "tfstate_region" {}

variable "kops_cluster_name" {}

variable "parent_zone_name" {}

provider "aws" {
  assume_role {
    role_arn = "${var.aws_assume_role_arn}"
  }
}

module "kops_state_backend" {
  source           = "git::https://github.com/cloudposse/terraform-aws-kops-state-backend.git?ref=tags/0.1.3"
  namespace        = "${var.tfstate_namespace}"
  stage            = "${var.tfstate_stage}"
  name             = "kops-state"
  parent_zone_name = "${var.parent_zone_name}"
  zone_name        = "$${name}.$${parent_zone_name}"
  cluster_name     = "${var.tfstate_region}"
  region           = "${var.tfstate_region}"
}

module "ssh_key_pair" {
  source              = "git::https://github.com/cloudposse/terraform-aws-key-pair.git?ref=tags/0.2.3"
  namespace           = "${var.tfstate_namespace}"
  stage               = "${var.tfstate_stage}"
  name                = "kops-${var.tfstate_region}"
  ssh_public_key_path = "/secrets/tf/ssh"
  generate_ssh_key    = "true"
}

output "parent_zone_id" {
  value = "${module.kops_state_backend.parent_zone_id}"
}

output "parent_zone_name" {
  value = "${module.kops_state_backend.parent_zone_name}"
}

output "zone_id" {
  value = "${module.kops_state_backend.zone_id}"
}

output "zone_name" {
  value = "${module.kops_state_backend.zone_name}"
}

output "bucket_name" {
  value = "${module.kops_state_backend.bucket_name}"
}

output "bucket_region" {
  value = "${module.kops_state_backend.bucket_region}"
}

output "bucket_domain_name" {
  value = "${module.kops_state_backend.bucket_domain_name}"
}

output "bucket_id" {
  value = "${module.kops_state_backend.bucket_id}"
}

output "bucket_arn" {
  value = "${module.kops_state_backend.bucket_arn}"
}

output "ssh_key_name" {
  value = "${module.ssh_key_pair.key_name}"
}

output "ssh_public_key" {
  value = "${module.ssh_key_pair.public_key}"
}
