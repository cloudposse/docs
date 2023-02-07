# Usage for docs-collator

Document collation supports 3 types of projects:
- components - `cloudposse/terraform-aws-component` - components from single repo `cloudposse/terraform-aws-component` under `modules/` dir 
- modules - `cloudposse/terraform-*` - for all public (non-archived) repos except `cloudposse/terraform-aws-component` that are prefixed with `terraform-`
- github actions - `cloudposse/github-action-*` - for all public (non-archived) repos that are prefixed with `github-action-`

Python is used for both tools so make sure to install python requirements.

### Install Python Requirements

```bash
pip install -r scripts/docs-collator/requirements.txt
```

### Render Documentation for Terraform Components

```bash
./scripts/render-docs-for-components.sh
```

### Render Documentation for Terraform Modules

Since this script uses the Github API, the GitHub access token should be set as the `PUBLIC_REPO_ACCESS_TOKEN ` environment variable.

```bash
export PUBLIC_REPO_ACCESS_TOKEN=<github-api-token>

./scripts/render-docs-for-modules.sh
```

### Render Documentation for GitHub Actions

This script also uses GitHub API, so the GitHub access token should be set as the `PUBLIC_REPO_ACCESS_TOKEN ` environment variable.

```bash
export PUBLIC_REPO_ACCESS_TOKEN=<github-api-token>

./scripts/render-docs-for-github-actions.sh
```
