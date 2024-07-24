---
title: acm
sidebar_label: acm
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/acm/README.md
tags: [terraform, aws, acm]
---

# Component: `acm`

This component is responsible for requesting an ACM certificate for a domain and adding a CNAME record to the DNS zone
to complete certificate validation.

The ACM component is to manage an unlimited number of certificates, predominantly for vanity domains. While the
[dns-primary](https://docs.cloudposse.com/components/library/aws/dns-primary) component has the ability to generate ACM
certificates, it is very opinionated and can only manage one zone. In reality, companies have many branded domains
associated with a load balancer, so we need to be able to generate more complicated certificates.

We have, as a convenience, the ability to create an ACM certificate as part of creating a DNS zone, whether primary or
delegated. That convenience is limited to creating `example.com` and `*.example.com` when creating a zone for
`example.com`. For example, Acme has delegated `acct.acme.com` and in addition to `*.acct.acme.com` needed an ACM
certificate for `*.usw2.acct.acme.com`, so we use the ACM component to provision that, rather than extend the DNS
primary or delegated components to take a list of additional certificates. Both are different views on the Single
Responsibility Principle.

## Usage

**Stack Level**: Global or Regional

Here's an example snippet for how to use this component.

```yaml
components:
  terraform:
    acm:
      settings:
        spacelift:
          workspace_enabled: true
      vars:
        enabled: true
        domain_name: acme.com
        process_domain_validation_options: false
        validation_method: DNS
        # NOTE: The following subject alternative name is automatically added by the module.
        #       Additional entries can be added by providing this input.
        # subject_alternative_names:
        #   - "*.acme.com"
```

ACM using a private CA

```yaml
components:
  terraform:
    acm:
      settings:
        spacelift:
          workspace_enabled: true
      vars:
        enabled: true
        domain_name: acme.com
        process_domain_validation_options: false
        dns_private_zone_enabled: true
        certificate_authority_component_name: private-ca-subordinate
        certificate_authority_stage_name: pca
        certificate_authority_environment_name: use2
        certificate_authority_component_key: subordinate
```

<!-- prettier-ignore-start -->
<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- hello terraform-docs -->
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- prettier-ignore-end -->

## References

- [cloudposse/terraform-aws-components](https://github.com/cloudposse/terraform-aws-components/tree/main/modules/acm) -
  Cloud Posse's upstream component



