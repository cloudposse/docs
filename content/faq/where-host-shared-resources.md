---
title: "Where should we host shared resources?"
description: "We recommend deploying a dedicated cluster in a separate account for shared platform services."
tags:
- shared resources
- shared platform services
- Codefresh
- Jira
- CRM
- corp
---

## Question

Is there a recommendation for where we should host shared resources like Keycloak, Jenkins or Teleport?

## Answer

We typically recommend to our customers that we provision a dedicated Kubernetes cluster a separate account for shared platform services. This is a good place to host internally facing services like Codefresh Enterprise, Jira, CRMs, etc. This is what we typlically call the "corp" account (and cluster). 
