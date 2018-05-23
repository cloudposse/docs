---
title: "Terraform Secrets Management"
---

Terraform supports 12-factor style environment variables. Thus we prescribe using a combination of terraform environment variables and `chamber`.

# Usage

First, review our documentation on using [`chamber`]({{< relref "tools/chamber.md" >}}) to manage secrets.

## Access Secrets from HCL

To access secrets within terraform code, simply refer to a variable. Do not set a `default` value to enforce that the value come from the environment.

```hcl
variable "POSTGRES_PASSWORD" {
  description = "Master password for Postgres database"
}
```

Since `chamber` will export all environment variables as strictly upper case, make sure that you define all variables in terraform in upper case as well. This also serves as a nice convention to follow because it communicates which variables should come from the environment.

When setting the variables with `chamber write`, make sure you prefix all variables with `TF_VAR_`. This will ensure they are properly exported in a way that `terraform` will read them. For example, if you have a HCL variable called `POSTGRES_PASSWORD`, then the chamber environment variable should be named `TF_VAR_POSTGRES_PASSWORD`.

## Use Chamber with `terraform` Commands

To use `chamber` with `terraform`, it's pretty straightforward.

Manage the secrets in SSM using the standard chamber commands: `chamber write`, `chamber list`, `chamber delete`.

Execute all `terraform` commands with `chamber exec ...`

For example, to run `terraform plan` using `chamber` with the `example` namespace, you would run `chamber exec example -- terraform plan` (after replacing `example` with the actual SSM path).

It should also be noted that you can pass multiple namespaces. This provides a nice way of inheriting settings and scoping IAM permissions.
