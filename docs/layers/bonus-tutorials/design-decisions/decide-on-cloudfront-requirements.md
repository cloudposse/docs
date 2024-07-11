---
title: "Decide on CloudFront Requirements"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1365016609/REFARCH-530+-+Decide+on+CloudFront+Requirements
sidebar_position: 100
refarch_id: REFARCH-530
---

# Decide on CloudFront Requirements

## Context and Problem Statement
A CDN such as CloudFront speeds up the user experience primarily in 2 ways.

1. **Caching.** By caching content on a server closer to the user (called the “edge server”), the user can benefit from the much shorter connection path to the nearby server, obtaining responses much more quickly.

2. **Connection Pooling & TLS offloading.** By maintaining a long-lived multiplexed connection to the origin (such as HTTP/2), the edge server can avoid the overhead of creating a new connection for each request and make other optimizations so that it can retrieve the data from the origin server considerably faster than an end user who makes a new connection for each request. Even compared to an end user using HTTP/2, a CloudFront edge server connected to an AWS origin benefits from traffic traveling over the optimized high-speed AWS backbone network and other optimizations built into CloudFront.

CloudFront also offers the ability to limit access to content based on the geographic location of the requester, field-level encryption of HTTP `POST` content, and other features. Typically, there are 3 common use-cases for CloudFront that need to each be addressed in a different way.

## Considered Options

In order to implement your CDN strategy with CloudFront, we’ll need to know a little bit more about how you currently use it and how you intend to use it. Any combination of one or more of the options below is supported but will need to be implemented differently. Keep in mind, as soon as you introduce a CDN, you have to solve the cache invalidation problem.

> _There are only two hard things in Computer Science: cache invalidation and naming things._
> _-- Phil Karlton_
[https://www.karlton.org/2017/12/naming-things-hard/](https://www.karlton.org/2017/12/naming-things-hard/)

### Option 1: Origin Acceleration for Dynamic Content

:::caution
If you intend to also serve static assets behind a CDN, see _Option 2._

:::

#### Pros

- Accelerate delivery of frequently requested content

- Reduce the compute capacity required to serve cacheable content

- Improve SEO
[https://www.semrush.com/blog/how-fast-is-fast-enough-page-load-time-and-your-bottom-line/](https://www.semrush.com/blog/how-fast-is-fast-enough-page-load-time-and-your-bottom-line/)

- Relatively easy to deploy (effectiveness will depend on cache rules and cachabilty of content)

- Handle spikey request traffic

- Speed up TLS connections

- Pipelining requests from the edge to your origins

- Conceal your origin servers from attackers

- More easily mitigate DoS/DDoS  attacks

#### Cons

- More difficult, less payoff for caching private assets

- Accidentally cache private content and serve it to another session or leak it publicly

- Not all content is “cacheable” (content with a short lifetime, private content, large content e.g. assets that are GBs in size)

- In frequently accessed content frequently expunged from the cache before getting subsequent hits

### Option 2: Origin Acceleration for Static Assets in S3 (e.g. Images, CSS)

The most common pattern we deploy is supporting [https://cloudposse.atlassian.net/wiki/spaces/CP/pages/1225752577](https://cloudposse.atlassian.net/wiki/spaces/CP/pages/1225752577). We’ll need to know if this is a pattern you intend to utilize, as it has an impact on the strategies for CI/CD. Each strategy will at a minimum require a different terraform component.

:::caution
If you intend to serve static assets behind a CDN, this is the only advisable way of doing it. Rolling updates associated with deployments to Kubernetes or ECS means that serving static assets from your application servers will likely yield inconsistent results during deployments.

:::

#### Recommendations

- Version your assets by release version or commit SHA.

- Release your CSS alongside your images/fonts with relative paths

- Ensure your applications are loading the assets for their version

- Do not use query string style cache busting (easy to cache the wrong version of the asset)

#### Pros

- Relatively easy to implement

- S3 storage is very inexpensive relative to the typical scale of data for static assets

- Easier rollouts/rollbacks (no need to worry about clients requesting the wrong version of the assets)

#### Cons

- An additional deployment target

- If your application was not built with this in mind, it could be costly to update all the hardcoded references to assets. The good news is most modern frameworks when implemented correctly handle this for you automatically.

### Option 3: Edge Lambda Dynamic Processing (Lambda@Edge)

Lambda@Edge lets you run code closer to users of your application, which improves performance and reduces latency. The major benefit is that with Lambda@Edge, you don't have to provision or manage multi-region infrastructure, and you pay only for the compute time you consume - there is no charge when your code is not running.

Common use-cases include Website Security & Privacy, Dynamics server-side applications at the edge, Search Engine Optimization (SEO), Data localization or Intelligent Routing to origins and datacenters, bot mitigation, image transformations (e.g. resizing), A/B Testing, real-time authentication and authorization, user prioritization, user tracking, and analytics.

[https://aws.amazon.com/lambda/edge/](https://aws.amazon.com/lambda/edge/)

#### Pros

- Serve content dynamically generated at the edge without relying on client capabilities

- Reduce overhead on origin servers to generate dynamic content

- See _common use_ _cases above._

#### Cons

- There are tons of restrictions on Edge lambda functions intended to ensure they are ultra-performant and do not tax edge locations. Make sure you’re aware of them.
[https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/edge-functions-restrictions.html](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/edge-functions-restrictions.html)

- Websites that rely on edge content manipulation will require some compensating controls for local development (harder to test and debug)

- The functions are more difficult to implement for _Preview Environments_ due to the complexity around managing lambda functions and deployments with the CDN.

## References

- **Lambda@Edge Design Best Practices**
[https://aws.amazon.com/blogs/networking-and-content-delivery/lambdaedge-design-best-practices/](https://aws.amazon.com/blogs/networking-and-content-delivery/lambdaedge-design-best-practices/)

- **Service Quotas (Limitations)**
[https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cloudfront-limits.html](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cloudfront-limits.html)


