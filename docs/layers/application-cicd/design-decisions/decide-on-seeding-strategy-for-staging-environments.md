---
title: "Decide on Seeding Strategy for Staging Environments"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1171947646/REFARCH-423+-+Decide+on+Seeding+Strategy+for+Staging+Environments
sidebar_position: 100
refarch_id: REFARCH-423
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/fundamentals/design-decisions/foundational-release-engineering/decide-on-seeding-strategy-for-staging-environments.md
---

# Decide on Seeding Strategy for Staging Environments

## Problem
Longer-lived staging environments need a dataset that closely resembles production. If this dataset becomes stale, we’ll not be effectively testing releases before they hit production. Restoring snapshots from production is not recommended.

## Considerations
- Should contain anonymized users, invalid email addresses

- No CHD, PHI, PII must be contained in the database

- The scale of data should be close to the production database

- Snapshots from production are dangerous if not anonymized/scrubbed (imagine the risk of sending emails to everyone from your staging env)

- Fixtures are not recommended (scale of data for fixtures usually does not represent production)

- We recommend including the DBA in these conversations.

- QA teams want stable data so that they can run through their test scenarios

## Recommendations

:::caution
Cloud Posse does not have a turnkey solution for seeding staging environments

:::
- ETL pipeline scrubs the data and refreshes the database weekly or monthly. (e.g. AWS Glue, GitHub Action Schedule Job)

