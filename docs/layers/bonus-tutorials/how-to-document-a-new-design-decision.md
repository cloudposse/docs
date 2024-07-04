---
title: "Document a New Design Decision"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1173454868/How+to+Document+a+New+Design+Decision
sidebar_position: 100
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/how-to-guides/tutorials/how-to-document-a-new-design-decision.md
---

# How to Document a New Design Decision

## Problem

During the course of building and managing infrastructure, lots of decisions are made along the way frequently through informal/casual conversations via Slack, Zoom calls, and whiteboarding. Persons involved in making the decisions may come and go. When new team members are onboarded, they lack all the context from previous decisions and need a way to quickly come up to speed. Plus, with so many decisions it’s hard sometimes to remember why a certain decision was made a the time. Usually, we make the best decisions based on the information, best practices, and options available at the time. However, as technology evolves, these options change and it might not be obvious anymore why a particular decision was made or even recalling what options were considered or ruled out.

## Solution

Design Decisions are anything we need to confirm architecturally or strategically before performing the implementation. They should include as much context as possible about what options are considered or ruled out. As part of this process, we’ll want to ask the right questions so we gather the necessary requirements for implementation. Once a decision is made, an should be written to capture the decision. Learn [How to write ADRs](/reference-architecture/how-to-guides/tutorials/how-to-write-adrs).

Design Decision should be created in the [Reference Architecture project](https://cloudposse.atlassian.net/jira/software/c/projects/REFARCH/boards/24/roadmap) in Jira and have the context defined in the Reference Architecture space in Confluence. There’s a specific way to do this so that the interlinking works appropriately. What follows are the instructions for how to do that.

## Process

### Step 1: Create a Jira Issue

1. **Identify the Epic that the Design Decision is associated with.**

1. Review the other decisions to make sure there’s not one that is similar enough. In that case, we should enrich the context of that decision, rather than create a new one.

2. **Create the Design Decision.**

1. Title/Summary _must_ always begin with “Decide on” so that our automation will automatically recognize it as a Design Decision

2. Add the following 3 sections: (see template)

```
## Status
Undecided

## Decision
*

## Consequences
*

```

3. The result should look like this:

<img src="/assets/refarch/cleanshot-2021-10-13-at-11.55.47@2x-20211013-165605.png" height="583" width="901" /><br/>

3. **After hitting “Save” you should see something that looks like this:**

<img src="/assets/refarch/cleanshot-2021-10-13-at-12.00.51@2x-20211013-170108.png" height="258" width="927" /><br/>

4. **Clicking on the title will take you to the confluence page. Add all the context there.**

### Step 2: Create a Confluence Page

The confluence page should contain all the context regarding the design decision. The context includes what options should be considered or ruled out, any pertinent questions, risks and limitations.

Review [our catalog of design decisions](/reference-architecture/design-decisions) for inspiration. Below are some examples.

- [Cold Start](/reference-architecture/fundamentals/design-decisions/cold-start)
- [Foundational Infrastructure](/reference-architecture/fundamentals/design-decisions/foundational-infrastructure)
- [Foundational Platform](/reference-architecture/fundamentals/design-decisions/foundational-platform)
- [Foundational Monitoring Platform](/reference-architecture/fundamentals/design-decisions/foundational-monitoring-platform)
- [Foundational Release Engineering](/reference-architecture/fundamentals/design-decisions/foundational-release-engineering)
- [Foundational Incident Management](/reference-architecture/fundamentals/design-decisions/foundational-incident-management)
- [Foundational Benchmark Compliance](/reference-architecture/fundamentals/design-decisions/foundational-benchmark-compliance)
- [Foundational Application Dependencies](/reference-architecture/fundamentals/design-decisions/foundational-application-dependencies)
- [Archived Decisions](/reference-architecture/fundamentals/design-decisions/archived-decisions)
- [Decide on Datadog Log Forwarding Requirements](/reference-architecture/fundamentals/design-decisions/decide-on-datadog-log-forwarding-requirements)
- [Decide on Terraform State Backend Architecture](/reference-architecture/fundamentals/design-decisions/decide-on-terraform-state-backend-architecture)
- [Decide on Cognito Requirements](/reference-architecture/fundamentals/design-decisions/decide-on-cognito-requirements)
- [Decide on Kinesis Requirements](/reference-architecture/fundamentals/design-decisions/decide-on-kinesis-requirements)
- [Decide on CloudFront Requirements](/reference-architecture/fundamentals/design-decisions/decide-on-cloudfront-requirements)
- [Decide on KMS Requirements](/reference-architecture/fundamentals/design-decisions/decide-on-kms-requirements)
- [Decide on Strategy for Continuous Deployment](/reference-architecture/fundamentals/design-decisions/decide-on-strategy-for-continuous-deployment)
- [Decide on CI/CD Platform](/reference-architecture/fundamentals/design-decisions/decide-on-ci-cd-platform)
- [Decide on Strategy for Managing and Orchestrating Secrets](/reference-architecture/fundamentals/design-decisions/decide-on-strategy-for-managing-and-orchestrating-secrets)
- [Decide on API Gateway Requirements](/reference-architecture/fundamentals/design-decisions/decide-on-api-gateway-requirements)
- [Decide on IPv4 and IPv6 support](/reference-architecture/fundamentals/design-decisions/decide-on-ipv4-and-ipv6-support)
- [Decide on IAM Roles for GitHub Action Runners](/reference-architecture/fundamentals/design-decisions/decide-on-iam-roles-for-github-action-runners)

## References

- [https://adr.github.io/madr/](https://adr.github.io/madr/)

