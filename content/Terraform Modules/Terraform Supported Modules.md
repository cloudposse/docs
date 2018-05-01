---
title: "Terraform Supported Modules"
excerpt: ""
---
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/034f19f-terraform.png",
        "terraform.png",
        1210,
        418,
        "#1b1845"
      ]
    }
  ]
}
[/block]

Cloud Posse is the largest provider of high quality, fully composable open source Terraform Modules (APACHE2). 

Our **60+ modules** make it easy to get up and running quickly. We've literally spent _thousands of hours_ building out infrastructure and bundled that know-how into turnkey modules that you can use to get started quickly. 

All of our modules are battle-tested and encompass our best-practices for how to provision infrastructure. We update our modules regularly and also receive contributions from the community. We practice [Semantic Versioning](doc:semantic-versioning) on all of our modules. This lets you use version pining to ensure your infrastructure will remain stable and let you upgrade to new releases only when you're ready. 

[block:parameters]
{
  "data": {
    "0-0": "[**Backups**](doc:terraform-backup-modules)",
    "6-0": "[**Monitoring**](doc:terraform-monitoring-modules)",
    "7-0": "[**Networking**](doc:terraform-networking-modules)",
    "8-0": "[**Platform**](doc:terraform-platform-modules)",
    "2-0": "[**CI/CD**](doc:terraform-cicd-modules)",
    "3-0": "[**Databases**](doc:terraform-database-modules)",
    "9-0": "[**Security**](doc:terraform-security-modules)",
    "5-0": "[**Logging**](doc:terraform-logging-modules)",
    "4-0": "[**Kubernetes (Kops)**](doc:terraform-kubernetes-kops-modules)",
    "4-1": "Use terraform to provision essential backing services for [Kops](doc:kops) resources and [Helm Charts](doc:helm-charts)",
    "10-0": "[**User Data**](doc:terraform-user-data-modules)",
    "1-0": "[**CDN**](doc:terraform-cdn-modules)",
    "0-1": "Use terraform to perform routine backups. Easily [backup EFS filesystems](doc:terraform-aws-efs-backup) filesystems or automatically create [AMI snapshots](doc:terraform-aws-ec2-ami-backup) of running instances.",
    "h-1": "Module Purpose",
    "h-0": "Module Category",
    "3-1": "Use terraform to provision databases like [redis](doc:terraform-aws-elasticache-redis) or [dynamodb](doc:terraform-aws-dynamodb).",
    "2-1": "Use terraform to provision e2e build-pipelines.",
    "1-1": "Use terraform to provision CloudFront CDNs backed by S3 websites.",
    "9-1": "Use terraform to provision resources to provide better security and audit trails.",
    "8-1": "Use terraform to provision platform services like Elastic Beanstalk or EC2 instances.",
    "7-1": "Use terraform to provision VPCs, subnets, EFS filesystems and more.",
    "6-1": "Use terraform to provision standard types of monitors.",
    "5-1": "Use terraform to provision [terraform-aws-cloudtrail](doc:terraform-aws-cloudtrail) and encrypted logging buckets with lifecycle rules.",
    "10-1": "Use terraform to provision \"user data\" stubs for EC2 instances which can be passed as \"Cloud Init\" data."
  },
  "cols": 2,
  "rows": 11
}
[/block]