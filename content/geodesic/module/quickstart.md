---
title: "Quick start"
excerpt: "Get up and running quickly with geodesic"
---
# Prerequisites

* Follow the "Quick Start" for [Local Development Environments]({{< relref "local-dev-environments/quickstart.md" >}})

{{% dialog type="info" icon="fa fa-info-circle" title="Examples" %}}
All examples are based on use cases provided in [Agenda]({{< relref "learn-by-example/agenda.md" >}})
{{% /dialog %}}

# Creating a New Module

## Name New Module

Geodesic new module should have a name. We recommend to follow this pattern ${stage}.${base_host}.
Set the name to `$CLUSTER_NAME` environment variable.

Example: `staging.example.com` - where `${stage} = staging` and `${base_host} = example.com`

## Generate Scaffolding

This will create a new module in your current working directory called `$CLUSTER_NAME`, complete with `Dockerfile` and `Makefile`.

##### create-cluster.sh
```shell
export CLUSTER_NAME=staging.example.com

docker run -e CLUSTER_NAME \
           -e DOCKER_IMAGE=cloudposse/${CLUSTER_NAME} \
           -e DOCKER_TAG=dev \
              cloudposse/geodesic:latest -c new-project | tar -xv -C .
```

# Configure Project

Customize module files as necessary. Edit the `Dockerfile` to reflect your settings. The files are installed to the `$CLUSTER_NAME/` folder. We recommend creating a [GitHub](doc:github) repo to store this configuration.

```
cd $CLUSTER_NAME
```

## Build & Install

Initialize the [Build Harness]({{< relref "release-engineering/build-harness.md" >}})

```
make init
```

Build the docker container

```
make build
```

Install the module as shell

```
make install
```

## Run the shell

The shell can now be easily started any time by simply running `$CLUSTER_NAME`,  which is a shell script in `/usr/local/bin`. Make sure this path is in your `PATH` environment variable.
For more information follow [Use](doc:use)

# Authorize on AWS

Config AWS credentials and roles following [Authorization]({{< relref "aws/iam/authorization.md" >}})

{{% dialog type="warning" icon="fa fa-exclamation-circle" title="Note" %}}
By default, Geodesic uses [AWS Vault]({{< relref "tools/aws-vault.md" >}}) to authorize on AWS so ensure you add source profile name to [AWS Vault]({{< relref "tools/aws-vault.md" >}})
{{% /dialog %}}

## Set default profile in Geodesic Module

Add to you module `Dockerfile` :

```docker
### Default AWS Profile name
ENV AWS_DEFAULT_PROFILE="example-staging-admin"
```

Run `make docker/build` to rebuild module container

{{% dialog type="info" icon="fa fa-info-circle" title="Note" %}}
You can install it on local to do the same for development purpose.
See [AWS Vault]({{< relref "tools/aws-vault.md" >}}) setup.
{{% /dialog %}}
