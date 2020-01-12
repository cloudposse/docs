---
title: "Should prod ↔ staging communication be disallowed?"
description: "Yes, we generally advocate disallowing all forms of connectivity between staging and production environments."
tags:
- production
- staging
- PCI
- SOC
---

## Question

Should we be strictly disallowing prod ↔ staging communication?

## Answer

Yes, generally advocate disallowing all forms of connectivity between staging and production environments. We achieve this by operating multiple AWS accounts and not using VPC peering between them. This is because we do not want to blur the lines between production and staging. It should be extremely difficult/cumbersome to move data out of production, plus this also makes compliance with PCI/SOC easier. Unfortunately we've seen it happen too many times where companies prematurely launch services that have dependencies on staging resources, which is a huge mistake. To avoid this from accidentally happening, make it impossible to connect between environments.
