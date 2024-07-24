---
title: argocd-repo
sidebar_label: argocd-repo
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/argocd-repo/README.md
tags: [terraform, aws, argocd-repo]
---

# Component: `argocd-repo`

This component is responsible for creating and managing an ArgoCD desired state repository.

## Usage

**Stack Level**: Regional

The following are example snippets of how to use this component:

```yaml
# stacks/argocd/repo/default.yaml
components:
  terraform:
    argocd-repo:
      vars:
        enabled: true
        github_user: ci-acme
        github_user_email: ci@acme.com
        github_organization: ACME
        github_codeowner_teams:
          - "@ACME/cloud-admins"
          - "@ACME/cloud-posse"
        # the team must be present in the org where the repository lives
        # team_slug is the name of the team without the org
        # e.g. `@cloudposse/engineering` is just `engineering`
        permissions:
          - team_slug: admins
            permission: admin
          - team_slug: bots
            permission: admin
          - team_slug: engineering
            permission: push
```

```yaml
# stacks/argocd/repo/non-prod.yaml
import:
  - catalog/argocd/repo/defaults

components:
  terraform:
    argocd-deploy-non-prod:
      component: argocd-repo
      settings:
        spacelift:
          workspace_enabled: true
      vars:
        name: argocd-deploy-non-prod
        description: "ArgoCD desired state repository (Non-production) for ACME applications"
        environments:
          - tenant: mgmt
            environment: uw2
            stage: sandbox
```

```yaml
# stacks/mgmt-gbl-corp.yaml
import:
---
- catalog/argocd/repo/non-prod
```

If the repository already exists, it will need to be imported (replace names of IAM profile var file accordingly):

```bash
$ export TF_VAR_github_token_override=[REDACTED]
$ atmos terraform varfile argocd-deploy-non-prod -s mgmt-gbl-corp
$ cd components/terraform/argocd-repo
$ terraform import -var "import_profile_name=eg-mgmt-gbl-corp-admin" -var-file="mgmt-gbl-corp-argocd-deploy-non-prod.terraform.tfvars.json" "github_repository.default[0]" argocd-deploy-non-prod
$ atmos terraform varfile argocd-deploy-non-prod -s mgmt-gbl-corp
$ cd components/terraform/argocd-repo
$ terraform import -var "import_profile_name=eg-mgmt-gbl-corp-admin" -var-file="mgmt-gbl-corp-argocd-deploy-non-prod.terraform.tfvars.json" "github_branch.default[0]" argocd-deploy-non-prod:main
$ cd components/terraform/argocd-repo
$ terraform import -var "import_profile_name=eg-mgmt-gbl-corp-admin" -var-file="mgmt-gbl-corp-argocd-deploy-non-prod.terraform.tfvars.json" "github_branch_default.default[0]" argocd-deploy-non-prod
```

<!-- prettier-ignore-start -->
<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- hello terraform-docs -->
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- prettier-ignore-end -->

## References

- [cloudposse/terraform-aws-components](https://github.com/cloudposse/terraform-aws-components/tree/main/modules/argocd-repo) -
  Cloud Posse's upstream component



## CHANGELOG

### Components PR [#851](https://github.com/cloudposse/terraform-aws-components/pull/851)

This is a bug fix and feature enhancement update. There are few actions necessary to upgrade.

### Upgrade actions

1. Enable `github_default_notifications_enabled` (set `true`)

```yaml
components:
  terraform:
    argocd-repo-defaults:
      metadata:
        type: abstract
      vars:
        enabled: true
        github_default_notifications_enabled: true
```

2. Apply changes with Atmos

### Features

- Support predefined GitHub commit status notifications for CD sync mode:
  - `on-deploy-started`
    - `app-repo-github-commit-status`
    - `argocd-repo-github-commit-status`
  - `on-deploy-succeded`
    - `app-repo-github-commit-status`
    - `argocd-repo-github-commit-status`
  - `on-deploy-failed`
    - `app-repo-github-commit-status`
    - `argocd-repo-github-commit-status`

#### Bug Fixes

- Remove legacy unnecessary helm values used in old ArgoCD versions (ex. `workflow auth` configs) and dropped
  notifications services

