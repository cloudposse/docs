---
title: "Integrations"
sidebar_position: 10
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/how-to-guides/integrations/integrations.md
---

# Integrations


Integrations involve connecting various third-party tools and services with AWS services to enhance and extend functionality. Tools like Datadog, Spacelift, and Opsgenie can provide additional capabilities in areas such as monitoring, infrastructure as code (IaC), and incident response.

1. Datadog:

  - *Purpose:* Datadog is a monitoring and analytics platform that helps organizations gain insights into the performance of their applications, infrastructure, and services.
  - *Integration Features:*
    - *Monitoring:* Datadog can be integrated with AWS services to collect and analyze metrics, logs, and traces, providing comprehensive visibility into the AWS environment.
    - *Alerting:* Datadog enables the creation of custom alerts based on AWS metrics, helping teams proactively identify and respond to issues.
    - *Dashboards:* Integration allows the creation of dashboards that aggregate data from various AWS services, offering a unified view of the entire infrastructure.

2. Spacelift:

  - *Purpose:* Spacelift is a platform that focuses on automating and managing infrastructure as code (IaC) workflows.
  - *Integration Features:*
    - Infrastructure Automation:* Spacelift integrates with AWS CloudFormation or HashiCorp Terraform to automate the provisioning and management of AWS resources.
    - Workflow Management:* Spacelift allows the definition and execution of IaC workflows, enabling version-controlled, collaborative infrastructure changes.
    - Policy Enforcement:* Integration with Spacelift can enforce best practices and compliance policies for AWS infrastructure deployments.

3. Opsgenie:

  - *Purpose:* Opsgenie is an incident management and alerting platform that helps teams respond to and resolve incidents efficiently.
  - *Integration Features:*
    - *Alerting:* Opsgenie integrates with AWS CloudWatch or other monitoring tools to receive alerts and incidents from AWS services.
    - *Incident Response:* When an incident occurs, Opsgenie can automatically notify the appropriate teams, escalate incidents, and provide a centralized platform for collaboration and communication.
    - *AWS Service Integration:* Opsgenie supports direct integrations with specific AWS services, allowing for seamless incident management for services like AWS Lambda, EC2, and more.

These integrations collectively enhance the AWS experience by providing additional functionalities, improving visibility, and automating various aspects of the development and operations lifecycle. Integrating tools such as these and more allow organizations to leverage and extend a comprehensive set of capabilities for monitoring, infrastructure management, and incident response within their AWS environment.
