---
title: "Decide on ArgoCD Architecture"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1171980417/REFARCH-420+-+Decide+on+ArgoCD+Architecture
sidebar_position: 100
refarch_id: REFARCH-420
---

# Decide on ArgoCD Architecture

## Considerations

- Multiple ArgoCD clusters should be used to provide a means to systematically upgrade ArgoCD in different environments.

- ArgoCD runs as a single pod, and requires being restarted when plugins are added or upgraded.

- Restarts of ArgoCD are disruptive to deployments.

- The more ArgoCD servers, the harder to visualize the delivery process.

- Each ArgoCD server needs to be integrated with each cluster it deploys to.

- ArgoCD can automatically deploy to the local cluster by installing a service account.

Our recommendation is to deploy one ArgoCD per cluster.

## Introduction

Argo is strictly a tool for doing continuous delivery to Kubernetes. In fact, it is basically analogous to specialized platforms like Terraform Cloud that is built for deploying using a single tool: Terraform. Argo does not even pretend to deploy outside of Kubernetes (e.g. not even uploading files to a bucket). And while Argo supports plugins, those plugins are not really intended to extend the target-deployment capabilities.

Two forms of escape hatches exist for slight deviations such as deployments involving Kubernetes-adjacent tooling like Helm, Kustomize, etc.

1. Using ArgoCD Config Plugins that shell-out and generate kubernetes manifests

2. Using the Operator Pattern to deploy Custom Resources that perform some operation

## Risks

While the Operator Pattern is _ideal_ in theory, __ the reality is less than ideal.

- Most operators are abandoned, or not regularly maintained (they never achieve traction)

- Most operators are in alpha state, seemingly created as pet-projects to scratch an itch

- Upgrading operators is non-trivial because you cannot have 2 versions deployed at the same time

- Operators don’t automatically play well with other operators. For example, how would you pass a secret written from ExternalSecrets operator to a Terraform

- When Operators fail, it might not break the pipeline. Debugging is also harder due to its asynchronous nature.

## Use-Cases

Here are some of the most <ins>common deployment patterns</ins> we see, and some ways in which those could be addressed:

<img src="/assets/refarch/iodjbrmutm7dwt1j0ynbbrlenmin0mvzkin285ndlsyoeneozwxoddrfraohaxsh" height="803" width="833" /><br/>

1. **Deploy a** **<ins>generic application</ins>** **to Kubernetes**

1. Raw manifests are supported natively

2. Render Helm charts to manifests, then proceed as usual.

3. (Secrets and Secret Operators)

2. **Deploy** **<ins>generic Lambda</ins>**

1. Convert to Serverless Framework

2. Convert to Terraform

3. **Deploy** **<ins>Serverless Framework Applications</ins>**

1. Serverless applications render to Cloudformation. See Cloudformation.

2. Wrap Cloudformation in a Custom Resource

4. **Deploy Infrastructure with** **<ins>Cloudformation</ins>**

