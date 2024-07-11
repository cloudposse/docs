---
title: "Horizontal Pod Autoscaling (HPA)"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1197834268
sidebar_position: 100
---

# How to use Datadog Metrics for Horizontal Pod Autoscaling (HPA)

## Problem

The native Kubernetes Horizontal Pod Autoscaler has only the ability to scale pods horizontally based on primitive metrics such as CPU and Memory. Your application is more complex and needs to scale based on other dimensions of data, such as queue depth. You have the data, but it’s in Datadog and you need some way for Kubernetes to scale based on complex insights.

## Solution

:::tip
**TL;DR**: Ensure the Datadog Cluster Agent Metrics Server is enabled, enable Kubernetes Integrations Autodiscovery as needed, then create `HorizontalPodAutoscaler` manifests referencing `DatadogMetric` objects or the Datadog query directly.

:::

The Datadog Cluster Agent has a metrics server feature which, as of Kubernetes v1.10, can be used for Horizontal Pod Autoscaling.

This means that metrics automatically collected by Datadog Cluster Agent can be leveraged in HorizontalPodAutoscaler k8s objects.

Take for example the following HorizontalPodAutoscaler manifest, which leverages the `nginx.net.request_per_s` metric automatically collected by Datadog Cluster Agent:

```
apiVersion: autoscaling/v2beta1
kind: HorizontalPodAutoscaler
metadata:
  name: nginxext
spec:
  minReplicas: 1
  maxReplicas: 5
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: nginx
  metrics:
  - type: External
    external:
      metricName: nginx.net.request_per_s
      metricSelector:
        matchLabels:
            kube_container_name: nginx
      targetAverageValue: 9
```

This leverages the already-existing metrics collection plane for out-of-the-box Kubernetes metrics (see: [https://docs.datadoghq.com/agent/kubernetes/data_collected/](https://docs.datadoghq.com/agent/kubernetes/data_collected/) for the list of native Kubernetes metrics automatically collected by the Datadog Cluster Agent)

This also opens up the possibility for Horizontal Pod Autoscaling capabilities for homegrown application Deployments, where metrics exported via Prometheus / OpenMetrics will be collected by the Datadog Cluster Agent and leveraged in HorizontalPodAutoscaler definitions.

Lastly, Datadog metrics integrations exist for applications such as Redis, Nginx, which are auto-discoverable via annotations (see: [https://docs.datadoghq.com/getting_started/integrations/](https://docs.datadoghq.com/getting_started/integrations/) )

1. Use `eks-datadog` component (already created by Cloud Posse) and override [https://github.com/DataDog/helm-charts/blob/main/charts/datadog/values.yaml#L551](https://github.com/DataDog/helm-charts/blob/main/charts/datadog/values.yaml#L551)  to enable the metrics server ([https://github.com/DataDog/helm-charts/blob/dae884481c5b3c9b67fc8dbd69c944bf3ec955e9/charts/datadog/values.yaml#L1318](https://github.com/DataDog/helm-charts/blob/dae884481c5b3c9b67fc8dbd69c944bf3ec955e9/charts/datadog/values.yaml#L1318)  must be set to true as well, which is already the case by default). Also, ensure Prometheus scraping is enabled ([https://github.com/DataDog/helm-charts/blob/main/charts/datadog/values.yaml#L425](https://github.com/DataDog/helm-charts/blob/main/charts/datadog/values.yaml#L425) )

2. For home grown applications, ensure Prometheus metrics are being exported by the application via an exported within the Kubernetes Pod.

3. For home grown applications, ensure the appropriate Datadog Prometheus / OpenMetrics collection configuration is present within the Pod annotations in the Deployment manifest ([https://docs.datadoghq.com/agent/kubernetes/prometheus/#simple-metric-collection](https://docs.datadoghq.com/agent/kubernetes/prometheus/#simple-metric-collection) )

4. For off-the-shelf applications, configure the additional values required to insert the Datadog annotations into the Kubernetes manifests templated by the public Helm Chart — for example adding the Redis integration auto-discovery annotations into the Pod manifest ([https://github.com/bitnami/charts/blob/ba9f72954d8f21ff38018ef250477d159378e8f7/bitnami/redis/values.yaml#L275](https://github.com/bitnami/charts/blob/ba9f72954d8f21ff38018ef250477d159378e8f7/bitnami/redis/values.yaml#L275) )

5. Optional but recommended: create `DatadogMetric` objects with the queries you will use to base HPA on.

6. Create appropriate `HorizontalPodAutoscaler` manifests referencing the `DatadogMetric` objects within the same namespace as the HPA (or alternatively the query directly, if not using `DatadogMetric` objects).

### References

- [https://www.datadoghq.com/blog/autoscale-kubernetes-datadog/](https://www.datadoghq.com/blog/autoscale-kubernetes-datadog/)

- [https://docs.datadoghq.com/agent/kubernetes/integrations/?tab=kubernetes#pagetitle](https://docs.datadoghq.com/agent/kubernetes/integrations/?tab=kubernetes#pagetitle)

- [https://github.com/DataDog/helm-charts/tree/main/charts/datadog](https://github.com/DataDog/helm-charts/tree/main/charts/datadog)


