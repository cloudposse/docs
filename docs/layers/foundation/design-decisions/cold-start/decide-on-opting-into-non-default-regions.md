---
title: "Decide on Opting Into Non-default Regions"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1175978007/REFARCH-392+-+Decide+on+Opting+Into+Non-default+Regions
sidebar_position: 100
refarch_id: REFARCH-392
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/fundamentals/design-decisions/cold-start/decide-on-opting-into-non-default-regions.md
---

# Decide on Opting Into Non-default Regions
If a Region is disabled by default, you must enable it before you can create and manage resources. It would be a pre-requisite to deploying anything in the region.

The following Regions are disabled by default:

- Africa (Cape Town)

- Asia Pacific (Hong Kong)

- Asia Pacific (Jakarta)

- Europe (Milan)

- Middle East (Bahrain)

When you enable a Region, AWS performs actions to prepare your account in that Region, such as distributing your IAM resources to the Region. This process takes a few minutes for most accounts, but this can take several hours. You cannot use the Region until this process is complete.

Source: [https://docs.aws.amazon.com/general/latest/gr/rande-manage.html](https://docs.aws.amazon.com/general/latest/gr/rande-manage.html)

## Procedure for enabling a region

If we need to enable the regions, it needs to be done as a manual step and is convenient to do at the same time we set up MFA for the root user of the account. We also at the same time need to edit the STS Global endpoint settings to generate credentials valid in all regions instead of just the default regions. When you enable the regions in the AWS console, you are prompted to do this, so just follow the prompt.

## Related

- [Decide on Primary AWS Region](/reference-architecture/fundamentals/design-decisions/cold-start/decide-on-primary-aws-region)


