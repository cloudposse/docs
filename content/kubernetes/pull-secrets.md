---
title: "Kubernetes Pull Secrets"
description: ""
---
There are a few ways to handle docker "pull secrets" under kubernetes. One way is specific to how `kops` works, the other is more generalized to kubernetes.

First you'll need to obtain a pull secret from your registry of choice.
e.g. ECR, Docker Hub or [Codefresh](https://codefresh.io/docs/docs/docker-registries/codefresh-registry/).

# Kops Pull Secret

This works by installing a docker config on each master or node. It will be available to all pods on the node by default. This is the easiest solution and is compatible with the kubernetes managed pull secrets.

##  Synopsis

```
kops create secret dockerconfig
```

1. __Create a docker config.__ Create a new docker config, and store it in the state store. Used to configure docker on each master or node (ie. for auth) Use update to modify it, this command will only create a new entry.
2. __Update Cluster__

## Examples

```
  # Create an new docker config.
  kops create secret dockerconfig -f /path/to/docker/config.json \
  --name k8s-cluster.example.com --state s3://example.com

  # Replace an existing docker config secret.
  kops create secret dockerconfig -f /path/to/docker/config.json --force \
  --name k8s-cluster.example.com --state s3://example.com
```



{{% dialog type="info" icon="fa fa-book" title="Read More" %}}
[github.com/kubernetes/kops/blob/master/docs/cli/kops_create_secret_dockerconfig.md](https://github.com/kubernetes/kops/blob/master/docs/cli/kops_create_secret_dockerconfig.md)
{{% /dialog %}}

# Kubernetes

## Create Secret

## Pod Pull Secrets

## Namespace Pull Secrets
