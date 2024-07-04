---
title: "Decide on MFA Solution for AWS Root Accounts"
refarch_id: REFARCH-50
---

# Decide on MFA Solution for AWS Root Accounts

We need an MFA solution for protecting the master AWS accounts. The two most common options are `TOTP` and U2F
(universal authenticator devices).

:::tip Cloud Posse recommends **1Password for Teams** or **1Password for Business**

:::

### 1Password for Teams, 1Password for Business (TOTP) - Recommended

TOTP tokens can be stored in a shared authenticator app like 1Password. This allows sharing of the secret amongst
designated stakeholders. Additionally, using MFA with 1Password (like Duo) protects access to 1Password.

For this reason, Cloud Posse recommends **1Password for Teams** or
[1Password for Business.](https://1password.com/teams/pricing/)

### Yubikey (U2F)

:::danger You cannot have more than one hooked up to an account for the root account credentials, so there’s no way
practical way to manage Yubikeys in a distributed team environment

:::

This is by far the most secure option but comes with a MASSIVE liability. This physical device can be lost, broken, or
damaged. Distributed team environments where the key can not be easily passed around adds to the difficulty of
maintaining continuity when team members are out-of-the-office. Getting locked out of an AWS master account is not fun.
For these reasons, we do not recommend it from a practical security perspective.

### Slack Bots

One option is to hook up a Slack bot to a restricted channel. Using ChatOps, admins can request a token. The nice part
about this is there's a clear audit trail of who is logging in. Also, we recommend a buddy system where each time a code
is requested, a "Buddy" confirms this request to ensure it was merited. For this to be more secure, MFA must be enabled
on Slack.

### Authy

:::danger Does not support shared TOTP credentials

:::

Authy is the original cloud-based authenticator solution. The downside is it doesn't support shared TOTP secrets, so a
shared login must instead be used. This is not recommended.

### LastPass

:::danger Does not support shared TOTP credentials

:::

LastPass is **not** an option. It does not support shared TOTP secrets. Do not confuse this with the ability to
authenticate with **LastPass** using TOTP/Authenticator apps. That's not what we need here.

## Related Tasks

- [REFARCH-62 - Setup Root Account Root Credentials MFA](https://cloudposse.atlassian.net/browse/REFARCH-62)

- [REFARCH-291 - Setup Child Accounts Master Credentials & MFA](https://cloudposse.atlassian.net/browse/REFARCH-291)