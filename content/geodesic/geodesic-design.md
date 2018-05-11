---
title: Geodesic Design
description: ''
weight: -1
---

# An Opinionated Framework

We designed this shell as the last layer of abstraction. It stitches all the tools together like `make`, `aws-cli`, `kops`, `helm`, `kubectl`, and `terraform`. As time progresses, there will undoubtedly be even more that come into play. For this reason, we chose to use a combination of `bash` and `make` which together are ideally suited to combine the strengths of all these wonderful tools into one powerful shell, without raising the barrier to entry too high.

For the default environment variables, check out `Dockerfile`. We believe using ENVs this way is both consistent with the "cloud" ([12 Factor Pattern]({{< relref "development/12-factor-pattern.md" >}})) way of doing things, as well as a clear way of communicating what values are being passed without using a complicated convention. Additionally, you can set & forget these ENVs in your shell.

# Layout Inside the Shell

We leverage as many semantics of the linux shell as we can to make the experience as frictionless as possible.

| Path                     | Purpose                                                                                                                                    |
|:-------------------------|:-------------------------------------------------------------------------------------------------------------------------------------------|
| `/etc/profile.d`         | is where shell profiles are stored (like aliases). These are executed when the shell starts.                                               |
| `/etc/bash_completion.d` | is where all bash completion scripts are kept and sourced when the shell starts.                                                           |
| `/usr/local/bin`         | has some helper scripts like `init-terraform` or `s3` to manage `fstab` for remote s3 filesystems.                                         |
| `/etc/motd`              | is the current "Message of the Day"                                                                                                        |
| `/etc/fstab`             | is where we configure the S3 filesystems we should mount                                                                                   |
| `/localhost`             | is where we house the local state (like your temporary AWS credentials). This is your native `$HOME` directory mounted into the container. |
| `/s3`                    | is where we mount S3 buckets; these files are never written to disk and only kept in memory for security                                   |

You can easily change almost any aspect of how the shell works simply by extending it with [Geodesic Module](/geodesic/module)
