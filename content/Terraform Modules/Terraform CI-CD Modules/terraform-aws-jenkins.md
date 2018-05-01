---
title: "terraform-aws-jenkins"
excerpt: "This is an enterprise-ready, scalable and fault-tolerant architecture and the CI/CD pattern to build and deploy Jenkins."
---
# Terraform AWS Jenkins
[block:parameters]
{
  "data": {
    "0-0": "GitHub Repo",
    "1-0": "Terraform Module",
    "2-0": "Release",
    "3-0": "Build Status",
    "0-1": "https://github.com/cloudposse/terraform-aws-jenkins",
    "1-1": "terraform-aws-jenkins",
    "2-1": "[![Release](https://img.shields.io/github/release/cloudposse/terraform-aws-jenkins.svg)](https://github.com/cloudposse/terraform-aws-jenkins/releases)",
    "3-1": "[![Build Status](https://travis-ci.org/cloudposse/terraform-aws-jenkins.svg)](https://travis-ci.org/cloudposse/terraform-aws-jenkins)"
  },
  "cols": 2,
  "rows": 4
}
[/block]
`terraform-aws-jenkins` is a Terraform module to build a Docker image with [Jenkins](https://jenkins.io/), save it to an [ECR](https://aws.amazon.com/ecr/) repo, and deploy to [Elastic Beanstalk](https://aws.amazon.com/elasticbeanstalk/) running [Docker](https://www.docker.com/).

![jenkins build server architecture](https://user-images.githubusercontent.com/52489/30888694-d07d68c8-a2d6-11e7-90b2-d8275ef94f39.png)

The module uses these open-source Cloud Posse modules:

* https://github.com/cloudposse/terraform-aws-elastic-beanstalk-application
* https://github.com/cloudposse/terraform-aws-elastic-beanstalk-environment
* https://github.com/cloudposse/terraform-aws-ecr
* https://github.com/cloudposse/terraform-aws-efs
* https://github.com/cloudposse/terraform-aws-efs-backup
* https://github.com/cloudposse/terraform-aws-cicd
* https://github.com/cloudposse/terraform-aws-codebuild


# Features

The module will create the following AWS resources:

   * Elastic Beanstalk Application
   * Elastic Beanstalk Environment with Docker stack to run the Jenkins master
   * ECR repository to store the Jenkins Docker image
   * EFS filesystem to store Jenkins config and jobs (it will be mounted to a directory on the EC2 host, and then to the Docker container)
   * CodePipeline with CodeBuild to build and deploy Jenkins so even Jenkins itself follows the CI/CD pattern
   * CloudFormation stack to run a DataPipeline to automatically backup the EFS to S3
   * CloudFormation stack for SNS notifications about the status of each backup


After all of the AWS resources are created,

## CodePipeline

CodePipeline will:

  * Get the specified Jenkins repo from GitHub, _e.g._ https://github.com/cloudposse/jenkins
  * Build a Docker image from it
  * Save the Docker image to the ECR repo
  * Deploy the Docker image from the ECR repo to Elastic Beanstalk running Docker stack
  * Monitor the GitHub repo for changes and re-run the steps above if new commits are pushed


## DataPipeline

DataPipeline will run on the specified schedule and will backup all Jenkins files to an S3 bucket by doing the following:

  * Spawn an EC2 instance
  * Mount the EFS filesystem to a directory on the EC2 instance
  * Backup the directory to an S3 bucket
  * Notify about the status of the backup (Success or Failure) via email
  * Destroy the EC2 instance

# Usage

For complete examples, see [examples](https://github.com/cloudposse/terraform-aws-jenkins/tree/master/examples).

## Deploy Jenkins into an existing VPC with existing subnets
[block:code]
{
  "codes": [
    {
      "code": "variable \"max_availability_zones\" {\n  default = \"2\"\n}\n\ndata \"aws_availability_zones\" \"available\" {}\n\nmodule \"jenkins\" {\n  source      = \"git::https://github.com/cloudposse/terraform-aws-jenkins.git?ref=master\"\n  namespace   = \"cp\"\n  name        = \"jenkins\"\n  stage       = \"prod\"\n  description = \"Jenkins server as Docker container running on Elastic Beanstalk\"\n\n  master_instance_type         = \"t2.medium\"\n  aws_account_id               = \"000111222333\"\n  aws_region                   = \"us-west-2\"\n  availability_zones           = [\"${slice(data.aws_availability_zones.available.names, 0, var.max_availability_zones)}\"]\n  vpc_id                       = \"vpc-a22222ee\"\n  zone_id                      = \"ZXXXXXXXXXXX\"\n  public_subnets               = [\"subnet-e63f82cb\", \"subnet-e66f44ab\", \"subnet-e88f42bd\"]\n  private_subnets              = [\"subnet-e99d23eb\", \"subnet-e77e12bb\", \"subnet-e58a52bc\"]\n  loadbalancer_certificate_arn = \"XXXXXXXXXXXXXXXXX\"\n  ssh_key_pair                 = \"ssh-key-jenkins\"\n\n  github_oauth_token  = \"\"\n  github_organization = \"cloudposse\"\n  github_repo_name    = \"jenkins\"\n  github_branch       = \"master\"\n\n  datapipeline_config = {\n    instance_type = \"t2.medium\"\n    email         = \"me@mycompany.com\"\n    period        = \"12 hours\"\n    timeout       = \"60 Minutes\"\n  }\n\n  env_vars = {\n    JENKINS_USER          = \"admin\"\n    JENKINS_PASS          = \"123456\"\n    JENKINS_NUM_EXECUTORS = 4\n  }\n\n  tags = {\n    BusinessUnit = \"ABC\"\n    Department   = \"XYZ\"\n  }\n}",
      "language": "json",
      "name": "HCL"
    }
  ]
}
[/block]
## Deploy Jenkins into an existing VPC and new subnets
[block:code]
{
  "codes": [
    {
      "code": "variable \"max_availability_zones\" {\n  default = \"2\"\n}\n\ndata \"aws_availability_zones\" \"available\" {}\n\nmodule \"jenkins\" {\n  source      = \"git::https://github.com/cloudposse/terraform-aws-jenkins.git?ref=master\"\n  namespace   = \"cp\"\n  name        = \"jenkins\"\n  stage       = \"prod\"\n  description = \"Jenkins server as Docker container running on Elastic Beanstalk\"\n\n  master_instance_type         = \"t2.medium\"\n  aws_account_id               = \"000111222333\"\n  aws_region                   = \"us-west-2\"\n  availability_zones           = [\"${slice(data.aws_availability_zones.available.names, 0, var.max_availability_zones)}\"]\n  vpc_id                       = \"vpc-a22222ee\"\n  zone_id                      = \"ZXXXXXXXXXXX\"\n  public_subnets               = \"${module.subnets.public_subnet_ids}\"\n  private_subnets              = \"${module.subnets.private_subnet_ids}\"\n  loadbalancer_certificate_arn = \"XXXXXXXXXXXXXXXXX\"\n  ssh_key_pair                 = \"ssh-key-jenkins\"\n\n  github_oauth_token  = \"\"\n  github_organization = \"cloudposse\"\n  github_repo_name    = \"jenkins\"\n  github_branch       = \"master\"\n\n  datapipeline_config = {\n    instance_type = \"t2.medium\"\n    email         = \"me@mycompany.com\"\n    period        = \"12 hours\"\n    timeout       = \"60 Minutes\"\n  }\n\n  env_vars = {\n    JENKINS_USER          = \"admin\"\n    JENKINS_PASS          = \"123456\"\n    JENKINS_NUM_EXECUTORS = 4\n  }\n\n  tags = {\n    BusinessUnit = \"ABC\"\n    Department   = \"XYZ\"\n  }\n}\n\nmodule \"subnets\" {\n  source              = \"git::https://github.com/cloudposse/terraform-aws-dynamic-subnets.git?ref=master\"\n  availability_zones  = [\"${slice(data.aws_availability_zones.available.names, 0, var.max_availability_zones)}\"]\n  namespace           = \"cp\"\n  name                = \"jenkins\"\n  stage               = \"prod\"\n  region              = \"us-west-2\"\n  vpc_id              = \"vpc-a22222ee\"\n  igw_id              = \"igw-s32321vd\"\n  cidr_block          = \"10.0.0.0/16\"\n  nat_gateway_enabled = \"true\"\n\n  tags = {\n    BusinessUnit = \"ABC\"\n    Department   = \"XYZ\"\n  }\n}",
      "language": "json",
      "name": "HCL"
    }
  ]
}
[/block]
## Deploy Jenkins into a new VPC and new subnets
[block:code]
{
  "codes": [
    {
      "code": "variable \"max_availability_zones\" {\n  default = \"2\"\n}\n\ndata \"aws_availability_zones\" \"available\" {}\n\nmodule \"jenkins\" {\n  source      = \"git::https://github.com/cloudposse/terraform-aws-jenkins.git?ref=master\"\n  namespace   = \"cp\"\n  name        = \"jenkins\"\n  stage       = \"prod\"\n  description = \"Jenkins server as Docker container running on Elastic Beanstalk\"\n\n  master_instance_type         = \"t2.medium\"\n  aws_account_id               = \"000111222333\"\n  aws_region                   = \"us-west-2\"\n  availability_zones           = [\"${slice(data.aws_availability_zones.available.names, 0, var.max_availability_zones)}\"]\n  vpc_id                       = \"${module.vpc.vpc_id}\"\n  zone_id                      = \"ZXXXXXXXXXXX\"\n  public_subnets               = \"${module.subnets.public_subnet_ids}\"\n  private_subnets              = \"${module.subnets.private_subnet_ids}\"\n  loadbalancer_certificate_arn = \"XXXXXXXXXXXXXXXXX\"\n  ssh_key_pair                 = \"ssh-key-jenkins\"\n\n  github_oauth_token  = \"\"\n  github_organization = \"cloudposse\"\n  github_repo_name    = \"jenkins\"\n  github_branch       = \"master\"\n\n  datapipeline_config = {\n    instance_type = \"t2.medium\"\n    email         = \"me@mycompany.com\"\n    period        = \"12 hours\"\n    timeout       = \"60 Minutes\"\n  }\n\n  env_vars = {\n    JENKINS_USER          = \"admin\"\n    JENKINS_PASS          = \"123456\"\n    JENKINS_NUM_EXECUTORS = 4\n  }\n\n  tags = {\n    BusinessUnit = \"ABC\"\n    Department   = \"XYZ\"\n  }\n}\n\nmodule \"vpc\" {\n  source                           = \"git::https://github.com/cloudposse/terraform-aws-vpc.git?ref=master\"\n  namespace                        = \"cp\"\n  name                             = \"jenkins\"\n  stage                            = \"prod\"\n  cidr_block                       = \"10.0.0.0/16\"\n  assign_generated_ipv6_cidr_block = \"true\"\n\n  tags = {\n    BusinessUnit = \"ABC\"\n    Department   = \"XYZ\"\n  }\n}\n\nmodule \"subnets\" {\n  source              = \"git::https://github.com/cloudposse/terraform-aws-dynamic-subnets.git?ref=master\"\n  availability_zones  = [\"${slice(data.aws_availability_zones.available.names, 0, var.max_availability_zones)}\"]\n  namespace           = \"cp\"\n  name                = \"jenkins\"\n  stage               = \"prod\"\n  region              = \"us-west-2\"\n  vpc_id              = \"${module.vpc.vpc_id}\"\n  igw_id              = \"${module.vpc.igw_id}\"\n  cidr_block          = \"${module.vpc.vpc_cidr_block}\"\n  nat_gateway_enabled = \"true\"\n\n  tags = {\n    BusinessUnit = \"ABC\"\n    Department   = \"XYZ\"\n  }\n}",
      "language": "json",
      "name": "HCL"
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
    "h-3": "Required",
    "0-0": "namespace",
    "1-0": "stage",
    "2-0": "name",
    "3-0": "description",
    "4-0": "aws_region",
    "5-0": "solution_stack_name",
    "6-0": "master_instance_type",
    "7-0": "vpc_id",
    "8-0": "availability_zones",
    "9-0": "healthcheck_url",
    "10-0": "loadbalancer_type",
    "11-0": "loadbalancer_certificate_arn",
    "12-0": "public_subnets",
    "13-0": "private_subnets",
    "14-0": "zone_id",
    "15-0": "security_groups",
    "16-0": "ssh_key_pair",
    "17-0": "github_oauth_token",
    "18-0": "github_organization",
    "19-0": "github_repo_name",
    "20-0": "github_branch",
    "21-0": "build_image",
    "22-0": "build_compute_type",
    "23-0": "aws_account_id",
    "24-0": "image_tag",
    "25-0": "env_default_key",
    "26-0": "env_default_value",
    "27-0": "env_vars",
    "28-0": "noncurrent_version_expiration_days",
    "29-0": "datapipeline_config",
    "30-0": "attributes",
    "31-0": "tags",
    "32-0": "delimiter",
    "0-3": "Yes",
    "1-3": "Yes",
    "2-3": "Yes",
    "3-3": "Yes",
    "4-3": "Yes",
    "5-3": "Yes",
    "6-3": "Yes",
    "7-3": "Yes",
    "8-3": "Yes",
    "9-3": "Yes",
    "10-3": "Yes",
    "11-3": "Yes",
    "12-3": "Yes",
    "13-3": "Yes",
    "14-3": "Yes",
    "15-3": "No",
    "16-3": "No",
    "17-3": "No",
    "18-3": "Yes",
    "19-3": "Yes",
    "20-3": "Yes",
    "21-3": "Yes",
    "22-3": "Yes",
    "23-3": "Yes",
    "24-3": "Yes",
    "25-3": "No",
    "26-3": "No",
    "27-3": "No",
    "28-3": "No",
    "29-3": "Yes",
    "30-3": "No",
    "31-3": "No",
    "32-3": "No",
    "0-2": "Namespace (_e.g._ `cp` or `cloudposse`)",
    "1-2": "Stage (_e.g._ `prod`, `dev`, `staging`)",
    "2-2": "Name of the application",
    "2-1": "jenkins",
    "3-2": "Used as Elastic Beanstalk application description",
    "4-1": "us-west-2",
    "5-1": "64bit Amazon Linux 2017.09 v2.8.4 running Docker 17.09.1-ce",
    "4-2": "AWS Region to provision all the AWS resources in",
    "5-2": "Elastic Beanstalk stack",
    "6-1": "t2.medium",
    "9-1": "/login",
    "10-1": "application",
    "15-1": "[]",
    "15-2": "List of security groups to be allowed to connect to the EC2 instances",
    "14-2": "Route53 parent zone ID. The module will create sub-domain DNS records in the parent zone for the EB environment and EFS",
    "13-2": "List of private subnets to place EC2 instances and EFS",
    "12-2": "List of public subnets to place Elastic Load Balancer",
    "11-2": "Load Balancer SSL certificate ARN. The certificate must be present in AWS Certificate Manager",
    "10-2": "Load Balancer type, e.g. `application` or `classic`",
    "9-2": "Application Health Check URL. Elastic Beanstalk will call this URL to check the health of the application running on EC2 instances",
    "8-2": "List of Availability Zones for EFS",
    "7-2": "AWS VPC ID where module should operate (_e.g._ `vpc-a22222ee`)",
    "6-2": "EC2 instance type for Jenkins master",
    "16-1": "\"\"",
    "17-1": "\"\"",
    "16-2": "Name of SSH key that will be deployed on Elastic Beanstalk and DataPipeline instances. The key should be present in AWS",
    "17-2": "GitHub Oauth Token for accessing private repositories. Leave it empty when deploying a public Jenkins repository",
    "18-2": "GitHub organization, _e.g._ `cloudposse`. By default, this module will deploy https://github.com/cloudposse/jenkins repository",
    "19-2": "GitHub repository name, _e.g._ `jenkins`. By default, this module will deploy https://github.com/cloudposse/jenkins repository",
    "20-2": "GitHub repository branch, _e.g._ `master`. By default, this module will deploy https://github.com/cloudposse/jenkins master branch",
    "21-2": "CodeBuild build image",
    "22-2": "CodeBuild compute type (instance type)",
    "22-1": "BUILD_GENERAL1_SMALL",
    "21-1": "aws/codebuild/docker:1.12.1",
    "20-1": "master",
    "19-1": "jenkins",
    "18-1": "cloudposse",
    "23-2": "AWS Account ID. Used as CodeBuild ENV variable $AWS_ACCOUNT_ID when building Docker images",
    "24-2": "Docker image tag in the ECR repository, _e.g._ `latest`. Used as CodeBuild ENV variable $IMAGE_TAG when building Docker images",
    "24-1": "latest",
    "25-2": "Default ENV variable key for Elastic Beanstalk `aws:elasticbeanstalk:application:environment` setting",
    "26-2": "Default ENV variable value for Elastic Beanstalk `aws:elasticbeanstalk:application:environment` setting",
    "27-2": "Map of custom ENV variables to be provided to the Jenkins application running on Elastic Beanstalk",
    "27-1": "{}",
    "26-1": "UNSET",
    "25-1": "DEFAULT_ENV_%d",
    "28-1": "35",
    "28-2": "S3 object versions expiration period (days) for backups",
    "29-1": "${map(\"instance_type\", \"t2.micro\", \"email\", \"\", \"period\", \"24 hours\", \"timeout\", \"60 Minutes\")}\"",
    "30-1": "[]",
    "31-1": "{}",
    "31-2": "Additional tags (_e.g._ `map(\"BusinessUnit\",\"ABC\")",
    "30-2": "Additional attributes (_e.g._ `vpc`)",
    "29-2": "DataPipeline configuration options",
    "32-2": "Delimiter to be used between `name`, `namespace`, `stage` and `attributes`",
    "32-1": "-"
  },
  "cols": 4,
  "rows": 33
}
[/block]
# DataPipeline Config Variables
[block:parameters]
{
  "data": {
    "h-0": "Name",
    "h-1": "Default",
    "h-2": "Description",
    "h-3": "Required",
    "0-0": "instance_type",
    "1-0": "email",
    "2-0": "period",
    "3-0": "timeout",
    "3-1": "60 Minutes",
    "2-1": "24 hours",
    "1-1": "\"\"",
    "0-1": "t2.small",
    "0-2": "Instance type to use in DataPipeline",
    "1-2": "Email to use in SNS. Needs to be provided, otherwise, the module will fail",
    "2-2": "Frequency of pipeline execution (frequency of backups)",
    "3-2": "Pipeline execution timeout",
    "0-3": "Yes",
    "1-3": "Yes",
    "2-3": "Yes",
    "3-3": "Yes"
  },
  "cols": 4,
  "rows": 4
}
[/block]