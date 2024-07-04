---
title: "Architecture Diagrams"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1176109758/Architecture+Diagrams
sidebar_position: 100
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/reference/architecture-diagrams.md
---

# Architecture Diagrams
We provide a number of boilerplate architecture diagrams. Think of them as templates that can be copied and used throughout your organization. Reach out to Cloud Posse PMs if you’d like a copy of any one of them.

## Available Diagrams

Don’t see the diagram you need? Let us know via the `#refarch-docs` channel.

## 4 Layers of Infrastructure

The 4 Layers of Infrastructure depict the various layers and lifecycles associated with provisioning infrastructure from the bottom up. Each layer introduces new tools and builds upon the previous layers. The SDLC of each layer is independent from the other layers, and each layer must exist before the subsequent layers can be provisioned. As we approach the top of the stack, the layers change more frequently. The lower down we go, the more seldom layers change and frequently more challenging to modify in place.

<a href="https://lucid.app/publicSegments/view/612ad71e-3a0a-4dcb-872a-f9b0bbd0f65d/image.png" target="_blank"><img src="https://lucid.app/publicSegments/view/612ad71e-3a0a-4dcb-872a-f9b0bbd0f65d/image.png" width="960px"/></a>

## 8 Layers of Security

The 8 Layers of Security depict security in depth. Cloud Posse has Terraform support for provisioning the most essential security-oriented products, mostly AWS managed services like AWS SecurityHub or AWS WAF.

<a href="https://lucid.app/publicSegments/view/b55b85c3-7863-4372-8aef-4b820c5da61d/image.jpeg" target="_blank"><img src="https://lucid.app/publicSegments/view/b55b85c3-7863-4372-8aef-4b820c5da61d/image.jpeg" width="960px"/></a>

## Big Picture

The BIg Picture helps paint the story of how there are dozens of services in play. Where possible, we opt for fully managed services by AWS or best-of-breed SaaS alternatives. We reserve the platform (EKS or ECS) for running and operating your applications, which is your competitive advantage.

<a href="https://lucid.app/publicSegments/view/a432cc0a-f6c3-4a71-9c24-a0c9c22d5e1e/image.jpeg" target="_blank"><img src="https://lucid.app/publicSegments/view/a432cc0a-f6c3-4a71-9c24-a0c9c22d5e1e/image.jpeg" width="960px"/></a>

## Security Escalation Architecture

Our approach to Security Escalations has everything flow through SecurityHub and then to Amazon SNS then through to OpsGeneie for Incident Management.

<a href="https://lucid.app/publicSegments/view/78e2842c-473c-44bb-9caf-952e07422424/image.png" target="_blank"><img src="https://lucid.app/publicSegments/view/78e2842c-473c-44bb-9caf-952e07422424/image.png" width="960px"/></a>