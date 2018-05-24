---
title: "Cluster Portal"
description: ""
---

[Cluster portal](https://github.com/cloudposse/charts/tree/master/incubator/portal) allow to access
internal dashboards after authorization with third party [oAuth]() service.

Cluster portal use [oauth2proxy](https://github.com/bitly/oauth2_proxy) as component
responsible for authentification.

# Dependencies

* [External DNS]({{< relref "kubernetes-backing-services/external-dns/external-dns.md" >}})
* [Kube Lego]({{< relref "kubernetes-backing-services/tls-management/kube-lego-lets-encrypt.md" >}})

# Install

Starting installation the `portal` you need to define `hostname` used to access the portal.
In our example it would be `portal.us-west-2.staging.example.com`.
Replace with value to suit your specific project.

## Create oAuth2 application

For authentification we need to create oAuth2 application on one of external providers.

As oAuth callback url use `https://portal.us-west-2.staging.example.com/oauth2/callback`
Replace with value to suit your specific project.

### Github Auth provider

To create oAuth2 application you can follow one of this instructions:
* [oAuth2Proxy with Github](https://github.com/bitly/oauth2_proxy#github-auth-provider)
* [Github creating oAuth app](https://developer.github.com/apps/building-oauth-apps/creating-an-oauth-app/)

As the result of creation oAuth2 app you need `Client ID` and `Client Secret`.

#### Create team

With Github Auth provider you need restrict access to the portal by membership users
in the `github organization` and in the `team` belog to it.

For more details read [Creating organization](https://help.github.com/articles/creating-a-new-organization-from-scratch/)
and [Organizing members into teams](https://help.github.com/articles/organizing-members-into-teams/)

In our example we will use `example-org` as the organization and `staging-team` as the team.

## Installing on Kubernetes

You can install `portal` in a few different ways, but we recomend to use the [Master Helmfile](https://github.com/cloudposse/geodesic/blob/master/rootfs/conf/kops/helmfile.yaml).

### Install with Master Helmfile

[Master Helmfile](https://github.com/cloudposse/geodesic/blob/master/rootfs/conf/kops/helmfile.yaml)
use Github auth provider and have configured to expose next dashboards:

* [Kubernetes Dashboard]({{< relref "kubernetes-platform-services/dashboard/kubernetes-ui-dashboard.md" >}})
  - Acceptable by https://dashboard.portal.us-west-2.staging.example.com
* [Prometheus]({{< relref "kubernetes-backing-services/monitoring/prometheus-alerts-grafana.md" >}})
  - Acceptable by https://prometheus.portal.us-west-2.staging.example.com
* [Alert Manager]({{< relref "kubernetes-backing-services/monitoring/prometheus-alerts-grafana.md" >}})
  - Acceptable by https://alerts.portal.us-west-2.staging.example.com
* [Grafana]({{< relref "kubernetes-backing-services/monitoring/prometheus-alerts-grafana.md" >}})
  - Acceptable by https://grafana.portal.us-west-2.staging.example.com
* [External Documentation](https://docs.cloudposse.com)

This environment variables are required.

1. Set the `PORTAL_HOSTNAME` secret with chamber or Dockerfile to base `hostname`
2. Set the `PORTAL_INGRESS` secret with chamber or Dockerfile to `ingress host`
3. Set the `PORTAL_OAUTH2_PROXY_GITHUB_CLIENT_ID` secret with chamber to Github oAuth app `Client ID`
4. Set the `PORTAL_OAUTH2_PROXY_GITHUB_CLIENT_SECRET` secret with chamber to Github oAuth app `Client Secret`
5. Set the `PORTAL_OAUTH2_PROXY_GITHUB_ORGANIZATION` secret with chamber or Dockerfile to Github `Organization name`
6. Set the `PORTAL_OAUTH2_PROXY_GITHUB_TEAM` secret with chamber or Dockerfile to Github `Team name`
7. Set the `PORTAL_OAUTH2_PROXY_COOKIE_NAME` secret with chamber to `random value`
8. Set the `PORTAL_OAUTH2_PROXY_COOKIE_SECRET` secret with chamber to `random value`
9. Do branging of cluster dashboard with this variables:
  * Set the `PORTAL_TITLE` secret with chamber or Dockerfile
  * Set the `PORTAL_BRAND` secret with chamber or Dockerfile
  * Set the `PORTAL_BRAND_IMAGE_URL` secret with chamber or Dockerfile
  * Set the `PORTAL_BRAND_IMAGE_FAVICON_URL` secret with chamber or Dockerfile
  * Set the `PORTAL_BRAND_IMAGE_WIDTH` secret with chamber or Dockerfile (default 35)
This image illustrate where branding configs goes
{{< img src="/assets/cluster-portal-9fada4bb.png" title="" >}}

10. Run then install `portal` using `helmfile sync`.

{{% dialog type="code-block" icon="fa fa-code" title="Install kube-lego" %}}
```
chamber write kops PORTAL_HOSTNAME portal.us-west-2.staging.example.com
chamber write kops PORTAL_INGRESS ingress.us-west-2.staging.example.com
chamber write kops PORTAL_OAUTH2_PROXY_GITHUB_CLIENT_ID e76XXXXXXXXXXXXXX9a0
chamber write kops PORTAL_OAUTH2_PROXY_GITHUB_CLIENT_SECRET b24XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXa1c
chamber write kops PORTAL_OAUTH2_PROXY_GITHUB_ORGANIZATION example-org
chamber write kops PORTAL_OAUTH2_PROXY_GITHUB_TEAM staging-team
chamber write kops PORTAL_OAUTH2_PROXY_COOKIE_NAME $(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1)
chamber write kops PORTAL_OAUTH2_PROXY_COOKIE_SECRET $(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1)
chamber write kops PORTAL_TITLE "Staging Example"
chamber write kops PORTAL_BRAND "Staging Cluster"
chamber write kops PORTAL_BRAND_IMAGE_URL "https://raw.githubusercontent.com/cloudposse/helm-chart-scaffolding/master/logo.png"
chamber write kops PORTAL_BRAND_IMAGE_FAVICON_URL "https://cloudposse.com/wp-content/uploads/sites/29/2016/04/favicon-152.png"
chamber exec kops -- helmfile -f /conf/kops/helmfile.yaml --selector namespace=kube-system,chart=portal sync
```
{{% /dialog %}}

These are some of the environment variables you may want to configure:

* `PORTAL_OAUTH2_PROXY_REPLICA_COUNT` - Count of `oauth2proxy` pods
* `PORTAL_OAUTH2_PROXY_IMAGE_TAG` - Version of [`oauth2proxy` image](https://hub.docker.com/r/cloudposse/oauth2-proxy/)
* `PORTAL_DASHBOARD_REPLICA_COUNT`- Count of portal `dashboard` pods
* `PORTAL_DASHBOARD_IMAGE_TAG` - Version of [`nginx` image](https://hub.docker.com/_/nginx/)

And few environment variables useful for backends

* [Kubernetes Dashboard]({{< relref "kubernetes-platform-services/dashboard/kubernetes-ui-dashboard.md" >}})
  - `PORTAL_BACKEND_K8S_DASHBOARD_NAME` - Menu item name for [kubernetes dashboard]({{< relref "kubernetes-platform-services/dashboard/kubernetes-ui-dashboard.md" >}})
  - `PORTAL_BACKEND_K8S_DASHBOARD_ENDPOINT` - Internal endpoint to [kubernetes dashboard]({{< relref "kubernetes-platform-services/dashboard/kubernetes-ui-dashboard.md" >}})
* [Prometheus]({{< relref "kubernetes-backing-services/monitoring/prometheus-alerts-grafana.md" >}})
  - `PORTAL_BACKEND_PROMETHEUS_NAME` - Menu item name for [prometheus ui]({{< relref "kubernetes-backing-services/monitoring/prometheus-alerts-grafana.md" >}})
  - `PORTAL_BACKEND_PROMETHEUS_ENDPOINT` - Internal endpoint for [prometheus ui]({{< relref "kubernetes-backing-services/monitoring/prometheus-alerts-grafana.md" >}})
* [Alert Manager]({{< relref "kubernetes-backing-services/monitoring/prometheus-alerts-grafana.md" >}})
  - `PORTAL_BACKEND_ALERTS_NAME` - Menu item name for [alert manager ui]({{< relref "kubernetes-backing-services/monitoring/prometheus-alerts-grafana.md" >}})
  - `PORTAL_BACKEND_ALERTS_ENDPOINT` - Internal endpoint [alert manager ui]({{< relref "kubernetes-backing-services/monitoring/prometheus-alerts-grafana.md" >}})
* [Grafana]({{< relref "kubernetes-backing-services/monitoring/prometheus-alerts-grafana.md" >}})
  - `PORTAL_BACKEND_GRAFANA_NAME` - Menu item name for [grafana]({{< relref "kubernetes-backing-services/monitoring/prometheus-alerts-grafana.md" >}})
  - `PORTAL_BACKEND_GRAFANA_ENDPOINT` - Internal endpoint for [grafana]({{< relref "kubernetes-backing-services/monitoring/prometheus-alerts-grafana.md" >}})
* [External Documentation](https://docs.cloudposse.com)
  - `PORTAL_BACKEND_DOCS_NAME` - Menu item name for documentation
  - `PORTAL_BACKEND_DOCS_ENDPOINT` - Endpoint for documentation

Environment variables can be specified in the Geodesic Module's `Dockerfile` or using [Chamber]({{< relref "tools/chamber.md" >}}) storage, which is recommended for all secrets.

### Install with Custom Helmfile

Add to your [Kubernetes Backing Services](/kubernetes-backing-services) Helmfile this code

{{% include-code-block  title="helmfile.yaml" file="kubernetes-platform-services/dashboard/examples/portal-helmfile.yaml" language="yaml" %}}
{{% include-code-block  title="values-portal.yaml" file="kubernetes-platform-services/dashboard/examples/values-portal.yaml" language="yaml" %}}

Then follow the instructions for running [`helmfile sync`]({{< relref "tools/helmfile.md" >}}).

# Usage

Open https://portal.us-west-2.staging.example.com/oauth2/callback process authorization on Github
and use dashboards.
