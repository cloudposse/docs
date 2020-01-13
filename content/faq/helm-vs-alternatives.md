---
title: "What are the reasons for using Helm over some alternatives?"
description: "Helm is the only available package manager for Kubernetes."
tags:
- Helm
- K8s
- Kubernetes
- YAML
---

## Question

What are the reasons for using Helm over some alternatives (e.g. Draft, Gitkube, Ksonnet, Metaparticle, Scaffold, and Terraform)?


## Answer

There used to be many valid security concerns over deploying a Helm Tiller (v2) in Kubernetes clusters. These concerns were all addressed in Helm v3, which is tillerless.

Let's face it: the only constant in the K8s ecosystem is that it’s constantly changing and evolving. Helm is one of the be options available today and there are many alternative approaches. Of those, Ksonnet is was interesting, since it presents a pretty terse way of expressing Kubernetes resources and is the result of years of research into developing a concise language for JSON manipulation. But with the acquisition of Heptio, the project was abandoned. Then again, coding in JSON isn't our favorite pastime either; just like writing raw Cloud Formation is a horrible experience.

Here's the deal. There are a lot of alternative strategies for deploying applications to kubernetes and the ecosystem is rapidly expanding. The most important distinction to make regarding `helm` is that it's a package manager that does some templating. All the other alternatives out there are strictly template engines. Templating is not enough and is the equivalent of managing an operating system with only tarballs and `sed`; it can be done, but you can't find a single operating system out there that works that way. Kubernetes is a modern incarnation of a cloud-native operating system. It needs a package manager and critical mass is behind Helm. Of the tools out there, Helm has probably a 1000x lead over the others. While we are not in favor of using `gotemplates` for YAML, it's an implementation detail; for example, helm v3 will add support for Lua. What helm does is provide an interface for package management. How it does it on the backend can and will evolve.

While there are a number of aspects of helm we're not fond of and there are some other more elegant approaches to defining kubernetes resources, we urge our customers to put things into perspective. We've spent thousands of hours getting everything running on Kubernetes using Helm Charts provided by the community (who have in turn spent thousands of hours developing those charts). We cannot begin to imagine the scope-of-work to use any other tool and the SME required to re-draft that many services (probably 10x the cost). It would be possible to take a hybrid approach where some core/central services are deployed via Helm, then deploy custom services using a different strategy. This would optimize perhaps the developer experience. However, it introduces yet another way of deploying software to the cluster. We're open to alternative approaches, but it’s not our standard recommendation and we defer to the kubernetes community at large to provide thought leadership in this area.

Even if there is an interesting new project for deploying to Kubernetes, there is still an overwhelming reason to use helm. The [community provides hundreds of battle tested, continually updated charts](https://hub.helm.sh). Porting these to any other "flavor of the week" deployment tool will be a monumental task. For example, take a look at the Helm Chart for [Grafana](https://github.com/helm/charts/blob/master/stable/grafana/templates/deployment.yaml) or Prometheus. It would be a massive effort to port something like that to any other mechanism. Then multiply that times the 15-20 other services we typically depend on in a production-grade cluster deployment.  For example: `external-dns`, `kiam`, `prometheus`, `prometheus-operator`, `alert-manager`, `nginx-ingress`, and `fluentd`. It’s no small feat. Therefore for now, since helm has critical mass, we recommend sticking with it.

**Side rant:** We’ve see a lot of beautiful demos out there of "easy deployments" on Kubernetes. The ease of use embody what we aspire to achieve, but are not reflective of the current reality of deploying complex interdependent applications, many of which are not "cloud native". Most of these demos showcase a "hello world" example that brushes over the challenging requirements such as secrets management, IAM roles, persistence & durability, backups, backing services, rollbacks, canary deployments, mesh routing, monitoring & alerting, etc. Getting all the pieces to fit together is the hardpart that is difficult to dumb down. 


