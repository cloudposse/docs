---
title: "Strategy for Infrastructure Integration Testing"
date: "2018-12-14" 
description: "We need a consistent way to test and validate that our infrastructure automation (kops, helm, terraform modules, etc) are working correctly."
weight: 2
---

## Status

**Proposed**

## Context

We maintain 250+ active projects on GitHub. These projects receive a lot of contributions from community members. 

We need a way to test `terraform` modules, `kops` clusters, `helm` charts, `helmfile` deployments, and more generally the functionality of our `geodesic` containers.

To date, we have not done much in the form of automated testing. When we receive contributions from members, someone on our team needs to manually checkout the changes to validate them. This is time consuming and we do not have the engineering resources to scale with the growth in popularity of our Open Source projects.

We have seen approaches to automated testing of terraform.

### Test Kitchen

This is the original testing framework 

### Terratest

[Terratest](https://github.com/gruntwork-io/terratest) is a project by Gruntworks that they use internally for building and running automated tests against terraform modules. 

The project has received immense interest and is engineering-wise a beautiful solution to the problem. By writing the integration tests in Go and compiling them down to a single, cross-architecture/platform binary, the end-user is able to run tests without needing to install the ["kitchen sink"](https://en.wikipedia.org/wiki/Scope_creep) to testing tools.

The problem with this approach is it sets the bar very high for users of `terraform`, many of which do not come from a strict software development background.
The persons who will most of the time run the tests are not the end users of the modules, but the developers of them. Getting started with Go requires a bit of commitment to get it setup and installed. In the end, we feel that this will exclude a large part of our community, which is contrary to our inclusive ethos. 

For an example, let us consider the wildly popular blogging platform of Wordpress.Much of its success was derived from the fact that it made it very easy
for anyone to get started without needing to be a rocketscientist. We should embrace some of those same elements.  

This is also a terraform-centric approach. It does not address our need to test kops, helm, helmfile, etc. We would prefer not to need to develop (5) new
techniques for each tool because that will increase the burden on our contributors to master testing frameworks.

### Bats

Bats stands for the "Bash Automated Testing System". It has been around for many years. While the original maintainers have abandoned the project, there is an active community effort and [official fork](https://github.com/bats-core/bats-core) that is committed to maintaining it (as of 2017-09). 

Bats presents a familiar testing DSL for running adhoc commands using the `bash` shell. This is really nice since it is a general way to test commands 
and outcomes in a largely language/framework agnostic manner. That is, it is not opinionated in the same way as more language-specific testing frameworks. 
Since the tests are just commands wrapped with a simple DSL plus some syntatic sugar, it is easy for anyone who has ever written a shell script to pick it up
in a matter of minutes.

The downside with `bats` is that it is written in `bash`, which is not a *modern* programming language. The underlying code that powers `bats` is complicated
for the uniniated shell programmers. Also, since it is interpreted (not compiled), lots of files/libraries get installed on the system much like a python or ruby app. The tests we write will most likely run commands like `curl` or `jq`, so there are more *native dependencies* that need to be installed. 

Using the `bats` strategy will probably necessistate running tests in a container to avoid needing to install too many native dependecies. 

We noticed that [HashiCorp](https://www.hashicorp.com/) is using `bats-core` for the automated testing of their [`consul-helm`](https://github.com/hashicorp/consul-helm) chart. This is a good example of the verstatility of `bats` for testing.


### Makefile

We could of course use a simple (or not so simple) `Makefile` to run our tests. By default `make` will abort on the first non-zero exit codes recieved by any of the commands. 

The problem with using a general purpose tool like `make` is that it is overloading the purpose of the tool: task running. We would need to develop
our own testing framework and methodology on top of it, which is not our core competency or business differentiator. 

Also, `make` is not a well understood language by developers because a `Makefile` is basically templated shell scrits, so the execution flow is awkward. 

We love `make` and will continue to use it. In fact, we should use it to call our test-suite, just the `Makefile` itself should not be our test-suite.



## Decision

Use [bats-core]() for implementing automated tests.


## Consequences

1. We will add examples to all terraform modules so we can run automated tests against them
2. We will integrate our `test-harness` into the `build-harness` to reduce exta work of integrating tests
3. We will write standard tests for `terraform`, `helm`, etc in the `test-harness` and use them in our modules
4. We will assume tests run in a container (e.g. `cloudposse/test-harness`)

 
