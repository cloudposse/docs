---
title: route53-resolver-dns-firewall
sidebar_label: route53-resolver-dns-firewall
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/route53-resolver-dns-firewall/README.md
tags: [terraform, aws, route53-resolver-dns-firewall]
---

# Component: `route53-resolver-dns-firewall`

This component is responsible for provisioning
[Route 53 Resolver DNS Firewall](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resolver-dns-firewall.html)
resources, including Route 53 Resolver DNS Firewall, domain lists, firewall rule groups, firewall rules, and logging
configuration.

## Usage

**Stack Level**: Regional

Here's an example snippet for how to use this component.

```yaml
# stacks/catalog/route53-resolver-dns-firewall/defaults.yaml
components:
  terraform:
    route53-resolver-dns-firewall/defaults:
      metadata:
        type: abstract
      settings:
        spacelift:
          workspace_enabled: true
      vars:
        enabled: true
        firewall_fail_open: "ENABLED"
        query_log_enabled: true
        logs_bucket_component_name: "route53-resolver-dns-firewall-logs-bucket"
        domains_config:
          allowed-domains:
            # Concat the lists of domains passed in the `domains` field and loaded from the file `domains_file`
            # The file is in the `components/terraform/route53-resolver-dns-firewall/config` folder
            domains_file: "config/allowed_domains.txt"
            domains: []
          blocked-domains:
            # Concat the lists of domains passed in the `domains` field and loaded from the file `domains_file`
            # The file is in the `components/terraform/route53-resolver-dns-firewall/config` folder
            domains_file: "config/blocked_domains.txt"
            domains: []
        rule_groups_config:
          blocked-and-allowed-domains:
            # 'priority' must be between 100 and 9900 exclusive
            priority: 101
            rules:
              allowed-domains:
                firewall_domain_list_name: "allowed-domains"
                # 'priority' must be between 100 and 9900 exclusive
                priority: 101
                action: "ALLOW"
              blocked-domains:
                firewall_domain_list_name: "blocked-domains"
                # 'priority' must be between 100 and 9900 exclusive
                priority: 200
                action: "BLOCK"
                block_response: "NXDOMAIN"
```

```yaml
# stacks/mixins/stage/dev.yaml
import:
  - catalog/route53-resolver-dns-firewall/defaults

components:
  terraform:
    route53-resolver-dns-firewall/example:
      metadata:
        component: route53-resolver-dns-firewall
        inherits:
          - route53-resolver-dns-firewall/defaults
      vars:
        name: route53-dns-firewall-example
        vpc_component_name: vpc
```

Execute the following command to provision the `route53-resolver-dns-firewall/example` component using Atmos:

```shell
atmos terraform apply route53-resolver-dns-firewall/example -s <stack>
```

<!-- prettier-ignore-start -->
<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- hello terraform-docs -->
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- prettier-ignore-end -->

## References

- [Deploy centralized traffic filtering using AWS Network Firewall](https://aws.amazon.com/blogs/networking-and-content-delivery/deploy-centralized-traffic-filtering-using-aws-network-firewall)
- [AWS Network Firewall – New Managed Firewall Service in VPC](https://aws.amazon.com/blogs/aws/aws-network-firewall-new-managed-firewall-service-in-vpc)
- [Deployment models for AWS Network Firewall](https://aws.amazon.com/blogs/networking-and-content-delivery/deployment-models-for-aws-network-firewall)
- [Deployment models for AWS Network Firewall with VPC routing enhancements](https://aws.amazon.com/blogs/networking-and-content-delivery/deployment-models-for-aws-network-firewall-with-vpc-routing-enhancements)
- [Inspection Deployment Models with AWS Network Firewall](https://d1.awsstatic.com/architecture-diagrams/ArchitectureDiagrams/inspection-deployment-models-with-AWS-network-firewall-ra.pdf)
- [How to deploy AWS Network Firewall by using AWS Firewall Manager](https://aws.amazon.com/blogs/security/how-to-deploy-aws-network-firewall-by-using-aws-firewall-manager)
- [A Deep Dive into AWS Transit Gateway](https://www.youtube.com/watch?v=a55Iud-66q0)
- [Appliance in a shared services VPC](https://docs.aws.amazon.com/vpc/latest/tgw/transit-gateway-appliance-scenario.html)
- [Quotas on Route 53 Resolver DNS Firewall](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/DNSLimitations.html#limits-api-entities-resolver)
- [Unified bad hosts](https://github.com/StevenBlack/hosts)
- [cloudposse/terraform-aws-components](https://github.com/cloudposse/terraform-aws-components/tree/main/modules/TODO) -
  Cloud Posse's upstream component



