---
title: "Do you recommend large batch jobs, streaming pipelines, and interactive Jupyter notebooks be provisioned within the customer-facing `production` account/environment/Kubernetes cluster?"
description: "We think it makes the most sense to create a separate data account and put all of your BI in there."
tags:
- Kubernetes
- Jupyter
- cluster
- BI
---

## Question

Our data team needs to run large batch jobs, streaming pipelines, and interactive Jupyter notebooks. Do you recommend these resources be provisioned within the customer-facing `production` account/environment/Kubernetes cluster?


## Answer

It mainly comes down to PCI/SOC. Companies usually want to reduce scope as much as possible. Putting the Jupyter stuff in the same cluster only makes it more difficult to convince the QSA that you're doing everything possible to product CHD/PII. Therefore, we think it makes the most sense to create a separate data account and put all of your BI in there.
