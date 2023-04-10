---
title: Building Blocks
description: 'Building Blocks'
sidebar_position: 600
---

The SweetOps solution by Cloud Posse is a powerful framework in the DevOps field, designed with multiple building blocks that offer various levels of abstraction. This modular approach allows for complete customization to meet the unique requirements of any business, ensuring a tailored solution that aligns with specific needs and objectives. To understand how it works, it's important to know how these parts work together: [Geodesic](/tutorials/geodesic-getting-started/), [Atmos](https://atmos.tools), [Terraform Components](/components/) (root modules), [Terraform Modules](/modules/), and [GitHub Actions](/github-actions/).

## Geodesic

[Geodesic](/tutorials/geodesic-getting-started/) is the ultimate DevOps toolbox, encapsulated within a Docker image. It eliminates the need for individual installations of Terraform, Kubernetes, Helmfile, AWS CLI, and other core tools in the SweetOps methodology. Geodesic is versatile, serving as an interactive cloud automation shell, a base image for other containers, or a crucial element in CI/CD workflows.

## Atmos

[Atmos](https://atmos.tools) takes the reins as a DevOps workflow automation tool, adept at managing large-scale and intricate infrastructures. It empowers users to manage configurations hierarchically, foster team collaboration, and enforce guardrails through policies as code. Atmos relies on YAML configuration and supports multiple inheritance, simplifying the process of defining and reusing logical groups of configuration.

## Terraform Components

[Terraform Components](/components/) (Root Modules) act as the foundational Terraform configurations for high-level infrastructure elements, such as Kubernetes clusters or VPCs. These root modules enable reusability across different environments, streamlining infrastructure management.

## Terraform Modules

[Terraform Modules](/modules/) are invoked by components to dictate the business logic associated with configuring infrastructure resources. These versatile modules can be shared among multiple Terraform configurations, allowing for the creation, updating, and deletion of infrastructure resources.

## GitHub Actions

[GitHub Actions](/github-actions/) play a pivotal role as the CI/CD tool, automating software workflows to build, test, and deploy code changes. This powerful platform integrates seamlessly with Atmos and Terraform components and modules, automating deployment to infrastructure environments.

## TL;DR

The various building blocks we leverage are Geodesic as a comprehensive DevOps toolbox, Atmos as a workflow automation conductor, Terraform components and modules as the architects of infrastructure elements and resources, and GitHub Actions as the deployment automation platform. This unified approach empowers teams to efficiently manage and scale their cloud infrastructure.