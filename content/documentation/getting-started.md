---
title: Getting Started with Cloud Posse
description: >-
  This page will help you get started with Cloud Posse. You'll be up and running
  in a jiffy!
---

# Geodesic

1. Get familiar with the [geodesic design]({{< relref "geodesic/design.md" >}}).
2. Create [geodesic modules](/geodesic/module/) anywhere you want to logically organize infrastructure as code.
3. Get intimately familiar with docker inheritance and [multi-stage docker builds]. We use this pattern extensively.
3. Check out our [terraform-root-modules](https://github.com/cloudposse/terraform-root-modules) for reference architectures to easily provision infrastructure

# Local Development

1. Get your [local environment](/local-dev-environments/) setup
2. Make sure you're familiar with [`make`](/tools/make/) and [`Makefiles`]({{< relref "tools/make/makefile-examples.md" >}}) because we use them extensively for "executable documentation".
3. Review Docker compose
4. Docker composition monorepo strategy

# Kubernetes

Kubernetes is a massive part of our documentation. All of our documentation is geared towards leveraging `kops` by way of our `geodesic` strategy.

## Helm

Helm is central to how we deploy all services on kubernetes.

* [helm]({{< relref "tools/helm.md" >}}) is essentially the package manager for Kubernetes (like `npm` for Node, `gem` for Ruby, and `rpm` for RHEL)
* [helm charts](/helm-charts/) are how kubernetes resources are templatized using go templates
* [helm charts quickstart]({{< relref "helm-charts/quickstart.md" >}}) is our "cheatsheet" for getting started with Helm Charts.
* [helm registries](/kubernetes-platform-services/chart-registry/) are used to store helm charts, which are essentially tarball artifacts.
* [chartmuseum]({{< relref "kubernetes-platform-services/chart-registry/chartmuseum.md">}}) is deployed as the chart repository
* [helmfiles]({{< relref "tools/helmfile.md">}}) are used to define a distribution of helm charts. So if you want to install prometheus, grafana, nginx-ingress, kube-lego, etc, we use a `helmfile.yaml` to define how that's done.
* [chamber]({{< relref "tools/chamber.md">}}) is used to manage secrets and provide them when provisioning with `helmfile`. It's also a big part of our overall story on [secrets management](/secrets-management/)

## CI/CD with Codefresh

* Learn how [codefresh]({{< relref "release-engineering/codefresh-kubernetes-integration.md" >}}) is integrated with kubernetes
* Our [build-harness]({{< relref "release-engineering/build-harness.md">}}) is used to distribute build tools used as part of the build steps
* We use some terraform modules to provision resources for codefresh like a chamber user
* Deploy [apps with secrets]({{< relref "secrets-management/cicd.md" >}})

## Backing Services

## Platform Services

## Optimization

Inevitably, at some point comes the time when you will need to optimize performance. We've documented some of the best ways to get started.

* [Scale Cluster Horizontally]({{< relref "kubernetes-optimization/scale-cluster-horizontally.md" >}}) - Scale Kubernetes cluster horizontally by adding nodes
* [Scale Cluster Vertically]({{< relref "kubernetes-optimization/scale-cluster-vertically.md" >}}) - Scale Kubernetes cluster vertically by using different types of EC2 instances
* [Scale Pods Horizontally]({{< relref "kubernetes-optimization/scale-pods-horizontally.md" >}}) - Scale Kubernetes pods horizontally by increasing the replica count
* [Scale Pods Vertically]({{< relref "kubernetes-optimization/scale-pods-vertically.md" >}}) - Scale Kubernetes pods vertically by increasing CPU and Memory limits
* [Scale Nginx Ingress Horizontally]({{< relref "kubernetes-optimization/scale-nginx-ingress-horizontally.md" >}}) - Scale Nginx Ingress pods horizontally by increasing the replica count
* [Scale Nginx Ingress Vertically]({{< relref "kubernetes-optimization/scale-nginx-ingress-vertically.md" >}}) - Scale Nginx Ingress vertically by increasing CPU and Memory limits
* [Tune Nginx]({{< relref "kubernetes-optimization/tune-nginx.md" >}}) - Tune Nginx parameters (timeouts, worker processes, logs, http)
* [Optimize databases]({{< relref "kubernetes-optimization/optimize-database-indexes.md" >}}) - Optimize database queries and indexes

# Terraform

* Study up on our [Best Practices]({{< relref "terraform/best-practices.md" >}}) for working with terraform.
* Get started quickly by referencing our [terraform-root-modules](/terraform-modules/root/)

## Terraform Modules

* Review our [Best Practices]({{< relref "terraform-modules/best-practices.md" >}}) for working with Terraform modules.

We provide a staggering number of Terraform modules in our GitHub. This number is growing every week and we're also [accepting module contributions]({{< relref "documentation/our-github.md#contributing" >}}).

Our modules are broken down in to specific areas of concern:

- [Backups](/terraform-modules/backups/)
- [CI/CD](/terraform-modules/cicd/)
- CDN
- Kubernetes (kops)
- Logging
- Monitoring
- Networking
- Platform
- Security

# Monitoring

Our monitoring documentation focuses on implementing

# Load Testing

After you've gotten familiar with how monitoring is working, load testing becomes more interesting. By following our load-testing methodology, you're able to put services and clusters under durress.

# Secrets


# Tools

Tons of tools/clis are used as part of our solution. We distribute these tools in a couple of different ways.

* Geodesic bundles most of these tools as part of the geodesic base image
* Our [packages repo]({{< relref "tools/packages.md" >}}) provides an embeddable `Makefile` system for installing packages in other contexts (e.g. [`build-harness`]({{< relref "release-engineering/build-harness.md" >}})). This can also be used for local ("native") development contexts.

Here are some of the most important tools to be aware of:

- [`make`](/tools/make/)
- [`chamber`]({{< relref "tools/chamber.md" >}})
- [`terraform`]
- [`gomplate`]({{< relref "tools/gomplate.md" >}})
- [`aws-vault`]({{< relref "tools/aws-vault.md" >}})

If using kubernetes, then also review these tools:

- [`kops`]({{< relref "tools/kops.md" >}})
- [`helm`]({{< relref "tools/helm.md" >}})
- [`helmfile`]({{< relref "tools/helmfile.md" >}})

# Contributing Back

Everything we provide on our [GitHub](https://github.com/cloudposse/) wouldn't have been possible if it weren't for our [phenomenal customers](https://cloudposse.com/) and the support of the [community](https://cloudposse.com/slack/) contributing bugfixes, [filing issues](https://github.com/search?q=org%3Acloudposse+type%3Aissue) and submitting a steady stream of [Pull Requests](https://github.com/search?q=org%3Acloudposse+type%3Apr).

We welcome any Terraform module submissions, Helm charts, and generally any other useful tools that others could benefit from. Our only requirement is that they be licensed under `APACHE2`.

Drop us a line at [hello@cloudposse.com](mailto:hello@cloudposse.com) to get in touch with us about contributing.

# Getting Help

Check out our [FAQ](/faq/) which is also fully indexed by our Algolia search available on the [homepage](/).

Review our [glossary](/glossary/) if there are any terms that are confusing.

File issues anywhere you find the documentation lacking by going to our [docs repo](https://github.com/cloudposse/docs).

Join our [Slack Community](https://cloudposse.com/slack/) and speak directly with the maintainers

We provide "white glove" DevOps support. [Get in touch]({{< relref "documentation/contact-us.md" >}}) with us today!

[Schedule Time](https://calendly.com/cloudposse/) with us.
