---
title: "Core Principles"
description: "Learn more about the core principles that make up the SweetOps methodology."
---

SweetOps is built on a foundational set of core principles that ensure the methodology is comprehensive and reusable across organizations. To fully understand what SweetOps is and how to utilize it effectively, it's critical to understand these backing principles.

## 100% Open Source

All of the primary technology that enables SweetOps is Open Sourced by [Cloud Posse](https://cloudposse.com) and the community under Apache 2.0 Open Source Software License. Using open source licensing is a practical, deliberate strategy. It enables SweetOps to be easily adopted by organizations by using a well-understood license that carries less risk than proprietary licenses. With SweetOps, everything is permissively licensed, which makes Infrastructure as Code more straight forward to adopt. It protects all parties to reuse the software and fosters greater collaboration.

## Automate Everything

An important idea from the beginning has been to ensure that all pieces of the process are automated. This includes everything from AWS account creation to configuring incident response management tooling. Ensuring that all aspects of SweetOps are automated makes processes repeatable, transparent, and reliable without having to depend on quickly outdated documentation (aka WikiOps).

## Embrace the UNIX Philosophy for the Cloud Era

The SweetOps infrastructure as code library, purpose built tools, and reusable catalogs are all crafted to follow the [UNIX Philosophy](https://en.wikipedia.org/wiki/Unix_philosophy); they're intended to be small, simple, readable, and modular in nature which encourages composition.

SweetOps never intends to provide one tool that does it all. It is the polar opposite of platforms like OpenShift and Rancher which attempt to do everything. Instead, SweetOps provides small tools that do one thing well and then stitch them together to achieve the best results. This enables SweetOps users to swap in & out tools as better ones come along.

## YAML Configuration Drives As Much As Possible

SweetOps has adopted YAML as its configuration syntax of choice. YAML is a portable, well-understood configuration format that is widely known and accepted within the DevOps community. It easily used in any language and has many advantages over using configuration formats.

Particularly of note is the comparison of YAML to Terraform's `.tfvar` files which are a form of HCL. With `.tfvar` files it is not possible to load them from remote locations (e.g. over `http://`), do interpolations, or control which files we want to load and when to load them. On the other hand, using YAML, we're able to address all of these shortcomings while also supporting [anchors](https://helm.sh/docs/chart_template_guide/yaml_techniques/#yaml-anchors) and permits us to define additional behaviors like imports and inheritance.
