---
title: "Use API Gateway REST API vs HTTP API"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1252950021/Use+API+Gateway+REST+API+vs+HTTP+API
sidebar_position: 100
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/reference/adrs/use-api-gateway-rest-api-vs-http-api.md
---

# Use API Gateway REST API vs HTTP API

:::info Needs Update!

The content in this ADR may be out-of-date and needing an update. For questions, please reach out to Cloud Posse

:::

## Status
**DECIDED**

## Problem
When using the [AWS API Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/welcome.html), users must choose between creating a REST API or an HTTP API.

## Context
AWS supports multiple types of API Gateways and there are tradeoffs between them. This document will help decide which flavor of API Gateway is suitable for your use case.

### Differences

|**Category/Feature** | **HTTP API** (formerly known as v2) | **REST API** (formerly known as v1)|
| ----- | ----- | ----- |
|**Authorizers** |  | |
|Cognito | Partial Support. Cognito can be used only as a JWT token issuer. | ✔|
|Native OpenID Connect / OAuth 2.0 | ✔ | |
|**Integration** |  | |
|Private integrations with Application Load Balancers | ✔ | |
|Private integrations with AWS Cloud Map | ✔ | |
|Mock |  | ✔|
|**API Management** |  | |
|Usage plans (e.g. rate limiting) |  | ✔|
|API keys |  | ✔|
|TLS | ✔ <br/>(Does not support TLS 1.0) | ✔|
|**Development** |  | |
|API caching |  | ✔|
|Request body transformation |  | ✔|
|Request / response validation |  | ✔|
|Test invocation (e.g. test backend via AWS console) |  | ✔|
|Automatic deployments | ✔ | |
|Default stage | ✔ | |
|Default route | ✔ | |
|Custom Gateway Responses |  | ✔|
|Canary Deployments |  | ✔|
|**Security** |  | |
|Certificates for backend authentication |  | ✔|
|AWS WAF |  | ✔|
|Resource Policies |  | ✔|
|**Deployment Options** |  | |
|Regional | ✔ | ✔|
|Edge-Optimized (Cloudfront) |  | ✔|
|Private |  | ✔|
|**Monitoring** |  | |
|Access logs to Amazon Kinesis Data Firehose |  | ✔|
|Execution logs |  | ✔|
|AWS X-Ray |  | ✔|

## Decision

**DECIDED**: Use REST API (formerly known as v1) because it checks all the boxes
