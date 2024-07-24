---
title: aws-inspector
sidebar_label: aws-inspector
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/aws-inspector/README.md
tags: [terraform, aws, aws-inspector]
---

# Component: `aws-inspector`

This component is responsible for provisioning an
[AWS Inspector](https://docs.aws.amazon.com/inspector/latest/user/what-is-inspector.html) by installing the
[Inspector agent](https://repost.aws/knowledge-center/set-up-amazon-inspector) across all EC2 instances and applying the
Inspector rules.

AWS Inspector is a security assessment service offered by Amazon Web Services (AWS). It helps you analyze and evaluate
the security and compliance of your applications and infrastructure deployed on AWS. AWS Inspector automatically
assesses the resources within your AWS environment, such as Amazon EC2 instances, for potential security vulnerabilities
and deviations from security best practices.

Here are some key features and functionalities of AWS Inspector:

- **Security Assessments:** AWS Inspector performs security assessments by analyzing the behavior of your resources and
  identifying potential security vulnerabilities. It examines the network configuration, operating system settings, and
  installed software to detect common security issues.

- **Vulnerability Detection:** AWS Inspector uses a predefined set of rules to identify common vulnerabilities,
  misconfigurations, and security exposures. It leverages industry-standard security best practices and continuously
  updates its knowledge base to stay current with emerging threats.

- **Agent-Based Architecture:** AWS Inspector utilizes an agent-based approach, where you install an Inspector agent on
  your EC2 instances. The agent collects data about the system and its configuration, securely sends it to AWS
  Inspector, and allows for more accurate and detailed assessments.

- **Security Findings:** After performing an assessment, AWS Inspector generates detailed findings that highlight
  security vulnerabilities, including their severity level, impact, and remediation steps. These findings can help you
  prioritize and address security issues within your AWS environment.

- **Integration with AWS Services:** AWS Inspector seamlessly integrates with other AWS services, such as AWS
  CloudFormation, AWS Systems Manager, and AWS Security Hub. This allows you to automate security assessments, manage
  findings, and centralize security information across your AWS infrastructure.

## Usage

**Stack Level**: Regional

Here's an example snippet for how to use this component.

```yaml
components:
  terraform:
    aws-inspector:
      vars:
        enabled: true
        enabled_rules:
          - cis
```

The `aws-inspector` component can be included in your Terraform stack configuration. In the provided example, it is
enabled with the `enabled` variable set to `true`. The `enabled_rules` variable specifies a list of rules to enable, and
in this case, it includes the `cis` rule. To simplify rule selection, the short forms of the rules are used for the
`enabled_rules` key. These short forms automatically retrieve the appropriate ARN for the rule package based on the
region being used. You can find a list of available short forms and their corresponding rule packages in the
[var.enabled_rules](https://github.com/cloudposse/terraform-aws-inspector#input_enabled_rules) input documentation.

For a comprehensive list of rules and their corresponding ARNs, you can refer to the
[Amazon Inspector ARNs for rules packages](https://docs.aws.amazon.com/inspector/latest/userguide/inspector_rules-arns.html)
documentation. This resource provides detailed information on various rules that can be used with AWS Inspector and
their unique identifiers (ARNs).

By customizing the configuration with the appropriate rules, you can tailor the security assessments performed by AWS
Inspector to meet the specific requirements and compliance standards of your applications and infrastructure.

<!-- prettier-ignore-start -->
<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- hello terraform-docs -->
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- prettier-ignore-end -->

## References

- [cloudposse/terraform-aws-components](https://github.com/cloudposse/terraform-aws-components/tree/main/modules/TODO) -
  Cloud Posse's upstream component
  


