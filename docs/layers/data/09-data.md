# Data

## Quick Start

| Steps                     | Example                             |
| :------------------------ | :---------------------------------- |
| 1. Vendor data components | `atmos workflow vendor -f data`     |
| 2. Connect to the VPN     | Click Ops                           |
| 3. Deploy clusters        | `atmos workflow deploy/all -f data` |

## Requirements

In order to deploy Data layer components, Networking must be fully deployed and functional. See
[the network documentation](https://docs.cloudposse.com/reference-architecture/setup/network/) for details.

All deployment steps below assume that the environment has been successfully set up with the following steps.

1. Sign into AWS via Leapp
2. Connect to the VPN
3. Open Geodesic

## Supported databases

At the moment we have support for:

- [Aurora PostgreSQL](https://docs.cloudposse.com/components/library/aws/aurora-postgres/) 

- [Aurora PostgreSQL Resources](https://docs.cloudposse.com/components/library/aws/aurora-postgres-resources/) 

- [Aurora MySQL](https://docs.cloudposse.com/components/library/aws/aurora-mysql/) 

- [Aurora MySQL Resources](https://docs.cloudposse.com/components/library/aws/aurora-mysql-resources/) 

- [AWS Backup](https://docs.cloudposse.com/components/library/aws/aws-backup/) 

- [DocumentDB](https://docs.cloudposse.com/components/library/aws/documentdb/) 

- [DynamoDB](https://docs.cloudposse.com/components/library/aws/dynamodb/) 

- [Elasticsearch Cluster](https://docs.cloudposse.com/components/library/aws/elasticsearch/) 

- [RDS](https://docs.cloudposse.com/components/library/aws/rds/) 

- [RedShift](https://docs.cloudposse.com/components/library/aws/redshift/) 

- [ElastiCache Redis](https://docs.cloudposse.com/components/library/aws/elasticache-redis/) ### Vendor

Vendor all data components with the following workflow:

```bash
atmos workflow vendor -f data
```

These run several vendor commands for each included component. You can always run these commands individually to update
any single component. For example:

> Note: We're using `aurora-postgres` for this example. Your database selection may differ.

```bash
atmos vendor pull -c aurora-postgres
```

### Deploy

In order to deploy database, deploy both the cluster and the resources component (if applicable). Applying changes to
the resources component requires a VPN connection. For example,

```bash
atmos workflow deploy/all -f data
```