---
title: "Is there a  path to exposing public static IPs?"
description: "Static IPs of services running inside the cluster are trivial. However, externally available public IPs are a different story."
tags:
- static IP
- public IP
- AWS
- Network Load Balancer
---

## Question

Is there a straightforward path to exposing public static IPs for services?

## Answer

Static IPs of services running inside the cluster are trivial. Simply specify the `ClusterIP` field in the pod spec. However, externally available public IPs are a different story.  This is now possible with the new Network Load Balancers (NLBs) on AWS (announced last re:invent)  However, we haven't tried using them yet with Kubernetes.

It’s quite easy to implement though. Simply add the following annotation to the Service Load Balancer for the ingress to switch from the default mode of `elb` to `nlb`.

  ```
    annotations:
    # by default the type is elb (Classic Load Balancer).
    service.beta.kubernetes.io/aws-load-balancer-type: nlb```

Read more [here.](https://github.com/kubernetes/ingress-nginx/blob/master/deploy/provider/aws/service-nlb.yaml)


NLBs are highly performant and the superior option in the long run. See [here.](https://aws.amazon.com/blogs/aws/new-network-load-balancer-effortless-scaling-to-millions-of-requests-per-second/)
