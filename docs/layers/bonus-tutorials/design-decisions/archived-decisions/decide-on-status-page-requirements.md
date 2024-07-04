---
title: "Decide on Status Page Requirements"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1171947803/REFARCH-467+-+Decide+on+Status+Page+Requirements
sidebar_position: 100
refarch_id: REFARCH-467
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/fundamentals/design-decisions/archived-decisions/decide-on-status-page-requirements.md
---

# Decide on Status Page Requirements

## Problem
The business may be obligated or want to communicate transparently to customers' the availability of all services affecting the platforms/products stability.

## Solution
Use [StatusPage.io](http://StatusPage.io) by Atlassian to integrate with OpsGenie and other dependent services to communicate overall availability.

## Other Considerations
- Should it be **Public** (customer-facing) or **Private** (internal facing only)?

- How to host it?

- What to expose to customers?

- Should it pull in the availability of third-party dependencies? e.g. Twillio API

<img src="/assets/refarch/image-20211109-201417.png" height="1492" width="1444" /><br/>

