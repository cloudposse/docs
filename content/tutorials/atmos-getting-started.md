---
title: "Getting started with Atmos"
description: "Learn what Atmos is and how you can start using it with stacks to simplify your DevOps Automation tasks."
weight: 2
---

## Intro

`atmos` is a SweetOps built tool to make DevOps and Cloud automation easy. It has direct support for automating Terraform, Helm, Helmfile, and Istio. By natively utilizing [stacks]({{< relref "fundamentals/concepts.md#stacks" >}}), `atmos` enables you to effortlessly manage your Terraform and Helmfile [components]({{< relref "fundamentals/concepts.md#components" >}}) from your local machine or in your CI / CD pipelines.

In this tutorial we'll be looking at a simple (albeit contrived) example of automating multiple Terraform components together into a workflow. This will give you some understanding of what `atmos` can do while also giving you some experience with using it at the command line.

## Prerequisites

### Requirements

To accomplish this tutorial, you'll need to have [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) and [Docker](https://docs.docker.com/get-docker/) installed on your local machine. **That's all**.

### Understanding

Prior to starting this tutorial, you should be sure you understand [our various concepts and terminology]({{< relref "fundamentals/concepts.md" >}}) and have gone through [Getting started with Geodesic]({{< relref "tutorials/geodesic-getting-started.md" >}}) as we'll be using Geodesic as our means to run `atmos`.

## Tutorial

### 1. Clone the tutorials repository

As part of this tutorial (and others in our tutorial series), we'll be utilizing [our tutorials repository](https://github.com/cloudposse/tutorials). This repository includes code and relevant materials for you to use alongside this tutorial walk through.

Let's clone it to your local machine:

```bash
git clone git@github.com:cloudposse/tutorials.git
```

Now that is on your local machine, let's get into the code that walks us through using `atmos`:

```bash
cd tutorials/02-atmos
```

### 2. Build the image for our tutorial

Now that we've got our code located on your local machine, let's look at our tutorial's example directory:

```
.
├── Dockerfile
├── Makefile
├── README.md
├── components/
└── stacks/
```

Here we've got a `Dockerfile` and a few other things going on. Let's pop open that `Dockerfile` and look at it quickly:

```Dockerfile
ARG VERSION=0.141.6
ARG OS=alpine
ARG CLI_NAME=atmos

FROM cloudposse/geodesic:$VERSION-$OS

# Geodesic message of the Day
ENV MOTD_URL="https://geodesic.sh/motd"

ENV DOCKER_IMAGE="cloudposse/atmos"
ENV DOCKER_TAG="latest"

# Geodesic banner
ENV BANNER="Atmos Tutorial"

# Install terraform.
RUN apk add -u terraform-0.14@cloudposse
# Set Terraform 0.14.x as the default `terraform`.
RUN update-alternatives --set terraform /usr/share/terraform/0.14/bin/terraform

# Install Atmos
RUN apk add atmos@cloudposse

COPY components/ /components/
COPY stacks/ /stacks/

WORKDIR /
```

Few important pieces to point out here:

1. We're using [Geodesic]({{< relref "reference/tools.md#geodesic" >}}) as our base image. This enables us to provide a consistent, reproducible toolbox to invoke `atmos` from.
1. We're installing the Terraform 0.14 and using that as our default `terraform` executable.
1. We're installing `atmos` as a simple binary via `apk`. This is because `atmos` is built and distributed as a [Cloud Posse linux package](https://github.com/cloudposse/packages).
1. We're copying our `components/` and `stacks/` folder into the image.

Overall, a fairly simple and small set of additions on top of standard Geodesic. To get started using this image, first we have to build it. To do so, we could invoke `docker build` manually, but speed things up we've provided a `make` target to simplify that process:

```bash
# Pull the Cloud Posse build-harness, which provides some additional utilities
# that our `build` target uses.
make init

# Build our local Dockerfile onto out local machines as `cloudposse/atmos:latest`
make build
```

Once our image is built, we're ready to run it!

### 3. Run the `atmos` image

Now that we've built our image, we want to run it as a new geodesic shell so we can work on our example. Let's run the following command to do that:

```bash
docker run -it \
           --rm \
           --volume $HOME:/localhost \
           --volume $PWD/stacks:/stacks \
           --volume $PWD/components:/components \
           cloudposse/atmos:latest \
           --login
```

Now we should have an interactive bash login shell open into our `cloudposse/atmos` image with our home folder, `stacks/`, and `components/` directories all mounted into it. To check that all is working correctly, let's invoke a couple commands to make sure all is looking good:

```bash
terraform -v # Should return: Terraform v0.14.XX

atmos version # Should return a simple Semver number.
```

Awesome, we've successfully set up `atmos` and we're ready to start using it!

### 4. Terraform plan and apply a component

Now that we've got access to `atmos`, let's do something simple like execute `plan` and `apply` on some terraform code! To do that, we need two things:

1. Components -- We've provided 3 small example components in our `components/terraform/` directory, which is mounted to `/` inside your running container.
1. A Stack configuration -- We've provided a simple example stack located at `stacks/example.yaml`. This is similarly mounted to `/` inside your running container.

For our example in this step, we'll use `components/terraform/fetch-location` component. To plan that component, let's execute the following:

```bash
atmos terraform plan fetch-location --stack=example
```

If you properly entered your command, you should see a successful plan which resulted in "No changes. Infrastructure is up-to-date." You'll notice this first executes a `terraform init` before doing the plan. This is intentional to ensure `atmos` can be invoked without prior project setup. Note, we'll discuss the currently unknown `--stack` parameter shortly.

So now that we've done a plan... let's get this project applied. We could invoke `atmos terraform apply ...`, but our best option at this point would be to invoke `deploy` which will execute a terraform `init`, `plan`, and `apply` in sequential order:

