---
title: "Terraform Supported Modules"
excerpt: ""
---
![](/assets/034f19f-terraform.png)

Cloud Posse is the largest provider of high quality, fully composable open source Terraform Modules (APACHE2).

Our **60+ modules** make it easy to get up and running quickly. We've literally spent _thousands of hours_ building out infrastructure and bundled that know-how into turnkey modules that you can use to get started quickly.

All of our modules are battle-tested and encompass our best-practices for how to provision infrastructure. We update our modules regularly and also receive contributions from the community. We practice [Semantic Versioning](doc:semantic-versioning) on all of our modules. This lets you use version pining to ensure your infrastructure will remain stable and let you upgrade to new releases only when you're ready.


| Module Category                                                | Module Purpose                                                                                                                                                                                                      |
|:---------------------------------------------------------------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [**Backups**](doc:terraform-backup-modules)                    | Use terraform to perform routine backups. Easily [backup EFS filesystems](doc:terraform-aws-efs-backup) filesystems or automatically create [AMI snapshots](doc:terraform-aws-ec2-ami-backup) of running instances. |
| [**Security**](doc:terraform-security-modules)                 | Use terraform to provision resources to provide better security and audit trails.                                                                                                                                   |
| [**User Data**](doc:terraform-user-data-modules)               | Use terraform to provision "user data" stubs for EC2 instances which can be passed as "Cloud Init" data.                                                                                                            |
| [**CDN**](doc:terraform-cdn-modules)                           | Use terraform to provision CloudFront CDNs backed by S3 websites.                                                                                                                                                   |
| [**CI/CD**](doc:terraform-cicd-modules)                        | Use terraform to provision e2e build-pipelines.                                                                                                                                                                     |
| [**Databases**](doc:terraform-database-modules)                | Use terraform to provision databases like [redis](doc:terraform-aws-elasticache-redis) or [dynamodb](doc:terraform-aws-dynamodb).                                                                                   |
| [**Kubernetes (Kops)**](doc:terraform-kubernetes-kops-modules) | Use terraform to provision essential backing services for [Kops](doc:kops) resources and [Helm Charts](doc:helm-charts)                                                                                             |
| [**Logging**](doc:terraform-logging-modules)                   | Use terraform to provision [terraform-aws-cloudtrail](doc:terraform-aws-cloudtrail) and encrypted logging buckets with lifecycle rules.                                                                             |
| [**Monitoring**](doc:terraform-monitoring-modules)             | Use terraform to provision standard types of monitors.                                                                                                                                                              |
| [**Networking**](doc:terraform-networking-modules)             | Use terraform to provision VPCs, subnets, EFS filesystems and more.                                                                                                                                                 |
| [**Platform**](doc:terraform-platform-modules)                 | Use terraform to provision platform services like Elastic Beanstalk or EC2 instances.                                                                                                                               |
