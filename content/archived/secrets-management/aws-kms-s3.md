---
title: "AWS KMS+S3 File Storage"
description: "AWS KMS+S3 is a method providing encrypted object storage."
tags:
- AWS
- KMS
- SSM
- Goofys
---

The AWS KMS+S3 pattern involves provisioning an S3 bucket which enforces encryption at rest together with KMS.

{{% include-code-block title="Provision an Encrypted Bucket with Terraform" file="secrets-management/examples/encrypted-bucket.tf" language="hcl" %}}

In geodesic, we use this together with [`goofys`]({{< relref "tools/goofys.md" >}}) and our [`s3fs`]({{< relref "geodesic/s3fs.md" >}}) wrapper scripts to mount the encrypted bucket to a local mount point inside the geodesic container. This is an awesome solution for securely storing file-based secrets (e.g. ssh master keys).
