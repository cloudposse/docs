---
title: "Secrets Management"
description: "Secrets management services allow to put all secrets in one place and protect it."
---
Secrets management services allow to put all secrets in one place and protect it.
The goal is to reduce [attack surface](https://en.wikipedia.org/wiki/Attack_surface) and
make secrets management easy.

# Types of Secrets

* _Application Secrets_ - secrets used as part of your application (E.g. API keys, SMTP credentials)
* _Bootstrap Secrets_ - secrets used to provision foundational services of your infrastructure (e.g. Vault keys)
* _Organizational Secrets_ - secrets shared by members of organizations (E.g. shared logins for SaaS)
* _TLS Keys_ - secrets used for client-side encryption (E.g. SSH, Kubernetes APIs)
* _AWS Credentials_ -  secrets used to access AWS services

# Use-cases

There are a number of different use-cases for managing secrets. The ones we'll address in this documentation are specificially:

* [Secrets for Local Development]({{< relref "secrets-management/development.md" >}}) - how to store shared secrets for local development environments (Application Secrets, AWS Credentials)
* [Secrets for Kubernetes]({{< relref "secrets-management/kubernetes.md" >}}) - how to store secrets for consumption by kubernetes services (Application Secrets, AWS Credentials, and Bootstrap Secrets)
* [Secrets for Terraform]({{< relref "secrets-management/terraform.md" >}}) - how to store secrets necessary for provisioning infrastructure using terraform (Bootstrap Secrets, AWS Credentials)
* [Secrets for CI/CD]({{< relref "secrets-management/cicd.md" >}}) - how to store secrets consumed by CI/CD pipelines

# System of Record

The "System of Record" is the authorative source for where secrets are kept. For any given secret, there should be a single "source of truth".

Depending on the underlying technology, there will be a few different systems. For example, we prescribe a combination of [SSM+KMS]({{< relref "secrets-management/aws-kms-ssm.md" >}}) for platform services managed with Chamber, [encrypted S3 buckets]({{< relref "secrets-management/aws-kms-s3.md" >}}) for master private keys, [Kubernetes secrets]({{< relref "secrets-management/kubernetes.md" >}}) for services running within a Kubernetes cluster, and [1Password for Teams]({{< relref "tools/1password.md" >}}) as a last resort for all other secrets.

# API

The API is the interface by which secrets are passed to the underlying system. Whenever possible, we presecribe using the 12-factor style environment variables.

# Key Rotation

Keys should be rotated as often as possible or reasonable. The more frequently keys are rotated, the more the keys are devalued.

# Audit Trails
