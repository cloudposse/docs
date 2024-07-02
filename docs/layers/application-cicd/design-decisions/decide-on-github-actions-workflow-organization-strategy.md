---
title: "Decide on GitHub Actions Workflow Organization Strategy"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1171947681/REFARCH-421+-+Decide+on+GitHub+Actions+Workflow+Organization+Strategy
sidebar_position: 100
refarch_id: REFARCH-421
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/edit/main/docs/docs/fundamentals/design-decisions/foundational-release-engineering/decide-on-github-actions-workflow-organization-strategy.md
---

# Decide on GitHub Actions Workflow Organization Strategy

## Problem
GitHub Actions Workflow files scattered in repositories throughout the GitHub organization can quickly violate the DRY principle if they contain repeated code.

## Considerations

### Standardize Workflows Across the Organization

### Metrics and Observability
With appropriate metrics, you’ll be able to answer questions like:

- Are we deploying faster? ...or slowing down?

- What is the stability of our deployments?

See [https://www.datadoghq.com/blog/datadog-github-actions-ci-visibility/](https://www.datadoghq.com/blog/datadog-github-actions-ci-visibility/)

[leanix-poster_17_metrics_to_help_build_better_software-en.pdf](/assets/refarch/leanix-poster_17_metrics_to_help_build_better_software-en.pdf)

[https://www.leanix.net/en/wiki/vsm/dora-metrics](https://www.leanix.net/en/wiki/vsm/dora-metrics)

### Public Actions
Trusted organizations for public actions

Verified organizations for public actions

### Private Actions
Private actions technically require GitHub Enterprise. We can do a workaround for non-enterprise organizations: an explicit `git clone` of a private actions repo.

### Shared Workflows

### Code Reusability
[Composite Actions](https://docs.github.com/en/actions/creating-actions/creating-a-composite-action) can be leveraged to solve that problem. Composite Actions are very similar to GHA workflow files in that they contain multiple steps, some of which can reference open-source Actions. Still, they are not individual workflows but rather actions that another workflow can reference. These Composite Actions thus reduce code repetition within the organization.

### GitHub Script

:::caution
Usage of inline GitHub Scripts are difficult to maintain. They are acceptable inside of dedicated actions, but not recommended as part of workflows.

:::
Some composite actions may utilize the [github-script](https://github.com/actions/github-script) action, resulting in inline Node.js code that lacks any syntax highlighting and can make the composite action YAML file unnecessarily long. A solution for this is to create separate Node.js modules, invoke them within the inline code supplied to `github-script`, and supply the references created by `github-script` and contexts available in GHA workflows to those modules:

```
const actionContext = require('./actions/lib/actioncontext.js')(this, context, core, github, ${{ toJSON(github) }}, ${{ toJSON(inputs) }}, ${{ toJSON(steps) }})
const deployment = require('./actions/lib/deployment.js')(actionContext)

deployment.newDeployment(JSON.parse(`${{ inputs.stages }}`))
```

## Recommendation
- Use a private repository for reusable GitHub workflows (e.g. `acme/github-workflows`)

- Use GitHub Enterprise to support approval steps

- Use Organization `acme/.github` repository with starter workflows

- Use Cloud Posse’s existing workflows to get started quickly

- Use Cloud Posse’s public github actions

- Use a private GitHub actions repository specific to your organization (e.g. `acme/github-actions`)

- Use a private template repository to make it easy for developers to initialize new projects

- Adjust `webhook_startup_timeout` in the chart. This setting is used for automatically scaling
back replicas. The recommended default is 30 minutes, but no one size fits all. Here's further
documentation for your consideration: [scaling runners](https://github.com/actions/actions-runner-controller/blob/master/docs/automatically-scaling-runners.md)

## Related
-  [Decide on Strategy for Continuous Integration](/reference-architecture/fundamentals/design-decisions/foundational-release-engineering/decide-on-strategy-for-continuous-integration)

- [Decide on Self-Hosted GitHub Runner Strategy](/reference-architecture/fundamentals/design-decisions/foundational-release-engineering/decide-on-self-hosted-github-runner-strategy)

- [GitHub Actions](/reference-architecture/reference/github-actions)


