---
title: "Decide on Secrets Management Strategy for Terraform"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1175355661/REFARCH-81+-+Decide+on+Secrets+Management+Strategy+for+Terraform
sidebar_position: 100
refarch_id: REFARCH-81
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/fundamentals/design-decisions/cold-start/decide-on-secrets-management-strategy-for-terraform.md
---

# Decide on Secrets Management Strategy for Terraform
We need to decide where secrets will be kept. We’ll need to be able to securely store platform integration secrets (e.g. master keys for RDS, HashiCorp Vault unseal keys, etc) as well as application secrets (any secure customer data).

One consideration is that a self-hosted solution won’t be available during cold-starts, so a hosted/managed solution like ASM/SSM is required.

- e.g. Vault deployed as helm chart in each tenant environment using KMS keys for automatic unsealing (this chart already exists)

- SSM Parameter Store + KMS for all platform-level secrets used by `infrastructure` and `terraform`

- AWS Secrets Manager supports automatic key rotation which almost nothing other than RDS supports and requires applications to be modified in order to use it to the full extent.

## Related

- [Use SSM over ASM for Infrastructure](/reference-architecture/reference/adrs/use-ssm-over-asm-for-infrastructure)

- [Decide on 1Password Strategy](/reference-architecture/fundamentals/design-decisions/cold-start/decide-on-1password-strategy)


