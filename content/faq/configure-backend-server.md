---
title: "Are we able to configure our backend server logs to forward to S3?"
description: "Yes, we deploy `fluentd` as a `DaemonSet` that runs on all nodes."
tags:
- fluentd
- DaemonSet
- logs
---

## Question

Are we able to configure our backend server logs to forward to S3 for use by our data team?


## Answer

Yes, we deploy `fluentd` as a `DaemonSet` that runs on all nodes. It forwards all logs with contextual information, then ships it to a log sink. It supports a multitude of other backends, including S3.
