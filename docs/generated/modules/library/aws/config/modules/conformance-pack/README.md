---
title: conformance-pack
sidebar_label: conformance-pack
sidebar_class_name: command
description: conformance-pack
custom_edit_url: https://github.com/cloudposse/terraform-aws-config/blob/main/modules/conformance-pack/README.md
---

# AWS Config Conformance Pack

This module deploys a [Conformance Pack](https://docs.aws.amazon.com/config/latest/developerguide/conformance-packs.html). A conformance pack is a collection of AWS Config rules and remediation actions that can be easily deployed as a single entity in an account and a Region or across an organization in AWS Organizations.Conformance packs are created by authoring a YAML template that contains the list of AWS Config managed or custom rules and remediation actions.

The Conformance Pack cannot be deployed until AWS Config is deployed, which can be deployed using the [root module](https://github.com/cloudposse/terraform-aws-config/tree/main/modules/conformance-pack/../../) of this repository.

## Usage

**IMPORTANT:** The `master` branch is used in `source` just as an example. In your code, do not pin to `master` because there may be breaking changes between releases.
Instead pin to the release tag (e.g. `?ref=tags/x.y.z`) of one of our [latest releases](https://github.com/cloudposse/terraform-aws-config/releases).

For a complete example, see [examples/hipaa](https://github.com/cloudposse/terraform-aws-config/tree/main/modules/conformance-pack/../../examples/hipaa).

For automated tests of the complete example using [bats](https://github.com/bats-core/bats-core) and [Terratest](https://github.com/gruntwork-io/terratest)(which tests and deploys the example on AWS), see [test](https://github.com/cloudposse/terraform-aws-config/tree/main/modules/conformance-pack/test).

```hcl
module "hipaa_conformance_pack" {
  source = "cloudposse/config/aws//modules/conformance-pack"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"

  name = "Operational-Best-Practices-for-HIPAA-Security"

  conformance_pack="https://raw.githubusercontent.com/awslabs/aws-config-rules/master/aws-config-conformance-packs/Operational-Best-Practices-for-HIPAA-Security.yaml"
  parameter_overrides = {
    AccessKeysRotatedParamMaxAccessKeyAge = "45"
  }

  depends_on = [
    module.config
  ]
}

module "config" {
  source = "cloudposse/config/aws"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"

  create_sns_topic = true
  create_iam_role  = true
}
```

