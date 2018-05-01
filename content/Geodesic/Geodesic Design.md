---
title: "Geodesic Design"
excerpt: ""
---
# An Opinionated Framework

We designed this shell as the last layer of abstraction. It stitches all the tools together like `make`, `aws-cli`, `kops`, `helm`, `kubectl`, and `terraform`. As time progresses,
there will undoubtedly be even more that come into play. For this reason, we chose to use a combination of `bash` and `make` which together are ideally suited to combine the strengths of all these wonderful tools into one powerful shell, without raising the barrier to entry too high.

For the default environment variables, check out `Dockerfile`. We believe using ENVs this way is both consistent with the "cloud" ([12 Factor Pattern](doc:12-factor-pattern)) way of doing things, as well as a clear way of communicating what values are being passed without using a complicated convention. Additionally, you can set & forget these ENVs in your shell.

# Layout Inside the Shell

We leverage as many semantics of the linux shell as we can to make the experience as frictionless as possible.
[block:parameters]
{
  "data": {
    "0-0": "`/etc/profile.d`",
    "0-1": "is where shell profiles are stored (like aliases). These are executed when the shell starts.",
    "1-0": "`/etc/bash_completion.d`",
    "1-1": "is where all bash completion scripts are kept and sourced when the shell starts.",
    "2-0": "`/usr/local/bin`",
    "2-1": "has some helper scripts like `init-terraform` or `s3` to manage `fstab` for remote s3 filesystems.",
    "3-0": "`/etc/motd`",
    "3-1": "is the current \"Message of the Day\"",
    "4-0": "`/etc/fstab`",
    "4-1": "is where we configure the S3 filesystems we should mount",
    "5-0": "`/localhost`",
    "5-1": "is where we house the local state (like your temporary AWS credentials). This is your native `$HOME` directory mounted into the container.",
    "6-0": "`/s3`",
    "6-1": "is where we mount S3 buckets; these files are never written to disk and only kept in memory for security",
    "h-0": "Path",
    "h-1": "Purpose"
  },
  "cols": 2,
  "rows": 7
}
[/block]
You can easily change almost any aspect of how the shell works simply by extending it with [Geodesic Module](doc:module)