---
title: "Remote Developer Environments: Comparative Analysis of Tools"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1189281964/Remote+Developer+Environments%3A+Comparative+Analysis+of+Tools
sidebar_position: 100
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/reference/remote-developer-environments-comparative-analysis-of-tools.md
---

# Remote Developer Environments: Comparative Analysis of Tools

### Overview

Comparative Analysis of Skaffold, Garden, and Telepresence with Helmfile

:::info
[Tilt.dev](https://tilt.dev/) was not evaluated because it is primarily focused on building and deploying to a _local_ kubernetes cluster. While a local kubernetes cluster can work for a local environment it often consumes the majority of the developer’s resources on their computer. This makes other tasks more difficult. Other tools Such as Garden, Skaffold, and Telepresence, focus on deploying to remote clusters but could support a local cluster if desired.

:::

### Remote Environment

|**Requirement** | **Skaffold** | **Garden**|
| ----- | ----- | ----- |
|**single application deployment** | `skaffold deploy` Skaffold makes it very easy to build and/or deploy a single application. Ran from app repository. | `garden dev my-app` Builds Tests and Deploys `my-app` where it is defined in the project. **Requires directory structure or linked folders (more later)**|
|**dependency deployment - DBs, Helper Containers** | Can be defined in the skaffold.yml as an additional release (or profile) or in the app chart dependencies. Must exist as a chart. can deploy helm charts from | each **module**[[1](https://docs.garden.io/using-garden/modules)] can contain a depends on section. This means any number of dependencies can be added which include Terraform, Helm Charts, Kubernetes Manifests, or Docker containers. Can point to modules from remote sources|
|**deploy group of applications** | Can be defined similarly as above through a profile as a set of releases, or through dependencies in the helm chart. Groups can also be defined through remote skaffold configurations which can live remotely and contain groups of releases [[2](https://skaffold.dev/docs/design/config/#remote-config-dependency)]. Other configs can be local paths as well - meaning no commit hassel [[3](https://skaffold.dev/docs/design/config/#local-config-dependency)]. | `garden dev` (or `deploy`) will deploy all modules in a project. This means an entire environment could be deployed in one command, a `--skip module-b` exists to help manually not deploy particular modules.|
|**application versioning by environment** | With additional config dependencies (more **skaffold.yml** files) could be committed to a repository and versioning could point to a branch to set the starting point for environments as the latest. A ref [[2](https://skaffold.dev/docs/design/config/#remote-config-dependency)] to another skaffold config would set other applications default versions. | Garden will build any module with a Dockerfile next to it. Deployment does not require a Helm chart, and will create kubernetes manifests to fit a docker image with configurations for port and ingresses.|
|**application version overrides** | Overriding Other Applications (e.g. `dev` environment for all except `svc-a` and `svc-b` where `svc-a` is your local repo and `svc-b` is a dependency you’ve customized) would require a local directory set. Or you change the helm chart version that is fetched for that service. Note: It looks like you cannot override Skaffold Yamls fetched remotely. | Garden allows `link`ing a service, which overrides a remote configuration with a local directory.  This allows you to use your local as a deployment for customized versioning. For a different published version modules allow you to specify a `repositoryUrl` and it will use the local configuration.|
|**customize environment variables** | Environment Variables can easily be added once the helm chart forwards an env block of values yaml to the deployment definition. Skaffold allows easy overriding of default values.yaml files, and merging other values.yaml files. | This is especially easy in Garden, for modules deployed as a container type (has some default k8 deployments) you can add an `env` block to define key value pairs. For kubernetes or helm type modules it must again be specified in the helm chart or in the deployment env block.|
|**New environment** | Using Skaffold Required Configs (Perhaps a config in an environment repository that has required configs in every microservice repository) we could define an entire environment and deploy it to a new environment with `skaffold deploy` | `garden deploy` will deploy and entire project, with a git controlled repository this would be extremely easy to stand up a clean new environment.|
|**Teardown environment** | Similar to spinning up a new environment there is a command that tears down the environment based on the current configuration, which is `skaffold delete` | `garden delete environment` will tear down an environment. you can specify with `--env foo`<br/><br/><br/><br/>A default environment can be specified for a project. It appears you could nest a `garden.yml` in a parent directory to override specific values.|
|**Re-create environment** <br/>**(teardown and re-create environment bringing all versioned apps and dependencies back to a clean state)** | Skaffold does not natively have this. However with local configs and version overrides we could tear down an environment, respin it up, and override with our versioned apps. This would be ran via `skaffold deploy` | `garden delete env foo; garden deploy --env=foo`  will reset an environment to a clean slate. This includes any linked local repositories. Since it is deploying it will rebuild and keep any changes to the code.|
|**Environment integration** <br/>**(Connecting development environment to dependencies on other environments)** | Not natively supported. This would require custom Services and values overrides to point to k8 services in other namespaces. | Not natively supported.|

### Development Cycle

| | **Skaffold** | **Garden**|
| ----- | ----- | ----- |
|**Creating a new application** | Skaffold does not support creating a new application. The tool does not support this type of generation. However there are other tools that can help with this. | Garden does not support creating a new application, however it does have a very easy to use onboarding to create a new module (App, Tests, Tasks, Deployments) via the CLI that includes auto detection.|
|**On-boarding an existing application** | Once a project exists. Github Workflows and Skaffold.yaml files would need to be added, these would likely need minor changes from other projects, such as project name. | Using `garden create module` a new module can be spun up pretty easily to be added to the current project.|
|**Starting the development** | Skaffold.yaml can be configured so it always points to the running developers workspace (namespace). Simply running `skaffold dev` should then be able to build, test, and deploy their code to their workspace. This command includes hot reloading. | `garden dev` starts by deploying the environment and also starting up the garden dashboard, which lets you look at pod logs, dependency graph, and an overview, including accessible endpoints.|
|**Hot reloading code** | Skaffold supports this by noticing file changes, it can either sync the files to the running container or can build a new image and redeploy it. | supported on deploy and dev with flags. <br/>`--watch # watch for changes to code`<br/><br/>`--hot=my-service` `--hot=*`|
|**Hot reloading packages** | Skaffold allows explicitly declaring folders and file types that should be synced to a deployment. This is done automatically during the `dev` command [[https://skaffold.dev/docs/filesync/](https://skaffold.dev/docs/filesync/)] | Garden supports File Sync and Command Sync. Where when files change they will either be volume mounted or a command will be run. [[https://docs.garden.io/v/docs%252Fexperimental/guides/hot-reload#basic-example](https://docs.garden.io/v/docs%252Fexperimental/guides/hot-reload#basic-example)]|
|**Debugging** | `skaffold debug` runs `skaffold dev` (build test deploy) but also forwards debugging ports. Currently Supports <br/><br/>- NodeJS (runtime ID: `nodejs`) using the NodeJS Inspector (Chrome DevTools)<br/><br/><br/>- Java and JVM languages (runtime ID: `jvm`) using JDWP | No Native Support|
|**Add/Change Environment Variables** | Requires upfront work - the helm chart update requires a block definition that can import a map of env variables from a values file. Skaffold can then override these variables very easily | Same as skaffold - can override helm deployment env block with values yamls. For kubernetes modules there is a directly supported `env` block in the `garden.yml`|
|**Add/Change Environment Secrets** | Similar to Env Variable changes, Secrets would need to be deployed in a helm chart somewhere, skaffold can then deploy it and override variables | Done through Kubernetes secrets, Only supported on Enterprise level for management.|
|**Helm Chart Changes** <br/>**(if we change SOPS, does the helm chart get reloaded)** | Skaffold `dev` allows rapid redeploy of helm charts. However if the helm chart syntax is broken the dev command will return non-zero exit code. This means pulling helm chart changes will be immediately deployed. | `helm` modules point to either a remote chart, or a local directory and would be redeployed through `garden deploy`. Kubernetes Modules and Container Modules deploy either set manifests or are auto detected.|

:::caution
**Telepresence Note**
Telepresence V2 is tightly coupled with Ambassador, this could potentially cause issues when using other service meshes (e.g. Istio, Linkerd, Kong, etc). Telepresence V1 could be used, though it would not be worth the investment for a tool that is no longer supported.

:::
