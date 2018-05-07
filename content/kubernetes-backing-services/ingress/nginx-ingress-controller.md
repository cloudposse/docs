---
title: "Nginx Ingress Controller"
excerpt: ""
---
Nginx Ingress Controller is a type of [Ingress controller](https://kubernetes.io/docs/concepts/services-networking/ingress/#ingress-controllers) that uses [ConfigMap](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#create-a-configmap) to store the nginx configuration.
# Dependencies

None
# Install

Add to your [Kubernetes Backing Services](doc:backing-services) Helmfile this code

##### Helmfile
```yaml
# https://github.com/cloudposse/helmfiles/blob/master/library/nginx-ingress.yaml
repositories:
- name: cloudposse-incubator
  url: https://charts.cloudposse.com/incubator/

releases:
- name: ingress
  namespace: kube-system
  labels:
    job: kube-system
  chart: cloudposse-incubator/nginx-ingress
  version: 0.1.7
  set:
  - name: replicaCount
    value: 4
  - name: resources.limits.cpu
    value: 20m
  - name: resources.limits.memory
    value: 256Mi
  - name: resources.requests.cpu
    value: 10m
  - name: resources.requests.memory
    value: 128Mi
  - name: nginx-default-backend.replicaCount
    value: 2
  - name: nginx-default-backend.resources.limits.cpu
    value: 2m
  - name: nginx-default-backend.resources.limits.memory
    value: 5Mi
  - name: nginx-default-backend.resources.requests.cpu
    value: 1m
  - name: nginx-default-backend.resources.requests.memory
    value: 3Mi
```

Then do [Helmfile]({{< relref "tools/helmfile.md" >}}) sync follow instructions

# Usage

After install you the ingress controller, then you can create [Ingress Resources](/kubernetes-backing-services/ingress/) with [kubectl]({{< relref "kubernetes/kubectl.md" >}}) or specifying them in [Helm Chart](/helm-charts) values directly or with [Helmfile]({{< relref "tools/helmfile.md" >}}).

Here are some examples: (see tabs)

##### kubectl-resource.yaml
```yaml
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: chartmuseum
spec:
  rules:
  - host: example.com
    http:
      paths:
      - path: /
        backend:
          serviceName: chartmuseum-service
          servicePort: 80
```


##### values.yaml
```yaml
ingress:
  enabled: true
  hosts:
    example.com:
        - /
```


##### helmfile
```yaml
repositories:
- name: stable
  url: https://kubernetes-charts.storage.googleapis.com

releases:
- name: charts
  chart: stable/chartmuseum
  version: 1.3.1
  set:
  - name: ingress.enabled
    value: true
  - name: ingress.hosts.example\.com[0]
    value: /

```



##### :warning: Helm chart values are specific for chart
> There is no unified specification for helm chart values structure. Different charts may have very different structures to values. The only way to know for sure what is supported is to refer to the chart.
 >
 >Provided examples are based on the `stable/chartmuseum` chart https://github.com/kubernetes/charts/blob/master/stable/chartmuseum
