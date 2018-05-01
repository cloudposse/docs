---
title: "Nginx Ingress Controller"
excerpt: ""
---
Nginx Ingress Controller is a type of [Ingress controller](https://kubernetes.io/docs/concepts/services-networking/ingress/#ingress-controllers) that uses [ConfigMap](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#create-a-configmap) to store the nginx configuration.
[block:api-header]
{
  "title": "Dependencies"
}
[/block]
None
[block:api-header]
{
  "title": "Install"
}
[/block]
Add to your [Kubernetes Backing Services](doc:backing-services) Helmfile this code
[block:code]
{
  "codes": [
    {
      "code": "# https://github.com/cloudposse/helmfiles/blob/master/library/nginx-ingress.yaml\nrepositories:\n- name: cloudposse-incubator\n  url: https://charts.cloudposse.com/incubator/\n\nreleases:\n- name: ingress\n  namespace: kube-system\n  labels:\n    job: kube-system\n  chart: cloudposse-incubator/nginx-ingress\n  version: 0.1.7\n  set:\n  - name: replicaCount\n    value: 4\n  - name: resources.limits.cpu\n    value: 20m\n  - name: resources.limits.memory\n    value: 256Mi\n  - name: resources.requests.cpu\n    value: 10m\n  - name: resources.requests.memory\n    value: 128Mi\n  - name: nginx-default-backend.replicaCount\n    value: 2\n  - name: nginx-default-backend.resources.limits.cpu\n    value: 2m\n  - name: nginx-default-backend.resources.limits.memory\n    value: 5Mi\n  - name: nginx-default-backend.resources.requests.cpu\n    value: 1m\n  - name: nginx-default-backend.resources.requests.memory\n    value: 3Mi",
      "language": "yaml",
      "name": "Helmfile"
    }
  ]
}
[/block]
Then do [Helmfile](doc:helmfile) sync follow instructions
[block:api-header]
{
  "title": "Usage"
}
[/block]
After install you the ingress controller, then you can create [Ingress Resources](doc:ingress) with [kubectl](doc:kubectl) or specifying them in [Helm](doc:helm-charts) values directly or with [Helmfile](doc:helmfile). 

Here are some examples: (see tabs)
[block:code]
{
  "codes": [
    {
      "code": "apiVersion: extensions/v1beta1\nkind: Ingress\nmetadata:\n  name: chartmuseum\nspec:\n  rules:\n  - host: example.com\n    http:\n      paths:\n      - path: /\n        backend:\n          serviceName: chartmuseum-service\n          servicePort: 80",
      "language": "yaml",
      "name": "kubectl-resource.yaml"
    },
    {
      "code": "ingress:\n  enabled: true\n  hosts:\n    example.com:\n        - /",
      "language": "yaml",
      "name": "values.yaml"
    },
    {
      "code": "repositories:\n- name: stable\n  url: https://kubernetes-charts.storage.googleapis.com\n\nreleases:\n- name: charts\n  chart: stable/chartmuseum\n  version: 1.3.1\n  set:\n  - name: ingress.enabled\n    value: true\n  - name: ingress.hosts.example\\.com[0]\n    value: /\n    ",
      "language": "yaml",
      "name": "helmfile"
    }
  ]
}
[/block]

[block:callout]
{
  "type": "warning",
  "title": "Helm chart values are specific for chart",
  "body": "There is no unified specification for helm chart values structure. Different charts may have very different structures to values. The only way to know for sure what is supported is to refer to the chart. \n\nProvided examples are based on the `stable/chartmuseum` chart https://github.com/kubernetes/charts/blob/master/stable/chartmuseum"
}
[/block]