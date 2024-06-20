---
title: "Foundational Infrastructure"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1171718277/Foundational+Infrastructure
sidebar_position: 10
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/fundamentals/design-decisions/foundational-infrastructure/foundational-infrastructure.md
---

# Foundational Infrastructure

## Related Epics

- [REFARCH-43 - Implement Foundational Infrastructure](https://cloudposse.atlassian.net/browse/REFARCH-43)

## Related Decisions

- [Decide VPC Peering Requirements (e.g. to Legacy Env)](/reference-architecture/fundamentals/design-decisions/foundational-infrastructure/decide-vpc-peering-requirements-e-g-to-legacy-env)
- [Decide on Organization Supernet CIDR Ranges](/reference-architecture/fundamentals/design-decisions/foundational-infrastructure/decide-on-organization-supernet-cidr-ranges)
- [Decide on AWS Account VPC Subnet CIDR Strategy](/reference-architecture/fundamentals/design-decisions/foundational-infrastructure/decide-on-aws-account-vpc-subnet-cidr-strategy)
- [Decide on VPC NAT Strategy](/reference-architecture/fundamentals/design-decisions/foundational-infrastructure/decide-on-vpc-nat-strategy)
- [Decide on Client VPN Options](/reference-architecture/fundamentals/design-decisions/foundational-infrastructure/decide-on-client-vpn-options)
- [Decide on VPC Network Traffic Isolation Policy](/reference-architecture/fundamentals/design-decisions/foundational-infrastructure/decide-on-vpc-network-traffic-isolation-policy)

## Related Components

- [tfstate-backend](/components/library/aws/tfstate-backend/)
- [iam-primary-roles](https://github.com/cloudposse/terraform-aws-components/tree/main/deprecated/iam-primary-roles)
- [vpc](/components/library/aws/vpc/)
- [account](/components/library/aws/account/)
- [account-settings](/components/library/aws/account-settings/)
- [iam-delegated-roles](https://github.com/cloudposse/terraform-aws-components/tree/main/deprecated/iam-delegated-roles)
- [sso](/components/library/aws/aws-sso/)
- [account-map](/components/library/aws/account-map/)
- [cloudtrail-bucket](/components/library/aws/cloudtrail-bucket/)
- [cloudtrail](/components/library/aws/cloudtrail/)
- [dns-primary](/components/library/aws/dns-primary/)
- [dns-delegated](/components/library/aws/dns-delegated/)
