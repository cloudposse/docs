---
name: atmos-authentication
description:
  Use when authenticating with AWS via Atmos. Covers ATMOS_PROFILE setup, SSO login, and how Atmos automatically assumes
  the correct identity per stack.
---

# Atmos Authentication

Atmos Auth handles AWS authentication automatically based on your profile and the target stack.

## Quick Start

```bash
# Set your profile (required for all atmos commands)
export ATMOS_PROFILE=devops  # or: developers, managers

# Run commands - Atmos auto-selects the correct identity per stack
# If not authenticated, this will automatically launch the IDP to sign in
atmos terraform plan vpc -s plat-use2-dev
```

## How It Works

1. **Set your profile**: `export ATMOS_PROFILE=<profile-name>` (or prefix each command)
2. **Run commands**: Atmos automatically assumes the correct identity for each stack based on the stack name. If you're not authenticated or credentials have expired, Atmos will automatically launch the IDP to sign in.

When you run `atmos terraform plan <component> -s <stack>`, Atmos:

1. Renders all stack config, then determines the default identity for the stack
2. If there's a single default identity (e.g., `plat-dev/terraform`), it's selected automatically
3. If multiple identities are marked as default, you'll be prompted to select one
4. Looks up that identity name in your profile to get the actual credentials
5. Assumes the configured Permission Set or IAM role
6. Runs the Terraform command with those credentials

We intentionally set only a single default identity per stack to avoid prompts.

## Identity Configuration

Each stack defines its default identity in its `_defaults.yaml` file:

```yaml
# stacks/orgs/acme/plat/dev/_defaults.yaml
auth:
  identities:
    plat-dev/terraform:
      default: true
```

This is simple YAML configuration - no special Atmos magic. The identity name (`plat-dev/terraform`) is then resolved
by your profile to determine the actual AWS credentials to use.

## Manual Authentication

You don't need to authenticate separately before running Atmos commands - authentication happens automatically when needed.
However, if you want to pre-authenticate a session or refresh expired credentials, use:

```bash
atmos auth login --provider acme-sso  # Triggers browser SSO login
```

Once authenticated, credentials are cached and subsequent commands work automatically.

## Profiles

Profiles are defined in `profiles/<profile-name>/atmos.yaml`. Each maps identities to Permission Sets:

| Profile      | Core Accounts        | Platform Dev/Sandbox | Platform Staging/Prod |
| ------------ | -------------------- | -------------------- | --------------------- |
| `devops`     | TerraformApplyAccess | TerraformApplyAccess | TerraformApplyAccess  |
| `developers` | TerraformStateAccess | TerraformApplyAccess | TerraformPlanAccess   |
| `managers`   | TerraformStateAccess | TerraformPlanAccess  | TerraformPlanAccess   |

**Permission Set capabilities:**

- `TerraformApplyAccess` - Full plan and apply
- `TerraformPlanAccess` - Plan only (no apply)
- `TerraformStateAccess` - Read state only (for cross-account references)

## Identity Naming Convention

Identities follow the pattern: `<tenant>-<stage>/terraform`

Examples:

- `plat-dev/terraform` - Platform dev account
- `core-auto/terraform` - Core automation account
- `plat-prod/terraform` - Platform production account

## Special Cases

**superadmin profile**: IAM user with MFA for breakglass access. Avoid unless SSO is unavailable.

**github profile**: OIDC-based authentication for CI/CD pipelines. Not for interactive use.

## Troubleshooting

If authentication fails:

1. Verify `ATMOS_PROFILE` is set: `echo $ATMOS_PROFILE`
2. Re-authenticate with the provider: `atmos auth login --provider acme-sso`
3. Check you have the required Permission Set in AWS IAM Identity Center
4. Verify the identity exists in `profiles/$ATMOS_PROFILE/atmos.yaml`

## Debugging

Enable debug logging to see detailed output:

```bash
ATMOS_LOGS_LEVEL=debug atmos terraform plan <component> -s <stack>
```

Inspect the rendered configuration (final YAML after all imports and merges):

```bash
atmos describe stacks                            # Describe all stacks (large output)
atmos describe component <component> -s <stack>  # Describe a single component
```

The `describe` commands output the fully-resolved YAML configuration, which is useful for:

- Debugging variable values and inheritance
- Seeing which vars come from catalog vs stack overrides
- Verifying `!terraform.state` references resolve correctly

Reset local Terraform state and cached configuration to start fresh:

```bash
atmos terraform clean <component> -s <stack>
```

This destroys the local `.terraform` directory and any rendered configuration files, useful when:

- Provider versions are out of sync
- Module cache is corrupted
- You want to force re-initialization
