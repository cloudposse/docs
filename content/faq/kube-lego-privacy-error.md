---
title: "Error: Your connection is not private"
---

# Question

We're using `kube-lego` together with the standard nginx ingress controller for kubernetes. The site was working fine with TLS, but after we change the hostname and redeployed, we started getting the following error.

{{< img src="/assets/kube-lego-privacy-error-9d1bee77.png" title="TLS Privacy Error" >}}

# Answer

This is usually cause by a stale `kube-lego` secret which is used to store the Let's Encrypt certificates. If the secret was previously created by a different hostname, `kube-lego` doesn't know to regenerate it. Try deleting the secret containing the TLS certificates for your service. After this, `kube-lego` should automatically regenerate the certificates. Worst case, redeploy your service after deleting the secret.

{{% dialog type="info" icon="fa fa-info-circle" title="Note" %}}
If the service was deployed as part of a helm chart, then deleting the release will not be sufficient to delete the `kube-lego` secret. This is because the secret is not created by the helm chart, but by `kube-lego`. Manually delete the TLS secret containing the `kube-lego` certificates for your service. 
{{% /dialog %}}
