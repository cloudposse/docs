---
title: network-firewall
sidebar_label: network-firewall
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/network-firewall/README.md
tags: [terraform, aws, network-firewall]
---

# Component: `network-firewall`

This component is responsible for provisioning [AWS Network Firewall](https://aws.amazon.com/network-firewal) resources,
including Network Firewall, firewall policy, rule groups, and logging configuration.

## Usage

**Stack Level**: Regional

Example of a Network Firewall with stateful 5-tuple rules:

:::info

The "5-tuple" means the five items (columns) that each rule (row, or tuple) in a firewall policy uses to define whether
to block or allow traffic: source and destination IP, source and destination port, and protocol.

Refer to
[Standard stateful rule groups in AWS Network Firewall](https://docs.aws.amazon.com/network-firewall/latest/developerguide/stateful-rule-groups-basic.html)
for more details.

:::

```yaml
components:
  terraform:
    network-firewall:
      settings:
        spacelift:
          workspace_enabled: true
      vars:
        enabled: true
        name: network-firewall
        # The name of a VPC component where the Network Firewall is provisioned
        vpc_component_name: vpc
        firewall_subnet_name: "firewall"
        stateful_default_actions:
          - "aws:alert_strict"
        stateless_default_actions:
          - "aws:forward_to_sfe"
        stateless_fragment_default_actions:
          - "aws:forward_to_sfe"
        stateless_custom_actions: []
        delete_protection: false
        firewall_policy_change_protection: false
        subnet_change_protection: false
        logging_config: []
        rule_group_config:
          stateful-packet-inspection:
            capacity: 50
            name: stateful-packet-inspection
            description: "Stateful inspection of packets"
            type: "STATEFUL"
            rule_group:
              stateful_rule_options:
                rule_order: "STRICT_ORDER"
              rules_source:
                stateful_rule:
                  - action: "DROP"
                    header:
                      destination: "124.1.1.24/32"
                      destination_port: 53
                      direction: "ANY"
                      protocol: "TCP"
                      source: "1.2.3.4/32"
                      source_port: 53
                    rule_option:
                      keyword: "sid:1"
                  - action: "PASS"
                    header:
                      destination: "ANY"
                      destination_port: "ANY"
                      direction: "ANY"
                      protocol: "TCP"
                      source: "10.10.192.0/19"
                      source_port: "ANY"
                    rule_option:
                      keyword: "sid:2"
                  - action: "PASS"
                    header:
                      destination: "ANY"
                      destination_port: "ANY"
                      direction: "ANY"
                      protocol: "TCP"
                      source: "10.10.224.0/19"
                      source_port: "ANY"
                    rule_option:
                      keyword: "sid:3"
```

Example of a Network Firewall with [Suricata](https://suricata.readthedocs.io/en/suricata-6.0.0/rules/) rules:

:::info

For [Suricata](https://suricata.io/) rule group type, you provide match and action settings in a string, in a Suricata
compatible specification. The specification fully defines what the stateful rules engine looks for in a traffic flow and
the action to take on the packets in a flow that matches the inspection criteria.

Refer to
[Suricata compatible rule strings in AWS Network Firewall](https://docs.aws.amazon.com/network-firewall/latest/developerguide/stateful-rule-groups-suricata.html)
for more details.

:::

```yaml
components:
  terraform:
    network-firewall:
      metadata:
        component: "network-firewall"
      settings:
        spacelift:
          workspace_enabled: true
      vars:
        enabled: true
        name: "network-firewall"

        # The name of a VPC component where the Network Firewall is provisioned
        vpc_component_name: "vpc"
        firewall_subnet_name: "firewall"

        delete_protection: false
        firewall_policy_change_protection: false
        subnet_change_protection: false

        # Logging config
        logging_enabled: true
        flow_logs_bucket_component_name: "network-firewall-logs-bucket-flow"
        alert_logs_bucket_component_name: "network-firewall-logs-bucket-alert"

        # https://docs.aws.amazon.com/network-firewall/latest/developerguide/stateless-default-actions.html
        # https://docs.aws.amazon.com/network-firewall/latest/APIReference/API_FirewallPolicy.html
        # https://docs.aws.amazon.com/network-firewall/latest/developerguide/rule-action.html#rule-action-stateless
        stateless_default_actions:
          - "aws:forward_to_sfe"
        stateless_fragment_default_actions:
          - "aws:forward_to_sfe"
        stateless_custom_actions: []

        # https://docs.aws.amazon.com/network-firewall/latest/developerguide/suricata-rule-evaluation-order.html#suricata-strict-rule-evaluation-order.html
        # https://github.com/aws-samples/aws-network-firewall-strict-rule-ordering-terraform
        policy_stateful_engine_options_rule_order: "STRICT_ORDER"

        # https://docs.aws.amazon.com/network-firewall/latest/developerguide/stateful-default-actions.html
        # https://docs.aws.amazon.com/network-firewall/latest/developerguide/suricata-rule-evaluation-order.html#suricata-default-rule-evaluation-order
        # https://docs.aws.amazon.com/network-firewall/latest/APIReference/API_FirewallPolicy.html
        stateful_default_actions:
          - "aws:alert_established"
        #  - "aws:alert_strict"
        #  - "aws:drop_established"
        #  - "aws:drop_strict"

        # https://docs.aws.amazon.com/network-firewall/latest/developerguide/rule-groups.html
        rule_group_config:
          stateful-inspection:
            # https://docs.aws.amazon.com/network-firewall/latest/developerguide/rule-group-managing.html#nwfw-rule-group-capacity
            # For stateful rules, `capacity` means the max number of rules in the rule group
            capacity: 1000
            name: "stateful-inspection"
            description: "Stateful inspection of packets"
            type: "STATEFUL"

            rule_group:
              rule_variables:
                port_sets: []
                ip_sets:
                  - key: "CIDR_1"
                    definition:
                      - "10.10.0.0/11"
                  - key: "CIDR_2"
                    definition:
                      - "10.11.0.0/11"
                  - key: "SCANNER"
                    definition:
                      - "10.12.48.186/32"
                  # bad actors
                  - key: "BLOCKED_LIST"
                    definition:
                      - "193.142.146.35/32"
                      - "69.40.195.236/32"
                      - "125.17.153.207/32"
                      - "185.220.101.4/32"
                      - "195.219.212.151/32"
                      - "162.247.72.199/32"
                      - "147.185.254.17/32"
                      - "179.60.147.101/32"
                      - "157.230.244.66/32"
                      - "192.99.4.116/32"
                      - "62.102.148.69/32"
                      - "185.129.62.62/32"

              stateful_rule_options:
                # https://docs.aws.amazon.com/network-firewall/latest/developerguide/suricata-rule-evaluation-order.html#suricata-strict-rule-evaluation-order.html
                # All the stateful rule groups are provided to the rule engine as Suricata compatible strings
                # Suricata can evaluate stateful rule groups by using the default rule group ordering method,
                # or you can set an exact order using the strict ordering method.
                # The settings for your rule groups must match the settings for the firewall policy that they belong to.
                # With strict ordering, the rule groups are evaluated by order of priority, starting from the lowest number,
                # and the rules in each rule group are processed in the order in which they're defined.
                rule_order: "STRICT_ORDER"

              # https://docs.aws.amazon.com/network-firewall/latest/developerguide/suricata-how-to-provide-rules.html
              rules_source:
                # Suricata rules for the rule group
                # https://docs.aws.amazon.com/network-firewall/latest/developerguide/suricata-examples.html
                # https://docs.aws.amazon.com/network-firewall/latest/developerguide/suricata-rule-evaluation-order.html
                # https://github.com/aws-samples/aws-network-firewall-terraform/blob/main/firewall.tf#L66
                # https://docs.aws.amazon.com/network-firewall/latest/developerguide/stateful-rule-groups-suricata.html
                # https://coralogix.com/blog/writing-effective-suricata-rules-for-the-sta/
                # https://suricata.readthedocs.io/en/suricata-6.0.10/rules/intro.html
                # https://suricata.readthedocs.io/en/suricata-6.0.0/rules/header-keywords.html
                # https://docs.aws.amazon.com/network-firewall/latest/developerguide/rule-action.html
                #
                # With Strict evaluation order, the rules in each rule group are processed in the order in which they're defined
                #
                # Pass – Discontinue inspection of the matching packet and permit it to go to its intended destination
                #
                # Drop or Alert – Evaluate the packet against all rules with drop or alert action settings.
                # If the firewall has alert logging configured, send a message to the firewall's alert logs for each matching rule.
                # The first log entry for the packet will be for the first rule that matched the packet.
                # After all rules have been evaluated, handle the packet according to the action setting in the first rule that matched the packet.
                # If the first rule has a drop action, block the packet. If it has an alert action, continue evaluation.
                #
                # Reject – Drop traffic that matches the conditions of the stateful rule and send a TCP reset packet back to sender of the packet.
                # A TCP reset packet is a packet with no payload and a RST bit contained in the TCP header flags.
                # Reject is available only for TCP traffic. This option doesn't support FTP and IMAP protocols.
                rules_string: |
                  alert ip $BLOCKED_LIST any <> any any ( msg:"Alert on blocked traffic"; sid:100; rev:1; )
                  drop ip $BLOCKED_LIST any <> any any ( msg:"Blocked blocked traffic"; sid:200; rev:1; )

                  pass ip $SCANNER any -> any any ( msg: "Allow scanner"; sid:300; rev:1; )

                  alert ip $CIDR_1 any -> $CIDR_2 any ( msg:"Alert on CIDR_1 to CIDR_2 traffic"; sid:400; rev:1; )
                  drop ip $CIDR_1 any -> $CIDR_2 any ( msg:"Blocked CIDR_1 to CIDR_2 traffic"; sid:410; rev:1; )

                  pass ip any any <> any any ( msg: "Allow general traffic"; sid:10000; rev:1; )
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
- [cloudposse/terraform-aws-components](https://github.com/cloudposse/terraform-aws-components/tree/main/modules/TODO) -
  Cloud Posse's upstream component



