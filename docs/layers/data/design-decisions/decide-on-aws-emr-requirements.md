---
title: "Decide on AWS EMR Requirements"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1204125709/REFARCH-490+-+Decide+on+AWS+EMR+Requirements
sidebar_position: 100
refarch_id: REFARCH-490
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/fundamentals/design-decisions/foundational-application-dependencies/decide-on-aws-emr-requirements.md
---

# Decide on AWS EMR Requirements

## Problem
We need to document the requirements for the EMR cluster.

## Context
If EMR is presently deployed, the best course of action is to replicate the settings you have (share these details if that’s the case).

## Considered Options
A list of applications for the cluster. Currently supported options are: Flink, Ganglia, Hadoop, HBase, HCatalog, Hive, Hue, JupyterHub, Livy, Mahout, MXNet, Oozie, Phoenix, Pig, Presto, Spark, Sqoop, TensorFlow, Tez, Zeppelin, and ZooKeeper (as of EMR 5.25.0).

For a full list of supported options, review the EMR module.

## References
- [https://github.com/cloudposse/terraform-aws-emr-cluster#inputs](https://github.com/cloudposse/terraform-aws-emr-cluster#inputs)

