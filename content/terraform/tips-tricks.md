---
title: "Terraform Tips & Tricks"
description: ""
tags:
  - terraform
  - Tips & Tricks
  - git
---
![Terraform](/assets/a1f105a-terraform.png)

# S3 Bucket Lifecycle Rules

{{% include-code-block title="Example: S3 Bucket Lifecycle Rules" file="terraform/examples/s3-bucket-lifecycle-rules.tf" language="hcl" %}}

For an example of how we use it, check out our [`terraform-aws-s3-log-storage`](https://github.com/cloudposse/terraform-aws-s3-log-storage) module.

{{% dialog type="info" icon="fa fa-book" title="Read More" %}}
- <https://docs.aws.amazon.com/AmazonS3/latest/dev/object-lifecycle-mgmt.html>
- <https://www.terraform.io/docs/providers/aws/r/s3_bucket.html#using-object-lifecycle>
{{% /dialog %}}


# Encrypted S3 Buckets

{{% include-code-block title="Example: Encrypted S3 Bucket" file="terraform/examples/encrypted-s3-bucket.tf" language="hcl" %}}

For an example of how we use it, check out our [`terraform-aws-s3-log-storage`](https://github.com/cloudposse/terraform-aws-s3-log-storage) module.

# Use Pre Commit Hooks for Linting

We strongly urge that all code be linted prior to checking into Git. Running `terraform fmt` on the codebase before committing will accomplish this.

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

![Example of Pre Commit Hook Output](/assets/terraform-git-precommit-hook.png)
