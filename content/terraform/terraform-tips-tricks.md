---
title: "Terraform Tips & Tricks"
excerpt: ""
---
![](/assets/a1f105a-terraform.png)

# Use Pre Commit Hooks for Linting

We strongly urge that all code be linted prior to checking into to git. Running `terraform fmt` on the codebase before committing will accomplish this.

To set this up so that it happens automatically prior to any commit, configure `git` pre-commit hooks using the `pre-commit` utility.

##### OSX Installation
```shell
brew install pre-commit
```

Then run `pre-commit install` in a given terraform repo to configure the hooks.

##### .pre-commit-config.yaml
```yaml
- repo: git://github.com/antonbabenko/pre-commit-terraform
  sha: v1.5.0
  hooks:
    - id: terraform_fmt
    - id: terraform_validate_no_variables
```

After setting this up, every time you commit, the `terraform fmt` command will be run to canonicalize your files and a basic smoke test to validate all configurations without requiring required variables to be set.

Any time your commit affects any `*.tf` files, the validator will ensure well-formed terraform code.
![](/assets/dd6447a-Screen_Shot_2018-04-02_at_2.46.35_PM.png)
