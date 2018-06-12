---
title: "Step 1: Initialize all Environment Variables"
description: ""
weight: 1
tags:
- cicd
- codefresh
---

A CI/CD pipeline usually depends on a number of predefined environment variables. There are a few ways to define these variables. For example, some of them can be set at the CI/CD platform level, [secrets should be set in `chamber` ]({{< relref "secrets-management/cicd.md" >}}), while other values should be set directly in the `codefresh.yml` configuration.

See the [Codefresh shared configuration](https://g.codefresh.io/account/shared-config) documentation for an example.

Our "best practice" is to store all *non-secrets* directly in the `codefresh.yml` configuration file. This solution allows us to easily keep track of the history with `git` as values change over time and let them vary by branch. To accomplish this, set all the predefined values in a step called `init_variables` that calls `cf_export` to pass them to subsequent steps.

# Dependencies

*None*

# Examples

{{% include-code-block title="Init variables with Codefresh" file="release-engineering/cicd-process/examples/init-variables-codefresh.yaml" language="yaml" %}}
