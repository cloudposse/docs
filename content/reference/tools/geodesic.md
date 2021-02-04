---
title: Geodesic
slug: geodesic
icon: "fa fa-cubes"
description: >-
  Geodesic is a DevOps Linux Distro. We use it as a cloud automation shell. It's the fastest way to get up and running with a rock solid Open Source toolchain.
homepage: true
---

![Geodesic Logo](/assets/638d917-geodesic-small.png)

|              |                                                                                                                                   |
|:-------------|:----------------------------------------------------------------------------------------------------------------------------------|
| GitHub Repo  | <https://github.com/cloudposse/geodesic>                                                                                          |
| Release      | [![Release](https://img.shields.io/github/release/cloudposse/geodesic.svg)](https://github.com/cloudposse/geodesic/releases)      |
| Build Status | [![Build Status](https://github.com/cloudposse/geodesic/actions?query=workflow%3Adocker)](https://github.com/cloudposse/geodesic) |

## Introduction

Geodesic provides a fully customizable framework for defining and building world-class cloud infrastructures backed by [AWS](https://aws.amazon.com/) and powered by [kubernetes](https://kubernetes.io/). It couples best-of-breed technologies with engineering best-practices to equip organizations with the tooling that enables infrastructure to be spun up in record time without compromises.

## Demo

{{% asciinema src="/assets/geodesic-demo.cast" autoplay="true" title="Geodesic Demo" %}}

At its core, Geodesic is a DevOps toolkit Linux Distro distributed via Docker for provisioning cloud infrastructure and the applications that sit on top of it. We leverage as many existing tools as possible to facilitate cloud fabrication and administration. Geodesic is like the connective tissue that sits between all of the components of a modern cloud.

## Technologies

| Tool                                                                 | Purpose                                                                                                                     |
|:---------------------------------------------------------------------|:----------------------------------------------------------------------------------------------------------------------------|
| [`terraform`](https://github.com/hashicorp/terraform/)               | for provisioning miscellaneous resources on pretty much any cloud                                                           |
| [`aws-vault`](https://github.com/99designs/aws-vault)                | for securely storing and accessing AWS credentials in an encrypted vault for the purpose of assuming IAM roles              |
| [`aws-cli`](https://github.com/aws/aws-cli/)                         | for interacting directly with the AWS APIs (E.g. s3, ec2, rds)                                                              |
| [`helm`](https://github.com/kubernetes/helm/)                        | for installing packages like nginx-ingress or datadog agent on the Kubernetes cluster                                       |
| [`kubectl`](https://kubernetes.io/docs/user-guide/kubectl-overview/) | for controlling kubernetes resources like deployments, pods, configmaps, etc.                                               |
| [`gomplate`](https://github.com/hairyhenderson/gomplate/)            | for template rendering configuration files using the GoLang template engine. Supports lots of local and remote data sources |
| [`goofys`](https://github.com/kahing/goofys/)                        | for mounting encrypted S3 buckets that store cluster configurations and secrets                                             |
| [`chamber`](https://github.com/segmentio/chamber)                    | for managing secrets with AWS SSM+KMS                                                                                       |
| [`atmos`](https://github.com/cloudposse/atmos)                       | for orchestrating terraform or helmfile automation                                                                          |
| [`turf`](https://github.com/cloudposse/turf)                         | for orchestrating automation tasks that are difficult to automate via IaC                                                   |


## Our Logo

In mathematics, a geodesic line is the shortest distance between two points on a sphere. It's also a solid structure composed of geometric shapes such as hexagons.

We like to think of geodesic as the shortest path to a rock-solid cloud infrastructure. The geodesic logo is a hexagon with a cube suspended at its center. The cube represents this geodesic container, which is central to everything and at the same time is what ties everything together.

But look a little closer and you'll notice there's much more to it. It's also an isometric shape of a cube with a missing piece. This represents its pluggable design, which lets anyone extend it to suit their vision.
