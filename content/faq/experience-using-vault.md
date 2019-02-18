---
title: "Do you have experience with HashiCorp Vault?"
description: "To date, we haven't used HashiCorp Vault in a production setting."
tags:
- HashiCorp
- Vault
- production
---

## Question

Do you have experience deploying and managing HashiCorp Vault?

## Answer

To date, we haven't used HashiCorp Vault in a production setting, because automatic unsealing was non-trivial. Additionally, a full reboot of the Vault tier would lead to a forced outage of everything, unless a human operator is able to unseal the Vault.

However, at HashiConf 2018, it was announced that this enterprise feature was coming to the community edition. We’re definitely  open to supporting it once that happens.
