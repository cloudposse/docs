# CLAUDE.md

AWS infrastructure repository using Cloud Posse reference architecture with Atmos and OpenTofu. Manages multiple AWS
accounts across core (root, audit, security, identity, network, dns, auto, artifacts) and platform (sandbox, dev,
staging, prod) tenants.

## Commands

**Important:** Always set `ATMOS_PROFILE` when running atmos commands. Use your assigned profile (`devops`, `developers`,
or `managers`).

### Authentication

Atmos authenticates automatically per-stack when running terraform/describe commands. There is no default identity -
each stack determines which identity to use following the `<tenant>-<stage>/terraform` pattern. These identities are
defined in the stack defaults.

If credentials have expired or you haven't authenticated yet, specify the provider from your profile to trigger SSO
login:

```bash
atmos auth login --provider acme-sso  # Triggers browser SSO login
```

Once authenticated, credentials are cached and subsequent commands will work automatically.

### Running Commands

```bash
atmos terraform plan <component> -s <stack>      # Plan a component
atmos terraform apply <component> -s <stack>     # Apply a component
atmos describe component <component> -s <stack>  # Show full config
```

Stack names: `{tenant}-{environment}-{stage}` (e.g., `core-use2-auto`, `plat-use2-prod`)

### Debugging

Enable debug logging to troubleshoot issues:

```bash
ATMOS_LOGS_LEVEL=debug atmos terraform plan <component> -s <stack>
```

Inspect rendered configuration (useful to see final YAML after all imports/merges):

```bash
atmos describe stacks                            # Describe all stacks
atmos describe component <component> -s <stack>  # Describe single component
```

Reset local state and cached configuration:

```bash
atmos terraform clean <component> -s <stack>     # Destroys local .terraform and rendered config
```

## Directory Structure

- `components/terraform/` - Terraform root modules (one per AWS resource type)
- `stacks/catalog/` - Component defaults (org-wide configurations)
- `stacks/orgs/acme/` - Environment stacks by tenant/stage
- `stacks/mixins/` - Reusable YAML fragments (region, stage settings)
- `profiles/` - Auth profiles (superadmin, devops, developers, managers, github-plan, github-apply)

## Key Concepts

- **Components**: Terraform modules in `components/terraform/`. Many vendored from Cloud Posse.
- **Stacks**: YAML in `stacks/orgs/` composing components per environment.
- **Catalog**: Default configs in `stacks/catalog/` inherited by stacks.

## Important Notes

- Uses **OpenTofu** (not Terraform) - `command: "tofu"` in atmos.yaml
- Prefer `!terraform.state` in stack YAML over `remote-state.tf` files
- Prefer existing generic components (`iam-role`, `s3-bucket`, `lambda`) over creating new ones
- Set `account_map_enabled: false` - uses static `account_map` variable, not account-map component

## Skills

Detailed guidance is available in `.claude/skills/`. Use these skills for in-depth instructions:

| Skill                   | Use When                                                                                   |
| ----------------------- | ------------------------------------------------------------------------------------------ |
| `developing-components` | Creating new Terraform components, modifying existing ones, setting up catalog defaults    |
| `developing-stacks`     | Deploying components via Atmos, configuring stacks, inheritance patterns, catalog defaults |
| `atmos-auth`            | Authenticating with AWS, SSO login, troubleshooting permission errors                      |
| `atmos-functions`       | Wiring cross-component dependencies with `!terraform.state` or `!terraform.output`         |
| `debugging-atmos`       | Troubleshooting Atmos errors, inspecting resolved configuration, understanding inheritance |
| `account-map-migration` | Removing account-map dependencies, using static account mappings, updating providers.tf    |