---
title: "What is the DNS resolution time like when using `external-dns`?"
description: "The DNS controller picks up new DNS entries almost immediately and registers them with Route 53."
tags:
- DNS
- resolution time
- external-dns
- TTL
---

## Question

How fast is the DNS resolution time when handled by `external-dns`? Do you just set low TTLs?

## Answer

The `external-dns` controller picks up the new DNS entries almost immediately and registers them with Route 53. 

However, for this to work well, the zone's `SOA` record TTL must be low. This is because the SOA acts like the equivalent of a DNS 404 page, but for DNS. That's why we set the SOA TTL to something really short like 30 or 60 seconds to ensure negative caching won’t cause problems. This happens if someone tries to view the URL before the DNS was created. There's roughly a 20-30 second period where that might be the case, but in practice we never see it. That's because when using `helm` for deployments, we tell it to wait for all health checks to pass before completing, which is always longer than the time necessary for the DNS controller to pick up and register the DNS entries.