```bash
atmos terraform deploy fetch-location --stack=example
```

Even though this component didn't have any resources, your deploy’s `apply` step will utilize the [`external`](https://registry.terraform.io/providers/hashicorp/external/latest/docs/data-sources/data_source) data source to invoke the component's `fetch_location.sh` script and output your city, region, and country (found by your IP address).

Awesome, we've got a component applied, but that would've been pretty trivial to do without `atmos`, right? We consolidated down 3 commands into one which is great, but we can do a lot better... Let's show you where `atmos` really provides value: Workflows.

### 5. Invoke an Atmos Workflow

The SweetOps methodology is built on small, composable components because through experience practitioners have found large root modules to become cumbersome: They require long `plan` times, create large blast radiuses, and don't foster reuse. The tradeoff with smaller root modules (components) however is that you then need to orchestrate them in an order that makes sense for what you're building. That is where `atmos` workflows come in. Workflows enable you to describe the ordering of how you want to orchestrate your terraform or helmfile components so that you can quickly invoke multiple components via one command. Let's look at an example in our `/stacks/example.yaml` file:

```yaml
import: []
vars: {}

terraform:
  vars: {}

helmfile:
  vars: {}

components:
  terraform:
    fetch-location:
      vars: {}

    fetch-weather:
      vars:
        api_key: 2a820d40d573758aa714641fc331e897

    output-results:
      vars:
        print_users_weather_enabled: true

  helmfile: {}

workflows:
  deploy-all:
    description: Deploy terraform projects in order
    steps:
      - job: terraform deploy fetch-location
      - job: terraform deploy fetch-weather
      - job: terraform deploy output-results
```

Here we can see our first stack, so let's break this file down to help understand what it is doing:

1. We've got a couple empty elements at the top: `import` and `vars`. We'll address these in an upcoming tutorial.
1. We've got `terraform` and `helmfile` elements that have empty `vars` elements. These provide any shared configuration variables across components when dealing with more complicated stacks. We'll address these in an upcoming tutorial as well.
1. We've got our `components` element which has `terraform` and `helmfile` elements. This is where we describe our various components that make up our stack and the input configurations that we want to invoke them with (via their `vars` elements). You can see here we have our 3 terraform components from within our `components/terraform/` folder specified here and some configuration to go along with them.
1. Finally, we've got our `workflows` element. This is a `map` type element that accepts a workflow name as the key and then the description and steps as values. In the example `deploy-all` workflow, our steps are `job` items which describe to `atmos` that we want to run `atmos terraform deploy` on each component in our stack.

To sum it up, our stack represents an environment: It describes the components we need to deploy for that environment, the configuration we want to supply to those components, and finally the ordering of how to orchestrate those components. This is immensely powerful as it enables us to provide one source of truth for what goes into building an environment and how to make it happen.

Now that we know what is in our `example.yaml` stack configuration, let's invoke that workflow:

```bash
atmos workflow deploy-all -s example
```

This will run our various steps through `atmos` and you should see the sequential `init`, `plan`, and `apply` of each component in the workflow to output the current weather for your area. We hope it's sunny wherever you're at 😁 🌤

Let's move on to updating our code and getting a feel for working a bit more hands on with `atmos` and stacks.

### 6. Update our Stack

One of the critical philosophies that SweetOps embodies is a focus on [improving Day 2+ operations]({{< relref "fundamentals/philosophy.md#optimize-for-day-2-operations" >}}) and with that in mind, it's important to know how you would update this stack and utilize `atmos` to make those changes. Luckily, that's as simple as you might think. Let's try it out and update the `stacks/example.yaml` file on our local machines to the following:

```yaml
import: []
vars: {}

terraform:
  vars: {}

helmfile:
  vars: {}

components:
  terraform:
    fetch-location:
      vars: {}

    fetch-weather:
      vars:
        api_key: 2a820d40d573758aa714641fc331e897
        unit_of_measurement: metric # Guess you're from across the pond?

    output-results:
      vars:
        print_users_weather_enabled: false # We disable outputting via Terraform.

  helmfile: {}

workflows:
  deploy-all:
    description: Deploy terraform projects in order
    steps:
      - job: terraform deploy fetch-location
      - job: terraform deploy fetch-weather
      - job: terraform deploy output-results
```

Above we updated a couple variables to change the behavior of our terraform code for this particular stack. Since we mounted our local `stacks/` folder to our `atmos` container via `--volume`, when you save the above stack file docker will update your container's `/stacks/example.yaml` file as well. Now to execute this again... we simply invoke our `deploy-all` workflow command:

```bash
atmos workflow deploy-all -s example
```

This should run through our workflow similar to the way we did it before, but this time we'll see our temperature come back from the weather API in celsius instead of fahrenheit and we'll skip over our terraform `local-exec`'s `printf` command for pretty printing our weather data. Instead we'll just get our updated temperature as one of our `Outputs`.

## Conclusion

Wrapping up, we've seen some critical aspects of SweetOps in action as part of this tutorial:

1. Another usage of Geodesic to easily provide a consistent environment where we can invoke `atmos`.
1. An example stack along with the breakdown of what goes into a stack and why it is a powerful way to describe an environment.
1. Example components that require a specific workflow in order to execute correctly.
1. Usage of `atmos` in executing against some terraform code and orchestrating a workflow from our stack.

With these tools, you can skip documenting the various steps of building an environment (aka WikiOps) and instead focus on just describing and automating those steps! And there is a lot more `atmos` and stack files can do beyond this brief intro, so keep looking around the docs for more usage patterns!

<!-- TODO: Update the above to point at how-tos for Atmos / Stacks -->
