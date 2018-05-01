---
title: "terraform-aws-codebuild"
excerpt: "Terraform module to create AWS CodeBuild project for AWS CodePipeline"
---
# Terraform AWS CodeBuild
[block:parameters]
{
  "data": {
    "0-0": "GitHub Repo",
    "1-0": "Terraform Module",
    "2-0": "Release",
    "3-0": "Build Status",
    "0-1": "https://github.com/cloudposse/terraform-aws-codebuild",
    "1-1": "terraform-aws-codebuild",
    "2-1": "[![Release](https://img.shields.io/github/release/cloudposse/terraform-aws-codebuild.svg)](https://github.com/cloudposse/terraform-aws-codebuild/releases)",
    "3-1": "[![Build Status](https://travis-ci.org/cloudposse/terraform-aws-codebuild.svg)](https://travis-ci.org/cloudposse/terraform-aws-codebuild)"
  },
  "cols": 2,
  "rows": 4
}
[/block]

# Usage

Include this repository as a module in your existing terraform code:
[block:code]
{
  "codes": [
    {
      "code": "module \"build\" {\n    source              = \"git::https://github.com/cloudposse/terraform-aws-codebuild.git?ref=master\"\n    namespace           = \"general\"\n    name                = \"ci\"\n    stage               = \"staging\"\n    \n    # http://docs.aws.amazon.com/codebuild/latest/userguide/build-env-ref.html\n    build_image         = \"aws/codebuild/docker:1.12.1\"\n    build_compute_type  = \"BUILD_GENERAL1_SMALL\"\n    \n    # These attributes are optional, used as ENV variables when building Docker images and pushing them to ECR\n    # For more info:\n    # http://docs.aws.amazon.com/codebuild/latest/userguide/sample-docker.html\n    # https://www.terraform.io/docs/providers/aws/r/codebuild_project.html\n    \n    privileged_mode     = \"true\"\n    aws_region          = \"us-east-1\"\n    aws_account_id      = \"xxxxxxxxxx\"\n    image_repo_name     = \"ecr-repo-name\"\n    image_tag           = \"latest\"\n}",
      "language": "json",
      "name": "HCL"
    }
  ]
}
[/block]
# Input
[block:parameters]
{
  "data": {
    "h-0": "Name",
    "h-1": "Default",
    "h-2": "Description",
    "0-0": "namespace",
    "0-1": "global",
    "0-2": "Namespace",
    "1-2": "Stage",
    "1-0": "stage",
    "2-0": "name",
    "2-2": "Name",
    "1-1": "default",
    "2-1": "codebuild",
    "3-0": "build_image",
    "3-1": "aws/codebuild/docker:1.12.1",
    "3-2": "Docker image for build environment, _e.g._ `aws/codebuild/docker:1.12.1` or `aws/codebuild/eb-nodejs-6.10.0-amazonlinux-64:4.0.0`",
    "4-0": "build_compute_type",
    "4-1": "BUILD_GENERAL1_SMALL",
    "4-2": "`CodeBuild` instance size.  Possible values are: ```BUILD_GENERAL1_SMALL``` ```BUILD_GENERAL1_MEDIUM``` ```BUILD_GENERAL1_LARGE```",
    "5-0": "buildspec",
    "5-1": "\"\"",
    "6-1": "\"\"",
    "7-1": "\"\"",
    "8-1": "\"\"",
    "6-0": "privileged_mode",
    "7-0": "aws_region",
    "8-0": "aws_account_id",
    "9-0": "image_repo_name",
    "10-0": "image_tag",
    "11-0": "github_token",
    "9-1": "\"UNSET\"",
    "10-1": "\"latest\"",
    "11-1": "\"\"",
    "11-2": "(Optional) GitHub auth token environment variable (`GITHUB_TOKEN`)",
    "10-2": "(Optional) Docker image tag in the ECR repository, _e.g._ `latest`. Used as `CodeBuild` ENV variable when building Docker images",
    "9-2": "(Optional) ECR repository name to store the Docker image built by this module. Used as `CodeBuild` ENV variable when building Docker images",
    "8-2": "(Optional) AWS Account ID. Used as `CodeBuild` ENV variable when building Docker images",
    "7-2": "(Optional) AWS Region, _e.g._ `us-east-1`. Used as `CodeBuild` ENV variable when building Docker images",
    "6-2": "(Optional) If set to true, enables running the Docker daemon inside a Docker container on the `CodeBuild` instance. Used when building Docker images",
    "5-2": "(Optional) `buildspec` declaration to use for building the project"
  },
  "cols": 3,
  "rows": 12
}
[/block]
# Output
[block:parameters]
{
  "data": {
    "h-0": "Name",
    "h-1": "Description",
    "0-0": "project_name",
    "1-0": "project_id",
    "2-0": "role_arn",
    "2-1": "IAM Role ARN",
    "1-1": "CodeBuild project ARN",
    "0-1": "CodeBuild project name"
  },
  "cols": 2,
  "rows": 3
}
[/block]