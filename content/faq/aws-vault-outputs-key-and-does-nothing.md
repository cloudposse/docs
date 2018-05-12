---
title: "aws-vault outputs `'aws_access_key_id'` message and does nothing"
description: "This is usually because there's a `[default]` section in your `~/.aws/config`"
tags:
- geodesic
- aws-vault
- faq
---

# Question

When calling `aws-vault exec` or using `assume-role` in `geodesic`, a single line is output that simply says:

```
'aws_access_key_id'
```

# Answer

This is usually because there's a `[default]` section in your `~/.aws/config`. Remove that and it should start to work.

