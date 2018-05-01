---
title: "Postmortem Example"
excerpt: "Example of a well-executed postmortem for Root Cause Analysis"
---
# Incident #1 - Rollout Caused Unplanned Outage (2017-06-29)

[block:parameters]
{
  "data": {
    "0-0": "On-call Engineer",
    "1-0": "Start Time",
    "2-0": "End Time",
    "3-0": "Total Duration",
    "4-0": "Affected Systems",
    "1-1": "2018-06-29 12:58 PST",
    "2-1": "2018-06-29 13:55 PST",
    "3-1": "39 Minutes",
    "0-1": "Erik Osterman",
    "4-1": "Production Web Tier"
  },
  "cols": 2,
  "rows": 5
}
[/block]

# Summary

## TL;DR

Cascading failures caused prolonged, unplanned site outage. Outage was not caught in staging because there is no server load in staging. Lack of monitoring for critical functionality, led to lost sales.

## Overview

On Thursday, 6/29/2017 ~13:00 we performed a routine ElasticBeanstalk deployment that took the latest artifact from staging and deployed that to production. Shortly afterward, the site started experiencing severe degradation before going entirely offline. 

The rollout included multiple fixes, including WordPress core and plugin updates and `monit` for automatic remediations. Unfortunately, due to the rolling-deployments and specifically the disablement of certain `mod_pagespeed` features for image compression, a perfect storm of events was triggered that led to the outage. The root cause was a fix to disable automatic `.webp` compression due to problems with Safari. When the compression was disabled, there was an increased rate of 404s, which are expensive to serve by WordPress. Since the varnish cache was flushed, the underlying infrastructure could not handle the increase in traffic, which led to maxed out database connections, and constant restarts of failed services as part of the automatic remediations.  

Due to insufficient monitoring, certain conditions were not caught. This meant the fallout of the incident was further prolonged. GadgetReview lost 4-5 days of Amazon Sales because certain WordPress settings were lost.

## Five Whys

The site experienced the classic cascading failure that affected all components (`varnish`, `apache`, `php-fpm`, and database). 

1. **Varnish cache unable to serve stale content**
    1. Varnish was restarted by monit because health check probes (which depend on apache) failed
    2. On restart the cache is purged, which means all requests hit the backend (php + database)
    3. As more cache servers were restarted, the problem cascaded and contributed to increased request load on apache → php-fpm → database

2. **Apache became unresponsive**
    1. Apache was hanging on responses (php-fpm blocked)
    2. Apache was restarted by monit b/c health check probes failed
    3. Since apache was frequently getting restarted, varnish health probes were also failing and marking the backend offline causing the site to flap
    4. See [Incident #2 - GadgetReview Rollout Caused Unplanned Outage (2017-07-06)](https://cloudposse.quip.com/MkEwAYbanvJ8) 

3. **PHP-FPM became unresponsive**
    1. PHP-FPM was blocked waiting on the database
    2. It was blocked as soon as all php-fpm processes were blocked on the database
    3. Scaling out elastic beanstalk nodes then maxed us out on all database connections

4. **Database maxed out**
    1. connections were maxed out
    2. new connection attempts were rejected
    3. PHP-FPM not configured to use transient connections
        `mysqli.allow_persistent = On`
    4. Replica instances were frequently getting automatically restarted (as an automatic remediation by RDS) due to load/lag

5. **Rollout process failed**
    1. Rollout succeed on each node, but rapidly degraded to eventual black-out
    2. Disablement of on-the-fly compression of webp files led to increased 404s
        1. `mod_pagespeed` uses sub http requests to download assets and compress them
        2. Non-upgraded servers were attempting to fetch assets for `.webp` files which didn't exist
        3. Upgraded servers couldn't handle these requests, so they were 404s
        4. Increase Wordpress 404s  → increase database requests/connections
    3. ElasticBeanstalk should have aborted the rollout after the first server failed, however, the servers passed healthchecks and only degraded after the process had moved on to the next server
    4. Since the rollout failed only after moving on, the rollout process was not aborted
    5. Since the rollout was not aborted, ultimately all servers were destablilized at which point the site went offline

## Unexplained problems

* During the rollout, API keys for the `amazon-associates-link-builder` plugin got cleared
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/e82e21a-image_10.png",
        "image (10).png",
        720,
        678,
        "#d2d4d6"
      ]
    }
  ]
}
[/block]
* During the rollout, TablePress options got cleared
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/4204bed-image_11.png",
        "image (11).png",
        720,
        432,
        "#e3e5e5"
      ]
    }
  ]
}
[/block]
## Remediations

