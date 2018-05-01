---
title: "Postmortem Template"
excerpt: ""
---
# Incident #1 - Descriptive Name of Incident (2018-06-06)
[block:parameters]
{
  "data": {
    "0-0": "On-call Engineer",
    "1-0": "Start Time",
    "2-0": "End Time",
    "3-0": "Total Duration",
    "4-0": "Affected Systems",
    "1-1": "2018-06-06 12:58 PST",
    "2-1": "2018-06-06 13:55 PST",
    "3-1": "39 Minutes",
    "0-1": "John Doe",
    "4-1": "Production Web Tier"
  },
  "cols": 2,
  "rows": 5
}
[/block]
# Summary

## TL;DR

A brief explanation of what happened and what went wrong. 

## Overview

This should read like an executive summary of the problem. It should include:
* When did it start, end and total duration
* It should be entirely blameless - do not assign blame to individuals, only to processes
* List affected systems and if customers were affected

## FIVE whys

Explain why the outage happened. Ask "why" for each reason given.

1. Reason 1
2. Reason 2
3. Reason 3
4. Reason 4
5. Reason 5

## Unexplained problems

Explain what is not understood, even after the post-mortem.

## Remediations

List of actions performed to resolve the problem:

* E.g. rolled back site to the previous version

### What did *not* help/work:

These attempted remediations had no positive impact.

* E.g. rebooting nodes, restarting processes

# TODO List

## Short term

List short-term planned fixes with links to the ticketing system. These are fixes that should be carried out ASAP.

* Fix 1
* Fix 2
    
## Medium term

* Fix 3
* Fix 4

## Other Considerations

* List other suggestions to reduce/mitigate/eliminate the root cause


# Appendix

## Supporting Charts 

* Include screenshots from monitoring systems (E.g. Pingdom, Datadog, Prometheus, etc)

## Related Post Mortems

* List any related Post Mortems

## Reference Links
* Include links to relevant documentation, GitHub Issues, etc.