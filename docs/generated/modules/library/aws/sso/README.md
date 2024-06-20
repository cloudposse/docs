---
title: sso
sidebar_label: sso
sidebar_class_name: command
description: |-
  This module configures [AWS Single Sign-On (SSO)](https://aws.amazon.com/single-sign-on/). AWS SSO makes it easy to 
  centrally manage access to multiple AWS accounts and business applications and provide users with single sign-on 
  access to all their assigned accounts and applications from one place. With AWS SSO, you can easily manage access and 
  user permissions to all of your accounts in AWS Organizations centrally. AWS SSO configures and maintains all the 
  necessary permissions for your accounts automatically, without requiring any additional setup in the individual 
  accounts. You can assign user permissions based on common job functions and customize these permissions to meet your 
  specific security requirements. AWS SSO also includes built-in integrations to many business applications, such as 
  Salesforce, Box, and Microsoft 365.

  With AWS SSO, you can create and manage user identities in AWS SSO’s identity store, or easily connect to your 
  existing identity source, including Microsoft Active Directory, Okta Universal Directory, and Azure Active Directory 
  (Azure AD). AWS SSO allows you to select user attributes, such as cost center, title, or locale, from your identity 
  source, and then use them for attribute-based access control in AWS.
custom_edit_url: https://github.com/cloudposse/terraform-aws-sso/blob/main/README.yaml
---

# Module: `sso`
This module configures [AWS Single Sign-On (SSO)](https://aws.amazon.com/single-sign-on/). AWS SSO makes it easy to 
centrally manage access to multiple AWS accounts and business applications and provide users with single sign-on 
access to all their assigned accounts and applications from one place. With AWS SSO, you can easily manage access and 
user permissions to all of your accounts in AWS Organizations centrally. AWS SSO configures and maintains all the 
necessary permissions for your accounts automatically, without requiring any additional setup in the individual 
accounts. You can assign user permissions based on common job functions and customize these permissions to meet your 
specific security requirements. AWS SSO also includes built-in integrations to many business applications, such as 
Salesforce, Box, and Microsoft 365.

With AWS SSO, you can create and manage user identities in AWS SSO’s identity store, or easily connect to your 
existing identity source, including Microsoft Active Directory, Okta Universal Directory, and Azure Active Directory 
(Azure AD). AWS SSO allows you to select user attributes, such as cost center, title, or locale, from your identity 
source, and then use them for attribute-based access control in AWS.






## Usage

This module contains two sub-modules that can be used in conjunction to provision AWS SSO Permission Sets and to 
assign AWS SSO Users and Groups to Permissions Sets in accounts.

- [modules/account-assignments](https://github.com/cloudposse/terraform-aws-sso/tree/main/modules/account-assignments) - a module for assigning users and groups to permission 
sets in particular accounts
- [modules/permission-sets](https://github.com/cloudposse/terraform-aws-sso/tree/main/modules/permission-sets) - a module for provisioning AWS SSO permission sets




## Examples

Here is a full example of using these modules to provision permission sets and assign them to accounts:
- [`examples/complete`](https://github.com/cloudposse/terraform-aws-sso/tree/main/examples/complete) - complete example of using these modules



<!-- markdownlint-disable -->
## Requirements

No requirements.

## Providers

No providers.

## Modules

No modules.

## Resources

No resources.

## Inputs

No inputs.

## Outputs

No outputs.
<!-- markdownlint-restore -->

