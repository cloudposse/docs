---
title: "Decide on Terraform Version"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1176010868/REFARCH-280+-+Decide+on+Terraform+Version
sidebar_position: 100
refarch_id: REFARCH-280
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/fundamentals/design-decisions/cold-start/decide-on-terraform-version.md
---

# Decide on Terraform Version

## Problem

Terraform versions pre-0.13 were notoriously backwards incompatible. This changed with the 0.13 release and backwards
compatibility is assured for all 1.x releases. Our terraform modules and components strive to be on the latest version,
but with hundreds of modules and components, there’s sometimes a delay before we get the chance to verify support.

## Considerations

:::tip Cloud Posse recommends using the latest 1.x version of terraform

::: Prior to terraform 1.x, the version of terraform was a big deal due to backward compatibility issues between minor
releases.

For customers who’ll need to use terraform versions < 1.0, that’s not a problem. We can support any version of terraform
in our stack configuration format.

## Latest Releases

[https://github.com/hashicorp/terraform/releases](https://github.com/hashicorp/terraform/releases)
