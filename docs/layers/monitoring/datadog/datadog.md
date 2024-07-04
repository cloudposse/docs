---
title: "Datadog"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1165852673/How+to+Implement+SRE+with+Datadog
sidebar_position: 10
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/how-to-guides/integrations/datadog/datadog.md
---

# How to Implement SRE with Datadog

## Introduction
Cloud Posse advises customers that all have <ins>very similar monitoring requirements</ins> because we filter for customers who match our delivery model. The actual fine-tuning of it will be specific to the customer.

Our goal with this ADR is to identify the reusable, standard SLI/SLO for our customers that we can readily implement time and time again.

Also, make sure to see [How to Implement Incident Management with OpsGenie](/reference-architecture/how-to-guides/tutorials/how-to-implement-incident-management-with-opsgenie)

## Problem
A typical business operating in AWS has literally tens of thousands of data points that leads to analysis paralysis. If we sit down and try to make sense of it all, we realize knowing what is critical and when is non-trivial. Modern advances in monitoring platforms have brought Artificial Intelligence and Anomaly Detection, but those are not foolproof. There is no silver bullet. AI can not tell us what is mission-critical for _our_ business to succeed. That’s because they only see part of the story. They have no visibility into our finances or business objectives.  Defining Service Level Objectives, therefore, becomes paramount and while mathematically trivial to compute, but defining what are services in the context of your organization and what your objectives are, is still very subjective. There’s an overwhelming amount of theory on what we should do, but not that much prescriptive step-by-step advice on how to actually implement it using IaC resulting in a fully functioning system.

## Solution
- Define a process for us to help our customers easily define SLOs that are special to their business

- Define a process for us to identify generalized SLOs for every one of our customers that have a very common stack

- Use SLOs to determine the health of a service, where a service is not always what end-users of the _business,_ but might be internal customers

- Use SLOs to reduce the number of alerts and concentrate them on when specifically the objectives have been violated

## Definitions

**Service** is any group of one or more applications (or “components”) with a shared purpose for some customer (either internal to some team or other service or external with end-users).

**Service Level Indicator (SLI)** A quantitative measurement of a service’s performance or reliability (e.g. the amount of time a transaction took). SLIs may or may not be expressed as percentages. In Datadog, the SLI is implemented as a metric, synthetic or aggregation of one or more monitors. There’s nothing called an SLI in Datadog.

**Service Level Objective (SLO)** A target percentage for an SLI over a specific period of time. It’s always expressed as a percentage. In Datadog it’s a specific resource type defined with a numerator and denominator. A score of 100% is excellent; 0% is dead. Datadog has native support for SLOs as a resource.

**Service Level Agreement (SLA)** An explicit (e.g. contractual agreement) or implicit agreement between a client and service provider stipulating the client’s reliability expectations and service provider’s consequences for not meeting them.

**Error Budget** The allowed amount of unreliability derived from an SLO’s target percentage (100% - target percentage) that is meant to be invested into product development.

- There’s a corresponding Burn Rate associated with an _Error Budget_ that is equally important to understand because it’s the rate of change. Datadog automates burnrate as part of the widget.

**MTTF (mean time to failure)** is the outage _frequency_

**MTTR (mean time to restore)** _is the Outage Duration_ **** and is defined **** as it is experienced by users: lasting from the start of a malfunction until normal behavior resumes.

**Availability** is a percentage defined as `(uptime)/(total length of time)`, using appropriate units (e.g. seconds). or `(1 - (MTTR/MTTF)) x 100%`

**RED method** (Rate, Errors, and Duration) focuses on monitoring your services, leaving their infrastructure aside and giving you an external view of the services themselves—in other words, from the client’s point of view.

