# Networking

[Previous steps for identity...](https://docs.cloudposse.com/reference-architecture/setup/identity/)

### Requirements

Before deploying the Networking layer, first purchase the vanity and service domains chosen by
ADR [2001](https://docs.cloudposse.com/reference-architecture/reference/adrs/jumpstart/service-discovery-domain/) and [2002](https://docs.cloudposse.com/reference-architecture/reference/adrs/jumpstart/decide-on-vanity-domain/)

When registering a new domain, we have the option of using Route53’s built-in registrar or using
an existing registrar. Many enterprise-scale organizations use MarkMonitor to manage their domain portfolio.
Our convention is to use the `dns` account as the registrar.

**Note**, the AWS Route53 Registrar cannot be automated with Terraform,
so ClickOps is still required for domain registration.

[Registering domain names using Amazon Route 53 - Amazon Route 53](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/registrar.html)

We recommend checking with your legal department on where they want to consolidate domain ownership. It has larger ramifications as to IP/trademark defense.

### VPCs
First, vendor the networking components by running `atmos workflow vendor -f network`

Once this is done, initialize all the VPCs in every configured region by running
`atmos workflow deploy/vpc -f network`.

Next, go ahead and set up the Transit Gateway (TGW) by running `atmos workflow deploy/tgw -f network`.

#### Known Issues

Please NOTE! At this time you will need to make sure that all EKS VPCs are commented out in
the TGW catalog. This is because the components currently have a race condition requiring EKS clusters to exist
before the TGW can be provisioned. This will be fixed in the future, but for now comment out the cluster
variable until clusters are created.

It's worth noting that propagation can fail during provisioning of Transit Gateway spokes.
You'll likely see an error like this:
```
╷
│ Error: reading EC2 Transit Gateway Route Table Propagation (tgw-rtb-*_tgw-attach-*): empty result
│
│   with module.tgw_hub_routes.aws_ec2_transit_gateway_route_table_propagation.default["plat-sandbox"],
│   on .terraform/modules/tgw_hub_routes/main.tf line 71, in resource "aws_ec2_transit_gateway_route_table_propagation" "default":
│   71: resource "aws_ec2_transit_gateway_route_table_propagation" "default" {
│
```

If this happens, you can safely wait a minute or two and then re-attempt the provisioning.

##### Redeploy `tgw` when Deploying a New EKS Cluster

The file `stacks/catalog/tgw/hub.yaml` and the separate `tgw/spokes` in each `stacks/org/**/global-region/network.yaml`
potentially contain references to EKS Clusters using the `eks_component_names` variable. If you add an EKS Cluster,
then you will want to look up the individual `spoke` and `hub` components that are affected. If you are using
cross-region `tgw/cross-region-hub-connector` components, you will also want to update `eks_component_names`
on the regional connections.

```
atmos workflow deploy/tgw -f network
```

### DNS

The DNS stacks are broken up into two kinds: Primary and Delegated.
Primary DNS zones only start with an `NS` record among other defaults and expect the
the owner of their associated domain to add these `NS` records to whatever console manages
the respective domain. Consult the component's README (`components/terraform/dns-primary/README.md`)
for more information.

The delegated DNS zones insert their `NS` records into the primary DNS zone; thus they
are mostly automated. Consult the component's README `components/terraform/dns-delegated/README.md`
for more information.

To start the dns setup, run `atmos workflow deploy/dns -f network`. This will go through
creating primaries, and then follow up with establishing the delegates.

#### Adding `NS` records to the Registered Domain (Click Ops)

In order to connect the newly provisioned Hosted Zone to the purchased domains,
add the `NS` records to the chosen Domain Registrar. Retrieve these with the output
of `dns-primary`. These will need to be manually added to the registered domain.

Shared Service Domain, acme-svc.com
```
atmos terraform output dns-primary -s core-gbl-dns
```

Platform Sandbox Vanity Domain, acme-sandbox.com
```
atmos terraform output dns-primary -s plat-gbl-sandbox
```

Platform Dev Vanity Domain, acme-dev.com
```
atmos terraform output dns-primary -s plat-gbl-dev
```

Platform Staging Vanity Domain, acme-stage.com
```
atmos terraform output dns-primary -s plat-gbl-staging
```

Platform Prod Vanity Domain, acme-prod.com
```
atmos terraform output dns-primary -s plat-gbl-prod
```

[For more on `NS` records](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/SOA-NSrecords.html)

### ACM

Note that each `dns-primary` component will already create its own ACM certs.
These are only for the vanity domains and won't do the more critical service domain certificates.

We use a separate instance of the `acm` component to provision the service domain certificates,
which still rely on the `dns-delegated` component.
Setting these up can be done quickly by running `atmos workflow deploy/acm -f network`.

### VPN

Lastly, configure the VPN. The VPN will be provisioned in the `network` account
and will leverage Transit Gateway to connect various VPCs to the VPN client. VPN deployment
consists of three parts: authentication, component deployment, and client setup.

First, set up authentication. We recommend
[using AWS IAM Identity Center to authenticate users](https://aws.amazon.com/blogs/security/authenticate-aws-client-vpn-users-with-aws-single-sign-on/).
Follow only the first section included in the linked AWS blog,
_Create and configure the Client VPN SAML applications in AWS IAM Identity Center_,
through downloading the _AWS IAM Identity Center SAML metadata_.
Save that file under the `ec2-client-vpn` component (`components/terraform/ec2-client-vpn`)
as "aws-sso-saml-app.xml". This should match the given
document name for `saml_metadata_document` in the `ec2-client-vpn` stack catalog (`stacks/catalog/ec2-client-vpn.yaml`)

Next, deploy the `ec2-client-vpn` component.
This is done by running `atmos workflow deploy/vpn -f network`.

Depending on the given network configuration, you may run out of available Client VPN routes. That error
will look something like this:
```
╷
│ Error: error creating EC2 Client VPN Route (cvpn-endpoint-0b7487fc0043a3df0,subnet-0b88f999578fd2340,10.101.96.0/19): ClientVpnRouteLimitExceeded: Limit exceeded
│       status code: 400, request id: 779f977b-2b31-490a-a4b1-2c8cb1da068d
│
│   with module.ec2_client_vpn.aws_ec2_client_vpn_route.default[40],
│   on .terraform/modules/ec2_client_vpn/main.tf line 245, in resource "aws_ec2_client_vpn_route" "default":
│  245: resource "aws_ec2_client_vpn_route" "default" {
│
```

If this happens, you'll need to
[increase the number of routes](https://console.aws.amazon.com/servicequotas/home/services/ec2/quotas/L-401D78F7)
allowed for the Client VPN endpoint. That said, you should already have a quota increase request
ready for this in [../../stacks/orgs/acme/core/network/global-region/baseline.yaml](../../stacks/orgs/acme/core/network/global-region/baseline.yaml).
You can apply that quota using `atmos terraform apply account-quotas -s core-gbl-network`.

Finally, set up the AWS VPN Client to access the VPN.
[Download the AWS VPN Client](https://aws.amazon.com/vpn/client-vpn-download/)
and or install it by running `brew install aws-client-vpn` in a regular terminal.
Follow the [AWS Documentation](https://docs.aws.amazon.com/vpn/latest/clientvpn-user/connect-aws-client-vpn-connect.html)
to complete the VPN setup.

The Atmos Workflow `deploy/vpn` creates a local VPN configuration as
`acme-core.ovpn` (`rootfs/etc/aws-config/acme-core.ovpn`)
located in the aws-config dir of `rootfs`. If it doesn't exist, create this file using the `client_configuration` output of
the `ec2-client-vpn` component, and commit it to the repo under `rootfs/etc/aws-config/acme-core.ovpn` for future reference.

```
atmos terraform output ec2-client-vpn -s core-use1-network
```

Once you configure the AWS VPN Client, set the file as the config and connect.
From there you should be able to access resources on any subnet in the VPCs you've provisioned.

### Optional: Bastion hosts

If you'd like to set up bastion hosts, you can do so by running `atmos workflow deploy/bastion -f network`.
This would let you further evaluate the VPN.

By default, we deploy the bastion to all accounts connected to Transit Gateway.
