---
title: "Generate versioning step"
description: ""
weight: 2
---

An Artifacts that are the result of CI/CD build should be stored and versioned
allow to address them in other CI/CD pipelines builds.

[Semantic versioning standard](https://semver.org/) helps to reduce entropy of
[dependency hell](https://en.wikipedia.org/wiki/Dependency_hell)

Managing `SemVer` manualy is too complex for developers, so we should automate it.
We use `Git` as a system of record and generate versions based on it's history.

There are several tools that use this approach:
* [GitVersion](https://github.com/GitTools/GitVersion)
* [Build Harness]({{< relref "release-engineering/build-harness.md" >}})

# Dependency

None

# Examples

{{% include-code-block title="Generate versions with Codefresh" file="release-engineering/cicd-process-steps/examples/init-variables-codefresh.yaml" language="yaml" %}}
