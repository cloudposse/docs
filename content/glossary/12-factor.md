---
title: 12-Factor
terms:
- "12f"
- "12-factor"
- "12 factor"
- "12 factor pattern"
- "12-factor pattern"
description: "The 12 Factor Pattern is a software methodology for building cloud-friendly (or cloud-native), scalable, maintainable applications that deploy easily on a Platform-as-a-Service (aka PaaS)."
tags:
  - cloud native
  - heroku
---
The 12-Factor pattern is a language agnostic, “Best Practice” for writing Cloud Native applications that can be easily and consistently deployed using Continuous Integration and Continuous Delivery (“CI/CD”).

The pattern can be summed up as:
- (a) treat all apps as disposable services that receive their configuration via environment variables;
- (b) rely on backing services to provide durability;
- (c) script all changes; and
- (d) treat all environments (dev, prod, qa, etc) as identical.
