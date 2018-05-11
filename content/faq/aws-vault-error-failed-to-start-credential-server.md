---
title: "aws-vault: error: Failed to start credential server"
description: "This is usually caused by another geodesic shell running."
tags:
- geodesic
- aws-vault
- faq
---

# Question

When running `aws-vault` or `assume-role`, I get the following error:

```
aws-vault: error: Failed to start credential server: listen tcp 127.0.0.1:9099: bind: address already in use
```

# Answer

This is usually caused by another geodesic shell running. This happens because aws-vault server can only be run once. Try exiting your other geodesic shell.