List of actions performed to resolve the problem:

* Redeployed previous version of GadgetReview (Igor )

## What did not help/work:

* Continuously/Manually restarted apache & php-fpm to attempt to serve some pages
* Scale out Elastic Beanstalk instances (made problem worse since more instances maxed out DB connections)

## TODO List

### Short term

* Varnish health probe should ping synthetic URI (e.g. /healthcheck) that only tests varnish, [not backends](https://github.com/gadgetreview/wordpress/blob/master/.ebextensions/80-monit.config#L174)
* PHP-FPM should not use persistent mysqli connections
* Ensure wp-plugins are all explicitly activated/deactivated as part of deployment
* Investigate what happens if wordpress plugin activated before all servers upgraded
    

### Medium term

* Replace Varnish Caching with Cloud Front CDN to improve Reliability
* PHP-FPM should be restarted by monit, if not responsive
    http://richard.wallman.org.uk/2010/03/monitor-a-fastcgi-server-using-monit/

### Other Considerations

* Disable Varnish Caching of Images to Reduce Memory Pressure
* Reduce rate of rolling deployments to ensure servers are stable for a longer period of time (~5 minutes)
* Cache 404s for 10-15 seconds to mitigate DoS (self-imposed or otherwise)
* Add Pingdom Monitoring for Amazon Affiliate Codes to ensure `amazon-associates-link-builder` is working
* Add Pingdom Monitoring for TablePress CSS options


# Appendix

## Supporting Charts & Documentation

Prior to rollout, all 3 production instances indicated high memory pressure (90%+), however, swap was still unused so this was acceptable at the time.


### Pingom
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/1f27db8-image_12.png",
        "image (12).png",
        148,
        108,
        "#e8e8e8"
      ]
    }
  ]
}
[/block]

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/89c0050-image_13.png",
        "image (13).png",
        380,
        82,
        "#e8eae9"
      ]
    }
  ]
}
[/block]

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/9d3f441-image_14.png",
        "image (14).png",
        384,
        83,
        "#e8ebea"
      ]
    }
  ]
}
[/block]
### Elastic Beanstalk

ElasticBeanstalk saw a massive increase in requests which manifested as a Denial of Service Attack. This was triggered probably by mod_pagespeed generating pages for webp assets which could not be served by upgraded servers. Varnish does not cache 404s. 
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/af54926-image_15.png",
        "image (15).png",
        1098,
        598,
        "#f6f8fa"
      ]
    }
  ]
}
[/block]

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/dc4dbd3-image_16.png",
        "image (16).png",
        1104,
        590,
        "#f1f5f8"
      ]
    }
  ]
}
[/block]
### RDS 

There were no deadlocks. There was no increase in IOPS (r/w)

#### CPU Utilization spiked.
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/2e1d7be-image_17.png",
        "image (17).png",
        640,
        354,
        "#f2f6f8"
      ]
    }
  ]
}
[/block]
#### Connections peaked and maxed out.
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/8f2e7d3-image_18.png",
        "image (18).png",
        640,
        348,
        "#f7f8f9"
      ]
    }
  ]
}
[/block]
#### Selects went through the roof. 
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/43dfb04-image_19.png",
        "image (19).png",
        640,
        340,
        "#f1f6f8"
      ]
    }
  ]
}
[/block]
#### CPU credits were not exhausted, so we had excess capacity
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/7bd6416-image_20.png",
        "image (20).png",
        640,
        351,
        "#f8f9fa"
      ]
    }
  ]
}
[/block]
#### Commits / Writes went through the roof
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/b7a608c-image_21.png",
        "image (21).png",
        891,
        488,
        "#f5f7f9"
      ]
    }
  ]
}
[/block]
## Related Post Mortems

* [Incident #2 - Rollout Caused Unplanned Outage (2017-07-06)](https://cloudposse.quip.com/MkEwAYbanvJ8)