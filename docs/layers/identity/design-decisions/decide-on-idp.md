# Decide on Identity Provider (IdP)

## Problem

Users need a way to authenticate to AWS. 

## Solution

Verified working IdPs:
 - GSuite (Google Workspaces)
 - Office 365 (Microsoft 365)
 - Okta
 - JumpCloud
 - Auth0

Cloud Posse recommends using your existing email provider (e.g. Google, Microsoft, etc) as the IdP, unless you explicitly need to use a specialized one, such as Okta or JumpCloud.

## Consequences
Cloud Posse requires this information for your team to sign in to the new AWS Accounts.

- [ ] Please create a User in your IdP for the Cloud Posse Team. The Cloud Posse Team will use this account to verify access to several resources. For example `cloudposse@acme.com`.
