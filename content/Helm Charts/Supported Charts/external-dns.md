---
title: "external-dns"
excerpt: "Configure external DNS servers (AWS Route53, Google CloudDNS and others) for Kubernetes Ingresses and Services"
---
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/61e5a81-external-dns.png",
        "external-dns.png",
        1586,
        1587,
        "#aaa7ac"
      ]
    }
  ]
}
[/block]

# FAQ

## Test Metadata API from Container

First, `kubectl exec -it` into a pod/container. Then run the following command:

```
curl http://169.254.169.254/latest/meta-data/iam/security-credentials/`
```