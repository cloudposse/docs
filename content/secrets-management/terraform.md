---
title: "Terraform Secrets Management"
---

Terraform supports 12-factor style environment variables. Thus we prescribe using a combination of terraform environment variables and `chamber`.

# Usage

First, review our documentation on using [`chamber`]() to manage secrets.

## With HCL

To access secrets in

## With `terraform` commands

To use `chamber` with `terraform`, it's pretty straight forward.

Manage the secrets in SSM using the standard chamber commands: `chamber write`, `chamber list`, `chamber delete`.

Execute all `terraform` commands with `chamber exec ...`

For example, to run `terraform plan` using `chamber`, you would run `chamber exec example -- terraform plan` (after replacing `example` with the actual SSM path).
