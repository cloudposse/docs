# EKS

## Quick Start

| Steps                               | Example                                                       |
| :---------------------------------- | :------------------------------------------------------------ |
| 1. Vendor EKS components            | `atmos workflow vendor -f eks`                                |
| 2. Connect to the VPN               |                                                               |
| 3. Deploy roles for each EKS stack  | `atmos workflow deploy/iam-service-linked-roles -f eks`       |
| 4. Deploy cluster into each stack   | `atmos workflow deploy/cluster -s plat-use1-dev -f eks`   |
| 5. Deploy resources into each stack | `atmos workflow deploy/resources -s plat-use1-dev -f eks` |

**Note**: Repeat steps 4 and 5 for each EKS stack, typically `plat-dev`, `plat-staging`, and `plat-prod`

## Requirements

In order to deploy EKS, Networking must be fully deployed and functional. In particular, the user deploying the cluster
must have a working VPN connection to the targeted account. See
[the network documentation](https://docs.cloudposse.com/reference-architecture/setup/network/) for details.

All deployment steps below assume that the environment has been successfully set up with the following steps.

1. Sign into AWS via Leapp
1. Connect to the VPN
1. Open Geodesic

## How To

### Vendor

EKS adds many components required to set up a cluster. Generally, all these components are contained in the EKS
components and catalog folders, under `components/terraform/eks` and `catalog/stacks/eks` respectively.

Vendor these components with the included Atmos Workflows.

```bash
atmos workflow vendor -f eks
```

or for each component. See `stacks/workflows/eks.yaml` for a complete list.

```bash
atmos vendor pull --component eks/cluster
```

### Deploy

EKS provisioning includes many components packaged together into a single import per stack. Leveraging Atmos
inheritance, we have defined a baseline set of required components for all EKS deployments and a unique set of
additional components for a particular stack's EKS deployment. Find these catalog set definitions under
`catalog/stacks/eks/clusters`.

To provision a cluster, these components need to be deployed in order. The included Atmos Workflows will carry out this
deployment in the proper order, but any of these step can be run outside of a workflow if desired.

See the eks workflow (`stacks/workflows/eks.yaml`) for each individual deployment step.

#### Deploy IAM Service Linked Roles

In order for Karpenter to reserve Spot Instances, the cluster needs to have a Service-Linked Role. Deploy these to all
cluster accounts with `iam-service-linked-roles`

```bash
atmos workflow deploy/iam-service-linked-roles -f eks
```

#### Deploy Initial Platform Dev Cluster

First deploy the cluster and AWS EFS. Since Karpenter will be used in the following steps, the initial cluster is
deployed without Nodes.

```bash
atmos workflow deploy/cluster -s plat-use1-dev -f eks
```

#### Deploy Platform Dev Cluster Resources

Once the cluster is up and running, continue with the EKS `plat` resources deployment. These need to be deployed in the
given order by the include Atmos Workflow. For additional details on each component, see the included `README.md` for
the individual component.

Run the Atmos Workflow to deploy all required `plat` components.

```bash
atmos workflow deploy/resources -s plat-use1-dev -f eks
```

Validate the cluster deployment with `eks/echo-server` and the targeted service domain. The following URL should return
a success message for `dev`:

https://echo.use1.dev.plat.acme-svc.com/

#### Deploy Staging and Production Clusters

Once the `dev` cluster is deployed and validated, continue with `staging` and then `prod`.

Repeat the same deployment steps in `staging`

```bash
atmos workflow deploy/cluster -s plat-use1-staging -f eks
atmos workflow deploy/resources -s plat-use1-staging -f eks
```

Validate `staging`: https://echo.use1.staging.plat.acme-svc.com/

Then deploy `prod`

```bash
atmos workflow deploy/cluster -s plat-use1-prod -f eks
atmos workflow deploy/resources -s plat-use1-prod -f eks
```

Validate `prod`: https://echo.use1.prod.plat.acme-svc.com/

# Related Topics

- [Confluence EKS Documentation](https://docs.cloudposse.com/components/category/eks/)
- [Karpenter Documentation](https://karpenter.sh/)