# ECS

## Quick Start

| Steps                      | Example                                    |
| :------------------------- | :----------------------------------------- |
| 1. Vendor ECS components   | `atmos workflow vendor -f ecs`             |
| 2. Deploy ACM certificates | `atmos workflow deploy/ecs-acm -f ecs`     |
| 3. Connect to the VPN      | Click Ops                                  |
| 4. Deploy Clusters         | `atmos workflow deploy/clusters -f ecs`    |
| 5. Deploy Echo Server      | `atmos workflow deploy/echo-server -f ecs` |

## Requirements

In order to deploy ECS, Networking must be fully deployed and functional. In particular, the user deploying the cluster
must have a working VPN connection to the targeted account. See
[the network documentation](https://docs.cloudposse.com/reference-architecture/setup/network/) for details.

All deployment steps below assume that the environment has been successfully set up with the following steps.

1. Sign into AWS via Leapp
1. Connect to the VPN
1. Open Geodesic

## How To

### Vendor

Vendor these components with the included Atmos Workflows.

```bash
atmos workflow vendor -f ecs
```

or for each component:

```bash
atmos vendor pull --component ecs
atmos vendor pull --component ecs-service
```

### Deploy

ECS provisioning includes deploying certificate requirements, the default ECS cluster, and Echo Server. Echo Server is a
basic service used to validate a successful cluster deployed and is an example of an ECS service. Find ECS Service
definitions under `catalog/stacks/ecs-services`.

To provision each cluster, these components need to be deployed in order. The included Atmos Workflows will carry out
this deployment in the proper order, but any of these step can be run outside of a workflow if desired.

See the ecs workflow (`stacks/workflows/ecs.yaml`) for each individual deployment step.

#### Deploy ACM Certificates

First deploy all required ACM certificates for each ECS cluster. These certificates validate the given service domain.
You can deploy these certificates before associating the given Route 53 Hosted Zone with the purchased domain in your
chosen Domain Registrar, but the certificate will not be ISSUED until the registered domain and Hosted Zone are
connected.

Run the following Atmos Workflow to deploy every required ACM certificate for ECS.

```bash
atmos workflow deploy/ecs-acm -f ecs
```

#### Connect to the VPN

In order to complete the following steps, connect to the VPN now. For more on connecting to the VPN, see
[`ec2-client-vpn`](https://docs.cloudposse.com/components/library/aws/ec2-client-vpn/#testing).

The OVPN configuration for your VPN can be found in the output of the `ecs-client-vpn` component. For example,

```bash
atmos terraform output ec2-client-vpn -s core-use1-network
```

#### Deploy All Clusters

Run the following Atmos Workflow to deploy every ECS cluster. This workflow will deploy every required platform cluster.

```bash
atmos workflow deploy/clusters -f ecs
```

#### Deploy Echo Server

Once the cluster is up and running, continue with the first ECS service deployment. We deploy Echo Server as an example
and to validate a given cluster. This deploys two ECS services: one private and one public. The private deployment
should only be accessible by VPN.

Run the following Atmos Workflow to deploy `ecs/platform/service/echo-server` and
`ecs/platform/service/echo-server-private` to every cluster.

```bash
atmos workflow deploy/echo-server -f ecs
```

Validate each cluster deployment with Echo Server and the targeted service domain. The following URL should return a
success message for each stage's public deployment:

1. `plat-sandbox`: https://echo-server.public-platform.use1.sandbox.plat.acme-svc.com/
1. `plat-dev`: https://echo-server.public-platform.use1.dev.plat.acme-svc.com/
1. `plat-staging`: https://echo-server.public-platform.use1.staging.plat.acme-svc.com/
1. `plat-prod`: https://echo-server.public-platform.use1.prod.plat.acme-svc.com/

Each of the following should time out if not connected to the VPN. Verify these are not publicly accessible. Then
connect to the VPN to successfully load the endpoint.

1. `plat-sandbox`: https://echo-server.private-platform.use1.sandbox.plat.acme-svc.com/
1. `plat-dev`: https://echo-server.private-platform.use1.dev.plat.acme-svc.com/
1. `plat-staging`: https://echo-server.private-platform.use1.staging.plat.acme-svc.com/
1. `plat-prod`: https://echo-server.private-platform.use1.prod.plat.acme-svc.com/

# Related Topics

- [ECS Fundamentals](https://docs.cloudposse.com/reference-architecture/fundamentals/ecs/)
- [ECS Component](https://docs.cloudposse.com/components/library/aws/ecs/)
- [ECS Services Component](https://docs.cloudposse.com/components/library/aws/ecs-service/)
