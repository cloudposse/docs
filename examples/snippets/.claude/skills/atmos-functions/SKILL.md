---
name: atmos-functions
description:
  Use when wiring cross-component dependencies in stack YAML. Covers !terraform.state syntax for passing outputs between
  components without remote-state lookups.
---

# Cross-Component Dependencies with Atmos Functions

**Preferred approach: Atmos Functions** - Use Atmos template functions in stack YAML to pass values between components
at plan/apply time. This avoids Terraform remote state lookups entirely.

## `!terraform.state` Syntax

Two-parameter form (current stack):

```yaml
!terraform.state <component> <output>
```

Three-parameter form (specific stack):

```yaml
!terraform.state <component> <stack> <output>
```

## Examples

```yaml
components:
  terraform:
    my-component:
      vars:
        # Current stack lookups (component output)
        vpc_id: !terraform.state vpc vpc_id
        subnet_ids: !terraform.state vpc private_subnet_ids

        # Cross-stack lookup (component stack output)
        grafana_role_arn: !terraform.state grafana core-use2-auto workspace_iam_role_arn

        # Nested output with YQ expression
        role_arn: !terraform.state iam-role/my-role plat-use2-dev .role.arn
```

## Best Practices

- **Define lookups in catalog defaults** - Put `!terraform.state` expressions in
  `stacks/catalog/<component>/defaults.yaml` rather than in stack files. The function automatically resolves based on
  the current stack context.
- **Use current-stack lookups when possible** - Omit the stack parameter to look up components in the same stack, making
  configs more portable.
- **Cross-stack lookups for shared resources** - Use the three-parameter form when referencing centralized resources
  (e.g., Grafana in core-auto from plat accounts).

## Legacy Approach (Being Phased Out)

Some older components still use Cloud Posse's `remote-state` Terraform module with `remote-state.tf` files. This pattern
is being phased out in favor of Atmos functions. The tfstate backend is in the core-auto account.

When you encounter `remote-state.tf` files, prefer converting them to `!terraform.state` expressions in the catalog.
