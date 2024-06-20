---
title: "GitHub"
sidebar_position: 10
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/how-to-guides/integrations/github/github.md
---

# GitHub

GitHub can serve as a central platform for hosting infrastructure code written in Atmos and Terraform, and it can seamlessly integrate with GitHub Actions to automate workflows associated with these infrastructure-as-code (IaC) tools.

1. Atmos and Terraform Repositories:

GitHub allows users to create repositories to host Atmos and Terraform code. These repositories store the IaC files (e.g., Atmos configurations or Terraform configuration files) and any related documentation.

2. Collaboration and Version Control:

GitHub provides version control through Git, allowing multiple users to collaborate on infrastructure code development. Changes are tracked, and users can create branches, submit pull requests, and review code changes before merging.

3. GitHub Actions for Continuous Integration (CI):

GitHub Actions allows the creation of CI workflows to automatically validate and test infrastructure code changes. For Atmos and Terraform, CI workflows may involve syntax checking, linting, and other validation steps to ensure the correctness of the code.

4. Continuous Deployment (CD):

GitHub Actions supports CD workflows, allowing for the automated deployment of infrastructure changes. For Atmos and Terraform, CD workflows may involve applying changes to cloud environments, such as provisioning or updating resources.

5. Conditional Workflows:

GitHub Actions supports conditional workflows, allowing users to trigger specific actions based on events, schedules, or conditions. This flexibility is useful for executing workflows selectively, such as deploying only when changes occur in certain branches.

6. Environment Variables and Secrets:

GitHub Actions allows the use of environment variables and secrets, ensuring that sensitive information, such as API keys or access credentials for cloud providers, can be securely stored and accessed in the workflows.

By hosting Atmos and Terraform code on GitHub and leveraging GitHub Actions, organizations can establish a streamlined and automated development and deployment pipeline for their infrastructure. This approach enhances collaboration, ensures code quality, and accelerates the delivery of reliable and consistent infrastructure changes.
