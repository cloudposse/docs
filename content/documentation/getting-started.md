---
title: Getting Started with Cloud Posse
description: >-
  This page will help you get started with Cloud Posse. You'll be up and running
  in a jiffy!
---

# Geodesic

Start with getting familiar with the [geodesic design]({{< relref "geodesic/design.md" >}}).

Create [geodesic modules](/geodesic/module/) anywhere you want to logically organize infrastructure as code.

Get intimately familiar with docker inheritance and [multi-stage docker builds]({{< relref "tools/docker/best-practices.md#multi-stage-builds" >}}). We use this pattern extensively.

Check out our [terraform-root-modules](https://github.com/cloudposse/terraform-root-modules) for reference architectures to easily provision infrastructure

# Local Development

1. Get your [local environment]({{< relref "local-dev-environments/_index.md" >}}) setup
2. Make sure you're familiar with [`make`](/tools/make/) and [`Makefiles`]({{< relref "tools/make/makefile-examples.md" >}}) because we use them extensively for "executable documentation".
3. Review Docker compose
4. Docker composition monorepo strategy

# Tools

Tons of tools/clis are used as part of our solution. We distribute these tools in a couple of different ways.

* Geodesic bundles most of these tools as part of the geodesic base image
* Our [packages repo]({{< relref "tools/packages.md" >}}) provides an embeddable `Makefile` system for installing packages in other contexts (e.g. [`build-harness`]({{< relref "release-engineering/build-harness.md" >}})). This can also be used for local ("native") development contexts.

Here are some of the most important tools to be aware of:

- [`make`](/tools/make/)
- [`chamber`]({{< relref "tools/chamber.md" >}})
- [`terraform`]({{< relref "terraform/_index.md" >}})
- [`gomplate`]({{< relref "tools/gomplate.md" >}})
- [`aws-vault`]({{< relref "tools/aws-vault.md" >}})

If using kubernetes, then also review these tools:

- [`kops`]({{< relref "tools/kops.md" >}})
- [`helm`]({{< relref "tools/helm.md" >}})
- [`helmfile`]({{< relref "tools/helmfile.md" >}})

# Kubernetes

Kubernetes is a massive part of our solutions. Our Kubernetes documentation is geared towards leveraging [`kops`]({{< relref "tools/kops.md" >}}) by way of our `geodesic` strategy.

## Helm

Helm is central to how we deploy all services on kubernetes.

* [helm]({{< relref "tools/helm.md" >}}) is essentially the package manager for Kubernetes (like `npm` for Node, `gem` for Ruby, and `rpm` for RHEL)
* [helm charts](/helm-charts/) are how kubernetes resources are templatized using Go templates
* [helm charts quickstart]({{< relref "helm-charts/quickstart.md" >}}) is our "cheatsheet" for getting started with Helm Charts.
* [helm registries](/kubernetes-platform-services/chart-registry/) are used to store helm charts, which are essentially tarball artifacts.
* [chartmuseum]({{< relref "kubernetes-platform-services/chart-registry/chartmuseum.md">}}) is deployed as the chart repository
* [helmfiles]({{< relref "tools/helmfile.md">}}) are used to define a distribution of helm charts. So if you want to install prometheus, grafana, nginx-ingress, kube-lego, etc, we use a `helmfile.yaml` to define how that's done.
* [chamber]({{< relref "tools/chamber.md">}}) is used to manage secrets and provide them when provisioning with `helmfile`. It's also a big part of our overall story on [secrets management](/secrets-management/)
* [rollbacks]({{< relref "faq/how-to-perform-rollbacks.md" >}})


## CI/CD with Codefresh

Our standard [CI/CD pipeline]({{< relref "release-engineering/cicd-process/_index.md" >}}) describes in detail each step and what it does.

Codefresh runs docker containers for each build step. We provide a dockerized [build-harness]({{< relref "release-engineering/build-harness.md">}}) to distribute common build tools that we use as part of the build steps in the `codefresh.yml`.

Learn how [Codefresh]({{< relref "release-engineering/codefresh/kubernetes-integration.md" >}}) is integrated with kubernetes. This is also the same process used to add integrations for multiple clusters.

We use some terraform modules to provision resources for codefresh like a [chamber user](https://github.com/cloudposse/terraform-aws-iam-chamber-user).

Securely deploy [apps with secrets]({{< relref "secrets-management/cicd.md" >}}).

## Backing Services (*Coming Soon*)

Checkout our docs on [kubernetes backing services]({{< relref "kubernetes-backing-services/_index.md" >}}).

## Platform Services (*Coming Soon*)

Checkout our docs on [kubernetes platform services]({{< relref "kubernetes-platform-services/_index.md" >}}).

## Optimization

Inevitably, at some point comes the time when you will need to optimize for performance. We've documented some of the best ways to get started.

First, make sure you're familiar with kubernetes [resource management]({{< relref "kubernetes/resource-management.md" >}}).

* [Scale Cluster Horizontally]({{< relref "kubernetes-optimization/scale-cluster-horizontally.md" >}}) - Scale Kubernetes cluster horizontally by adding nodes
* [Scale Cluster Vertically]({{< relref "kubernetes-optimization/scale-cluster-vertically.md" >}}) - Scale Kubernetes cluster vertically by using different types of EC2 instances
* [Scale Pods Horizontally]({{< relref "kubernetes-optimization/scale-pods-horizontally.md" >}}) - Scale Kubernetes pods horizontally by increasing the replica count
* [Scale Pods Vertically]({{< relref "kubernetes-optimization/scale-pods-vertically.md" >}}) - Scale Kubernetes pods vertically by increasing CPU and Memory limits
* [Scale Nginx Ingress Horizontally]({{< relref "kubernetes-optimization/scale-nginx-ingress-horizontally.md" >}}) - Scale Nginx Ingress pods horizontally by increasing the replica count
* [Scale Nginx Ingress Vertically]({{< relref "kubernetes-optimization/scale-nginx-ingress-vertically.md" >}}) - Scale Nginx Ingress vertically by increasing CPU and Memory limits
* [Tune Nginx]({{< relref "kubernetes-optimization/tune-nginx.md" >}}) - Tune Nginx parameters (timeouts, worker processes, logs, http)
* [Optimize databases]({{< relref "kubernetes-optimization/optimize-database-indexes.md" >}}) - Optimize database queries and indexes

# Terraform

Study up on our [Best Practices]({{< relref "terraform/best-practices.md" >}}) for working with terraform. Get started quickly provisioning infrastructure by referencing our [terraform-root-modules](/terraform-modules/root/).

## Terraform Modules

We provide a staggering number of Terraform modules in our GitHub. This number is growing every week and we're also [accepting module contributions]({{< relref "documentation/our-github.md#contributing" >}}).

Our modules are broken down in to specific areas of concern:

- [Backups](/terraform-modules/backups/)
- [CI/CD](/terraform-modules/cicd/)
- [CDN](/terraform-modules/cdn/)
- [Kubernetes (kops)](/terraform-modules/kops-kubernetes/)
- [Logging](/terraform-modules/logging/)
- [Monitoring](/terraform-modules/monitoring/)
- [Networking](/terraform-modules/networking/)
- [Platform](/terraform-modules/platform/)
- [Security](/terraform-modules/security/)

Before writing your own modules, review our [Best Practices]({{< relref "terraform-modules/best-practices.md" >}}) for working with Terraform modules.

# Monitoring (*Coming Soon*)

In the meantime, review some of our docs on [monitoring and alerting](/monitoring-and-alerting/).

If running on kubernetes, review our ["backing services" documentation for monitoring]({{< relref "kubernetes-backing-services/monitoring/_index.md" >}})

# Load Testing

After you've gotten familiar with how monitoring is working, you'll want to run some load tests to ensure everything meets expectations. We provide some of our "best practices", workflows, scripts and scenarios for load and performance testing of websites and applications
(in particular those deployed on Kubernetes clusters).

Our strategy for load and performance testing breaks down like this:

1. [Review Load Testing Tools]({{< relref "load-testing/load-testing-tools.md" >}}) - how we select and setup our load testing tools
2. [Example Testing Scenarios]({{< relref "load-testing/load-testing-scenarios.md" >}}) - how we implement load testing scenarios
3. [Run Tests and Analyze Results]({{< relref "load-testing/perform-testing-and-analyze-results.md" >}}) - how we do load testing and analyze the results
4. [Optimization and Tuning Procedures]({{< relref "load-testing/optimization-and-tuning-procedures.md" >}}) - optimization and tuning steps that we usually perform after running load tests


# Secrets (*Coming Soon*)

Have  a look at our docs on [secrets management](/secrets-management/).



# Contributing Back

Everything we provide on our [GitHub](https://github.com/cloudposse/) wouldn't have been possible if it weren't for our [phenomenal customers](https://cloudposse.com/) and the support of the [community](https://cloudposse.com/slack/) contributing bug-fixes, [filing issues](https://github.com/search?q=org%3Acloudposse+type%3Aissue) and submitting a steady stream of [Pull Requests](https://github.com/search?q=org%3Acloudposse+type%3Apr).

We welcome any Terraform module submissions, Helm charts, and generally any other useful tools that others could benefit from. Our only requirement is that they be licensed under `APACHE2`.

Drop us a line at [hello@cloudposse.com](mailto:hello@cloudposse.com) to get in touch with us about contributing.

# Getting Help

Check out our [FAQ](/faq/) which is also fully indexed by our Algolia search available on the [homepage](/).

Review our [glossary](/glossary/) if there are any terms that are confusing.

File issues anywhere you find the documentation lacking by going to our [docs repo](https://github.com/cloudposse/docs).

Join our [Slack Community](https://cloudposse.com/slack/) and speak directly with the maintainers

We provide "white glove" DevOps support. [Get in touch]({{< relref "documentation/contact-us.md" >}}) with us today!

[Schedule Time](https://calendly.com/cloudposse/) with us.
