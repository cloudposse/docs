---
title: "Is it safe to assume significant duplication between the staging and production infrastructure repositories?"
description: "Yes, there will be a mirror image in the staging account."
tags:
- duplication
- staging
- production
- infrastructure
- repositories
---

## Question

Is it safe to assume significant duplication between the staging and production infrastructure repositories? For example, as we roll out new resources, will we need to commit & roll them out to both repositories/environments completely & separately, every time?


## Answer

Yes, there will be a mirror image in the staging account. There may be some confusion per our Codefresh demo, whereby there were two git organizations (one for staging & development, one for prod). This is typically not how we do things, but was required by the customer.

We do recommend production vs. staging Docker registries. When doing this, we recommend pushing tagged releases to both registries. However, development and staging only goes to one registry.
