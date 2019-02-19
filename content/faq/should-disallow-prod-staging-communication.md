---
title: "Should prod ↔ staging communication be disallowed?"
description: "Without knowing your product, we would generally (100%) advocate disallowing all forms of connectivity between staging and production environments."
tags:
- production
- staging
- PCI
- SOC
---

## Question

Should we be strictly disallowing prod ↔ staging communication?

## Answer

Yes, without knowing your product, we would generally (100%) advocate disallowing all forms of connectivity between staging and production environments. Do not blur the lines. It should be extremely difficult/cumbersome to move data out of production to make compliance with PCI/SOC easier.
