---
title: dns-primary
sidebar_label: dns-primary
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/dns-primary/README.md
tags: [terraform, aws, dns-primary]
---

# Component: `dns-primary`

This component is responsible for provisioning the primary DNS zones into an AWS account. By convention, we typically
provision the primary DNS zones in the `dns` account. The primary account for branded zones (e.g. `example.com`),
however, would be in the `prod` account, while staging zone (e.g. `example.qa`) might be in the `staging` account.

The zones from the primary DNS zone are then expected to be delegated to other accounts via
[the `dns-delegated` component](https://github.com/cloudposse/terraform-aws-components/tree/main/modules/dns-delegated).
Additionally, external records can be created on the primary DNS zones via the `record_config` variable.

## Architecture

### Summary

The `dns` account gets a single `dns-primary` component deployed. Every other account that needs DNS entries gets a
single `dns-delegated` component, chaining off the domains in the `dns` account. Optionally, accounts can have a single
`dns-primary` component of their own, to have apex domains (which Cloud Posse calls "vanity domains"). Typically, these
domains are configured with CNAME (or apex alias) records to point to service domain entries.

### Details

The purpose of the `dns` account is to host root domains shared by several accounts (with each account being delegated
its own subdomain) and to be the owner of domain registrations purchased from Amazon.

The purpose of the `dns-primary` component is to provision AWS Route53 zones for the root domains. These zones, once
provisioned, must be manually configured into the Domain Name Registrar's records as name servers. A single component
can provision multiple domains and, optionally, associated ACM (SSL) certificates in a single account.

Cloud Posse's architecture expects root domains shared by several accounts to be provisioned in the `dns` account with
`dns-primary` and delegated to other accounts using the `dns-delegated` component, with each account getting its own
subdomain corresponding to a Route 53 zone in the delegated account. Cloud Posse's architecture requires at least one
such domain, called "the service domain", be provisioned. The service domain is not customer facing, and is provisioned
to allow fully automated construction of host names without any concerns about how they look. Although they are not
secret, the public will never see them.

Root domains used by a single account are provisioned with the `dns-primary` component directly in that account. Cloud
Posse calls these "vanity domains". These can be whatever the marketing or PR or other stakeholders want to be.

After a domain is provisioned in the `dns` account, the `dns-delegated` component can provision one or more subdomains
for each account, and, optionally, associated ACM certificates. For the service domain, Cloud Posse recommends using the
account name as the delegated subdomain (either directly, e.g. "plat-dev", or as multiple subdomains, e.g. "dev.plat")
because that allows `dns-delegated` to automatically provision any required host name in that zone.

There is no automated support for `dns-primary` to provision root domains outside of the `dns` account that are to be
shared by multiple accounts, and such usage is not recommended. If you must, `dns-primary` can provision a subdomain of
a root domain that is provisioned in another account (not `dns`). In this case, the delegation of the subdomain must be
done manually by entering the name servers into the parent domain's records (instead of in the Registrar's records).

The architecture does not support other configurations, or non-standard component names.

## Usage

**Stack Level**: Global

Here's an example snippet for how to use this component. This component should only be applied once as the DNS zones it
creates are global. This is typically done via the DNS stack (e.g. `gbl-dns.yaml`).

```yaml
components:
  terraform:
    dns-primary:
      vars:
        domain_names:
          - example.net
        record_config:
          - root_zone: example.net
            name: ""
            type: A
            ttl: 60
            records:
              - 53.229.170.215
          # using a period at the end of a name
          - root_zone: example.net
            name: www.
            type: CNAME
            ttl: 60
            records:
              - example.net
          # using numbers as name requires quotes
          - root_zone: example.net
            name: "123456."
            type: CNAME
            ttl: 60
            records:
              - example.net
          # strings that are very long, this could be a DKIM key
          - root_zone: example.net
            name: service._domainkey.
            type: CNAME
            ttl: 60
            records:
              - !!str |-
                YourVeryLongStringGoesHere
```

:::info Use the [acm](https://docs.cloudposse.com/components/library/aws/acm) component for more advanced certificate
requirements.

:::

<!-- prettier-ignore-start -->
<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- hello terraform-docs -->
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- prettier-ignore-end -->

## References

- [cloudposse/terraform-aws-components](https://github.com/cloudposse/terraform-aws-components/tree/main/modules/dns-primary) -
  Cloud Posse's upstream component



