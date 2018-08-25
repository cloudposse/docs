---
title: "Helmfile"
description: 'Helmfile is a declarative configuration for deploying distributions of helm charts'
tags:
- helm
- helm chart
- k8s
- yaml
- chamber
- 12-factor
- tools
---

We use `helmfile` to deploy collections of charts as part of geodesic. The `helmfile.yaml` is a declarative configuration file that makes it easier to deploy and manage a large number of helm charts.

Another way to think about it is like this:

> If `helm` is responsible for deploying a single application to kubernetes, then `helmfile` is responsible for deploying multiple applications by calling `helm`.

# Features

- **12-Factor Style Configurations** - Parameterize all charts using Environment Variables
- **Inline `values.yaml`** - Maintain changes to chart configurations in version control
- **Chamber Compatibility** - Use [`chamber`]({{< relref "tools/chamber.md" >}}) to deploy helm charts with secrets pulled from SSM
- **CI/CD Integration** - Easily integrate `helmfile` with CI/CD pipelines using our [`build-harness`]({{< relref "release-engineering/build-harness.md" >}})
- **Synchronize Environments**  - Rapidly deploy or update all services for a cluster
- **Go Templating** - Configuration is templatized using [Go template](https://godoc.org/text/template) and supports all the [Sprig](https://godoc.org/github.com/Masterminds/sprig) intepolation functions.

# Use-cases

- We recommend using a `helmfile` anywhere you need to deploy a helm chart. This is because `helm` does not support environment variables out-of-the-box.
- The `helmfile` reduces the need for complex umbrella charts that are more difficult to manage.

# Dependencies

Helmfile depends on the following `cli` tools.

- [`helm`]({{< relref "tools/helm.md" >}}) - for managing helm packages
- [`kubectl`]({{< relref "kubernetes/kubectl.md" >}}) - for interfacing with the Kubernetes API

{{% dialog type="info" icon="fa fa-info-circle" title="Note" %}}
[`geodesic`](/geodesic/) shell ships with all dependencies.
{{% /dialog %}}

Prior to using `helmfile`, you'll need a valid [`kubectl` context]({{< relref "geodesic/module/with-kops.md#export-kubecfg" >}}).

Alternatively, set the [`KUBE_CONTEXT`]({{< relref "release-engineering/codefresh/kubernetes-integration.md#usage" >}}) when using `helmfile` with a Codefresh pipeline.

# Configuration File

The `helmfile.yaml` is a [go-template](https://golang.org/pkg/text/template/) formatted "YAML" file. Note, this means that it is first evaluated as a plain-text go-template before getting processed as YAML. It essential that the go-template result in well-formed YAML with properly escaped values.

For complete examples, review our comprehensive distribution of [helmfiles](https://github.com/cloudposse/helmfiles/tree/master/helmfile.d).

## Example `helmfile.yaml`

Here's an example `helmfile.yaml`. Note that it's possible to use conditionals (e.g. `if` / `else`).

{{% include-code-block title="Helmfile Example" file="tools/examples/helmfile.yaml" language="yaml" %}}

## Environment Variables

There are two options for retrieving environment variables.

The `env` function will simply retrieve the environment variable. If it does not exist, it will return an empty string. Combined with the `default` function, it's possible to set a default value.

```
{{ env "POSTGRES_USER" }}
```

The other option is to call `requiredEnv`. This method is not recommended.

```
{{ requiredEnv "POSTGRES_USER" }}
```

This will throw an exception if the environment variable (`POSTGRES_USER`) is not set. While this sounds like a great feature, it's actually problematic because sometimes we only want to `sync` a particular chart using the `--selector` argument. In this case, we shouldn't need to set all environment variables - only the ones relevant to the chart we're installing. If the `helmfile.yaml` is using `requiredEnv`, all those environment variables will need to be defined. For this reason, we do not recommend using `requiredEnv.


## Default Values

```
{{ env "POSTGRES_USER" | default "postgres" }}
```

An alternative way to express this is with the `coalesce` function (Sprig function).

```
{{ coalesce (env "POSTGRES_USER") "postgres" }}
```

# Usage

First, ensure that the `kubectl` context has been set. If running in `geodesic`, then run:

```
kops export kubecfg
```

(Note, in older versions of `kops` you will need to pass the cluster name, so run `kops export kubecfg $KOPS_CLUSTER_NAME`)

By default, `helmfile` will look for a configuration file called `helmfile.yaml` in your current working directory (`./`). The alternative is to explicitly pass `--file some-path/helmfile.yaml` to specify a non-standard location.

## Arguments

{{% include-code-block title="Helmfile Usage" file="tools/examples/helmfile-usage.txt" %}}



## Example: Sync All Charts

To deploy all charts defined in the `helmfile.yaml`, simply run `helmfile sync`. Typically, we do not run this, however, because a `helmfile.yaml` will define many more charts than installed on the cluster.

## Example: Sync Specific Charts

A `helmfile.yaml` may contain dozens of charts. To target specific charts, just pass the `--selector` argument to `helmfile`. Multiple label constraints can be specified by concatenating them with a `,` (comma). This works like a logical "and".

Alternatively, the `--selector` argument may be passed multiple times which works like a logical "or"; each parameter is resolved independently so a release that matches any parameter will be used.

For example, to sync all charts that have the `default: true` label, we would run:

```
helmfile --selector default=true sync
```

To sync all default charts, but exclude one in particular (e.g. `chartmuseum`), we could run something like:

```
helmfile --selector 'default=true,chart!=chartmuseum' sync
```

To sync all default charts *or* `chartmuseum`, we would run:
```
helmfile --selector 'default=true' --selector 'chart=chartmuseum' sync
```

## Example: Helmfile with Chamber

We prefer to use SSM as the system of record for all secrets. To export those secrets as environment variables for usage with helm, run the following command:

```
chamber exec $service -- helmfile sync
```

# References

- [Official Helmfile documentation](https://github.com/roboll/helmfile)
- [Sprig functions documentation](http://masterminds.github.io/sprig/)
- [Helmfiles](https://github.com/cloudposse/helmfiles/tree/master/helmfile.d/)
