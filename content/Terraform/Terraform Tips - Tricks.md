---
title: "Terraform Tips & Tricks"
excerpt: ""
---
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/a1f105a-terraform.png",
        "terraform.png",
        1210,
        418,
        "#1b1845"
      ]
    }
  ]
}
[/block]

# Use Pre Commit Hooks for Linting

We strongly urge that all code be linted prior to checking into to git. Running `terraform fmt` on the codebase before committing will accomplish this. 

To set this up so that it happens automatically prior to any commit, configure `git` pre-commit hooks using the `pre-commit` utility.
[block:code]
{
  "codes": [
    {
      "code": "brew install pre-commit",
      "language": "shell",
      "name": "OSX Installation"
    }
  ]
}
[/block]
Then run `pre-commit install` in a given terraform repo to configure the hooks. 
[block:code]
{
  "codes": [
    {
      "code": "- repo: git://github.com/antonbabenko/pre-commit-terraform\n  sha: v1.5.0\n  hooks:\n    - id: terraform_fmt\n    - id: terraform_validate_no_variables",
      "language": "yaml",
      "name": ".pre-commit-config.yaml"
    }
  ]
}
[/block]
After setting this up, every time you commit, the `terraform fmt` command will be run to canonicalize your files and a basic smoke test to validate all configurations without requiring required variables to be set.

Any time your commit affects any `*.tf` files, the validator will ensure well-formed terraform code.
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/dd6447a-Screen_Shot_2018-04-02_at_2.46.35_PM.png",
        "Screen Shot 2018-04-02 at 2.46.35 PM.png",
        614,
        159,
        "#454544"
      ]
    }
  ]
}
[/block]