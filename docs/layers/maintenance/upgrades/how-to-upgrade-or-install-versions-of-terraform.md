---
title: "Upgrade Terraform"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1221853205/How+to+Upgrade+or+Install+Versions+of+Terraform
sidebar_position: 100
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/how-to-guides/upgrades/how-to-upgrade-or-install-versions-of-terraform.md
---

# How to Upgrade or Install Versions of Terraform

## Problem
You want to install or upgrade to a specific version of terraform, ideally, without affecting anything that needs newer or older versions of terraform.

## Solution

#### Install Desired Version of Terraform
First, make sure you’ve installed the latest version of `terraform` in [Geodesic](/fundamentals/geodesic). Installation instructions will vary depending on if you’re using Alpine, Ubuntu, or CentOS.

We publish special [packages](https://github.com/cloudposse/packages) for terraform to support installing multiple versions simultaneously. We support package pinning going back as far as Terraform 0.11 (remember those days? 😵 ).

:::info
We support installing multiple versions of terraform **without** using a version manager like `tfenv`.

:::
You’ll want to install the desired version of terraform by adding it to the `Dockerfile` for your infrastructure repository.

E.g.

```
RUN apt-get install -y terraform-1
```

 [https://github.com/cloudposse/packages](https://github.com/cloudposse/packages)

### Terraform Releases
[https://github.com/hashicorp/terraform/releases](https://github.com/hashicorp/terraform/releases)

Here’s a list of our supported versions of terraform (these are updated nightly by a [github action](https://github.com/cloudposse/packages/tree/master/.github/workflows))

| |  | |
| ----- | ----- | ----- |
|Terraform 1.x | [https://github.com/cloudposse/packages/tree/master/vendor/terraform-1](https://github.com/cloudposse/packages/tree/master/vendor/terraform-1) | **Ubuntu**: `apt-get install -y terraform-1`<br/>**Alpine**: `apk add terraform-1@cloudposse`|
|Terraform 0.15 | [https://github.com/cloudposse/packages/tree/master/vendor/terraform-0.15](https://github.com/cloudposse/packages/tree/master/vendor/terraform-0.15) | **Ubuntu**: `apt-get install -y terraform-0.15`<br/>**Alpine**: `apk add terraform-0.15@cloudposse`|
|Terraform 0.14 | [https://github.com/cloudposse/packages/tree/master/vendor/terraform-0.14](https://github.com/cloudposse/packages/tree/master/vendor/terraform-0.14) | **Ubuntu**: `apt-get install -y terraform-0.14`<br/>**Alpine**: `apk add terraform-0.14@cloudposse`|
|Terraform 0.13 | [https://github.com/cloudposse/packages/tree/master/vendor/terraform-0.13](https://github.com/cloudposse/packages/tree/master/vendor/terraform-0.13) | **Ubuntu**: `apt-get install -y terraform-0.13`<br/>**Alpine**: `apk add terraform-0.13@cloudposse`|
|Terraform 0.12 | [https://github.com/cloudposse/packages/tree/master/vendor/terraform-0.12](https://github.com/cloudposse/packages/tree/master/vendor/terraform-0.12) | **Ubuntu**: `apt-get install -y terraform-0.12`<br/>**Alpine**: `apk add terraform-0.12@cloudposse`|
|Terraform 0.11 | [https://github.com/cloudposse/packages/tree/master/vendor/terraform-0.11](https://github.com/cloudposse/packages/tree/master/vendor/terraform-0.11) | **Ubuntu**: `apt-get install -y terraform-0.11`<br/>**Alpine**: `apk add terraform-0.11@cloudposse`|

:::tip
You can pin the version of `terraform` using `update-alternatives` as well as in the component configuration.

:::

After installing the desired version of terraform, make sure you know [How to Switch Versions of Terraform](/reference-architecture/how-to-guides/tutorials/how-to-switch-versions-of-terraform), and don’t forget to update the component’s configuration in the stack for both Spacelift and command line.

## Related

- [How to Switch Versions of Terraform](/reference-architecture/how-to-guides/tutorials/how-to-switch-versions-of-terraform)

- [How to Keep Everything Up to Date](/reference-architecture/how-to-guides/upgrades/how-to-keep-everything-up-to-date)

