---
title: "Decide on Namespace Abbreviation"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1175388263/REFARCH-53+-+Decide+on+Namespace+Abbreviation
sidebar_position: 100
refarch_id: REFARCH-53
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/fundamentals/design-decisions/cold-start/decide-on-namespace-abbreviation.md
---

# Decide on Namespace Abbreviation

Using a common prefix for all resource names will help establish a consistent naming convention. Certain resources in
AWS are globally unique (e.g. for all customers). In order to maintain an (optimistically) unique naming convention,
prefixing all resources with a namespace goes a long way to ensuring uniqueness.

Shorter the better. Some AWS resource names like S3 bucket names and Elasticache Redis names are restricted to something
like 65 characters.

We recommend a namespace prefix of 2-4 characters. The longer, the more optimistic we can be about avoiding collisions
with other global resources in AWS.

Some strategies we’ve seen is removing all vowels from your company name, or taking the initials for longer company
names.

Examples:

- Intel = `intl`

- Google = `ggl`

- Cloud Posse = `cpco`

:::note It is advised to keep the namespace as short as possible (< 5 chars) because of resources with low max character
limits [AWS Resources Limitations](/reference-architecture/reference/aws/aws-feature-requests-and-limitations)

:::

## References

- [https://github.com/cloudposse/terraform-null-label](https://github.com/cloudposse/terraform-null-label)
