---
title: "Ingress"
description: ""
---
Configuring a web server or load balancer used to be harder than it should be, especially since most web server configuration files are very similar. The Ingress resource makes this whole problem go away. It provides round-robin load balancing, automatic SSL termination, and name-based virtual hosting.

Typically, services and pods have IPs only routable by the cluster network. All traffic that ends up at an edge router is either dropped or forwarded elsewhere. Conceptually, this might look like:


#####
```yaml
    internet
        |
  ------------
  [ Services ]
```

An Ingress is a collection of rules that allow inbound connections to reach the cluster services.


#####
```yaml
     internet
        |
   [ Ingress ]
   --|-----|--
   [ Services ]
```

It can be configured to give services externally-reachable URLs, load balance traffic, terminate SSL, offer name based virtual hosting, and more. Users request ingress by POSTing the Ingress resource to the API server. An Ingress controller is responsible for fulfilling the Ingress, usually with a loadbalancer, though it may also configure your edge router or additional frontends to help handle the traffic in an HA manner.

A typical Ingress might look like:

##### ingress-resource.yaml
```yaml
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: test-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
  - http:
      paths:
      - path: /testpath
        backend:
          serviceName: test
          servicePort: 80
```


# Ingress Controllers

In order for the Ingress resource to work, the cluster must have an Ingress controller running. Only one ingress controller per cluster is required.

An Ingress Controller is a daemon, deployed as a Kubernetes Pod, that watches the API server's /ingresses endpoint for updates to the Ingress resource. Its job is to satisfy requests for Ingresses.

{{% dialog type="info" icon="fa fa-book" title="Note" %}}
In theory, you can install several ingress controllers, for example, for different types of service.
This would require you to specify explicitly which instance of the ingress controller to associate with. Therefore, we recommend to only have one controller per cluster.
{{% /dialog %}}

Here is a list of controllers we support:

* [Nginx Ingress Controller]({{< relref "kubernetes-backing-services/ingress/nginx-ingress-controller.md" >}})

{{% dialog type="info" icon="fa fa-book" title="Read More" %}}
https://kubernetes.io/docs/concepts/services-networking/ingress
{{% /dialog %}}
