# Usage for docs-collator

Docs collation tools works for 2 types of projects:
- components - `cloudposse/terraform-aws-component` - components from single repo `cloudposse/terraform-aws-component` under `modules/` dir 
- modules - `cloudposse/terraform-*` - for all public (non archived) repos except `cloudposse/terraform-aws-component` that are prefixed with `terraform-`

Python is used for both tools so make sure to install python requirements.

### Install python requirements

```bash
pip install -r scripts/docs-collator/requirements.txt
```

### Render docs components

```bash
./scripts/render-docs-for-components.sh
```

### Render docs for modules

Since this script uses Github API - access token should be set as env var.

```bash
export PUBLIC_REPO_ACCESS_TOKEN=<github-api-token>

./scripts/render-docs-for-modules.sh
```
