---
title: "How will fluentd be rolled out?"
description: "We deploy fluentd as a DaemonSet that runs on all nodes."
tags:
- fluentd
- DaemonSet
- logs
---

## Question

How will `fluentd` be rolled out?


## Answer

We deploy `fluentd` as a `DaemonSet` that runs on all nodes. It forwards/annotates all logs with contextual information, then ships it to a log sink. We've used Datadog logs, CloudWatch logs, and ElasticSearch. It supports a multitude of other backends, including Splunk and S3.

More information is available [here.](https://github.com/cloudposse/charts/tree/master/incubator/fluentd-kubernetes)
