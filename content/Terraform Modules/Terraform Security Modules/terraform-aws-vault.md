---
title: "terraform-aws-vault"
excerpt: ""
---
# Terraform AWS Vault 
[block:parameters]
{
  "data": {
    "0-0": "GitHub Repo",
    "1-0": "Terraform Module",
    "2-0": "Release",
    "3-0": "Build Status",
    "0-1": "https://github.com/cloudposse/terraform-aws-vault",
    "1-1": "Vault AWS Module",
    "2-1": "[![Release](https://img.shields.io/github/release/cloudposse/terraform-aws-vault.svg)](https://github.com/cloudposse/terraform-aws-vault/releases)",
    "3-1": "[![Build Status](https://travis-ci.org/cloudposse/Vault AWS Module.svg?branch=master)](https://travis-ci.org/cloudposse/Vault AWS Module)"
  },
  "cols": 2,
  "rows": 4
}
[/block]
This repo contains a Module for how to deploy a [Vault](https://www.vaultproject.io/) cluster on 
[AWS](https://aws.amazon.com/) using [Terraform](https://www.terraform.io/). Vault is an open source tool for managing secrets. This Module uses [S3](https://aws.amazon.com/s3/) as a [storage 
backend](https://www.vaultproject.io/docs/configuration/storage/index.html) and a [Consul](https://www.consul.io) server cluster as a [high availability backend](https://www.vaultproject.io/docs/concepts/ha.html):

![Vault architecture](https://github.com/hashicorp/terraform-aws-vault/blob/master/_docs/architecture.png?raw=true)

This Module includes:

* [install-vault](https://github.com/hashicorp/terraform-aws-vault/tree/master/modules/install-vault): This module can be used to install Vault. It can be used in a 
  [Packer](https://www.packer.io/) template to create a Vault 
  [Amazon Machine Image (AMI)](http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AMIs.html).

* [run-vault](https://github.com/hashicorp/terraform-aws-vault/tree/master/modules/run-vault): This module can be used to configure and run Vault. It can be used in a 
  [User Data](http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/user-data.html#user-data-shell-scripts) 
  script to fire up Vault while the server is booting.

* [vault-cluster](https://github.com/hashicorp/terraform-aws-vault/tree/master/modules/vault-cluster): Terraform code to deploy a cluster of Vault servers using an [Auto Scaling 
  Group](https://aws.amazon.com/autoscaling/).
    
* [vault-elb](https://github.com/hashicorp/terraform-aws-vault/tree/master/modules/vault-elb): Configures an [Elastic Load Balancer 
  (ELB)](https://aws.amazon.com/elasticloadbalancing/classicloadbalancer/) in front of Vault if you need to access it
  from the public Internet.
   
* [private-tls-cert](https://github.com/hashicorp/terraform-aws-vault/tree/master/modules/private-tls-cert): Generate a private TLS certificate for use with a private Vault 
  cluster.
   
* [update-certificate-store](https://github.com/hashicorp/terraform-aws-vault/tree/master/modules/update-certificate-store): Add a trusted, CA public key to an OS's 
  certificate store. This allows you to establish TLS connections to services that use this TLS certs signed by this
  CA without getting x509 certificate errors.
    
# How do you use this Module?

Each Module has the following folder structure:

* [modules](https://github.com/hashicorp/terraform-aws-vault/tree/master/modules): This folder contains the reusable code for this Module, broken down into one or more modules.
* [examples](https://github.com/hashicorp/terraform-aws-vault/tree/master/examples): This folder contains examples of how to use the modules.
* [test](https://github.com/hashicorp/terraform-aws-vault/tree/master/test): Automated tests for the modules and examples.

Click on each of the modules above for more details.

To deploy Vault with this Module, you will need to deploy two separate clusters: one to run 
[Consul](https://www.consul.io/) servers (which Vault uses as a [high availability 
backend](https://www.vaultproject.io/docs/concepts/ha.html)) and one to run Vault servers. 

To deploy the Consul server cluster, use the [Consul AWS Module](https://github.com/hashicorp/terraform-aws-consul). 

To deploy the Vault cluster:

1. Create an AMI that has Vault installed (using the [install-vault module](https://github.com/hashicorp/terraform-aws-vault/tree/master/modules/install-vault)) and the Consul
   agent installed (using the [install-consul 
   module](https://github.com/hashicorp/terraform-aws-consul/tree/master/modules/install-consul)). Here is an 
   [example Packer template](https://github.com/hashicorp/terraform-aws-vault/tree/master/examples/vault-consul-ami). 
   
   If you are just experimenting with this Module, you may find it more convenient to use one of our official public AMIs:
   - [Latest Ubuntu 16 AMIs](https://github.com/hashicorp/terraform-aws-vault/tree/master/_docs/ubuntu16-ami-list.md).
   - [Latest Amazon Linux AMIs](https://github.com/hashicorp/terraform-aws-vault/tree/master/_docs/amazon-linux-ami-list.md).
   
   **WARNING! Do NOT use these AMIs in your production setup. In production, you should build your own AMIs in your 
     own AWS account.**

1. Deploy that AMI across an Auto Scaling Group in a private subnet using the Terraform [vault-cluster 
   module](https://github.com/hashicorp/terraform-aws-vault/tree/master/modules/vault-cluster). 

1. Execute the [run-consul script](https://github.com/hashicorp/terraform-aws-consul/tree/master/modules/run-consul)
   with the `--client` flag during boot on each Instance to have the Consul agent connect to the Consul server cluster. 

1. Execute the [run-vault](https://github.com/hashicorp/terraform-aws-vault/tree/master/modules/run-vault) script during boot on each Instance to create the Vault cluster. 

1. If you only need to access Vault from inside your AWS account (recommended), run the [install-dnsmasq 
   module](https://github.com/hashicorp/terraform-aws-consul/tree/master/modules/install-dnsmasq) on each server, and 
   that server will be able to reach Vault using the Consul Server cluster as the DNS resolver (e.g. using an address 
   like `vault.service.consul`). See the [vault-cluster-private example](https://github.com/hashicorp/terraform-aws-vault/tree/master/examples/vault-cluster-private) for working 
   sample code.

1. If you need to access Vault from the public Internet, deploy the [vault-elb module](https://github.com/hashicorp/terraform-aws-vault/tree/master/modules/vault-elb) in a public 
   subnet and have all requests to Vault go through the ELB. See the [vault-cluster-public 
   example](https://github.com/hashicorp/terraform-aws-vault/tree/master/examples/vault-cluster-public) for working sample code.

2. Head over to the [How do you use the Vault cluster?](https://github.com/hashicorp/terraform-aws-vault/tree/master/modules/vault-cluster#how-do-you-use-the-vault-cluster) guide
   to learn how to initialize, unseal, and use Vault.