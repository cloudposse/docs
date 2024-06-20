---
title: "GuardDuty for EKS"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1265893397/REFARCH-516+-+Enable+GuardDuty+for+EKS+Protection
sidebar_position: 100
refarch_id: REFARCH-516
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/how-to-guides/tutorials/enable-guardduty-for-eks-protection.md
---

# Enable GuardDuty for EKS Protection

## Problem
The new feature, GuardDuty for EKS Protection expands coverage to continuously monitor and profile Amazon Elastic Kubernetes Service (EKS) workload activity to identify malicious or suspicious behavior representing potential threats to container workloads.

## Solution
Enable GuardDuty for EKS Protection in the `security` account via click ops.

:::tip
TL;DR

Under Guard Duty in the AWS Console, go to “Kubernetes Protection” and enable “Kubernetes Audit Logs Monitoring” for both (1) this account **and** for (2) all your active member accounts

:::
<img src="/assets/refarch/screen-shot-2022-02-22-at-10.46.16-am.png" height="372" width="1399" /><br/>

<img src="/assets/refarch/screen-shot-2022-02-22-at-10.46.29-am.png" height="242" width="683" /><br/>

<img src="/assets/refarch/screen-shot-2022-02-22-at-2.13.04-pm.png" height="423" width="1024" /><br/>


