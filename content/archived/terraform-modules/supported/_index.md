---
title: "Terraform Supported Modules"
description: ""
---
![Terraform Modules](/assets/034f19f-terraform.png)

Cloud Posse is the largest provider of high quality, fully composable open source Terraform Modules (APACHE2).

Our **60+ modules** make it easy to get up and running quickly. We've literally spent _thousands of hours_ building out infrastructure and bundled that know-how into turnkey modules that you can use to get started quickly.

All of our modules are battle-tested and encompass our best-practices for how to provision infrastructure. We update our modules regularly and also receive contributions from the community. We practice [Semantic Versioning]({{< relref "development/semver.md" >}}) on all of our modules. This lets you use version pining to ensure your infrastructure will remain stable and let you upgrade to new releases only when you're ready.


| Module Category                                             | Module Purpose                                                                                                                                                                                                                                                |
|:----------------------------------------------------------- |:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [**Backups**](/terraform-modules/backups)                   | Use terraform to perform routine backups. Easily [backup EFS filesystems]({{< relref "terraform-modules/backups/terraform-aws-efs-backup.md" >}}) filesystems or automatically create [AMI snapshots]({{< relref "terraform-modules/backups/terraform-aws-ec2-ami-backup.md" >}}) of running instances. |
| [**Security**](/terraform-modules/security)                 | Use terraform to provision resources to provide better security and audit trails.                                                                                                                                                                             |
| [**User Data**](/terraform-modules/user-data)               | Use terraform to provision "user data" stubs for EC2 instances which can be passed as "Cloud Init" data.                                                                                                                                                      |
| [**CDN**](/terraform-modules/cdn)                           | Use terraform to provision CloudFront CDNs backed by S3 websites.                                                                                                                                                                                             |
| [**CI/CD**](/terraform-modules/cicd)                        | Use terraform to provision e2e build-pipelines.                                                                                                                                                                                                               |
| [**Databases**](/terraform-modules/databases)               | Use terraform to provision databases like [redis]({{< relref "terraform-modules/databases/terraform-aws-elasticache-redis.md" >}}) or [dynamodb]({{< relref "terraform-modules/databases/terraform-aws-dynamodb.md" >}}).                                     |
| [**Kubernetes (Kops)**](/terraform-modules/kops-kubernetes) | Use terraform to provision essential backing services for [Kops]({{< relref "tools/kops.md" >}}) resources and [Helm Charts](/helm-charts)                                                                                                                                       |
| [**Logging**](/terraform-modules/logging)                   | Use terraform to provision [terraform-aws-cloudtrail]({{< relref "terraform-modules/security/terraform-aws-cloudtrail.md" >}}) and encrypted logging buckets with lifecycle rules.                                                                                                                       |
| [**Monitoring**](/terraform-modules/monitoring)             | Use terraform to provision standard types of monitors.                                                                                                                                                                                                        |
| [**Networking**](/terraform-modules/networking)             | Use terraform to provision VPCs, subnets, EFS filesystems and more.                                                                                                                                                                                           |
| [**Platform**](/terraform-modules/platform)                 | Use terraform to provision platform services like Elastic Beanstalk or EC2 instances.                                                                                                                                                                         |