1. [https://github.com/linki/cloudformation-operator](https://github.com/linki/cloudformation-operator)

5. **Deploy** **<ins>Single Page Application</ins>** **to S3**

1. This does not fit well into the

6. **Deploy Infrastructure with** **<ins>Terraform</ins>**

1. All operators are alpha. [https://github.com/hashicorp/terraform-k8s](https://github.com/hashicorp/terraform-k8s)
Something _feels_ wrong about deploying kubernetes with Terraform and then running Terraform inside of Kubernetes?

2. While it works, it’s a bit advanced to express.

7. **Deploy** **<ins>Database Migrations</ins>**

1. Replicated (enterprise application delivery platform) maintains schemahero. Only supports DDL.
[https://github.com/schemahero/schemahero](https://github.com/schemahero/schemahero)

2. Standard kubernetes Jobs calling migration tool

## Pros

- Simplify dependency management across components (eventually, ArgoCD will redeploy everything)

- Protect KubeAPI from requiring public access (reduce attack surface)

- Powerful CD tool for Kubernetes supporting multiple rollout strategies for Pods

- Nice UI

- Easy to use many kinds of deployment toolchains (that run in argocd docker image)

- Feels like deployments are faster

- “Backup kubernetes cluster” out of the box

- Consistent framework for how to do continuous deployment regardless of CI platform

## Cons

- Breaks the immediate feedback loop from commit to deployment
(as deployment with ArgoCD are async)

- Application CRD should be created in the namespace where argo cd is running

- Applications name must be unique for ArgoCD instance

- Custom deployment toolchain (anything except kube resources/helm/kustomize/jsonnet) requires to build a custom docker image for argocd and redeploy it.

- Redeploying ArgoCD is potentially a disruptive operation to running deployments
(like restarting Jenkins) and therefore must be planned.

- Updating plugins requires re-deploying ArgoCD since the tools must exist in the ArgoCD docker image

- Access management has an additional level - github repo access + argocd projects + rbac. We can have `helm tiller` type of problem

- Additional self-hosted solution ( while classic deploy step with helm 3 runs on CI and use only kubectl )

- Repository management (give access to private repos for argocd) does not support declarative way (need research for ‘repo pattern’ workaround)

- ArgoCD is in the critical path of deployments and has it’s own SDLC.

## Infrastructure

### Create terraform-helm-argocd module

- Deploy ArgoCD with Terraform so it will work well with Spacelift setup continuous delivery to Kubernetes

- Use terraform-helm-provider

- Use projects/terraform/argocd/  (do not bundle with projects/terraform/eks/)
In [https://github.com/acme/infrastructure](https://github.com/acme/infrastructure)

- Use spacelift to deploy/manage with GitOps

- Use terraform-github-provider to create a deployment (e.g. deploy-prod) repository to manage ArgoCD and manage all branch protections
(confirm with acme)

###
Create GitHub PAT for Managing Repos

:::info
The scopes outlined in [the provider documentation](https://github.com/integrations/terraform-provider-github/blob/main/CONTRIBUTING.md#github-personal-access-token) covers the entirety of the provider's capabilities. When applying the principal of least-privileged, this component only interacts with a few repositories and their settings, therefore the PAT generated for this specific use-case should be limited to those actions and should not contain overly permissive scopes such as `admin:org`.

:::

The PAT needs to have the following permissions:

|**Scope(s)** | **Purpose**|
| ----- | ----- |
|- repo | Create repository; Manage repository’s settings; Modify repository’s contents|
|- read:org<br/><br/><br/>- read:discussion | Used to validate teams when setting up branch protections and team access|

Once generated, the PAT should be stored in an SSM parameter (by default at `/argocd/github/api_key`) where it will be retrieved and passed to the [integrations/github](https://registry.terraform.io/providers/integrations/github/latest) Terraform provider.

### Create Repos for Deployment

We’ll use 3 repos “`argocd-deploy-prod`” and “`argocd-deploy-non-prod`”, and “argocd-deploy-preview” for release apps.

Repos will be created manually due to GitHub organization permissions required.

Repos will be managed terraform configure branch protection, using a bot user that has admin permissions to the repos.

## Repo structure

We’ll create 3 repos to start.

- `acme/argocd-deploy-prod/`

- `acme/argocd-deploy-non-prod/`

- `acme/argocd-deploy-preview/` (for release apps)

By separating the preview environments from the other repos, we’re able to lifecycle it more frequently (e.g. resetting the commit history when it gets too large). We can also be more liberal about branch protections to enable continuous delivery without approvals.

ArgoCD will only deploy from the `main` branch.

Here’s an example layout

|       |       |       |       |
| ----- | ----- | ----- | ----- |
|**Repository** | **Cluster**<br/>**(region & stage)** | **Kubernetes Namespace** | **Kubernetes Manifests**|
|`acme/argocd-deploy-prd/` | `uw2-prd/*` | `argocd/` | |
| |  | `prd/` | `bazle-demo-frontend.yaml`<br/>`bazle-demo-api.yaml`<br/>`bazle-demo-db.yaml` <br/>(output from helmfile template)|
| | `uw2-tools/*` | `argocd/` | |
| |  | `github-action-runners/` | |
| | `uw2-auto/*` |  | |
|`acme/argocd-deploy-non-prd/` | `uw2-stg/*` | `argocd/` | |
| |  | `stg/` | `bazle-demo-frontend.yaml`<br/>`bazle-demo-api.yaml`<br/>`bazle-demo-db.yaml` <br/>(output from helmfile template)|
| |  | `uat/` | |
| | `uw2-dev/*` |  | |
| | `uw2-sbx/*` |  | |
|`acme/argocd-deploy-preview/` | `uw2-dev/*` |  | |
| |  | `pr2-example-app/` | `example.yaml`|

### Setup Branch Protections

#### Production

We need to tightly control who can deploy to these environments. Using branch protections, no one (including bot users) can commit directly to the `main` branch.

Pull Requests will be the only way to affect the main branch and will require approvals from teams defined by the `CODEOWNERS` and based on the cluster and namespace and status checks.

Required status checks to merge the pull requests:

1. Workflows in the non-production environment will post status indicating success or failure. In the example below, the commit has a successful `staging deployment (success)` check, enabling deployment to production.

2. Workflows in the `acme/argocd-deploy-prd/.github/workflows/` will do linting on the kubernetes manifests (where manifests exists)

<img src="/assets/refarch/ibuhh3gf6dafekjoz7d2i2f0xrgvorppoqdupvh6yrbsnorgsvkn2j349hmy9n15" height="134" width="732" /><br/>

Pull Requests will be predominantly machine generated by GitHub Actions. However, anyone can open a Pull Request (e.g for hotfixes), and with appropriate approvals get them deployed.

#### Non-production

The non-prod environments will work identically to production environments, with one exception. We’ll use the Mergify bot to automatically approve pull requests matching specific criteria, while supporting the same core functionality of production without the human overhead of acquiring approvals.

#### Preview Environments

These environments will not require Pull Requests, however, will restrict the main branch to commits from the `acmebot`. This will enable rapid continuous delivery for review apps.

#### Deploy Argo CD with terraform-helm-argocd module on each target cluster

We’ll deploy ArgoCD on each target cluster so it can easily manage in-cluster resources and we don’t need to worry about cross-cluster networking, permissions, roles, etc.

#### Configuration

##### Settings (non-sensitive)

These come from the `example1/env/` folder and are defined by namespace.

##### Secrets

## Release Engineering Process

This is our recommended process for continuous delivery of monorepos.

Using ArgoCD with helmfile provides limited utility for the following reasons:

- We cannot use helmfile’s native ability to fetch secrets from ASM or SSM, because that will result in secrets getting committed to source control

- We cannot use helmfile hooks, because those run at execution time of helmfile, and not during synchronization with ArgoCD

Instead, we can achieve similar results using native support for Helm in ArgoCD and the External Secrets Operator.

Inside each monorepo, define a charts folder that has all charts for this repository.

- We recommend one chart for each type of app (e.g. c++ microservice), rather than one chart per app.

- GitHub Action should validate the chart (lint check) for all Pull Requests

### Preview Environments

#### Developer adds `deploy` label to Pull Request

GitHub Action Workflow runs on events “opened”, “reopened”, “synchronized”

- Builds & pushes docker images

- Checks out the main branch in the preview repo

- Commits the follow custom resource and pushes to main branch

File is generated by the GitHub Action based on `example1/app.yaml`

File is written to `acme/argocd-deploy-preview/uw2-stg/argocd/pr2-example1.yaml`

####### _Example 1: acme/__**argocd-deploy-preview**__/uw2-stg/argocd/pr2-example1.yaml (artifact)_

```
# Example ArgoCD Application (use built-in Helm) generated from the app.yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: pr2-example1
  # This should always be argocd (it’s not where the app will run)
  namespace: argocd
  finalizers:
  - resources-finalizer.argocd.argoproj.io
spec:
  source:
    # Example of shared chart in the bazel-monorepo-demo
    path: charts/monochart
    repoURL: acme/bazel-monorepo-demo/
    targetRevision: {git-sha}
    helm:
      version: v3
      valueFiles:
        - example1/env/default.yaml
        - example1/env/preview.yaml
      parameters:
        - name: image
          value: ecr/example1:{git-sha}

```

Example of the `acme/bazel-monorepo-demo/example1/env/default.yaml`

```
# This is a standard helm values file
# The defaults set common values for all releases
use_db: true
```

`acme/bazel-monorepo-demo/example1/env/preview.yaml`

```
# This is a helm values file
# This is an example of overriding the defaults. It needs parameterization.
host: pr12-example1.acme.org
```

`acme/bazel-monorepo-demo/example1/app.yaml`

```
# this is the configuration used by the GitHub action to build the ArgoCD Application Manifest
chart: charts/monochart
```

GitHub Action Step:

1. Looks at `app.yaml` (our own custom specification) to generate the ArgoCD Application

2. Produces `acme/argocd-deploy-preview/uw2-stg/argocd/pr2-example1.yaml`

####### _Example 2_

Fundamentally similar to Example 1. The difference is that it bypasses the need for Helm.

```
# Example with Raw Kubernetes Manifests (alternative to helm strategy)
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: pr2-example1
  # This should always be argocd (it’s not where the app will run)
  namespace: argocd
  finalizers:
  - resources-finalizer.argocd.argoproj.io
spec:
  destination:
    namespace: pr2-example1
  project: default
  source:
    path: uw2-stage/pr2-example1/
    repoURL: acme/argocd-deploy-preview/
    targetRevision: main
---
# Deployment
# Service
# Ingress

```

### Staging Releases

The process always starts by cutting a GitHub release against the monorepo.

This triggers the GitHub Action on release events.

- Retag the artifacts (presumed to already exist)

- Open Pull Request against `acme/argocd-deploy-non-prd/`

- Open Pull Request against `acme/argocd-deploy-prd/`

When respective pull requests are merged to main, subject to all branch protections, ArgoCD kicks off the automatic deployment.

### Production Releases

Production releases are triggered by merging the respective PR, subject to all branch protections.

The most notable branch protection is the requirement that the status check for the commit (corresponding to the release) has a passing “`staging deployment`” check.

<img src="/assets/refarch/skcm9r9ztzks7drtb7w-e_uou4glaqjb_kzy3fy_ul1ot2q6fcwz40bumnll84st" height="134" width="732" /><br/>

## Demo

Update `acme/bazel-monorepo-demo` with 3 or more examples (we’ll just clone the current one) to set up `example1/`, `example2/`, `example3/` services. The objective is to show how we can use shared charts as well as dedicated charts per service.

Convert helmfile raw chart examples to sample charts in the `charts/` folder of the monorepo.

Deprecate the helmfile.yaml example

Update GitHub Actions workflow

1. Produce the ArgoCD Application manifest artifact from the app.yaml

2. Open Pull Request against repo (for prd and non-prd)

3. Push directly for preview environments

Create `acme/argocd-deploy-non-prd/.github/mergify.yml` for auto-merging PRs

```
pull_request_rules:
- name: "approve automated PRs that have passed checks"
  conditions:
  - "check-success~=lint/kubernetes"
  - "check-success~=lint/helm"
  - "base=main"
  - "author=acmebot"
  - "head~=argocd/.*"
  actions:
    review:
      type: "APPROVE"
      bot_account: "acmebot"
      message: "We've automatically approved this PR because the checks from the automated Pull Request have passed."

- name: "merge automated PRs when approved and tests pass"
  conditions:
  - "check-success~=lint/kubernetes"
  - "check-success~=lint/helm"
  - "base=main"
  - "head~=argocd/.*"
  - "#approved-reviews-by>=1"
  - "#changes-requested-reviews-by=0"
  - "#commented-reviews-by=0"
  - "base=master"
  - "author=acmebot"
  actions:
    merge:
      method: "squash"

- name: "delete the head branch after merge"
  conditions:
  - "merged"
  actions:
    delete_head_branch: {}

- name: "ask to resolve conflict"
  conditions:
  - "conflict"
  actions:
    comment:
      message: "This pull request is now in conflict. Could you fix it @{{author}}? 🙏"

- name: "remove outdated reviews"
  conditions:
  - "base=main"
  actions:
    dismiss_reviews:
      changes_requested: true
      approved: true
      message: "This Pull Request has been updated, so we're dismissing all reviews."

```

Create the sample `acme/argocd-deploy-non-prd/.github/CODEOWNER`

```
uw2-stg/* @acme/staging @acme/mergebots

```

Enable branch protections

## Research

- Feedback loop with ArgoCD to update GitHub Status API [<ins>Igor Rodionov</ins>](mailto:igor@cloudposse.com)

- [https://github.com/argoproj-labs/argo-kube-notifier](https://github.com/argoproj-labs/argo-kube-notifier)

```
apiVersion: v1
kind: ConfigMap
metadata:
  name: argocd-notifications-cm
data:
  config.yaml: |
    triggers:
      # Define your custom trigger
      - name: my-custom-trigger
        condition: app.status.sync.status == 'Unsynced' && ( time.Parse(app.status.operationState.finishedAt) - time.Parse(app.status.operationState.startedAt) ) < 100
        template: my-custom-template
    templates:
      # Add your custom template
      - name: my-custom-template
        title: Hello {{.app.metadata.name}}
        body: |
          Application details: {{.context.argocdUrl}}/applications/{{.app.metadata.name}}.
```

- [https://argocd-notifications.readthedocs.io/en/stable/services/opsgenie/](https://argocd-notifications.readthedocs.io/en/stable/services/opsgenie/)

```
apiVersion: argoproj.io/v1alpha1
kind: Notification
metadata:
  name: notification-1
spec:
  # Define resource need to be monitor.
  monitorResource:
    Group:    "argoproj.io"
    Resource: "application"
    Version:  "v1alpha1"
  Namespace: default
  notifiers:
  - name: slack
    slack:
      hookUrlSecret:
        name: my-slack-secret
        key: hookURL
      channel: testargonotification
      hookurl: "https://hooks.slack.com"
  rules:
  - allConditions:
    - jsonPath: "status/sync/status"
      operator: "ne"
      value: "Unsynced"
      Events:
      - message: "Condition Triggered : Deployment = {{.metadata.name}} replicaset doesnt match. Required Replicas = {{.status.replicas}}, Current Replicas={{.status.readyReplicas}}"
        emailSubject: "Argo Notification Condition Triggered {{.metadata.name}}"
        notificationLevel: "warning"
        notifierNames:
        - "slack"
      name: rule1
      initialDelaySec: 60
      throttleMinutes: 5

```

- Can `deliverybot` simplify some of this process (including updating the GitHub Status API) [<ins>Igor Rodionov</ins>](mailto:igor@cloudposse.com)

- At the moment it looks like delivery bot will add complexity. As the only thing it is doing - triggering a `deployment` event for github actions that do all work.

[https://deliverybot.dev/docs/guide/2-deploy-action/](https://deliverybot.dev/docs/guide/2-deploy-action/)

[https://github.com/deliverybot/example-helm/blob/master/.github/workflows/cd.yml](https://github.com/deliverybot/example-helm/blob/master/.github/workflows/cd.yml)

- Delivery bot could we useful if we get rid of pattern with `PR for prod approval` as it allow automate deployment created based on commit statuses [https://deliverybot.dev/docs/configuration/#targetrequired_contexts](https://deliverybot.dev/docs/configuration/#targetrequired_contexts)

- Running delivery bot on prem with kubernetes is not documented[https://github.com/deliverybot/deliverybot/tree/master/packages/kubernetes](https://github.com/deliverybot/deliverybot/tree/master/packages/kubernetes)

- SaaS delivery bot cost per user

## Suggestions

Common suggestions and practices to consider and discuss in the implementation of ArgoCD solutions.

### ALB and Ingress

#### Overview

- ArgoCD is capable of deploying and updating resources of all types on a Kubernetes cluster (including RBAC and Ingress, etc.). Some extra consideration should be taken in the Architecture used per customer engagement. Where possible we should try to isolate the ArgoCD API and UI from other application and service traffic.

- The term `common` ALB/Ingress in this section refers to identifying an ingress by `group.name` where any ingress that references that same `group.name` applies its configurations to to the same alb resources. There is also a concept of weighting group based rules so it is possible for another ingress annotations to supersede already established configurations by setting a smaller number (higher priority) with `group.order`.

- Previous load balancer patterns used with Cloud Posse engagements utilize a single, `common`, internet-facing ALB, and Ingress Groups ensure that all services will use this ALB and Ingress. Services such as ArgoCD should probably not be internet-facing, even if they are backed by authentication. Maybe we need to extend this pattern to multiple `group.name` ALBs, for internet facing, public facing and any service that should be treated as a separate security or functional concern.

- Ingress groups should not overlap different k8s RBAC permission boundaries (e.g. namespaces) because different users can override existing rules in the ingress group with higher priority rules. So maybe `common` ALBs should be per k8s namespace.

#### References

- [https://docs.aws.amazon.com/eks/latest/userguide/alb-ingress.html](https://docs.aws.amazon.com/eks/latest/userguide/alb-ingress.html)

- [https://kubernetes-sigs.github.io/aws-load-balancer-controller/v2.2/guide/ingress/annotations/#ingressgroup](https://kubernetes-sigs.github.io/aws-load-balancer-controller/v2.2/guide/ingress/annotations/#ingressgroup)


