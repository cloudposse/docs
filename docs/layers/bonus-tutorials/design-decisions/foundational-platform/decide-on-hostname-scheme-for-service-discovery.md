---
title: "Decide on Hostname Scheme for Service Discovery"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1176010884/REFARCH-208+-+Decide+on+Hostname+Scheme+for+Service+Discovery
sidebar_position: 100
refarch_id: REFARCH-208
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/fundamentals/design-decisions/foundational-platform/decide-on-hostname-scheme-for-service-discovery.md
---

# Decide on Hostname Scheme for Service Discovery

### Context and Problem Statement
We need a consistent way of naming resources. Also please see related design-decision concerning DR implications.

This is not an easily reversible decision once whatever convention is in use across services.

### Considered Options
1. Multi-cloud? e.g. AWS, GCP, Azure (we recommend baking the cloud into the service discovery domain. See [Decide on Service Discovery Domain](/reference-architecture/fundamentals/design-decisions/cold-start/decide-on-service-discovery-domain))

2. Multi-region? [Decide on Primary AWS Region](/reference-architecture/fundamentals/design-decisions/cold-start/decide-on-primary-aws-region)

3. Pet or Cattle? → Blue/green or multi-generational

4. Short or Long region name? see [Decide on Regional Naming Scheme](/reference-architecture/fundamentals/design-decisions/cold-start/decide-on-regional-naming-scheme)

5. Does it extend all the way down to the VPC? (we do not recommend this due to excessive subnet allocations and complications around network routing)

6. Too many DNS zone delegations add latency to DNS lookups due to having to jump between nameservers

We typically use the following convention with tenants

- `$service.$region.$account.$tenant.$tld`

- e.g. `eks.us-east-1.prod.platform.ourcompany.com` where `platform` is the tenant

Or without tenants:

- `$service.$region.$account.$tld`

- e.g. `eks.us-east-1.prod.ourcompany.com` without a tenant

The question is now what to do for the `$service` name. Using `eks` is visually appealing but treating the cluster like a named pet. If in the future we want to support multiple generations of clusters, we may want to consider this in whatever convention.

We may want to consider that following convention:

- `$service-$color.$region.$account.$tld` with a `CNAME` of `$service.$region.$account.$tld` pointing to the live cluster

- e.g. `eks-blue.us-east-1.prod.ourcompany.com`

## Related

- [Decide on Service Discovery Domain](/reference-architecture/fundamentals/design-decisions/cold-start/decide-on-service-discovery-domain)


