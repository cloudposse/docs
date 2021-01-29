---
title: Route 53 Best Practices
description: ''
tags:
  - dns
  - aws
  - best practices
---

- Use very short TTLs on `SOA` records (E.g. 60 seconds or less)
- Delegate Zones to every organization or use dedicated zones per organization (e.g. `cloudposse.com`, `cloudposse.net`, `cloudposse.org`)
- Use `ALIAS` records to map zone apex record to ELBs
