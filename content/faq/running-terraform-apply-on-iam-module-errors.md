---
title: "Running terraform apply on iam module errors with: The security token included in the request is invalid status code: 403"
description: "This is normally an issue with a bad aws-vault session"
tags:
- aws-vault
- terraform
- geodesic
- aws
- assumed-roles
---

# Question

Running terraform apply on iam module errors with: 
```
The security token included in the request is invalid status code: 403
```

# Answer

This is normally an issue with a bad aws-vault session. While we don't know what the root-cause is, deleting the offending sessions from the `.awsvault` sessions directory usually clears up the problem. 

```
find ~/.awsvault/ -name '* session *' -delete
```

(Also, if running in geodesic, use `/localhost/.awsvault/` instead of `~/.awsvault`)

If that still doesn't fix the problem, you can run to delete the entire `.awsvault` folder and reinitialize the vault.
