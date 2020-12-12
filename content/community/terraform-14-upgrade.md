---
title: Tools for Updating Terraform Modules
description: 'How to update our Terraform modules for Terraform 0.14'
---

## Updating Cloud Posse Terraform modules for Terraform 0.14


We have some tools you can use for updating our Terraform modules to support Terraform 0.14. This should work for any Terraform modules we have published that currently support Terraform 0.12 or later and contain a `context.tf` file. 

- Check out/fork the current version of the Terraform module

- Create a `terraform-0.14-upgrade` branch and check it out: `git checkout -b terraform-0.14-upgrade`

- Run the update: `make tf14-upgrade`

- **Important**: Manually verify the changes to the Terraform code. The scripts are not foolproof. 

- *Optional:* Update any internal label modules to refer to version `0.22.0` of `cloudposse/label/null`

- If you have made any changes, run `make pr/prepare` to rebuild the README

- Check in the changes and open a PR request with the name "Terraform 0.14 upgrade"

- ```
  ## what
  - Upgrade to support Terraform 0.14 and bring up to current Cloud Posse standard
  
  ## why
  - Support Terraform 0.14
  ```

- *Optional:* If the core Terraform provider version did not change, label the PR with "patch"

  - Not all of our repositories have a "patch" label configured. If you need to create the label, here is the the configuration:
    - name: "patch"
    - description: "A minor, backward compatible change"
    - color: "#0e8a16"

- *If you are a Cloud Posse Contributor:* Run the tests by adding a comment "/test all" to the PR

- Fix problems causing tests to fail until they all pass

  - If `validate-codeowners` fails, you will not be able to fix it. Request a review from `cloudposse/admins`

- Post a link to the PR in the #pr-reviews channel of the [SweetOps Slack](https://slack.cloudposse.com/)

