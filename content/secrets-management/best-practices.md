---
title: "Secrets Management Best Practices"
tags:
- best-practices
- secrets
---

# Security by Design

# Never Share Secrets Between Stages

# Rotate Secrets Frequently

# Automate Key Rotation

# Audit Trails

# Encrypted at Rest

# TLS Everywhere

# MFA Everywhere

Password-based security is not sufficient. Too many passwords have been compromised over the years and aggregated as part of massive rainbow tables which make password cracking much more effective. Othertimes, users simply share passwords with eachother and forget to change them. The best wat to mitigate the usefulness of a credential (e.g. devalue them) is to combine password-based authetnication with multi-factor authentication (MFA). With MFA, when a user goes to authenticate they are required to supply an alternative form of authnetication in addition to entering their passwords. We recommend using push-based MFA combined with geo-fencing as the best way to prevent unauthorized users from accessing corporate data.
