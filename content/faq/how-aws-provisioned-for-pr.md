---
title: "How are AWS resources provisioned?"
description: "We do not recommend deploying any new AWS resources for Pull Request environments."
tags:
- AWS
- Postgres
- PR
- ElastiCache
---

## Question

How are AWS resources provisioned for Pull Request environments?


## Answer

We do not recommend deploying any new AWS resources for PR environments. 

For example, if the app depends on RDS Postgres, then we deploy Postgres as an ephemeral container. If it depends on ElastiCache Redis, then we deploy Redis as an ephemeral container for the PR. This ensures fully disposable and easily provisioned environments. 

This is also why we run a "pre-production" environment that uses all the standard fully-managed services like RDS and ElastiCache. Since thes is a finite/fixed environment, it works well.

Basically, our goal for integration testing differs based on the type of environment (demo, qa, staging, PR, pre-predocution). For PR environments, our goal is to validate integration with backing services works, not our ability to spin up an RDS database. 
