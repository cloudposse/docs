---
title: "AWS SSO Login"
sidebar_position: 100
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/how-to-guides/integrations/okta/how-to-setup-okta-aws-sso.md
tags:
  - okta
  - aws_sso
  - identity
---

# How to Setup Okta AWS SSO

## Problem
Okta is a common business suite that has an active director to manage users and permissions. We need to utilize this to login to AWS.

## Solution
Okta has **Applications** that are used to sign in to things from your Okta Account.

### Okta

1. Under the Admin Panel go to **Applications**
2. Click **Browse App Catalog**
3. Search for `AWS IAM Identity Center` and click **Add Integration**
4. Keep the default settings of **App Label** ("AWS IAM Identity Center") and **Application Visibility**
5. Go to **Sign On** and Copy information from the SAML Metadata section, this will be used in AWS SSO.
6. Then go to Provisioning and click **Configure API Integration**

### AWS SSO
1. Sign into AWS SSO under your management account (`core-root`)
2. Go to the AWS IAM Identity Center (successor to AWS Single Sign-On) application
3. Enable IAM Identity Center
4. On the left panel click **Settings**
5. Under Identity Source click edit and add an **External identity provider**
6. Copy the information from Okta into the fields
7. The Okta App will need to be updated with the **Service provider metadata**
