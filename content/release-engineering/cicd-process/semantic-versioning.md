---
title: "Step 2: Generate Semantic Versions"
description: "Automatically generate semantic versions based on git tag/branch and commit hash (sha)."
weight: 2
---

[Semvers]({{< relref "development/semver.md" >}}) allow us to deploy applications that remain stable despite a constantly changing and evolving web of dependencies. Everytime we build a docker image or helm chart, we want to use strict version pinning so that dependent services (e.g. helm charts) can reference them. Using this strategy we may rest assured that our applications can be safely deployed at any point in the future without worrying about dependencies.

# Dependency

* [Build Harness]({{< relref "release-engineering/build-harness.md" >}})

# Examples

{{% include-code-block title="Generate Semantic Versions using Build Harness" file="release-engineering/cicd-process/examples/init-variables-codefresh.yaml" language="yaml" %}}
