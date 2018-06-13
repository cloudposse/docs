---
title: "Error: UPGRADE FAILED: failed to create resource: namespaces \"...\" not found"
description: "Quick fix: `helm delete --purge` the release and try again."
---

# Question

{{% include-code-block title="Helm Upgrade Failed" file="faq/examples/helm-upgrade-failed.txt" language="sh" %}}

# Answer

This usually happens when the state of the resources (e.g. `Deployments`, `Services`, `Namespaces`, etc) in the kubernetes cluster does not match what Helm knows about. In the example above, the namespace had been deleted without first deleting the helm releases. So `helm` attempted to perform an upgrade on a non-existent resource.

To fix this, simply delete the errant helm release. In this case, we would run the following command to delete the `pr-1627-app` helm release.

```
helm delete --purge pr-1627-app
```

To avoid this, only use `helm` commands to operate on kubernetes resources.
