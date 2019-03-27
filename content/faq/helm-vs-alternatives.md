---
title: "What are the reasons for using Helm over some alternatives?"
description: "Of the tools out there, Helm has probably a 1000x lead over the others."
tags:
- Helm
- K8s
- Kubernetes
- YAML
---

## Question

What are the reasons for using Helm over some alternatives (e.g. Draft, Gitkube, Ksonnet, Metaparticle, Scaffold, and Terraform)?


## Answer

Tiller potentially introduces well-known security concerns. There are plans for removing it, but no ETA yet when that will be released.

The only constant in the K8s ecosystem is that it’s constantly changing and evolving. Helm is a very intrusive decision, and there are many alternative approaches. Of those, Ksonnet is most interesting, since it presents a pretty terse way of expressing Kubernetes resources and is the result of years of research into developing a concise language for JSON manipulation. Then again, coding in JSON isn't our fave either (Cloud Formation = evil).

Here's the deal. Yes, there are a lot of alternatives and the ecosystem is rapidly expanding. Of the tools out there, Helm has probably a 1000x lead over the others. It sucks to template YAML. We’re not a fan. It sucks to have the Tiller deployed. If we consider "academic ideals," then we can probably select some other approach today that is incrementally better than Helm. However, to put things into perspective, we've spent thousands of hours getting everything running on Kubernetes using Helm Charts provided by the community (who have in turn spent thousands of hours developing those charts). We cannot begin to imagine the scope-of-work to use any other tool and the SME required to redraft that many services (probably 10x the cost). It would be possible to take a hybrid approach where some core/central services are deployed via Helm, then deploy custom services using a different strategy. This would optimize perhaps the developer experience. However, it  introduces yet another way of deploying software to the cluster. We're open to alternative approaches, but it’s not our standard recommendation.

Side rant: We’ve see a lot of beautiful demos of "easy deployments" on Kubernetes. Kelsey Hightower has one that makes us green with envy. However, all the ones we’ve seen (including his) fall apart when you want to deploy real apps (not `hello world`). For example, take a look at the Helm Chart for [Grafana](https://github.com/helm/charts/blob/master/stable/grafana/templates/deployment.yaml) or Prometheus. It would be a massive effort to port something like that to any other mechanism. There  are  approximately 15 more resources.

Multiply this number by 10 for all the other services: `external-dns`, `kiam`, `prometheus`, `prometheus-operator`, `alert-manager`, `nginx-ingress`, and `fluentd`. It’s no small feat.
