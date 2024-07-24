---
title: ses
sidebar_label: ses
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/ses/README.md
tags: [terraform, aws, ses]
---

# Component: `ses`

This component is responsible for provisioning SES to act as an SMTP gateway. The credentials used for sending email can
be retrieved from SSM.

## Usage

**Stack Level**: Regional

Here's an example snippet for how to use this component.

```yaml
components:
  terraform:
    ses:
      settings:
        spacelift:
          workspace_enabled: true
      vars:
        enabled: true
        name: ses
        # {environment}.{stage}.{tenant}.acme.org
        domain_template: "%s[2]s.%[3]s.%[1]s.acme.org"
        # use this when `account-map` is deployed in a separate `tenant`
        tags:
          Team: sre
          Service: ses
```

<!-- prettier-ignore-start -->
<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- hello terraform-docs -->
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- prettier-ignore-end -->

## References

- [cloudposse/terraform-aws-components](https://github.com/cloudposse/terraform-aws-components/tree/main/modules/ses) -
  Cloud Posse's upstream component



