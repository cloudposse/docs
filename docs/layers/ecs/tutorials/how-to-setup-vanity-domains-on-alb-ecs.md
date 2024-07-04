---
title: "Setup Vanity Domains on an ALB"
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/how-to-guides/tutorials/how-to-setup-vanity-domains-on-alb-ecs.md
tags:
  - network
  - dns
  - alb
  - ecs
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

# How to Setup ECS Vanity Domains on an existing ALB used for Service Discovery Domains

## Pre-requisites
* [Understand the differences between Vanity Domains and Service Discovery Domains](/reference-architecture/reference/learning-resources/#the-difference-between-vanity-domains-and-service-discovery-domains)
* [Setup Network Architecture](/reference-architecture/setup/network/)
  * Only requires `dns-primary` & `dns-delegated` to be deployed.

## Context

After setting up your [Network Architecture](/reference-architecture/setup/network/) you will have 2 hosted zones in each platform account.

In `dev` for example, you will have Hosted Zones for `dev-acme.com` and `dev.platform.acme.com`.

You should also have an ACM certificate that registers `*.dev-acme.com` and `*.dev.platform.acme.com`.

Also ensure you've deployed applications to your ECS cluster and have two ALBs for service discovery, one public, one private.

Now we want to set up a vanity subdomain for `echo-server.dev-acme.com` that will point to one of the ALBs used for service discovery. This saves us money by not requiring a new ALB for each vanity domain.

## Implementation

The implementation of this is fairly simple. We add additional certificates to our ECS Cluster ALBs, then we add another route to the ALB Listener Rules.

### Setup ACM Certs

By default, our `dns-primary` component will create ACM certs for  `*.dev-acme.com`. Depending on the level of subdomains you want, you may need to disable this with the variable `request_acm_certificate: false`

If a single subdomain is sufficient. e.g. `api.dev-acme.com` then you can leave this enabled.

See the troubleshooting section if you run into issues with recreating resources.

## How it works

With a valid ACM cert for your domains we configure the ECS Cluster ALBs to use the certificate. This is done by adding the certificate to the ECS Clusters stack configuration.

You can validate your cert is picked up by the ALB by checking the ALB's target group. You should see the certificate listed under the `Certificates` tab.

### Adding the Cert to the ECS Cluster ALBs

Here is a snippet of a stack configuration for the ECS Cluster. Note the `additional_certs` variable which declares which additional certs to add to the ALB.
```yaml
components:
  terraform:
    ecs/cluster:
      vars:
        alb_configuration:
          public:
            internal_enabled: false
            # resolves to *.public-platform.<environment>.<stage>.<tenant>.<domain>.<tld>
            route53_record_name: "*.public-platform"
            additional_certs:
              - "dev-acme.com"
          private:
            internal_enabled: true
            route53_record_name: "*.private-platform"
            additional_certs:
              - "dev-acme.com"
```

With this our ECS Cluster ALB supports `*.dev-acme.com`, we now need to update our service to point to this new domain as well. We can use the following snippet:
```yaml
components:
  terraform:
    ecs/platform/service/echo-server:
      vars:
        vanity_domain: "dev-acme.com"
        vanity_alias:
          - "echo-server.dev-acme.com"

```

## Troubleshooting

The problem with this comes when you need to remove a subdomain or ACM certificate. By running `atmos terraform deploy dns-delegated -s plat-<region>-dev` with `request_acm_certificate: false`, you are trying to destroy a single ACM certificate in an account. While this is a small scope deletion, the ACM certificate is in use by the ALB, and the ALB has many different targets. Thus Terraform will stall out.

:::warning
This is a **destructive** operation and will cause downtime for your applications.

:::

You need to:
1. Delete the listeners and targets of the ALB that are using the certificate
2. Delete the ALB
3. Terraform will then successfully delete the ACM certificate.

You will notice:
1. The ALB will be recreated
2. Ingresses should reconcile for service discovery domains
3. ALB Targets should be recreated pointing at service discovery domains.

Once you recreate the correct ACM certificates and have valid ingresses you should be able to access your applications via the vanity domain.