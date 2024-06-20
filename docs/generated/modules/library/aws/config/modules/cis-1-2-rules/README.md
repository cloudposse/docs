---
title: cis-1-2-rules
sidebar_label: cis-1-2-rules
sidebar_class_name: command
description: cis-1-2-rules
custom_edit_url: https://github.com/cloudposse/terraform-aws-config/blob/main/modules/cis-1-2-rules/README.md
---

# AWS Config Rules for CIS AWS Foundations Benchmark Compliance

This module outputs a map of [AWS Config](https://aws.amazon.com/config) Rules that should be in place as part of acheiving compliance with the [CIS AWS Foundation Benchmak 1.2](https://www.cisecurity.org/cis-benchmarks/#amazon_web_services) standard. These rules are meant to be used as an input to the [Cloud Posse AWS Config Module](https://github.com/cloudposse/terraform-aws-config/tree/main/modules/cis-1-2-rules/../../) and are defined in the rules [catalog](https://github.com/cloudposse/terraform-aws-config/tree/main/modules/cis-1-2-rules/../../catalog).

## Usage

### Which Account(s) Should Rules Be Applied In

In general, these rules are meant to be enabled in every region of each of your accounts, with some exceptions noted below.

### Controls You May Want to Disable

There are some controls that are part of the standard that should be disabled in certain scenarios.

#### CIS AWS Foundations Benchmark Control 2.7: Ensure CloudTrail logs are encrypted at rest using AWS KMS CMKs

When you are using a centralized CloudTrail account, you should only run this rule in the centralized account. The rule can be enabled in the centralized account by setting the `is_logging_account` variable to true and disabled in all other accounts by setting `is_logging_account` to false or omitting it as false is the default value.

#### CIS AWS Foundations Benchmark Controls 1.2-1.14, 1.16, 1.20, 1.22, and 2.5: Global Resources

These controls deal with ensuring various global resources, such as IAM Users, are configured in a way that aligns with the Benchmark. Since these resources are global, there is no reason to have AWS Config check them in each region. One region should be designated as the _Global Region_ for AWS Config and checks for these controls should only be run in that region. This set of checks can be enabled in the _Global Region_ by setting the `is_global_resource_region` to true and disabled in all other regions by setting `is_global_resource_region` to false or omitting it as false is the default value.

### Parameter Overrides

You may also override the values any of the AWS Config Parameters set by the rules from our [catalog](https://github.com/cloudposse/terraform-aws-config/tree/main/modules/cis-1-2-rules/../../catalog) by providing a map of maps to the `parameter_overrides` variable. The example below shows overriding the `MaxPasswordAge` of the `iam-password-policy` rule. The rule defaults to 90 days, while in this example we want to set it to 45 days.

**IMPORTANT:** The `master` branch is used in `source` just as an example. In your code, do not pin to `master` because there may be breaking changes between releases.
Instead pin to the release tag (e.g. `?ref=tags/x.y.z`) of one of our [latest releases](https://github.com/cloudposse/terraform-aws-config/releases).

For a complete example, see [examples/cis](https://github.com/cloudposse/terraform-aws-config/tree/main/modules/cis-1-2-rules/../../examples/cis).

For automated tests of the complete example using [bats](https://github.com/bats-core/bats-core) and [Terratest](https://github.com/gruntwork-io/terratest)
(which tests and deploys the example on AWS), see [test](https://github.com/cloudposse/terraform-aws-config/tree/main/modules/cis-1-2-rules/test).

```hcl
module "cis_1_2_rules" {
  source = "cloudposse/config/aws//modules/cis-1-2-rules"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"


  is_global_resource_region = true
  is_logging_account       = true

  parameter_overrides = {
    "iam-password-policy": {
      "MaxPasswordAge": "45"
    }
  }
}

module "config" {
  source = "cloudposse/config/aws"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"

  create_sns_topic = true
  create_iam_role  = true

  managed_rules = module.cis_1_2_rules.rules
  }
}
```

