---
title: "New Major Release of Geodesic"
description: "This release rips out the complicated dependencies on `Makefiles` that wrapped `helm` and `kops`. "
publishDate: "2018-03-31 19:47:11"
tags:
- geodesic
- goofys
- aws-vault
---
Geodesic is the fastest way to get up and running with a rock solid, production grade cloud platform leveraging best-of-breed Open Source tools.

This release rips out the complicated dependencies on `Makefiles` that wrapped `helm` and `kops`. Our new philosophy is to "Keep things simple, stupid" and not try to wrap all commands under one umbrella.

New with this release:
- `aws-vault` to manage sessions
- `fstab` to mount S3 buckets with `goofys`
- `/localhost` maps to caller's `$HOME` directory
