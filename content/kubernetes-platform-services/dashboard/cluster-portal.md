---
title: "Cluster Portal"
description: "Cluster Portal is a collection of dashboards that expose several services behind an OAuth2 proxy"
weight: 2
---

[Cluster portal](https://github.com/cloudposse/charts/tree/master/incubator/portal) allows to access
internal dashboards after authorization with a third party [OAuth2](https://en.wikipedia.org/wiki/OAuth) service like GitHub, GitLab or Okta.

Cluster Portal follows the [BeyondCorp](https://www.beyondcorp.com/) security model and uses the Bitly [`oauth2-proxy`](https://github.com/bitly/oauth2_proxy) as an Identity Aware Proxy ("IAP").

# Dependencies

* [External DNS]({{< relref "kubernetes-backing-services/external-dns/external-dns.md" >}})
* [Kube Lego]({{< relref "kubernetes-backing-services/tls-management/kube-lego-lets-encrypt.md" >}})

# Installation

To install the `portal`, you will need to define the `hostname`, which is the FQHN used to access the `portal`.

In our example, we use `portal.us-west-2.staging.example.com` as the FQHN. Replace this with an appropriate value to suit your specific project.

## Create OAuth2 Application

For authentication we'll need to create an OAuth2 application with one of the supported external providers.

The OAuth2 callback URL should be `https://portal.us-west-2.staging.example.com/oauth2/callback`

Replace the FQHN to suit your specific project.

### GitHub Auth Provider

To create OAuth2 application, follow these instructions:

1. [Create a GitHub OAuth2 App](https://developer.github.com/apps/building-oauth-apps/creating-an-oauth-app/) to obtain `Client ID` and `Client Secret`
2. [Configure OAuth2 Proxy](https://github.com/bitly/oauth2_proxy#github-auth-provider) to configure OAuth2 proxy using the `Client ID` and `Client Secret` from the previous step

#### Create Team

With GitHub OAuth provider you need to restrict access to the `portal` by user membership
in the GitHub `organization` and in the `team` belonging to it.

For more details read [Creating organization](https://help.github.com/articles/creating-a-new-organization-from-scratch/)
and [Organizing members into teams](https://help.github.com/articles/organizing-members-into-teams/)

In our example we will use `example-com` as the organization and `staging-team` as the team.

### GitLab Auth Provider

To create OAuth2 application, follow these instructions:

1. [Create a GitLab OAuth2 App](https://docs.gitlab.com/ce/integration/oauth_provider.html) to obtain `Application ID` (use as `Client ID`) and `Secret` (use as `Client Secret`). Pay attention to setting the correct [list of redirect URI](https://docs.gitlab.com/ce/integration/img/oauth_provider_application_form.png)
2. [Configure OAuth2 Proxy](https://github.com/bitly/oauth2_proxy#gitlab-auth-provider) to configure OAuth2 proxy using the `Client ID` and `Client Secret` from the previous step

{{% dialog type="info" icon="fa fa-info-circle" title="Note" %}}
If you are using self-hosted `GitLab` you have to set
```
-login-url="<your gitlab url>/oauth/authorize"
-redeem-url="<your gitlab url>/oauth/token"
-validate-url="<your gitlab url>/api/v4/user"
```
{{% /dialog %}}

## Installing on Kubernetes

You can install `portal` in a few different ways, but we recommend using the [Helmfile](https://github.com/cloudposse/helmfiles/blob/master/helmfile.d/0620.portal.yaml).

### Install with Master Helmfile

[Helmfile](https://github.com/cloudposse/helmfiles/blob/master/helmfile.d/0620.portal.yaml)
uses GitHub OAuth provider and is configured to expose the following dashboards:

* [Kubernetes Dashboard]({{< relref "kubernetes-platform-services/dashboard/kubernetes-ui-dashboard.md" >}})
  - accessible at `https://dashboard.portal.us-west-2.staging.example.com`
* [Prometheus]({{< relref "kubernetes-backing-services/monitoring/kube-prometheus.md" >}})
  - accessible at `https://prometheus.portal.us-west-2.staging.example.com`
* [Alert Manager]({{< relref "kubernetes-backing-services/monitoring/kube-prometheus.md" >}})
  - accessible at `https://alerts.portal.us-west-2.staging.example.com`
* [Grafana]({{< relref "kubernetes-backing-services/monitoring/kube-prometheus.md" >}})
  - accessible at `https://grafana.portal.us-west-2.staging.example.com`
* [External Documentation](https://docs.cloudposse.com)

#### Adding Additional Tabs

If you want to add some additional tabs, follow these instructions:

1. Exit the Geodesic Module Shell
2. Create file `/conf/kops/values/portal.backends.yaml` with config for your tabs. For example

{{% include-code-block title="/conf/kops/values/portal.backends.yaml" file="kubernetes-platform-services/dashboard/examples/example-portal.backends.yaml" language="yaml" %}}

3. [Rebuild the Geodesic Module]({{< relref "geodesic/module/quickstart.md#build-install" >}})
4. [Run into the Geodesic Module shell]({{< relref "geodesic/module/quickstart.md#run-the-shell" >}})
5. Proceed to [Helmfile sync]({{< relref "#helmfile-sync" >}})

#### Helmfile sync

{{% dialog type="warning" icon="fa fa-exclamation-circle" title="Breaking changes" %}}
For [helmfiles](https://github.com/cloudposse/helmfiles) version >= 0.7.0
these environment variables have been changed starting (please use the new variables):
* `PORTAL_OAUTH2_PROXY_GITHUB_CLIENT_ID` -> `PORTAL_OAUTH2_PROXY_CLIENT_ID`
* `PORTAL_OAUTH2_PROXY_GITHUB_CLIENT_SECRET` -> `PORTAL_OAUTH2_PROXY_CLIENT_SECRET`
{{% /dialog %}}

These environment variables are required:

* Set `PORTAL_HOSTNAME` with chamber or Dockerfile pointing to the cluster `hostname`
* Set `PORTAL_INGRESS` with chamber or Dockerfile to `ingress host`
* Set `PORTAL_OAUTH2_PROXY_COOKIE_NAME` with chamber to a random string
* Set `PORTAL_OAUTH2_PROXY_COOKIE_SECRET` with chamber to a random string

##### GitHub Auth Provider
* Set `PORTAL_OAUTH2_PROXY_CLIENT_ID` with chamber to GitHub OAuth app `Client ID`
* Set `PORTAL_OAUTH2_PROXY_CLIENT_SECRET` with chamber to GitHub OAuth app `Client Secret`
* Set `PORTAL_OAUTH2_PROXY_GITHUB_ORGANIZATION` with chamber or Dockerfile to GitHub `Organization name`
* Set `PORTAL_OAUTH2_PROXY_GITHUB_TEAM` with chamber or Dockerfile to GitHub `Team name`

##### GitLab Auth Provider
* Set `PORTAL_OAUTH2_PROXY_CLIENT_ID` with chamber to GitLab OAuth app `Application ID`
* Set `PORTAL_OAUTH2_PROXY_CLIENT_SECRET` with chamber to GitLab OAuth app `Secret`
* Set `PORTAL_OAUTH2_PROXY_REDIRECT_URL` with chamber to `https://<PORTAL_HOSTNAME>/oauth2/callback`

If you are using selfhosted `GitLab`
* Set `PORTAL_OAUTH2_PROXY_LOGIN_URL` with chamber to `<your gitlab url>/oauth/authorize`
* Set `PORTAL_OAUTH2_PROXY_REDEEM_URL` with chamber to `<your gitlab url>/oauth/token`
* Set `PORTAL_OAUTH2_PROXY_VALIDATE_URL` with chamber to `<your gitlab url>/api/v4/user`

Customize the portal UI appearance with these environment variables:

* Set `PORTAL_TITLE` with chamber or Dockerfile
* Set `PORTAL_BRAND` with chamber or Dockerfile
* Set `PORTAL_BRAND_IMAGE_URL` with chamber or Dockerfile
* Set `PORTAL_BRAND_IMAGE_FAVICON_URL` with chamber or Dockerfile
* Set `PORTAL_BRAND_IMAGE_WIDTH` with chamber or Dockerfile (default 35)

This image shows a customized portal UI
{{< img src="/assets/cluster-portal-9fada4bb.png" title="Example: Customized Cluster Portal" >}}

These environment variables you may want to update:

* `PORTAL_OAUTH2_PROXY_REPLICA_COUNT` - `oauth2-proxy` pods replica count
* `PORTAL_OAUTH2_PROXY_IMAGE_TAG` - version of [`oauth2-proxy` image](https://hub.docker.com/r/cloudposse/oauth2-proxy/)
* `PORTAL_DASHBOARD_REPLICA_COUNT`- portal `dashboard` pods replica count
* `PORTAL_DASHBOARD_IMAGE_TAG` - version of [`nginx` image](https://hub.docker.com/_/nginx/)

Use these environment variables to configure the backends:

* [Kubernetes Dashboard]({{< relref "kubernetes-platform-services/dashboard/kubernetes-ui-dashboard.md" >}})
  - `PORTAL_BACKEND_K8S_DASHBOARD_NAME` - menu item name for [kubernetes dashboard]({{< relref "kubernetes-platform-services/dashboard/kubernetes-ui-dashboard.md" >}})
  - `PORTAL_BACKEND_K8S_DASHBOARD_ENDPOINT` - internal endpoint for [kubernetes dashboard]({{< relref "kubernetes-platform-services/dashboard/kubernetes-ui-dashboard.md" >}})
* [Prometheus]({{< relref "kubernetes-backing-services/monitoring/kube-prometheus.md" >}})
  - `PORTAL_BACKEND_PROMETHEUS_NAME` - menu item name for [prometheus ui]({{< relref "kubernetes-backing-services/monitoring/kube-prometheus.md" >}})
  - `PORTAL_BACKEND_PROMETHEUS_ENDPOINT` - internal endpoint for [prometheus ui]({{< relref "kubernetes-backing-services/monitoring/kube-prometheus.md" >}})
* [Alert Manager]({{< relref "kubernetes-backing-services/monitoring/kube-prometheus.md" >}})
  - `PORTAL_BACKEND_ALERTS_NAME` - menu item name for [alert manager ui]({{< relref "kubernetes-backing-services/monitoring/kube-prometheus.md" >}})
  - `PORTAL_BACKEND_ALERTS_ENDPOINT` - internal endpoint for [alert manager ui]({{< relref "kubernetes-backing-services/monitoring/kube-prometheus.md" >}})
* [Grafana]({{< relref "kubernetes-backing-services/monitoring/kube-prometheus.md" >}})
  - `PORTAL_BACKEND_GRAFANA_NAME` - menu item name for [grafana]({{< relref "kubernetes-backing-services/monitoring/kube-prometheus.md" >}})
  - `PORTAL_BACKEND_GRAFANA_ENDPOINT` - internal endpoint for [grafana]({{< relref "kubernetes-backing-services/monitoring/kube-prometheus.md" >}})
* [External Documentation](https://docs.cloudposse.com)
  - `PORTAL_BACKEND_DOCS_NAME` - menu item name for documentation
  - `PORTAL_BACKEND_DOCS_ENDPOINT` - endpoint for documentation

Environment variables can be specified in the Geodesic module's `Dockerfile` or using [Chamber]({{< relref "tools/chamber.md" >}}) storage, which is recommended for all secrets.

Install the `portal` using `helmfile sync`

{{% include-code-block title="Install portal using helmfile sync" file="kubernetes-platform-services/dashboard/examples/portal-helmfile-sync.txt" %}}

### Install with Custom Helmfile

Add the following code to your [Kubernetes Backing Services](/kubernetes-backing-services) Helmfile:

{{% include-code-block  title="helmfile" file="kubernetes-platform-services/dashboard/examples/portal-helmfile.yaml" language="yaml" %}}

{{% include-code-block  title="values/portal.yaml" file="kubernetes-platform-services/dashboard/examples/values-portal.yaml" language="yaml" %}}

Then follow the instructions for running [`helmfile sync`]({{< relref "tools/helmfile.md" >}}).

# Usage

To access the portal, open `https://portal.us-west-2.staging.example.com` and authenticate using your GitHub credentials.
