---
title: "Helm Quick Start"
excerpt: ""
---
Helm is a package manager for kubernetes. 

There are a vast number of public charts available: https://github.com/kubernetes/charts/

[block:callout]
{
  "type": "info",
  "body": "Visit the [Helm Documentation Portal](https://docs.helm.sh/) for excellent documentation",
  "title": "Official Documentation"
}
[/block]

# Values File

Most packages will require some shared secrets. We recommend storing the `values.yaml` in an encrypted S3 bucket. [Geodesic Overview](doc:geodesic) makes this easy using the `s3` command to mount S3 buckets to the local filesystem.

Mount secrets:
```
s3 mount
```

# Searching for Packages

Search package repository for `datadog`

```
helm search datadog
```
#### Installing Github Authorized Keys

Install Github Authorized Keys if you want to enable users to login to the cluster via SSH using their Github Usernames & Github SSH keys.

To install [`github-authorized-keys`](https://github.com/cloudposse/github-authorized-keys/) on all nodes (including master nodes), you can run the following commands.

**NOTE**: The [Kops](doc:kops) `bastion` is not part of the kubernetes cluster, thus `DaemonSets` cannot be deployed to this instance. One alternative is to deploy a [`bastion`](https://github.com/cloudposse/charts/tree/master/incubator/bastion) helm chart.

Simply run,
```
source /secrets/github
helm install --name ghk --namespace=kube-system \
  --set "githubAPIToken=${GITHUB_API_TOKEN}" \
  --set "githubOrganization=${GITHUB_ORGANIZATION}" \
  --set "githubTeam=${GITHUB_TEAM}" \
    "cloudposse-incubator/github-authorized-keys"
```

View all settings:
```
helm get values ghk
```

Now you can edit those values by running:
```
helm edit ghk
```