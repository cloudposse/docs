---
title: Roles & Responsibilities
description: ''
---

The following matrix outlines various components and responsibilities that establishes who amongst the various teams involved are Responsible, Accountable, Consulted, and Informed for each action or component. We use the [RACI Matrix]({{< relref "project-management/raci-matrix.md" >}}) to assign responsibilities.

# Roles

There are four teams involved in these processes. Team membership is not exclusive. Members may be part of multiple teams.

| Team                     | Abbreviation | Description                                                                                                                                                                                                                      |
|:-------------------------|:-------------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **DevOps Engineering**   | **DEVOPS**   | Engineers specializing on developing infrastructure and tools that allow Software Engineers to specify how the application would be run.Responsible for creating and support monitoring, alerting and backup/restore of systems. |
| **Software Engineering** | **DEV**      | Full Stack Engineers who work on software development, create tests and specify how that soft will be run in the cluster. Use tools provided by DevOps and QA engineers.                                                         |
| **QA Engineering**       | **QA**       | Engineers developing tools and frameworks that simplify creation of tests.                                                                                                                                                       |
| **Engineering Managers** | **MGMT**     | Project managers with technical expertise.                                                                                                                                                                                       |

# Responsibilities

These are the responsibility of various roles.

| Responsibilities                                        | Responsible | Accountable | Consulted | Informed |
|:--------------------------------------------------------|:------------|:------------|:----------|:---------|
| Chart Development                                       | DEV         | DEV         | DEVOPS    | DEVOPS   |
| Integration Tests                                       |             |             |           |          |
| Unit Tests                                              |             |             |           |          |
| Acceptance Tests                                        |             |             |           |          |
| On Call / Pager Duty                                    |             |             |           |          |
| Infrastructure as Code(e.g. kops)                       |             |             |           |          |
| Backing Services(e.g. databases)                        |             |             |           |          |
| Platform Services(E.g. kube2iam, external-dns, ingress) |             |             |           |          |
| Chart Code Reviews                                      |             |             |           |          |
| Chart Deployment                                        |             |             |           |          |
| CI/CD Pipelines                                         |             |             |           |          |
| Dockerization                                           |             |             |           |          |
| Docker Code Reviews                                     |             |             |           |          |
| Terraform Code Reviews                                  |             |             |           |          |
| Terraform Modules                                       |             |             |           |          |
| Software Development                                    |             |             |           |          |
