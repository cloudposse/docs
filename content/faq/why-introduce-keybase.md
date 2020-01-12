---
title: "Why introduce Keybase?"
description: "Keybase makes it very easy for users to practice good security, plus it gets people in the habit of using/understanding PGP early."
tags:
- Keybase
- AWS
- Terraform
- PGP
---

## Question

Why introduce Keybase?


## Answer

The only way to add user accounts programmatically on AWS using Terraform is by encrypting their password using a PGP key. This gets messy quickly. Users suck at PGP, because it’s complicated by design and seldom used daily. We promote Keybase because it makes this process easy. Not only that, but Terraform provides out-of-the-box Keybase support by looking up the username’s public key and passing it to AWS when creating the user.

Here's an [example.](https://github.com/cloudposse/root.cloudposse.co/blob/master/conf/users/osterman.tf#L4)

Keybase makes it very easy for users to practice good security, plus it gets people in the habit of using/understanding PGP early. We recommend incorporating Keybase as part of the device-provisioning process implemented by your organization’s IT team.
