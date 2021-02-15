---
title: "Core Principles"
description: "Learn more about the core principles that make up the SweetOps methodology."
---

SweetOps is built on a foundational set of core principles that ensure the methodology is comprehensive and reusable across organizations. To fully understand what SweetOps is and how to utilize it effectively, it's critical to understand these backing principles.

## 100% Open Source

All of the primary technology that enables SweetOps is Open Sourced by [Cloud Posse](https://cloudposse.com) and the community under Apache 2.0. Using open source licensing is a practical, deliberate strategy. It enables SweetOps to be easily adopted, less risky, and distribution of all tools and IaC is straight forward. It protects all parties to reuse the software and fosters collaboration.

## Automate Everything

A important ideal from the beginning has been to ensure that all pieces of the process are automated. This includes everything from AWS account creation to configuring incident response management tooling. Ensuring that all aspects of SweetOps are automated makes processes repeatable, transparent, and reliable without having to depend on quickly outdated documentation (aka WikiOps).

## Code should be Small and Composable

The SweetOps infrastructure as code library, purpose built tools, and reusable catalogs are all crafted to be small, composable, and do only one thing well. This allows SweetOps to **share nothing** and supports mixing and matching reusable code to help build your unique architecture.

## YAML Configuration Drives As Much As Possible

SweetOps has adopted YAML as its configuration language of choice. YAML is a portable, well understood configuration format that is widely known and accepted within the DevOps community. It easily used in any language and has many advantages over using configuration formats.

Particularly of note is the comparison of YAML to Terraform's tfvar files as it's not possible to load tfvar files from remote locations, do interpolations, or control which files we want to load. YAML supports all of these shortcomings while also supporting [anchors](https://helm.sh/docs/chart_template_guide/yaml_techniques/#yaml-anchors) and allowing us the ability to define our own behaviors like imports and inheritance.
