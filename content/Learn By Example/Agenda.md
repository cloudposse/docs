---
title: "Agenda"
excerpt: ""
---

##### :no_entry_sign: Important
> All examples provided in the documentation will be based on use cases described in **Learn by Example** chapter

Company "Example, LLC" owns a portal `example.com` that provides documentation, roadmaps and examples for a lot of activities we do in real life.

The company wants to migrate to AWS cloud hosting and use Kubernates as containers management and deployment system. 

They need multiple environments:
* Production
* Staging
* Development

As a continuous integration platform, they choose Codefresh.io.

## Game Plan

Following [AWS Well-Architected Framework](doc:aws-well-architected-framework) and [Best Practices](doc:aws-organizations-best-practices) we will create 3 AWS organizations belongs to root AWS account and 4 <<glossary:Module>>:
* `root.example.com` - Module for root AWS account
* `staging.example.com` - Module for the staging environment
* `development.example.com` - Module for the development environment
* `production.example.com` - Module for the production environment

----------

`root.example.com` - will be responsible for managing users, creation [Organizations](doc:organizations) for environments and grant access to them.
All other Modules will spin up <<glossary:Kubernetes>>  where applications will be executed