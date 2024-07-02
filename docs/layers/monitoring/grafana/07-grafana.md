# Grafana

## Quick Start

Grafana is built around the Amazon managed services for Grafana and Prometheus. At this time, we have implemented only
the EKS solution, although Grafana and Prometheus are deployed with managed services and are not deployed to an EKS
cluster. In the future, we plan to incorporate ECS support into this monitoring platform.

### Vendoring

Vendor all required components

```console
atmos workflow vendor -f grafana
```

### Deployment

Please see
[How to Setup Grafana](https://docs.cloudposse.com/reference-architecture/how-to-guides/tutorials/how-to-setup-grafana)
for in depth documentation.

However, if you can find the abbreviation steps by Atmos Workflows here. You can choose to run these workflows
one-by-one, or run them altogether with the following:

```console
atmos workflow deploy -f grafana
```

#### Deploy all data sources

Deploy Prometheus and Loki to `plat-dev`, `plat-staging`, and `plat-prod`. Run the following Atmos Workflow:

```console
atmos workflow deploy/data-sources -f grafana -s plat-use1-dev
atmos workflow deploy/data-sources -f grafana -s plat-use1-staging
atmos workflow deploy/data-sources -f grafana -s plat-use1-prod
```

#### Grant the Prometheus Scraper Access to EKS

After deploying the `eks/prometheus-scraper` component, you will need to reapply the `eks/cluster` component with an
update to `var.map_additional_iam_roles`.

```console
atmos terraform output eks/prometheus-scraper -s plat-use1-dev
atmos terraform output eks/prometheus-scraper -s plat-use1-staging
atmos terraform output eks/prometheus-scraper -s plat-use1-prod
```

Note the `scraper_role_arn` and `clusterrole_username` outputs and set them to `rolearn` and `username` respectively
with the `map_additional_iam_roles` input for `eks/cluster`.

```yaml
# stacks/orgs/acme/plat/STAGE/us-east-1/eks.yaml
components:
  terraform:
    eks/cluster:
      vars:
        map_additional_iam_roles:
          # this role is used to grant the Prometheus scraper access to this cluster. See eks/prometheus-scraper
          - rolearn: "arn:aws:iam::111111111111:role/AWSServiceRoleForAmazonPrometheusScraper_111111111111111"
            username: "acme-plat-ue2-sandbox-prometheus-scraper"
            groups: []
```

Then reapply `eks/cluster`:

```console
atmos terraform apply eks/cluster -s plat-use1-dev
atmos terraform apply eks/cluster -s plat-use1-staging
atmos terraform apply eks/cluster -s plat-use1-prod
```

#### Deploy Grafana

Deploy the Amazon Managed Grafana workspace, API key, data-source integrations, and finally dashboards:

```console
atmos workflow deploy/grafana -s core-use1-auto -f grafana
```

### Accessing Grafana

::::info Custom URLs

We would prefer to have a custom URL for the provisioned Grafana workspace, but at the moment it's not supported
natively and implementation would be non-trivial. We will continue to monitor that Issue and consider alternatives, such
as using Cloudfront.

[Issue #6: Support for Custom Domains](https://github.com/aws/amazon-managed-grafana-roadmap/issues/6)

::::

You can access Grafana from the Grafana workspace endpoint that is output by the `grafana` component:

```console
atmos terraform output grafana -s core-use1-auto
```

Or you can open your AWS Single-Sign-On page, navigate to the "Applications" tab, and then select "Amazon Grafana".

[https://d-1111aa1a11.awsapps.com/start/](https://d-1111aa1a11.awsapps.com/start/)
