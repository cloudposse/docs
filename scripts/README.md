# Usage for docs-collator

Docs collation tools works for 2 types of projects:
- `cloudposse/terraform-aws-component` - modules from single repo `cloudposse/terraform-aws-component` under `modules/` dir 
- `cloudposse/terraform-*` - modules for all public (non archived) repos except `cloudposse/terraform-aws-component`

Python is used for both tools so make sure to install python requirements.

### Install python requirements

```bash
pip install -r scripts/docs-collator/requirements.txt
```

### Render docs components for `terraform-aws-components`

```bash
./scripts/render-docs-for-terraform-aws-components.sh
```

### Render docs components for `terraform-*` repositories

Since this script uses Github API - github `ACCESS_TOKEN` should be set as env var.

```bash
export GITHUB_API_TOKEN=<github-api-token>

./scripts/render-docs-for-terraform-projects.sh
```
