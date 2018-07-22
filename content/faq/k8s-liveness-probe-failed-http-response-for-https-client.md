---
title: "Liveness probe failed: ... server gave HTTP response to HTTPS client"
description: "Ensure `scheme` is http and that service does not return a `301` or `302` redirect to an `https://` scheme."
tags:
- kubernetes
- healthcheck
- probe
---

# Question

While trying to deploy the `master` branch of our app to a new namespace in staging, we're getting the following error:

```
Liveness probe failed: Get https://100.112.158.75:3000/healthz: http: server gave HTTP response to HTTPS client
```

# Answer

Ensure that the scheme of the probes match that of the service. Since TLS usually terminates at the ingress, services should typically define `scheme: HTTP`.

Review the [kubernetes documentation](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/#configure-probes) for setting the `scheme` on `readinessProbes` and `livenessProbes` for complete details.

Also, make sure that the service does not issue a 301 or 302 redirect. That will also cause this error. For example, it's common for applications to automatically redirect non-TLS requests (`http://`) to the TLS version (`https://`). If this is the case for your application, we recommend disabling automatic redirects for the probe path (e.g. `/healthz`).
