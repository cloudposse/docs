---
title: "Init variables step"
description: ""
weight: 1
---

CI/CD pipeline steps expect to have some predefined variables and constants.
Some of that values can be set on CI/CD platform level.
See [Codefresh shared configuration](https://g.codefresh.io/account/shared-config) for example.

But the Best Practice is to store all non-secret values in code, in pipeline
config file.
This solution allow to see history of values change with git.
Usually all predefined values are grouped in special step - `init variables`

# Dependency

None

# Examples

{{% include-code-block title="Init variables with Codefresh" file="release-engineering/cicd-process-steps/examples/init-variables-codefresh.yaml" language="yaml" %}}
