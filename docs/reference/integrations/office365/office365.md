---
title: "Office 365"
sidebar_position: 10
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/how-to-guides/integrations/office365/office365.md
---

Microsoft 365 (formerly known as Office 365) can be used as an identity provider for AWS (Amazon Web Services) through a feature called AWS Single Sign-On (AWS SSO). AWS SSO allows organizations to centralize identity management and provide users with seamless access to AWS resources using their existing Microsoft 365 credentials. Here's a general overview of how this integration works:

1. AWS Single Sign-On (AWS SSO):

- AWS SSO is a service that simplifies access management for AWS accounts and applications. It enables users to sign in to AWS once and access multiple AWS accounts and applications without the need to re-enter credentials.
Integration Steps:
- To use Microsoft 365 as an identity provider for AWS SSO, administrators typically need to configure the integration within the AWS Management Console.
This involves setting up a new AWS SSO instance, connecting it to Microsoft 365, and specifying the Microsoft 365 users or groups that should have access to AWS resources.

2. SAML-Based Authentication:

- The integration between Microsoft 365 and AWS SSO often relies on the Security Assertion Markup Language (SAML) for authentication and authorization.
SAML enables the exchange of authentication and authorization data between Microsoft 365 and AWS, allowing users to log in once to Microsoft 365 and gain access to AWS resources without additional logins.


3. User Provisioning:

- AWS SSO can be configured to automatically provision and de-provision user accounts based on changes in the Microsoft 365 directory. This helps keep user access in sync with changes made in the Microsoft 365 environment.
Access Policies:
- AWS SSO allows administrators to define fine-grained access policies, specifying which AWS accounts and services users from Microsoft 365 can access. This is done through AWS SSO permission sets.


4. Multi-Factor Authentication (MFA):

- Organizations using Microsoft 365 for authentication with AWS SSO can enhance security by enforcing multi-factor authentication (MFA) for added identity verification.

5. Single Sign-On Experience:

- Once configured, users can experience single sign-on when accessing AWS resources. They log in to their Microsoft 365 account and seamlessly gain access to AWS without needing to provide credentials again.
Logging and Auditing:

AWS SSO provides logging and auditing capabilities, allowing organizations to track user access to AWS resources and monitor security-related events.
It's important to note that the specifics of the integration process may be subject to updates or changes, so it's recommended to refer to the official AWS documentation and Microsoft 365 documentation for the most accurate and up-to-date information based on your current date.
