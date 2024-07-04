---
title: "Reference Architecture Overview"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/overview
sidebar_position: 0
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/index.md
---

# Reference Architecture Overview

This is the documentation corresponding to our proprietary _Reference Architecture_. Every engagement is derived from this project plan and tailored to the customer’s needs. This space is an resource to document and share knowledge for working with this reference architecture. While we intend for portions of this documentation to make their way into [our public documentation](https://github.com/cloudposse/docs), we need to be able to share information in a timely manner with all of our customers. Please respect our [Code of Conduct](/reference-architecture/reference/code-of-conduct).

Have an issue? Make sure to check out our [Troubleshooting](/reference-architecture/reference/troubleshooting) guide for fixes to common issues.

## What is our Reference Architecture?

This is our commercial implementation of a Reference Architecture using the vast ecosystem of Cloud Posse modules following our SweetOps methodology. SweetOps is a methodology for building modern, secure infrastructure on top of Amazon Web Services (AWS) backed entirely by Infrastructure as Code. It provides a toolset, library of reusable Infrastructure as Code (IaC), and opinionated patterns to help you bootstrap robust cloud-native architectures. Built-in an Open Source first fashion by [Cloud Posse](https://cloudposse.com/) together with our customers, it is utilized by many high stakes startups to ensure their cloud infrastructure is an advantage instead of a liability.

In short, SweetOps makes working in the DevOps world _**Sweeeeet!**_

## Who is this documentation for?

This documentation is written for DevOps or platform engineering teams that want an opinionated way to build software platforms in the cloud.

If the below sounds like you, then SweetOps is what you’re looking for:

1. **You’re on AWS** (the majority of our modules are for AWS)
2. **You’re using Terraform** as your primary IaC tool (and not Cloud Formation)
3. **Your platform needs to be secure** and potentially requires passing compliance audits (PCI, SOC2, HIPAA, HITRUST, FedRAMP, etc.)
4. You don’t want to reinvent the wheel

With SweetOps you can implement the following complex architectural patterns with ease:

1. An AWS multi-account Landing Zone built on strong, well-established principles including Separation of Concerns and Principle of Least Privilege (POLP).
2. Multi-region, globally available application environments with disaster recovery capabilities.
3. Foundational AWS-focused security practices that make complex compliance audits a breeze.
4. Microservice architectures that are ready for massive scale running on Docker and Kubernetes.
5. Reusable service catalogs and components to promote reuse across an organization and accelerate adoption

## What are the alternatives?

SweetOps is similar to [Gruntwork](https://gruntwork.io/)’s Terragrunt + subscription plan, [the Terraspace framework](https://terraspace.cloud/), and [BinBash’s Leverage](https://leverage.binbash.com.ar/).

How does it differentiate from these solutions?

1. **It’s based 100% on Open Source**: SweetOps [is on GitHub](https://github.com/cloudposse) and is free to use with no strings attached under Apache 2.0.
2. **It’s comprehensive**: SweetOps is not only about Terraform. It provides patterns and conventions for building cloud-native platforms that are security-focused, Kubernetes or ECS-based, with comprehensive monitoring and incident management, and driven by continuous delivery.
3. **It’s community-focused**: SweetOps has [over 4000 users in Slack](https://sweetops.com/slack/), well-attended weekly [office hours](https://cloudposse.com/office-hours/), and a [budding community forum](https://ask.sweetops.com/).

## How is this documentation structured?

This documentation site breaks down SweetOps into the following sections to help you get up and running:

- [**Reference Architecture**](/reference-architecture/): Explains what SweetOps and this Reference Architecture are, what they can do, and what comprises the methodology.
- [**Fundamentals**](/reference-architecture/fundamentals/): Fundamentals for Cloud Posse Reference Architecture, including quick start documentation for each layer of infrastructure.
- [**Design Decisions**](/reference-architecture/fundamentals/design-decisions): Up-to-date context on the decisions for implementing well-built infrastructure
- [**Setup**](/reference-architecture/setup): show how to step up a specific layer or resource in easy-to-follow steps.
- [**How-To Guides**](/reference-architecture/how-to-guides): show how to solve specific problems with SweetOps via a series of easy-to-follow steps.
- [**Reference**](/reference-architecture/category/reference/): Informative materials on specific tools and patterns within SweetOps.
- [**Components**](/components): Details on our vast library of opinionated root modules
