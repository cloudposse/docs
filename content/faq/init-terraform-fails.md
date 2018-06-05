---
title: "Running `init-terraform` fails: `Permission denied (publickey)`"
description: "Make sure that your GitHub SSH public key has been added to your geodesic `ssh-agent`"
tags:
- geodesic
- ssh-agent
- terraform
- init-terraform
- tfstate
- terraform-aws-tfstate-backend
- ssh
---

# Question

When running `init-terraform`, it fails while trying to fetch a private github repository.

```
init-terraform
Mounted buckets
Filesystem                 Mounted on
eg-staging-terraform-state /secrets/tf
Initializing modules...
- module.identity
  Getting source "git::git@github.com:cloudposse/terraform-aws-account-metadata.git?ref=tags/0.1.0"
Error downloading modules: Error loading modules: error downloading 'ssh://git@github.com/cloudposse/terraform-aws-account-metadata.git?ref=tags%2F0.1.0': /usr/bin/git exited with 128: Cloning into '.terraform/modules/ce64520f6f20f6ef2bd2674d5f00db4d'...
Warning: Permanently added the RSA host key for IP address '194.31.252.103' to the list of known hosts.
Permission denied (publickey).
fatal: Could not read from remote repository.

Please make sure you have the correct access rights
and the repository exists.
```


# Answer

This usually happens for one of two reasons:

1) The SSH key added to your geodesic `ssh-agent` is not the same one authorized with your GitHub account
2) No SSH keys have been added to your `ssh-agent`

Run `ssh-add -l` to verify the keys are in your `ssh-agent`. Remember, that in geodesic `/localhost` is your `$HOME` directory.
