---
title: "aws-vault: error: Failed to get credentials ... aes.KeyUnwrap(): integrity check failed."
description: "This horribly cryptic error message is a cryptographers way of saying \"wrong password\"."
tags:
- aws-vault
- geodesic
- faq
---

# Question

When calling aws-vault exec or attempting to assume-role, I get the following error:

```
Enter passphrase to unlock /conf/.awsvault/keys/:
aws-vault: error: Failed to get credentials for peerstreet (source profile for cp-root-admin): aes.KeyUnwrap(): integrity check failed.
```

# Answer

This horribly cryptic error message is a cryptographers way of saying "wrong password". Just try running the command again, but this time enter the correct password. =)