**USE method** (Utilization, Saturation, and Errors) focuses on the utilization of resources to quickly identify common bottlenecks; however, this method only uses request errors as an external indicator of problems and is thus unable to identify latency-based issues that can affect your systems as well.

 Some definitions borrowed from Datadog’s [https://docs.datadoghq.com/monitors/service_level_objectives/#key-terminology](https://docs.datadoghq.com/monitors/service_level_objectives/#key-terminology).

## Theory

### Golden Signals (SLIs)

Golden Signals are a form of telemetry that applies to anything with throughput. Anything that’s not a golden signal is considered general telemetry.

- **Latency** - The time it takes to service a request. It’s important to distinguish between the latency of successful requests and the latency of failed requests.

- **Traffic** - A measure of how much demand is being placed on your system, measured in a high-level system-specific metric. For a web service, this measurement is usually HTTP requests per second

- **Errors** - The rate of requests that fail, either explicitly (e.g., HTTP 500s), implicitly (for example, an HTTP 200 success response, but coupled with the wrong content), or by policy (for example, "If you committed to one-second response times, any request over one second is an error")

- **Saturation** - How "full" your service is. A measure of your system fraction, emphasizing the resources that are most constrained (e.g., in a memory-constrained system, show memory; in an I/O-constrained system, show I/O).

These golden signals are closely related to the <ins>[RED metrics](https://www.weave.works/blog/the-red-method-key-metrics-for-microservices-architecture/)</ins> for microservices: rate, errors, and duration, and the older <ins>[USE method](https://www.weave.works/blog/the-red-method-key-metrics-for-microservices-architecture/)</ins> focusing on utilization, saturation, and errors. These signals are used to calculate the service level objectives (SLOs).

Here are other useful metrics that are examples which don’t necessarily fit into the Golden Signals.

- Pull Request: Time to Merge

- Pull Request: Lead Time

- Pull Request: Size (LOC)

- Pull Request: Flow Ratio - the sum of the opened pull request in a day divided by the sum of closed pull requests in that same day. This metric shows whether your team works in a healthy proportion.

- Pull Request: Discussions # Comments

- Pull Request: Force Merged by Admins (bypassing approvals)

- Code Quality

- Static Code Analysis :question_mark:

- Defect Escape Rate

- Customer Experience: Page Load Time

- Customer Experience: Browser Interaction Time

- Customer Experience: Server Error Rate

- Customer Experience: JS Errors

- Log Events

### **Service-Oriented View**

- A service is anything that warrants having an SLO

- A service has a contract with internal parties or external parties to provide a “service” with certain guarantees. Guarantees with a contractual commitment are SLAs.

- Should be able to look at a business service and drill down to the alerts affecting that service

- **What are the services we provide? e.g. API**

- **Who are the consumers of those services? e.g. internal users or customers**

- **Who is the support team of those services?**

## Our Strategy

1. For everything deployed, decide on what qualifies as a “service” for the business

1. Somethings we know what is a service, other things we will need to ask the customer

2. For every service, decide on how to quantify the 4 golden signals, **these are your SLI**s

3. Determine how to create **SLO’s** from these SLIs over time. This should be a simple math formula over time.

4. Incidents are created **ONLY** in response to violations of the SLO for some period of time _t._

1. There should be a 24 hour, 7 day, 30 day and 1 year SLO (for customers).

2. All alerts that relate to some SLO and Incident share same common tag convention.

5. Our SLO Dashboards should be by Service, coalescing into Team Dashboards, which further group into Organization Dashboards.

1. Organization/Team Dashboards should include a list of services (as we can only use DD’s APM Service for things that execute - such as containers, lambdas, and hosts)

2. Each Service Should have Enough Monitors to accurately describe when it is operating **correctly** and when it is not, no more. **Ideally** **1-3 SLIs per User Journey** [[source](https://www.datadoghq.com/videos/solving-reliability-fears-with-service-level-objectives/#focus-on-one-to-three-slis)].

> As Simple as Possible, No Simpler
> To avoid an overly complex, and eventually unmaintainable monitoring system we propose avoiding unnecessary complexity, such as:
> • Alerts on different latency thresholds, at different percentiles, on all kinds of different metrics
> • Extra code to detect and expose possible causes
> • Associated dashboards for each of these possible causes
> The sources of potential complexity are never-ending. Like all software systems, monitoring can become so complex that it’s fragile, complicated to change, and a maintenance burden.
> Therefore, design your monitoring system with an eye toward simplicity. In choosing what to monitor, keep the following guidelines in mind:
> • The rules that catch real incidents most often should be as simple, predictable, and reliable as possible.
> • Data collection, aggregation, and alerting configuration that is rarely exercised (e.g., less than once a quarter for some SRE teams) should be up for removal.
> • Signals that are collected, but not exposed in any prebaked dashboard nor used by any alert, are candidates for removal.
> [https://sre.google/sre-book/monitoring-distributed-systems/](https://sre.google/sre-book/monitoring-distributed-systems/)

## Datadog - Monitoring Platform

### SLIs

Generally, the SLIs should be the _Golden Signals_ for a given service, with one exception: SLIs can be a composite of other SLOs, and this is how an overall site reliability score is achieved. E.g by aggregating and weighting the SLOs into an SLI.

SLIs are always a percentage out of 100%. Percentages are easy to understand by the widest audience and they are relative.

SLIs should be derived values (e.g. from KPIs)

Every SLI may or may not have an SLO. An SLI may be part of one or more SLOs.

<img src="/assets/refarch/image-20211006-041301.png" height="179" width="730" /><br/>

Example SLIs:

-

We need to figure out what the SLIs for a customer should be based on common services deployed (e.g. our service catalog) and the customer’s own services.

1. Who are the users or customers of your service? ...so we know where to measure

1. e.g.

2. Why are they using the service?  ...so we know what’s important

1. E.g.

3. What are they trying to do? ...so we know

4. How do they know if it's "working" or "broken"?

### SLAs

SLAs should be thought of like SLOs but on an annual basis and tied to a contractual commitment (expectations, impacts, and consequences) with customers. These usually have penalties associated with them.

Additionally, SLAs are typically on a calendar year, and not a rolling window of 365 days.

### SLOs

With well-defined SLOs we can ensure that everyone from the business side to engineering is aligned on what’s important and what the goals are for the business at large.

- There is no one SLO. Each logical instance of a service (for example, a database shard) gets its own SLO.

- Combine significant SLIs for a given capability into a single SLO for that capability

- A dashboard must exist that aggregates all SLOs in one place.

- Technically, SLOs are not restricted to just what’s in Datadog, however, that’s just what we’re able to monitor.

- Not every SLO is associated with an SLA

SLOs will not necessarily be the same per business.

|**Business Impact** | **Good examples of SLOs** |  **Bad Examples of SLOs** |
| ----- | ----- | ----- |
|Our SEO experts require that pages respond within 300ms or we will drop in rankings. The website receives most of it’s traffic from natural search. | 99.95% of pages respond with a 200 response code in less than 300ms | CPU utilization is less than 95%<br/><br/>SQL Database Read I/O is at 90% utilization|
|As an e-commerce business, users must be able to add products to their cart and checkout or have no revenue. | 99.99% of cart transactions succeed without error. <br/><br/>99.99% of checkout transactions succeed without error. | |
|As a online store, customers are much more likely to purchase products with images than with placeholder images. | 99.99% of images served are actual product images (e.g.<br/><br/>99.99% of images are served within a latency of 100ms<br/><br/>99.99% of images are served with a status code of 2XX | |

#### Goals

- As few SLOs as possible

- Aggregate as much as possible into an SLO, but for the _right_ audience

#### Erik’s Theory

- SLOs are a simple way to give a team responsible for something know when they aren’t meeting their objectives, as much as they are valuable to provide quality of service to business end-users.

- We can _solve_ the practical implementation of SLOs once for all of our customers, while giving each customer the ability to tailor it to their needs

- SLOs should be thought about like an organization structure, where each node in the org has an SLO

- SLOs where created to support managing SLAs, but nowadays should be valuable to any team. But maybe we should then name them something else, so we don’t trigger a lot of associations with what SLOs are to other people

- SLOs can be valuable to validate our assumptions on how stable some system is (@Jeremy Grodberg 's point on KMS keys)

- SLOs might not have urgent action items, but if they are not urgent, then what should we do? Call them something else?

- SLOs convey the institutional knowledge of what is healthy in a unit everyone understands (percentages) @Jeremy Grodberg

- SLOs convey the health of the system for some period of time @Matt Calhoun

- SLOs should/can also be visualized over time as any other metric

- Bad SLOs can be detrimental, but that only means our objectives were wrong. But having the objectives is what is so valuable, because they can be corrected. We should refine/correct our objectives until they are accurate.

- When SLOs are violated, it might be that the objective was wrong, rather than the systems are failing

- We can boil the ocean with SLOs, but we dont' want to or need to.

- “If a tree falls in a forest and no one was listening does it make a sound?”

- We can have SLOs that are only visible to some, and don’t impact other teams

- It helps us move from “feelings” of why something is violated to concrete explanation

- There are categories, classes or levels of SLOs

- e.g. Capacity Planning SLOs

- e.g. Critical SLOs (or SLA SLOs)

- e.g.  User Journey SLOs [https://cloud.google.com/blog/products/management-tools/practical-guide-to-setting-slos](https://cloud.google.com/blog/products/management-tools/practical-guide-to-setting-slos) - measures a set of interactions a user has with a service to achieve some end result.

- What’s interesting about this kind of SLO, is that it measures an outcome that was influenced by possibly dozens of underlying services

- A system of SLOs should help us identify cascading failures before it’s too late, as the underlying SLOs should fire before higher-level SLOs are affected

- While some might say this is at odds with setting different thresholds on the top-level SLO, I disagree - because the top-level SLOs are/should be the slowest to move as a result of HA/redundancies within the system. It’s when those redundancies are giving out, we need to be very afraid.

### Error Budget

The Error Budget determines risk tolerance. When the budget is depleted (nearing 0%), reliability should be prioritized, which often results in:

- freeze feature releases

- prioritize postmortem items

- improve automation over human toil

- improve monitoring and observability

- consult/collaborate with SRE

When an Error Budget is abundant (remaining error budget > 0%), velocity should be prioritized, which results in:

- release new features

- expected system changes

- try risky (but valuable) experiments

<img src="/assets/refarch/image-20211006-041558.png" height="84" width="927" /><br/>

#### Implementation

SLOs Datadog Setup Page: [https://app.datadoghq.com/slo](https://app.datadoghq.com/slo?_gl=1*w89f70*_ga*OTkwNTc4OTY1LjE2MjYzMDAyMjI.*_ga_KN80RDFSQK*MTYzMzM3ODc3Mi4yOC4wLjE2MzMzNzg3NzIuMA) and terraform provider: [https://registry.terraform.io/providers/DataDog/datadog/latest/docs/resources/service_level_objective](https://registry.terraform.io/providers/DataDog/datadog/latest/docs/resources/service_level_objective)

We should have multiple early indicators (aka thresholds) for when the SLO is in jeopardy: e.g. when 10%, 25%, 50%, 75% of the error budget is exhausted.

- 99.9 = target

- 1 - 99.9 = error budget = 0.10

- “...at this rate, you’ll exhaust the error budget (violate the SLO) in X time.”

Every monitor (SLI) that influences a given SLO should share a common tag value (E.g. `slo:myapp`) with the SLO. In other words, the SLO should be tagged `slo:myapp` and the monitors (SLI) corresponding to that (the _golden signals)_ should also then be tagged `slo:myapp`.

:::caution
Datadog SLOs are implemented on a rolling window, while SLAs are may be tied to a calendar period (e.g. the calendar year).

:::

```
# Create a new Datadog service level objective
resource "datadog_service_level_objective" "foo" {
  name        = "Example Metric SLO"
  type        = "metric"
  description = "My custom metric SLO"
  query {
    numerator   = "sum:my.custom.count.metric{type:good_events}.as_count()"
    denominator = "sum:my.custom.count.metric{*}.as_count()"
  }

  # 7 day rolling window
  thresholds {
    timeframe       = "7d"
    target          = 99.9
    warning         = 99.99
    target_display  = "99.900"
    warning_display = "99.990"
  }

  # 1 month rolling window
  thresholds {
    timeframe       = "30d"
    target          = 99.9
    warning         = 99.99
    target_display  = "99.900"
    warning_display = "99.990"
  }

  # 1 year rolling window (SLA)
  thresholds {
    timeframe       = "365d"
    target          = 99.9
    warning         = 99.99
    target_display  = "99.900"
    warning_display = "99.990"
  }

  tags = ["foo:bar", "baz"]
}
```

Also see: SLO status corrections, SLO replays

Questions:

### Dashboards

- Only SLOs are on the SLO dashboard

- A dashboard must exist that aggregates all SLOs in one place, group logically by some service

<img src="/assets/refarch/image-20211007-052902.png" height="781" width="1400" /><br/>

- Each widget displays an SLO with the remaining error budget.

## FAQ

- **Where is the line drawn between OpsGenie and Datadog?**

- Datadog is only responsible for monitoring and raising alerts tagged with appropriate tags (priority, service, severity, etc)

- The OpsGenie configuration should be thought of as mostly static and it only operates on tags. The OpsGenie configuration should only change when Teams and Escalations change, or when new services are added that need to be associated with teams.

- Everything else should be tag-driven, so that behaviors are regulated almost entirely from within Datadog simply by tagging of alerts.

- We should alert in OpsGenie if an alert doesn’t match any rules, as it’s improperly categorized with tags

- **What events would ever go directly into OpsGenie and not Datadog?**

- Datadog SaaS Issues

- :question_mark: Aws Cloudwatch Metric Alarms (Currently CT → CW → SNS ?→ DD Event)

-

- **How to visualize error budgets and burn rate?**

- [https://docs.datadoghq.com/dashboards/widgets/slo/#setup](https://docs.datadoghq.com/dashboards/widgets/slo/#setup)

- [https://docs.datadoghq.com/monitors/service_level_objectives/error_budget/#overview](https://docs.datadoghq.com/monitors/service_level_objectives/error_budget/#overview)

- [https://docs.datadoghq.com/monitors/guide/slo-checklist/](https://docs.datadoghq.com/monitors/guide/slo-checklist/)

## References

-  [https://devops.com/sres-stop-asking-your-product-managers-for-slos/?utm_source=pocket_mylist](https://devops.com/sres-stop-asking-your-product-managers-for-slos/?utm_source=pocket_mylist)

- [https://cloudplatform.googleblog.com/2018/07/sre-fundamentals-slis-slas-and-slos.html?utm_source=pocket_mylist](https://cloudplatform.googleblog.com/2018/07/sre-fundamentals-slis-slas-and-slos.html?utm_source=pocket_mylist)

- [https://bravenewgeek.com/microservice-observability-part-1-disambiguating-observability-and-monitoring/](https://bravenewgeek.com/microservice-observability-part-1-disambiguating-observability-and-monitoring/?utm_source=pocket_mylist)

- [https://www.datadoghq.com/blog/slo-monitoring-tracking/](https://www.datadoghq.com/blog/slo-monitoring-tracking/)

- [https://www.datadoghq.com/blog/define-and-manage-slos/](https://www.datadoghq.com/blog/define-and-manage-slos/)

- [https://sre.google/sre-book/monitoring-distributed-systems/](https://sre.google/sre-book/monitoring-distributed-systems/)

- [https://cloud.google.com/blog/products/management-tools/practical-guide-to-setting-slos](https://cloud.google.com/blog/products/management-tools/practical-guide-to-setting-slos)

- [https://learn.datadoghq.com/](https://learn.datadoghq.com/)

- [https://sourcelevel.io/blog/5-metrics-engineering-managers-can-extract-from-pull-requests](https://sourcelevel.io/blog/5-metrics-engineering-managers-can-extract-from-pull-requests)

- [https://harness.io/blog/continuous-integration-performance-metrics/](https://harness.io/blog/continuous-integration-performance-metrics/)

- [https://tanzu.vmware.com/content/blog/slis-and-error-budgets-what-these-terms-mean-and-how-they-apply-to-your-platform-monitoring-strategy](https://tanzu.vmware.com/content/blog/slis-and-error-budgets-what-these-terms-mean-and-how-they-apply-to-your-platform-monitoring-strategy)

- [https://newrelic.com/blog/best-practices/best-practices-for-setting-slos-and-slis-for-modern-complex-systems](https://newrelic.com/blog/best-practices/best-practices-for-setting-slos-and-slis-for-modern-complex-systems)

- [https://cloud.google.com/blog/products/devops-sre/sre-at-google-our-complete-list-of-cre-life-lessons](https://cloud.google.com/blog/products/devops-sre/sre-at-google-our-complete-list-of-cre-life-lessons)

- [https://www.datadoghq.com/blog/establishing-service-level-objectives/#picking-good-slis](https://www.datadoghq.com/blog/establishing-service-level-objectives/#picking-good-slis)

- Video: [https://www.datadoghq.com/videos/solving-reliability-fears-with-service-level-objectives/#error-budgets-for-slos](https://www.datadoghq.com/videos/solving-reliability-fears-with-service-level-objectives/#error-budgets-for-slos)

## Appendix

#### Golden Signals Workbook

| |  **Golden Signals**|
| ----- | ----- |
|**Services** | **Latency** | **Traffic** | **Errors** | **Saturation**|
| ----- | ----- | ----- | ----- | ----- |
|**Platform Owners**|
|Kubernetes Cluster: Pod Scheduling |  |  |  | |
|Kubernetes Cluster: Capacity |  | Healthy Nodes / <br/><br/>Total Nodes online |  | |
|Application Deployments | Time to Deploy / <br/>Total time of | Number of Successful Deployments / <br/><br/>Total number of Deployments | 1 - (Unsuccessful Deployments / <br/>       Total Deployments) | Total Time to Deploy in Seconds per Duration / <br/>Seconds in Duration (e.g. 86400 = 1 day)|
|AWS Spend |  |  |  | |
|**Security & Compliance**|
| | Time to Acknowledge<br/><br/> Time to fix |  | False Positives<br/>Number of Security Vulnerabilities | |
| |  |  |  | |
|**Development & PM**|
|Pull Request Throughput | Time to Close or Merge PR / <br/>??? | 1 - (Number of Open PRs / <br/>       Total Number of PRs) | PRs Open with Tests Passing / <br/>Total PRs Open | 1 - (PRs Open / <br/>       Max Number of PRs Acceptable)|
| |  |  |  | |
| |  |  |  | |
| |  |  |  | |
| |  |  |  | |
|Sprint Throughput | Total Number of Sprints to Complete Issues / <br/>Total Number of Issues | Issues Transitioned to Done / <br/>Total Issues in Sprint | Bugs Added to Active Sprint / <br/>Total Issues in Sprint | Total Issues Not Completed / <br/><br/>Total Issues in Sprint|
| |  |  |  | |
|**Microservice / Web Application**|
|HTTP Requests |  |  |  | Notes: INFO, DEBUG log level alerts relative to all alerts.|
|Transactions |  |  |  | |
|Synthetic Requests |  |  |  | |
|**Customer Experience** |  |  |  | |
| |  |  |  | |
| |  |  |  | |
|**CI/CD and Release Management**|
|Lead Time To Deploy |  |  |  | |
|Code Coverage |  |  |  | |
|Test Coverage |  |  |  | |
|GitHub Action Runs | Time to start build |  |  | |
