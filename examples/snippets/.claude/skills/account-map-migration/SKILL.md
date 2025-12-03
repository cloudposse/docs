---
name: account-map-migration
description:
  Use when fixing legacy account-map component references. Covers migration from dynamic account-map lookups to static
  account_map variable with Atmos Auth.
---

# Account Map Migration

This implementation is migrating away from the `account-map` component to use Atmos Auth for authentication. Instead of
dynamically looking up account IDs via the account-map component, we use a static `account_map` variable defined in
`stacks/orgs/acme/_defaults.yaml`.

## Key Patterns

- **`account_map_enabled: false`** - Disables the legacy account-map component lookup
- **`account_map` variable** - Static map containing `full_account_map` (account names to IDs),
  `iam_role_arn_templates`, and account name references
- **Dummy `iam_roles` module** in `providers.tf` - Satisfies legacy module dependencies that expect this output

## When You Encounter Legacy References

You may still see references to `account_map` in remote-state configurations that need to be fixed. When creating new
components or fixing existing ones, use the pattern from recently updated components (e.g., `vpc`, `ecr`) that use the
static `account_map` variable instead of the account-map component.

## Reference Implementation

See `components/terraform/vpc/providers.tf` for the current pattern with:

- `account_map_enabled = false`
- Static `account_map` variable usage
- Dummy `iam_roles` module for compatibility
