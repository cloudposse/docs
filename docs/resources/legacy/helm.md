---
title: "Helm"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1201504352/Helm
sidebar_position: 100
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/reference/helm.md
---

# Helm
Helm makes it easy to install `charts` (an application) on kubernetes clusters. Just like `npm` or `apt` make it easy to install NodeJS modules and Debian packages, `helm` makes it easy to deploy a full-fledged application architecture with all of its dependencies on Kubernetes.

It’s one of the original tools to deploy applications to Kubernetes and has the widest support amongst tools. One of the problem though is that something still needs to define the `values` you need to deploy a Helm release. That’s why there are other tools (e.g. terraform, helmfile, and argocd) required in order to integrate helm with your environment. 

## Alternatives
- Kustomize [https://github.com/kubernetes-sigs/kustomize](https://github.com/kubernetes-sigs/kustomize)

- Ksonnet (deprecated) [https://github.com/ksonnet/ksonnet](https://github.com/ksonnet/ksonnet)

- Kapitan [https://github.com/deepmind/kapitan](https://github.com/deepmind/kapitan)

## How-to Guides

- [How to Keep Everything Up to Date](/reference-architecture/how-to-guides/upgrades/how-to-keep-everything-up-to-date)

## Charts
Charts are the deployable artifact used to create helm releases.

### Our Charts
Cloud Posse maintains a dozen or so charts. In general, <ins>we prefer</ins> _<ins>not</ins>_ <ins>to maintain any charts</ins> and our goal is to leverage as many open source charts as possible. Our charts are available via `https://charts.cloudposse.com` and browsable via [https://artifacthub.io/packages/search?repo=cloudposse&sort=relevance&page=1](https://artifacthub.io/packages/search?repo=cloudposse&sort=relevance&page=1) . 

[https://github.com/cloudposse/charts](https://github.com/cloudposse/charts)

### Open Source Charts
There’s been a lot of churn in the open-source community regarding Helm Charts. Historically, the `helm/charts` repo was the “official” source of charts managed by the community at large. Maintenance became a serious problem and bottleneck, so the repo has been deprecated. [https://helm.sh/blog/charts-repo-deprecation](https://helm.sh/blog/charts-repo-deprecation) 

[https://github.com/helm/charts](https://github.com/helm/charts)

Today, the best place to search for charts is via [https://artifacthub.io/](https://artifacthub.io/) , which is like the “DockerHub” for helm charts. We also really like the well-maintained charts from Bitnami. [https://github.com/bitnami/charts](https://github.com/bitnami/charts)

## Conventions

### Charts as an Interface
Typically, in a service-oriented architecture (SOA) aka microservices architecture, there will be dozens of very similar services. Traditionally, companies would develop a “unique” helm chart for each of these services. In reality, the charts were generated by running the `helm create` ([https://helm.sh/docs/helm/helm_create/](https://helm.sh/docs/helm/helm_create/) ) command that would generate all the boilerplate. As a result, the services would share 99% of their DNA with each other (e.g. like monkeys and humans), and 1% would differ. This led to a lot of tech debt, sprawl, and copy & paste 🍝 mistakes. 

For proprietary apps deployed by your organization, we recommend taking a different tactic when developing helm charts. Instead, treat charts like an interface - the way you want to deploy apps to Kubernetes. Develop 1-2 charts based on the patterns you want your developers to use (e.g. microservice, batchjob, etc). Then parameterize things like the `image`, `env` values, `resource` limits, `healthcheck` endpoints, etc. Think of charts like developing your own Heroku-like mechanism to deploy an application. Instead of writing 2 dozen charts, maintain one. Make your apps conform to the convention. Push back on changes to the convention unless necessary.

**What if we need more than one deployment (or XYZ) in a chart?**  That’s easy. You have a few options: a) Deploy the same chart twice; b) Decide if as an organization you want to support that interface and then extend the chart; c) Develop an additional chart interface. 

**What if we want to add a feature to our chart and don’t want to disrupt other services?** No problem. Charts are versioned. So think of the version of a chart as the version of your interface. Everytime you change the chart, bump the version. Ensure all your services pin to a version of the chart. Now when you change the version of the chart in your service, you know that your upgrading your interface as well.

**What if we need some backing services?** Good question. You can still use the features of umbrella charts, and even feature flag common things like deploying a database backend for development environments by using a `condition` in the `requirements.yaml` that can be toggled in the `values.yaml`. _Pro-tip:_ Use [https://artifacthub.io/](https://artifacthub.io/) to find ready-made charts you can use.

```
- name: elasticsearch
  version: ^1.17.0
  repository: https://kubernetes-charts.storage.googleapis.com/
  condition: elasticsearch.enabled
- name: kibana
  version: ^1.1.0
  repository: https://kubernetes-charts.storage.googleapis.com/
  condition: kibana.enabled
```

## Usage

### Command Line
Helm is conveniently operated from the command line using the `helm` cli. We provide a package in our `packages` repository for multiple versions of helm (`helm2` and `helm3`) so they can be concurrently installed using `dpkg-alternative`

[https://github.com/cloudposse/packages/tree/master/vendor](https://github.com/cloudposse/packages/tree/master/vendor)

### Helmfile
For many years, we relied on `helmfile` as the primary delivery tool for `helm`. Using `helmfile` we could declaratively express all the applications and their settings by the environment. Starting in 2021, we started shifting our focus on using `terraform` and/or ArgoCD for deployments as many of the features of `helmfile` are now adequately supported by them.

[https://github.com/roboll/helmfile](https://github.com/roboll/helmfile)

[https://github.com/cloudposse/helmfiles](https://github.com/cloudposse/helmfiles)

[https://archive.sweetops.com/helmfile/](https://archive.sweetops.com/helmfile/) 

### Terraform
There are two predominant ways to deploy `helm` chart releases with terraform. The primary benefit to using `terraform` over any other tool like `helmfile` or ArgoCD, is it’s the ability to facilitate integration with other services like AWS IAM, S3, SAML providers, etc. For example, a very common requirement is to provision IRSAs needed by pods to perform certain operations in AWS. 

#### Terraform `helm` provider

:::caution
Out-of-the-box the `helm` provider does not detect any changes made to the cluster, helm charts or values.

[https://github.com/hashicorp/terraform-provider-helm/issues/372](https://github.com/hashicorp/terraform-provider-helm/issues/372)

This means that changes that are made manually in the cluster are not detected as drift. Unlike with helmfile, which performs a `diff` (using `helm-diff` plugin), the terraform `helm` provider does not.

#### Mitigations
- Use the `helm_template` data source ([https://registry.terraform.io/providers/hashicorp/helm/latest/docs/data-sources/template](https://registry.terraform.io/providers/hashicorp/helm/latest/docs/data-sources/template)) to render the helm release and deploy it with the new `kubernetes_manifest` resource ([https://registry.terraform.io/providers/hashicorp/kubernetes/latest/docs/resources/manifest](https://registry.terraform.io/providers/hashicorp/kubernetes/latest/docs/resources/manifest)). Terraform will then be able to detect changes from the desired state. There’s one trade-off, however, and that’s there will no longer be any helm history on the server since the manifests will be managed directly by terraform.

- Use the `repository_file` resource together with ArgoCD to write `Application` Custom Resource manifests for deployment. This has the benefit of coupling all the benefits of terraform’s ability to provision backing services, with ArgoCDs abilities to reconcile kubernetes state.

:::
The `helm` provider works conveniently in terraform to deploy helm releases. 

[https://github.com/hashicorp/terraform-provider-helm](https://github.com/hashicorp/terraform-provider-helm)

We use our `terraform-aws-helm-release` module to facilitate the most common deployment patterns that we use, including the ability to automatically provision the IAM roles required by the service. 

[https://github.com/cloudposse/terraform-aws-helm-release](https://github.com/cloudposse/terraform-aws-helm-release)

As well as publish ready-made [Components](/components) for services like `external-dns`, `cert-manager`, `aws-load-balancer-controller`, and `argocd` (and many more) leveraging this pattern.

[https://github.com/cloudposse/terraform-aws-components](https://github.com/cloudposse/terraform-aws-components)

#### Terraform `helmfile` provider
Usage of the `helmfile` provider is primarily advised for customers with a sizable investment into `helmfile`, but who also want to consolidate deployments with terraform. The `helmfile` provider simply wraps the `helmfile` command-line tool and ties into the terraform life cycle hooks for plan, apply and destroy. In order for it to work, it depends on multiple binaries being installed: `helm`, `helmfile`, and the `helm-diff` plugin. In addition, the `KUBECONFIG` must be set and pointed to an active session.  

### ArgoCD
TL;DR: Even if you use ArgoCD, you’ll still need something that manages ArgoCD itself, any integrations with other kubernetes clusters, GitHub, and your IdP. For this reason we deploy ArgoCD with terraform and your apps _optionally_ with ArgoCD.

See [https://cloudposse.atlassian.net/wiki/spaces/CP/pages/1168113701](https://cloudposse.atlassian.net/wiki/spaces/CP/pages/1168113701) 

## Learning Resources
- [https://helm.sh/docs/intro/quickstart/](https://helm.sh/docs/intro/quickstart/) 

- [https://kube.academy/courses/helm-101](https://kube.academy/courses/helm-101) 

- [https://jfrog.com/blog/10-helm-tutorials-to-start-your-kubernetes-journey/](https://jfrog.com/blog/10-helm-tutorials-to-start-your-kubernetes-journey/) 

- [https://www.udemy.com/course/helm-package-manager-for-kubernetes-complete-master-course/](https://www.udemy.com/course/helm-package-manager-for-kubernetes-complete-master-course/)  💰 

## References
- [https://helm.sh/docs/howto/charts_tips_and_tricks/](https://helm.sh/docs/howto/charts_tips_and_tricks/) 

- [Handling CRDs in Helm 3](https://github.com/helm/community/blob/main/hips/hip-0011.md)

[https://github.com/kubernetes/helm](https://github.com/kubernetes/helm)

