---
title: "AWS SSO Login"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1513553945/How+to+Setup+Office+365+AWS+SSO
sidebar_position: 100
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/how-to-guides/integrations/office365/how-to-setup-office-365-aws-sso.md
tags:
  - office365
  - aws_sso
  - identity
---

# How to Setup Office 365 AWS SSO

## Problem
Office 365 is a common business suite that has an active director to manage users and permissions. We need to utilize this to login to AWS.

## Solution
Azure Devops has **Enterprise Apps** that are used to sign into things from your O365 Account.

### AWS SSO

1. Under [https://aad.portal.azure.com/#allservices/category/All](https://aad.portal.azure.com/#allservices/category/All)  go to **Enterprise Applications**

<img src="/assets/refarch/screen-shot-2023-01-13-at-8.33.13-am.png" height="783" width="1376" /><br/>

2. Click **New Application**

3. Choose the right application, for SSO it’s

**AWS IAM Identity Center (successor to AWS Single Sign-On)**

<img src="/assets/refarch/screen-shot-2023-01-13-at-8.36.16-am.png" height="565" width="1324" /><br/>

4. Click **Create**, default options are fine

5. On the Left Panel Click **Single sign-on,** then download the XML File by Pressing the Button on step 5 **Set up AWS IAM Identity Center (successor to AWS Single Sign-On**)

6. <img src="/assets/refarch/screen-shot-2023-01-13-at-8.41.28-am.png" height="841" width="1342" /><br/>

The Metadata file downloaded will need to be given to the CloudPosse team, as it is used in AWS for setting up SSO.

7. Similarly, Cloud Posse Team will give you an XML file from AWS SSO that contains metadata. Upload this by clicking the **Upload metadata file** button.

8. <img src="/assets/refarch/screen-shot-2023-01-13-at-8.47.03-am.png" height="338" width="1304" /><br/>

**SAVE**

#### Automatic Provisioning

1. Cloudposse team will provide a URL and secret via 1Pass

2. Go to Your App for Single Sign On, on the left Panel go to **Provisioning**

3. Set the mode to **Automatic** and Paste the Values provided into the **Admin Credentials** Section

<img src="/assets/refarch/screen-shot-2023-01-13-at-8.53.55-am.png" height="639" width="739" /><br/>


