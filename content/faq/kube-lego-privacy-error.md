---
title: "Error: Your connection is not private"
description: "If your getting a TLS error for a service leveraging `kube-lego`, then try deleting the TLS secret to let `kube-lego` generate a new one."
tags:
- kube-lego
- nginx-ingress
- tls
- kubernetes
- letsencrypt
---

# Question

We're using `kube-lego` together with the standard nginx ingress controller for kubernetes. The site was working fine with TLS, but after we changed the hostname and redeployed, we started getting the following error.

{{< img src="/assets/kube-lego-privacy-error-9d1bee77.png" title="TLS Privacy Error" >}}

# Answer

This may be caused by a stale `kube-lego` secret which is used to store the Let's Encrypt certificates. If the secret was previously created with a different hostname, `kube-lego` doesn't seem to realize that it should regenerate it. Try deleting the secret containing the TLS certificates for your service. After this, `kube-lego` should automatically regenerate the certificates. Worst case, redeploy your service after deleting the secret.

{{% dialog type="info" icon="fa fa-info-circle" title="Note" %}}
If the service was deployed as part of a helm chart, then deleting the release will not be sufficient to delete the `kube-lego` secret. This is because the secret is not created by the helm chart, but by `kube-lego`. Manually delete the TLS secret containing the `kube-lego` certificates for your service. 
{{% /dialog %}}

# Other Considerations

* Make sure that `external-dns` is working and that all public DNS names are resolvable. Let's Encrypt makes a request to `/.well-known/acme-challenge`, so functioning DNS is a requirement.
* Make sure that Let's Encrypt API limits haven't been reached. Tailing the logs of `kube-lego` will provide more information about what's going on.

# Troubleshooting Resources

- Review JetStack's Troubleshooting resources: <https://github.com/jetstack/kube-lego#troubleshooting>
- Review GitHub Issues: <https://github.com/jetstack/kube-lego/issues>
