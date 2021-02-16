---
title: "Introduction"
description: "Learn what SweetOps is and who it is for."
icon: "fa fa-brain"
---

# What is SweetOps?

SweetOps is a methodology for building modern, secure infrastructure on top of Amazon Web Services (AWS). It provides a toolset, library of reusable Infrastructure as Code (IaC), and opinionated patterns to help you bootstrap robust cloud native architectures. Built in an Open Source first fashion by [Cloud Posse](https://cloudposse.com/), it is utilized by many high performing startups to ensure their cloud infrastructure is an advantage instead of a liability. In short, SweetOps makes working in the DevOps world **Sweet**!

# Who is this for?

SweetOps is for DevOps or platform engineering teams that want an opinionated way to build software platforms in the cloud. If the below sounds like you, then SweetOps is what you're looking for:

1. You're on AWS
1. You're using Terraform as your IaC tool
1. Your platform needs to be secure and potentially requires passing compliance audits (PCI, SOC2, HIPAA, HITRUST, FedRAMP, etc.)
1. You don't want to reinvent the wheel

With SweetOps you can implement the following complex architectural patterns with ease:

1. An AWS multi-account Landing Zone built on strong, well-established principles including Separation of Concerns and Principle of Least Privilege (POLP).
1. Multi-region, globally available application environments with disaster recovery capabilities.
1. Foundational AWS-focused security practices that make complex compliance audits a breeze.
1. Microservice architectures that are ready for massive scale running on Docker and Kubernetes.
1. Reusable service catalogs and components to promote reuse across an organization and accelerate adoption

# What are the alternatives?

SweetOps is similar to [Gruntwork](https://gruntwork.io/)'s Terragrunt + subscription plan, [the Terraspace framework](https://terraspace.cloud/), and [BinBash's Leverage](https://leverage.binbash.com.ar/).

How does it differentiate from these solutions?

1. It's 100% Open Source: SweetOps [is on GitHub](https://github.com/cloudposse) and is free to use with no strings attached under Apache 2.0.
1. It's comprehensive: SweetOps is not only about Terraform. It provides patterns and conventions for building cloud native platforms that are security focused, Kubernetes-based, and driven by continuous delivery.
1. It's community focused: SweetOps has [over 3400 users in Slack](https://sweetops.com/slack/), well-attended weekly office hours, and a [budding community forum](https://ask.sweetops.com/).


# How is this documentation structured?

This documentation site breaks down SweetOps into the following sections to help you get up and running:

- *[Introduction]({{< relref "introduction" >}})*: Explains what SweetOps is, what it can do, and what comprises the methodology.
- *[Tutorials]({{< relref "tutorials" >}})*: Lessons on how to utilize SweetOps to implement a project.
- *[How-To]({{< relref "howto" >}})*: Guides on how to solve specific problems with SweetOps via a series of easy to follow steps.
- *[Reference]({{< relref "reference" >}})*: Informative materials on specific tools and patterns within SweetOps.

