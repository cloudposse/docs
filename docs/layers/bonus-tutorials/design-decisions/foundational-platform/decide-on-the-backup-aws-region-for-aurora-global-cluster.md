---
title: "Decide on the backup AWS region for Aurora Global Cluster"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1175978124/REFARCH-242+-+Decide+on+the+backup+AWS+region+for+Aurora+Global+Cluster
sidebar_position: 100
refarch_id: REFARCH-242
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/fundamentals/design-decisions/foundational-platform/decide-on-the-backup-aws-region-for-aurora-global-cluster.md
---

# Decide on the backup AWS region for Aurora Global Cluster

## Considerations

- Global Aurora Postgres cluster requires at least two regions in which `aws_rds_cluster` are created

- An Aurora global database consists of one primary AWS Region where your data is mastered, and up to five read-only, secondary AWS Regions. Aurora replicates data to the secondary AWS Regions with a typical latency of under a second. You issue write operations directly to the primary DB instance in the primary AWS Region

- Related to this: decide on VPC CIDRs for the main and backup regions

:::info
Consequences of deploying RDS Aurora Global Cluster include:

- Provisioning additional VPC and Aurora clusters in the backup region

- Setting up peering via the transit gateway because write operations go directly to the primary DB instance in the primary AWS Region

:::

### Related

- [Decide on RDS Technology and Architecture](/reference-architecture/fundamentals/design-decisions/foundational-application-dependencies/decide-on-rds-technology-and-architecture)


