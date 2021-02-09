---
title: Getting Started with Cloud Posse
description: >-
  This page will help you get started with Cloud Posse. You'll be up and running
  in a jiffy!
---

## Geodesic

Start with getting familiar with the [geodesic]({{< relref "reference/tools.md#geodesic" >}}).

Get intimately familiar with docker inheritance and [multi-stage docker builds]({{< relref "reference/best-practices/docker-best-practices.md#multi-stage-builds" >}}). We use this pattern extensively.

Check out our [terraform-aws-components](https://github.com/cloudposse/terraform-aws-components) for reference architectures to easily provision infrastructure

## Tools

Tons of tools/clis are used as part of our solution. We distribute these tools in a couple of different ways.

* Geodesic bundles most of these tools as part of the geodesic base image
* Our [packages repo]({{< relref "reference/tools.md#packages.md" >}}) provides an embeddable `Makefile` system for installing packages in other contexts (e.g. [`build-harness`]({{< relref "reference/tools.md#build-harness" >}})). This can also be used for local ("native") development contexts.

Here are some of the most important tools to be aware of:

- [`make`]({{< relref "reference/tools.md#make" >}})
- [`chamber`]({{< relref "reference/tools.md#chamber" >}})
- [`terraform`]({{< relref "reference/tools.md#terraform" >}})
- [`gomplate`]({{< relref "reference/tools.md#gomplate" >}})
- [`aws-vault`]({{< relref "reference/tools.md#aws-vault" >}})

If using kubernetes, then also review these tools:

- [`helm`]({{< relref "reference/tools.md#helm" >}})
- [`helmfile`]({{< relref "reference/tools.md#helmfile" >}})

## Kubernetes

Kubernetes is a massive part of our solutions. Our Kubernetes documentation is geared towards leveraging our [Terraform EKS modules](https://github.com/cloudposse?q=terraform-aws-eks) and [`helmfile`]({{< relref "reference/tools.md#helmfile" >}}).

### Helm

Helm is central to how we deploy all services on kubernetes.

* [helm]({{< relref "reference/tools.md#helm" >}}) is essentially the package manager for Kubernetes (like `npm` for Node, `gem` for Ruby, and `rpm` for RHEL)
* [helm charts](https://helm.sh/docs/topics/charts/) are how kubernetes resources are templatized using Go templates
* [helmfiles]({{< relref "reference/tools.md#helmfile">}}) are used to define a distribution of helm charts. So if you want to install prometheus, grafana, nginx-ingress, kube-lego, etc, we use a `helmfile.yaml` to define how that's done.

## Terraform

Study up on our [Best Practices]({{< relref "reference/best-practices/terraform-best-practices.md" >}}) for working with terraform. Get started quickly provisioning infrastructure by referencing our [terraform-aws-components](https://github.com/cloudposse/terraform-aws-components).

### Terraform Modules

[We provide a staggering number of Terraform modules in our GitHub](https://github.com/cloudposse?q=&type=&language=hcl). This number is growing every week and we're also [accepting module contributions]({{< relref "documentation/our-github.md#contributing" >}}).

Before writing your own modules, review our [Best Practices]({{< relref "reference/best-practices/terraform-best-practices.md" >}}) for working with Terraform modules.

## Contributing Back

Everything we provide on our [GitHub](https://github.com/cloudposse/) wouldn't have been possible if it weren't for our [phenomenal customers](https://cloudposse.com/) and the support of the [community](https://cloudposse.com/slack/) contributing bug-fixes, [filing issues](https://github.com/search?q=org%3Acloudposse+type%3Aissue) and submitting a steady stream of [Pull Requests](https://github.com/search?q=org%3Acloudposse+type%3Apr).

We welcome any Terraform module submissions, Helm charts, and generally any other useful tools that others could benefit from. Our only requirement is that they be licensed under `APACHE2`.

Drop us a line at [hello@cloudposse.com](mailto:hello@cloudposse.com) to get in touch with us about contributing.

## Getting Help

Check out our [FAQ](/faq/) which is also fully indexed by our Algolia search available on the [homepage](/).

Review our [glossary](/glossary/) if there are any terms that are confusing.

File issues anywhere you find the documentation lacking by going to our [docs repo](https://github.com/cloudposse/docs).

Join our [Slack Community](https://cloudposse.com/slack/) and speak directly with the maintainers

We provide "white glove" DevOps support. [Get in touch]({{< relref "documentation/contact-us.md" >}}) with us today!

[Schedule Time](https://calendly.com/cloudposse/) with us.
