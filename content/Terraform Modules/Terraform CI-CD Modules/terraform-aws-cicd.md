---
title: "terraform-aws-cicd"
excerpt: "Terraform module to create AWS [CodePipeline](https://aws.amazon.com/codepipeline/) with [CodeBuild](https://aws.amazon.com/codebuild/) for [CI/CD](https://en.wikipedia.org/wiki/CI/CD)"
---
# Terraform AWS CI/CD
[block:parameters]
{
  "data": {
    "0-0": "GitHub Repo",
    "1-0": "Terraform Module",
    "2-0": "Release",
    "3-0": "Build Status",
    "0-1": "https://github.com/cloudposse/terraform-aws-cicd",
    "1-1": "terraform-aws-cicd",
    "2-1": "[![Release](https://img.shields.io/github/release/cloudposse/terraform-aws-cicd.svg)](https://github.com/cloudposse/terraform-aws-cicd/releases)",
    "3-1": "[![Build Status](https://travis-ci.org/cloudposse/terraform-aws-cicd.svg?branch=master)](https://travis-ci.org/cloudposse/terraform-aws-cicd)"
  },
  "cols": 2,
  "rows": 4
}
[/block]

# Use-cases

This module supports three specific use-cases.

## GitHub → S3 (build artifact) → Elastic Beanstalk (running application stack)

The module gets the code from a GitHub repository (public or private), builds it by executing the `buildspec.yml` file from the repository pushes the built artifact to an S3 bucket,
and deploys the artifact to Elastic Beanstalk running one of the supported stacks (_e.g._ Java, Go, Node, IIS, Python, Ruby, etc.).
[block:callout]
{
  "type": "info",
  "title": "References",
  "body": "- http://docs.aws.amazon.com/codebuild/latest/userguide/sample-maven-5m.html\n- http://docs.aws.amazon.com/codebuild/latest/userguide/sample-nodejs-hw.html\n- http://docs.aws.amazon.com/codebuild/latest/userguide/sample-go-hw.html"
}
[/block]

## GitHub → ECR (Docker image) → Elastic Beanstalk (running Docker stack)

The module gets the code from a `GitHub` repository, builds a Docker image from it by executing the `buildspec.yml` and `Dockerfile` files from the repository,
pushes the Docker image to an ECR repository, and deploys the Docker image to Elastic Beanstalk running Docker stack.
[block:callout]
{
  "type": "info",
  "title": "References",
  "body": "- http://docs.aws.amazon.com/codebuild/latest/userguide/sample-docker.html"
}
[/block]
## GitHub → ECR (Docker image)

The module gets the code from a GitHub repository, builds a Docker image from it by executing the `buildspec.yml` and `Dockerfile` files from the repository,
and pushes the Docker image to an ECR repository. This is used when we want to build a Docker image from the code and push it to ECR without deploying to Elastic Beanstalk.

To activate this mode, don't specify the `app` and `env` attributes for the module.
[block:callout]
{
  "type": "info",
  "body": "- http://docs.aws.amazon.com/codebuild/latest/userguide/sample-docker.html",
  "title": "References"
}
[/block]
# Usage

