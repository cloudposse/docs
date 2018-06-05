---
title: Goofys
description: '[Goofys](https://github.com/kahing/goofys) is a high-performance POSIX-like FUSE filesystem for Amazon S3.'
tags:
- apache2
- S3
- KMS
- tools
---

Goofys is similar to the original [`s3fs`](https://github.com/s3fs-fuse/s3fs-fuse) FUSE filesystem, but written in Golang and much, much faster. Also, it works seamlessly with EC2 instance profiles for assumed-roles, which `s3fs-fuse` does not support as of `v1.82`.

The reason why `goofys` is faster is that it implements a subset of the POSIX filesystem semantics. Namely, it only supports `read`, `write` and `append` operations. This makes it suitable for many simple use-cases, but not suitable for running things like a database. We use `goofys` as part of Geodesic to provide our own [`s3fs`]({{< relref "geodesic/s3fs.md">}}) interface for mounting buckets securely inside a container for the purpose of storing master SSH keys needed by EC2 instances.
