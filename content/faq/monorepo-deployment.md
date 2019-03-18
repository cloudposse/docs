---
title: "Have you deployed applications from a monorepo?"
description: "No, we haven’t dealt with large monorepo architectures."
tags:
- monorepo
- architectures
- Terraform
- polyrepo
---

## Question

Have you deployed applications from a monorepo? What are some of the biggest known risks?


## Answer

No, we haven’t dealt with large monorepo architectures.

Here are some of the known risks:

* We cannot estimate the scope or implications of this change.


* Not all changes may be suitable for automated deployment or rollbacks. For example, by including your Terraform code in the monorepo (and if it is released at the same time as everything else), orchestrating this would be non-trivial. In addition, rollbacks of Terraform should not and cannot be easily orchestrated.


* Rather than having multiple pipelines per project in the polyrepo approach, in the monorepo approach, we'll have fewer pipelines doing more (which means they'll be more complicated).