Include this repository as a module in your existing terraform code.
[block:code]
{
  "codes": [
    {
      "code": "module \"build\" {\n    source              = \"git::https://github.com/cloudposse/terraform-aws-cicd.git?ref=master\"\n    namespace           = \"global\"\n    name                = \"app\"\n    stage               = \"staging\"\n\n    # Enable the pipeline creation\n    enabled             = \"true\"\n\n    # Elastic Beanstalk\n    app                 = \"<(Optional) Elastic Beanstalk application name>\"\n    env                 = \"<(Optional) Elastic Beanstalk environment name>\"\n\n    # Application repository on GitHub\n    github_oauth_token  = \"(Optional) <GitHub Oauth Token with permissions to access private repositories>\"\n    repo_owner          = \"<GitHub Organization or Person name>\"\n    repo_name           = \"<GitHub repository name of the application to be built and deployed to Elastic Beanstalk>\"\n    branch              = \"<Branch of the GitHub repository>\"\n\n    # http://docs.aws.amazon.com/codebuild/latest/userguide/build-env-ref.html\n    # http://docs.aws.amazon.com/codebuild/latest/userguide/build-spec-ref.html\n    build_image         = \"aws/codebuild/docker:1.12.1\"\n    build_compute_type  = \"BUILD_GENERAL1_SMALL\"\n\n    # These attributes are optional, used as ENV variables when building Docker images and pushing them to ECR\n    # For more info:\n    # http://docs.aws.amazon.com/codebuild/latest/userguide/sample-docker.html\n    # https://www.terraform.io/docs/providers/aws/r/codebuild_project.html\n    privileged_mode     = \"true\"\n    aws_region          = \"us-east-1\"\n    aws_account_id      = \"xxxxxxxxxx\"\n    image_repo_name     = \"ecr-repo-name\"\n    image_tag           = \"latest\"\n}",
      "language": "json",
      "name": "HCL"
    }
  ]
}
[/block]
# Example: GitHub, NodeJS, S3 and EB

This is an example to build a Node app, store the build artifact to an S3 bucket, and then deploy it to Elastic Beanstalk running ``Node`` stack
[block:code]
{
  "codes": [
    {
      "code": "version: 0.2\n\nphases:\n  install:\n    commands:\n      - echo Starting installation ...\n  pre_build:\n    commands:\n      - echo Installing NPM dependencies...\n      - npm install\n  build:\n    commands:\n      - echo Build started on `date`\n  post_build:\n    commands:\n      - echo Build completed on `date`\nartifacts:\n  files:\n    - node_modules/**/*\n    - public/**/*\n    - routes/**/*\n    - views/**/*\n    - app.js",
      "language": "yaml",
      "name": "buildspec.yml"
    }
  ]
}
[/block]

# Example: GitHub, NodeJS, Docker, ECR, and EB

This is an example to build a ``Docker`` image for a Node app, push the ``Docker`` image to an ECR repository, and then deploy it to Elastic Beanstalk running ``Docker`` stack


`buildspec.yml` file

[block:code]
{
  "codes": [
    {
      "code": "version: 0.2\n\nphases:\n  pre_build:\n    commands:\n      - echo Logging in to Amazon ECR...\n      - $(aws ecr get-login - -region $AWS_REGION)\n  build:\n    commands:\n      - echo Build started on `date`\n      - echo Building the Docker image...\n      - docker build -t $IMAGE_REPO_NAME .\n      - docker tag $IMAGE_REPO_NAME:$IMAGE_TAG $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$IMAGE_REPO_NAME:$IMAGE_TAG\n  post_build:\n    commands:\n      - echo Build completed on `date`\n      - echo Pushing the Docker image to ECR...\n      - docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$IMAGE_REPO_NAME:$IMAGE_TAG\nartifacts:\n  files:\n    - '**/*'",
      "language": "text",
      "name": "buildspec.yml"
    }
  ]
}
[/block]

