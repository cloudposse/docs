---
title: "How are AWS resources provisioned?"
description: "We do not deploy any new AWS resources for PR environments."
tags:
- AWS
- Postgres
- PR
- ElastiCache
---

## Question

How are AWS resources provisioned for PR environments?


## Answer

We do not deploy any new AWS resources for PR environments. For example, if the app depends on RDS Postgres, then we deploy Postgres as a container. If it depends on ElastiCache Redis, then we deploy Redis as a container for the PR. This ensures fully disposable and easily provisioned environments. It's also why we run a pre-production"environment that uses all managed services like RDS and ElastiCache. Since this is a finite/fixed environment, it works well.
