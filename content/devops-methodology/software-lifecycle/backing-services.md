---
title: Backing Services
description: ''
---

# Backing Services

This is a hybrid of two types: `Infrastructure as a Code` and `Deployable backing services`.

- Application Backing Services (databases, redis, memcache, sqs)
- Platform Backing Services (support kops like kube2iam, external-dns, ingress)
- Infrastructure Backing Services (support Platform Backing Services, like S3 buckets for kops, IAM roles for external-dns, and kube2iam, etc)

`Deployable backing services` is sort of `Deployable applications` differs from it with manual deployment. Depend of software purpose, one of this types can be missed.

`Backing Services` usually extends the functionality of kubernetes or provide some services for CI/CD and development (example: artifact storage / chartmuseum / external dns / tls certbot )

`Backing Services` stored in the same repo with `Infrastructure as a Code` software. So `Backing Services` does not have independent build, test and release steps. On deploy step `Backing Services` deploys independently from umbrella `Infrastructure as a Code` app.

{{< img src="/assets/70b071a-Process_Loop_-_Backing_Services_-_Page_1.png" title="Backing Services Process loop" >}}
