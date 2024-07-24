---
title: dns-delegated
sidebar_label: dns-delegated
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/dns-delegated/README.md
tags: [terraform, aws, dns-delegated]
---

# Component: `dns-delegated`

This component is responsible for provisioning a DNS zone which delegates nameservers to the DNS zone in the primary DNS
account. The primary DNS zone is expected to already be provisioned via
[the `dns-primary` component](https://github.com/cloudposse/terraform-aws-components/tree/main/modules/dns-primary).

This component also provisions a wildcard ACM certificate for the given subdomain.

## Usage

**Stack Level**: Global or Regional

Here's an example snippet for how to use this component. Use this component in global or regional stacks for any
accounts where you host services that need DNS records on a given subdomain (e.g. delegated zone) of the root domain
(e.g. primary zone).

Public Hosted Zone `devplatform.example.net` will be created and `example.net` HZ in the dns primary account will
contain a record delegating DNS to the new HZ

This will create an ACM record

```yaml
components:
  terraform:
    dns-delegated:
      vars:
        zone_config:
          - subdomain: devplatform
            zone_name: example.net
        request_acm_certificate: true
        dns_private_zone_enabled: false
        #  dns_soa_config configures the SOA record for the zone::
        #    - awsdns-hostmaster.amazon.com. ; AWS default value for administrator email address
        #    - 1 ; serial number, not used by AWS
        #    - 7200 ; refresh time in seconds for secondary DNS servers to refreh SOA record
        #    - 900 ; retry time in seconds for secondary DNS servers to retry failed SOA record update
        #    - 1209600 ; expire time in seconds (1209600 is 2 weeks) for secondary DNS servers to remove SOA record if they cannot refresh it
        #    - 60 ; nxdomain TTL, or time in seconds for secondary DNS servers to cache negative responses
        #    See [SOA Record Documentation](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/SOA-NSrecords.html) for more information.
        dns_soa_config: "awsdns-hostmaster.amazon.com. 1 7200 900 1209600 60"
```

Private Hosted Zone `devplatform.example.net` will be created and `example.net` HZ in the dns primary account will
contain a record delegating DNS to the new HZ

This will create an ACM record using a Private CA

```yaml
components:
  terraform:
    dns-delegated:
      vars:
        zone_config:
          - subdomain: devplatform
            zone_name: example.net
        request_acm_certificate: true
        dns_private_zone_enabled: true
        vpc_region_abbreviation_type: short
        vpc_primary_environment_name: use2
        certificate_authority_component_name: private-ca-subordinate
        certificate_authority_stage_name: pca
        certificate_authority_environment_name: use2
        certificate_authority_component_key: subordinate
```

### Limitations

Switching a hosted zone from public to private can cause issues because the provider will try to do an update instead of
a ForceNew.

See: https://github.com/hashicorp/terraform-provider-aws/issues/7614

It's not possible to toggle between public and private so if switching from public to private and downtime is
acceptable, delete the records of the hosted zone, delete the hosted zone, destroy the terraform component, and deploy
with the new settings.

NOTE: With each of these workarounds, you may have an issue connecting to the service specific provider e.g. for
`auroro-postgres` you may get an error of the host set to `localhost` on the `postgresql` provider resulting in an
error. To get around this, dump the endpoint using `atmos terraform show`, hardcode the `host` input on the provider,
and re-run the apply.

#### Workaround if downtime is fine

1. Delete anything using ACMs connected to previous hosted zones
1. Delete ACMs
1. Delete entries in public hosted zone
1. Delete hosted zone
1. Use atmos to destroy `dns-delegated` to remove the public hosted zone
1. Use atmos to deploy `dns-delegated` for the private hosted zone
1. Move aurora-postgres, msk, external-dns, echo-server, etc to the new hosted zone by re-deploying

#### Workaround if downtime is not fine

1. Create a new virtual component of `dns-delegated` with the correct private inputs (see above)
1. Deploy the new dns-delegated-private component
1. Move aurora-postgres, msk, external-dns, echo-server, etc to the new hosted zone by re-deploying

## Caveats

- Do not create a delegation for subdomain of a domain in a zone for which that zone is not authoritative for the
  subdomain (usually because you already delegated a parent subdomain). Though Amazon Route 53 will allow you to, you
  should not do it. For historic reasons, Route 53 Public DNS allows customers to create two NS delegations within a
  hosted zone which creates a conflict (and can return either set to resolvers depending on the query).

For example, in a single hosted zone with the domain name `example.com`, it is possible to create two NS delegations
which are parent and child of each other as follows:

```
a.example.com. 172800 IN NS ns-1084.awsdns-07.org.
a.example.com. 172800 IN NS ns-634.awsdns-15.net.
a.example.com. 172800 IN NS ns-1831.awsdns-36.co.uk.
a.example.com. 172800 IN NS ns-190.awsdns-23.com.

b.a.example.com. 172800 IN NS ns-1178.awsdns-19.org.
b.a.example.com. 172800 IN NS ns-614.awsdns-12.net.
b.a.example.com. 172800 IN NS ns-1575.awsdns-04.co.uk.
b.a.example.com. 172800 IN NS ns-338.awsdns-42.com.
```

This configuration creates two discrete possible resolution paths.

1. If a resolver directly queries the `example.com` nameservers for `c.b.a.example.com`, it will receive the second set
   of nameservers.

2. If a resolver queries `example.com` for `a.example.com`, it will receive the first set of nameservers.

If the resolver then proceeds to query the `a.example.com` nameservers for `c.b.a.example.com`, the response is driven
by the contents of the `a.example.com` zone, which may be different than the results returned by the `b.a.example.com`
nameservers. `c.b.a.example.com` may not have an entry in the `a.example.com` nameservers, resulting in an error
(`NXDOMAIN`) being returned.

From 15th May 2020, Route 53 Resolver has been enabling a modern DNS resolver standard called "QName Minimization"[*].
This change causes the resolver to more strictly use recursion path [2] described above where path [1] was common
before. [*] [https://tools.ietf.org/html/rfc7816](https://tools.ietf.org/html/rfc7816)

As of January 2022, you can observe the different query strategies in use by Google DNS at `8.8.8.8` (strategy 1) and
Cloudflare DNS at `1.1.1.1` (strategy 2). You should verify that both DNS servers resolve your host records properly.

Takeaway

1. In order to ensure DNS resolution is consistent no matter the resolver, it is important to always create NS
   delegations only authoritative zones.

<!-- prettier-ignore-start -->
<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- hello terraform-docs -->
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- prettier-ignore-end -->

## References

- [cloudposse/terraform-aws-components](https://github.com/cloudposse/terraform-aws-components/tree/main/modules/dns-delegated) -
  Cloud Posse's upstream component



