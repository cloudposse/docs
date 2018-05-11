---
title: "SignatureDoesNotMatch: Signature expired"
description: "This usually happens due to time drift when running under Docker for Mac"
tags:
- aws-cli
- aws
- aws-vault
- faq
- geodesic
- assume-role
---

# Question

When attempting to `assume-role` or call `aws-vault exec`, it errors with a message like:

```
aws-vault: error: Failed to get credentials for joany (source profile for xxxxx-staging-admin): SignatureDoesNotMatch: Signature expired: 20180405T213414Z is now earlier than 20180405T220101Z (20180405T221601Z - 15 min.)
        status code: 403, request id: ec5b2b11-391e-11e8-8986-bf22dc40d072
```

# Answer

This usually happens due to time drift. If using Docker for Mac, this error is pretty common, especially on laptops which go into sleep or hibernation mode.

Simply run the following command inside your `geodesic` shell to resync the time inside the VM.

```
hwclock -s
```
