---
title: "Should we operate a separate data environment with special access to production resources?"
description: "Yes, we recommend provisioning an additional AWS account for data processing and analytics."
tags:
- production
- data environment
- AWS
- CDE
---

## Question

Should we consider operating a separate data environment that is granted special access to production resources?


## Answer

Yes, we recommend provisioning an additional AWS account for data processing and analytics. Ideally, some kind of ETL process scrubs the data before shipping it to a non-cardholder data environment (CDE).
