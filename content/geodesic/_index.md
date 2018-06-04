---
title: Geodesic
slug: geodesic
icon: "fa fa-cubes"
description: >-
  Geodesic is the fastest way to get up and running with a rock solid,
  production-grade cloud platform.
homepage: true
---

![Geodesic Logo](/assets/638d917-geodesic-small.png)

|              |                                                                                                                              |
|:-------------|:-----------------------------------------------------------------------------------------------------------------------------|
| GitHub Repo  | <https://github.com/cloudposse/geodesic>                                                                                     |
| Release      | [![Release](https://img.shields.io/github/release/cloudposse/geodesic.svg)](https://github.com/cloudposse/geodesic/releases) |
| Build Status | [![Build Status](https://travis-ci.org/cloudposse/geodesic.svg?branch=master)](https://travis-ci.org/cloudposse/geodesic)    |

# Introduction

Geodesic provides a fully customizable framework for defining and building world-class cloud infrastructures backed by [AWS](https://aws.amazon.com/) and powered by [kubernetes](https://kubernetes.io/). It couples best-of-breed technologies with engineering best-practices to equip organizations with the tooling that enables clusters to be spun up in record time without compromising security.

# Demo

{{% asciinema src="/assets/geodesic-demo.cast" autoplay="true" title="Geodesic Demo" %}}

Geodesic is composed of two parts:

1. **It is an interactive command-line shell**. The shell includes the _ultimate_ mashup of cloud orchestration tools. Those tools are then integrated to work in concert with each other using a consistent framework. Installation of the shell is as easy as running a docker container.
2. **It is a distribution of essential services.** The distribution includes a collection of Helm charts for CI/CD, VPN, SSH Bastion, Automatic DNS, Automatic TLS, Automatic Monitoring, Account Management, Log Collection, Load Balancing/Routing, Image Serving, and much more. What makes these charts even more valuable is that they were designed from the ground up to work well with each other and integrate with external services for authentication (SSO/OAuth2, MFA).

An organization may choose to leverage all of these components or just the parts that make their life easier.

# Features

- **Secure** - TLS/PKI, OAuth2, MFA Everywhere, remote access VPN, [ultra secure bastion/jumphost](https://github.com/cloudposse/bastion) with audit capabilities and slack notifications, [IAM assumed roles](https://github.com/99designs/aws-vault/), automatic key rotation, encryption at rest, and VPCs
- **Repeatable** - 100% Infrastructure-as-Code with change automation and support for scriptable admin tasks in any language, including Terraform
- **Extensible** - A framework where everything can be extended to work the way you want to
- **Comprehensive** - our [helm charts library](https://github.com/cloudposse/charts) are designed to tightly integrate your cloud-platform with GitHub Teams and Slack Notifications and CI/CD systems like TravisCI, CircleCI or Jenkins
- **OpenSource** - Permissive [APACHE 2.0](https://github.com/cloudposse/geodesic/blob/master/LICENSE) license means no lock-in and no on-going license fees

# Technologies

At its core, Geodesic is a framework for provisioning cloud infrastructure and the applications that sit on top of it. We leverage as many existing tools as possible to facilitate cloud fabrication and administration. We're like the connective tissue that sits between all of the components of a modern cloud.

| Tool                                                                 | Purpose                                                                                                                     |
|:---------------------------------------------------------------------|:----------------------------------------------------------------------------------------------------------------------------|
| [`goofys`](https://github.com/kahing/goofys/)                        | for mounting encrypted S3 buckets that store cluster configurations and secrets                                             |
| [`terraform`](https://github.com/hashicorp/terraform/)               | for provisioning miscellaneous resources on pretty much any cloud                                                           |
| [`aws-vault`](https://github.com/99designs/aws-vault)                | for securely storing and accessing AWS credentials in an encrypted vault for the purpose of assuming IAM roles              |
| [`aws-cli`](https://github.com/aws/aws-cli/)                         | for interacting directly with the AWS APIs (E.g. s3, ec2, rds)                                                              |
| [`chamber`](https://github.com/segmentio/chamber)                    | for managing secrets with AWS SSM+KMS                                                                                       |
| [`helm`](https://github.com/kubernetes/helm/)                        | for installing packages like Varnish or Apache on the Kubernetes cluster                                                    |
| [`kops`](https://github.com/kubernetes/kops/)                        | for Kubernetes cluster orchestration                                                                                        |
| [`kubectl`](https://kubernetes.io/docs/user-guide/kubectl-overview/) | for controlling kubernetes resources like deployments or load balancers                                                     |
| [`gomplate`](https://github.com/hairyhenderson/gomplate/)            | for template rendering configuration files using the GoLang template engine. Supports lots of local and remote data sources |

# Our Logo

In mathematics, a geodesic line is the shortest distance between two points on a sphere. It's also a solid structure composed of geometric shapes such as hexagons.

We like to think of geodesic as the shortest path to a rock-solid cloud infrastructure. The geodesic logo is a hexagon with a cube suspended at its center. The cube represents this geodesic container, which is central to everything and at the same time is what ties everything together.

But look a little closer and you'll notice there's much more to it. It's also an isometric shape of a cube with a missing piece. This represents its pluggable design, which lets anyone extend it to suit their vision.
