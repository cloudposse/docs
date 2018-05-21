---
title: "S3 Filesystem"
description: "Geodesic provides an easy way for mounting encrypted S3 buckets to the local container."
---

The geodesic base image ships with a number of utility scripts:
- [`s3`](https://github.com/cloudposse/geodesic/blob/master/rootfs/usr/local/bin/s3) - for managing S3 filesystems in `/etc/fstab`
- [`s3fs`] - a thin wrapper around `goofys` for mounting S3 filesystems with a local cache in `/dev/shm`
