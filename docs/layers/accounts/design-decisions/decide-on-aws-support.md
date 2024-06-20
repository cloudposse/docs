---
title: "Decide on AWS Support"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1172078774/REFARCH-417+-+Decide+on+AWS+Support
sidebar_position: 100
refarch_id: REFARCH-417
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/fundamentals/design-decisions/cold-start/decide-on-aws-support.md
---

# Decide on AWS Support
AWS Support is always enabled on a per-account basis. With an AWS Enterprise Agreement, AWS support is already included from a billing perspective for all accounts, but it still needs to be enabled on a per-account basis.

:::caution
Cross-account support is not provided by AWS. AWS Support will not address support questions that affect one account, from another account’s support subscription.

See [https://aws.amazon.com/premiumsupport/faqs/#Cross-account_support](https://aws.amazon.com/premiumsupport/faqs/#Cross-account_support)

:::

If no Enterprise Agreement, then at a minimum we recommend enabling Business-level support in the root account, which should cost roughly $100/mo (since nothing else runs in the root account). This enables us to expedite requests so that organizational limits may be raised (e.g. member accounts). Without paid support, requests may take several days and are more likely to be denied.

For the latest pricing, go to [https://aws.amazon.com/premiumsupport/plans/](https://aws.amazon.com/premiumsupport/plans/)

## Sample Pricing

<img src="/assets/refarch/image-20220713-003707.png" height="675" width="1672" /><br/>


