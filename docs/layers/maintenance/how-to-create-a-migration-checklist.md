---
title: "Create a Migration Checklist"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1519583243/How+to+Create+a+Migration+Checklist
sidebar_position: 100
---

# How to Create a Migration Checklist

## Problem

## Solution

:::tip
TL;DR

:::

### Pre-cutover Tasks
- [ ] Update EKS Task with ElasticSearch URL
- [ ] Ensure ALB ingress can support 2 active vanity domains
- [ ] Create ACM component
- [ ] Audit Security Groups
- [ ] Implement Database Seeding & Migration Strategy
- [ ] Create `release` pipeline
- [ ] Redeploy bastion on public and private subnets
- [ ] SSH access via bastion host
- [ ] Restore most recent snapshot from production to staging
- [ ] Attach additional scratch space to EKS tasks for web app
- [ ] Bastion Host user-data/ACL updates
- [ ] Investigate 502s
- [ ] Tune EKS web app and tasks
- [ ] Implement Lambda Log Parser for Cloudwatch Logs
- [ ] Update Spacelift to Trigger on Changes to TF Var files
- [ ] Rename SSM Parameters for AWS_* to LEGACY_AWS_*
- [ ] Add feature flag to disable scheduled tasks for Preview
- [ ]  Provision Read Replica For Production Database (used by Redshift)
- [ ] Implement Scheduled Tasks
- [ ] Implement Pipeline to Create Preview Environments
- [ ] Decide on Cut Over Plan
- [ ] Deploy sidekiq workers (high priority)
- [ ] Containers should log to stdout
- [ ]  Decide on Pipeline Strategy
- [ ] Implement `registry/terraform/eks-web-app` module
- [ ]  Deploy acme to Production ([app.acme.com](http://app.acme.com))
- [ ] Integrate EKS Web App with Cloudwatch Logs
- [ ] Implement Vanity DNS with EKS Tasks
- [ ] Deploy [http://acme.com](http://acme.com)    to Staging ([app.acme.com](http://app.acme.com))
- [ ] Deploy [http://acme.com](http://acme.com)    as EKS Task with Spacelift
- [ ]  Create `build` pipeline
- [ ] Reduce Scope of IAM Grants for GitHub Runners
- [ ] Create `deploy` pipeline
- [ ] ETL Postgres Databases to Bastion Instance
- [ ] Import Staging Database to All RDS Clusters for Testing
- [ ]  Update Spacelift Config to Assume Role before Apply
- [ ] Implement Preview Environment Destroy Pipeline
- [ ] Increase GitHub Runners volume sizes
- [ ] Make sure all required backing services are provisioned on *acme accounts
- [ ]  Setup [http://acme.com](http://acme.com)    staging domain
- [ ] Move aurora-potsgres from *acme accounts to *acme
- [ ] Setup [http://acme.com](http://acme.com)    temp vanity domain
- [ ] Deploy bastion to corp account
- [ ] Update RDS Maintenance Window
- [ ] Provision ECS Bastion Instance with SSM Agent
- [ ] Decide How to Run Database Migrations
- [ ] Decide on Database Seeding Strategy
- [ ] Decide on deployment strategy for `repository`
- [ ]  Decide on Log Group Architecture
- [ ] Implement `cloudposse/terraform-aws-code-deploy` module
- [ ] Add Instance Profile to GitHub Runners to Support Pushing to ECR
- [ ] Use Postgres terraform provider to manage users
- [ ] Deploy self-hosted GitHub Action Runners with Terraform
- [ ] Proposal: Implement GitOps-driven Continuous Delivery Pipeline for Microservices and Preview Environments
- [ ] Decide on RDS Maintenance Window
- [ ]  Move remaining child modules from acme-com to infrastructure registry
### Cutover Plan

##### Rollback Plan
- [ ] Verify Backup Integrity and Recency
- [ ]  Ensure ability to perform software rollbacks with automation (E.g. CI/CD)
- [ ] Prepare step-by-step plan to rollback to Heroku
##### External Availability Monitoring
- [ ] Enable “Real User Monitoring” (RUM). Establish a 1-2 week baseline before launch
- [ ] Enable external synthetic tests 2-4 weeks before launch to identify any potential stability problems (e.g. during deployments)
##### Exception Logging
- [ ] Ensure you have frontend/javascript exception logging enabled in Datadog
##### QA
- [ ] Test & Time Restore Process (x minutes)
- [ ] Audit errors/warnings from pg_restore to ensure they are acceptable
- [ ] Coordinate with QA team on acceptance testing
- [ ] Ensure robots.txt blocks crawlers on non-prod environments
##### Load Tests
- [ ] Replicate production workloads to ensure systems handle as expected
- [ ] Tune EKS Autoscaling
- [ ] Verify Alert Escalations
##### Reduce DNS TTLs
- [ ] Set all SOAs for TLDs (e.g. `acme.com`) to 60 seconds to mitigate effects of negative DNS caching
- [ ] Set TTLs to 60 seconds on branded domains (E.g. `acme.com`)
##### Security
- [ ]  Audit Security Groups (EKS & RDS)
##### Schedule Cut Over
- [ ] Identify all relevant parties, stakeholders
- [ ] Communicate scope of migration and any expected downtime
##### Prepare Maintenance Page
- [ ] Provide a means to display a maintenance page (if necessary)
- [ ] Should be a static page (e.g. hosted on S3)
- [ ] Update copy as necessary to communicate extent of the outage our downtime
##### Perform End-to-End Tests
- [ ] Verify deployments are working
- [ ] Verify software rollbacks are working
- [ ] Verify auto-scaling is working (pods and nodes) - or we can over-provision for go-live
- [ ]  Verify TLS certificates are in working order (non-staging)
- [ ] Verify logs are flowing to cloudwatch and Datadog
- [ ] Verify TLD redirects are working
##### Perform Cut-Over
- [ ] [Choose time] Activate Maintenance Page
- [ ] Delegate [http://acme.com](http://acme.com)  zone to new account
- [ ] Take Fresh Production Database Dump on Bastion
- [ ] Load Database Dump
- [ ] Update env vars in Production SSM to use prod settings from 1password
- [ ] Disable Heroku deployments
- [ ] Perform ACM flip for [http://acme.com](http://acme.com)
- [ ] Disable monitoring?
- [ ] Merge/Rebase main into acme-master
- [ ] Open PR for acme-master into main
- [ ] replace `acme-master` with `master` in github
- [ ] Merge the PR to master
- [ ] Merge the auto-generated PR in `infra`
- [ ] Confirm ALL deployments in spacelift
- [ ] Instruct QA team to commence testing on `app.acme.com`
- [ ] Flip CNAME for [http://acme.com](http://acme.com)    to [http://acme.com](http://acme.com)   in legacy account
- [ ]  Manual TLS validation for [http://acme.com](http://acme.com)   ACM
- [ ] Instruct QA team to commence testing on `app.acme.com`
- [ ] Enable monitoring
- [ ] Deactivate Maintenance Page (happens automatically by flipping DNS)
##### Post-Cut-over Checklist
- [ ] Verify ability to deploy
- [ ]  Monitor customer support tickets
- [ ] re-enable scheduled EKS tasks for production
- [ ] Review exception logs
- [ ] Review Slow Query Logs
- [ ] Monitor non-200 status codes for anomalies
- [ ] Check Real End User Data
- [ ] Audit Errors/Warnings after loading
- [ ] Ensure `robots.txt` is permitting indexing in production (SEO)

### Post Cutover Tasks
- [ ] Ensure Idempotent Plan for Scheduled EKS Tasks
- [ ] Rename acme component to `acme-com`
- [ ] Configure auto-scaling
- [ ] Fix Bastion host to access Redis
- [ ] Tune Healthcheck Settings
- [ ] Automatically add `migrate` label
- [ ]  Improve Automated PR Descriptions
- [ ] Clean up acme Artifacts In Spacelift (no longer needed after move to acme-com)
- [ ] Update Spacelift for acme
- [ ] Remove unneeded resources from data accounts
##### Someday
- [ ] Prepare `acme.com` vanity domain in `prod` and all DNS records (do not delegate NS)