[block:code]
{
  "codes": [
    {
      "code": "FROM node:latest\n\nWORKDIR /usr/src/app\n\nCOPY package.json package-lock.json ./\nRUN npm install\nCOPY . .\n\nEXPOSE 8081\nCMD [ \"npm\", \"start\" ]\n",
      "language": "text",
      "name": "Dockerfile"
    }
  ]
}
[/block]
# Variables
[block:parameters]
{
  "data": {
    "h-0": "Name",
    "h-1": "Default",
    "h-2": "Description",
    "0-0": "app",
    "1-0": "attributes",
    "2-0": "aws_account_id",
    "3-0": "aws_region",
    "4-0": "branch",
    "5-0": "build_compute_type",
    "6-0": "build_image",
    "7-0": "buildspec",
    "8-0": "delimiter",
    "9-0": "enabled",
    "10-0": "env",
    "11-0": "github_oauth_token",
    "12-0": "image_repo_name",
    "13-0": "image_tag",
    "14-0": "name",
    "15-0": "namespace",
    "16-0": "poll_source_changes",
    "17-0": "privileged_mode",
    "18-0": "repo_name",
    "19-0": "repo_owner",
    "20-0": "stage",
    "21-0": "tags",
    "21-1": "{}",
    "20-1": "\"default\"",
    "19-1": "REQUIRED",
    "18-1": "REQUIRED",
    "17-1": "\"false\"",
    "16-1": "\"true\"",
    "15-1": "\"global\"",
    "14-1": "\"app\"",
    "13-1": "\"latest\"",
    "12-1": "\"UNSET\"",
    "11-1": "REQUIRED",
    "10-1": "\"\"",
    "9-1": "\"true\"",
    "8-1": "\"-\"",
    "7-1": "\"\"",
    "6-1": "\"aws/codebuild/docker:1.12.1\"",
    "5-1": "\"BUILD_GENERAL1_SMALL\"",
    "4-1": "REQUIRED",
    "3-1": "\"\"",
    "2-1": "\"\"",
    "1-1": "[]",
    "0-1": "\"\"",
    "0-2": "Elastic Beanstalk application name. If not provided or set to empty string, the Deploy stage of the pipeline will not be created",
    "1-2": "Additional attributes (e.g. policy or role)",
    "2-2": "AWS Account ID. Used as CodeBuild ENV variable when building Docker images. \n[For more info](http://docs.aws.amazon.com/codebuild/latest/userguide/sample-docker.html)|",
    "3-2": "AWS Region, e.g. us-east-1. Used as CodeBuild ENV variable when building Docker images. [For more info](http://docs.aws.amazon.com/codebuild/latest/userguide/sample-docker.html)|",
    "4-2": "Branch of the GitHub repository, e.g. master",
    "5-2": "CodeBuild instance size. Possible values are: BUILD_GENERAL1_SMALL BUILD_GENERAL1_MEDIUM BUILD_GENERAL1_LARGE",
    "6-2": "Docker image for build environment, e.g. aws/codebuild/docker:1.12.1 or aws/codebuild/eb-nodejs-6.10.0-amazonlinux-64:4.0.0",
    "7-2": "Declaration to use for building the project. [For more info](http://docs.aws.amazon.com/codebuild/latest/userguide/build-spec-ref.html)",
    "8-2": "Delimiter to be used between name, namespace, stage, etc.",
    "9-2": "Enable CodePipeline creation",
    "10-2": "Elastic Beanstalk environment name. If not provided or set to empty string, the Deploy stage of the pipeline will not be created",
    "11-2": "GitHub Oauth Token with permissions to access private repositories",
    "12-2": "ECR repository name to store the Docker image built by this module. Used as CodeBuild ENV variable when building Docker images. [For more info](http://docs.aws.amazon.com/codebuild/latest/userguide/sample-docker.html)",
    "13-2": "Docker image tag in the ECR repository, e.g. 'latest'. Used as CodeBuild ENV variable when building Docker images. [For more info](http://docs.aws.amazon.com/codebuild/latest/userguide/sample-docker.html)",
    "14-2": "Solution name, e.g. 'app' or 'jenkins'",
    "15-2": "Namespace, which could be your organization name, e.g. 'cp' or 'cloudposse'",
    "16-2": "Periodically check the location of your source content and run the pipeline if changes are detected",
    "17-2": "If set to true, enables running the Docker daemon inside a Docker container on the CodeBuild instance. Used when building Docker images",
    "18-2": "GitHub repository name of the application to be built (and deployed to Elastic Beanstalk if configured)",
    "19-2": "GitHub Organization or Person name",
    "20-2": "Stage, e.g. 'prod', 'staging', 'dev', or 'test'",
    "21-2": "Additional tags (e.g. map('BusinessUnit', 'XYZ')"
  },
  "cols": 3,
  "rows": 22
}
[/block]