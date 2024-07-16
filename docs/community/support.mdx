---
title: "FAQ"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1176371788/FAQ
sidebar_position: 100
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/faq.md
---

# FAQ
Here are some quick answers to frequently asked questions. See also our [Troubleshooting](/reference-architecture/reference/troubleshooting) .

## Documentation

### How do I request additional documentation?

Please request documentation via your given team's Slack channel.

### What’s the difference between this documentation and our public documentation?

Our [public documentation](/) is written more generally since we cannot make any assumptions about how the public is using our tools. The reference architecture documentation is more opinionated on how we use our tools, for example, how we layout stacks, components, etc.

## Terraform

### How to upgrade Terraform?

See [How to Switch Versions of Terraform](/reference-architecture/how-to-guides/tutorials/how-to-switch-versions-of-terraform) for a more complete guide.

TL;DR:

- Note the version you want to use
- Make sure the version is available in [cloudposse/packages](https://github.com/cloudposse/packages/pulls?q=terraform) to see if the version desired is in a merged PR for terraform
- Make sure the version is available in Spacelift by editing an existing stack and see if the new version is available
- Update Terraform in `Dockerfile`
- Update Terraform in `.github/workflows/pre-commit.yaml` github action
- Update Terraform in `components/terraform/spacelift/default.auto.tfvars`

### How to use `context.tf`?

Copy this file from `https://github.com/cloudposse/terraform-null-label/blob/master/exports/context.tf` and then place it in your Terraform module to automatically get Cloud Posse's standard configuration inputs suitable for passing to Cloud Posse modules.

```
curl -sL https://raw.githubusercontent.com/cloudposse/terraform-null-label/master/exports/context.tf -o context.tf
```

Modules should access the whole context as `module.this.context` to get the input variables with nulls for defaults, for example `context = module.this.context`, and access individual variables as `module.this.<var>`, with final values filled in.


