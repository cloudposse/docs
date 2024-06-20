---
title: "Decide on Cognito Requirements"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1365213271/REFARCH-525+-+Decide+on+Cognito+Requirements
sidebar_position: 100
refarch_id: REFARCH-525
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/fundamentals/design-decisions/decide-on-cognito-requirements.md
---

# Decide on Cognito Requirements

## Overview
Amazon Cognito provides authentication, authorization, and user management for your web and mobile apps. Users can sign in directly with a user name and password stored in Cognito or through a third party such as a SAML IdP, OIDC, Facebook, Amazon, Google, or Apple.

There are two main components to Amazon Cognito: User Pools and Identity Pools. User Pools are directories of your applications’ users while Identity Pools are used to grant application users access to other AWS services such as S3. User Pools and Identity Pools can be used together or separately, depending on your needs.

## Common Scenarios
There are several common use cases for Cognito, some of the most common of which are detailed below. To configure the Cognito component, we’ll need to know as much as possible about your configuration. Ideally, you’ve already set it up previously and can share the precise configuration you’re using.

### App Authentication and Authorization

In this scenario, Cognito becomes your application's authentication and authorization service. You allow users to log in with a username and password (stored in a Cognito User Pool), social provider (Google, Facebook, Apple, etc), OIDC Provider (GitHub), or SAML IdP (Okta) and your app trusts Cognito to verify the identity of the user. After successful authentication, your app will receive a signed JSON Web Token (JWT) which it can use to control access to features and functionality within your application. Groups may be set up within the User Pools (and sent along to your application in the JWT after login) to represent different user Roles within the application.

### API Gateway Access

In this scenario, a user of your application logs in to the User Pool via one of the methods discussed previously (U/P, Social, IdP, OIDC). Then the application makes requests to your API Gateway, providing the Cognito-issued JWT in the request via HTTP headers. The API Gateway, via an Amazon Cognito authorizer Lambda function, would then use the information contained in the JWT to determine if the API operation is allowed or denied.

### AWS Service Access

For this use case, your application obtains a third-party identity token (from a Social, SAML IdP, or OIDC provider), or if your use case requires, generates an anonymous token, and exchanges that token for temporary AWS Credentials that allow direct access to certain AWS services (via IAM roles). One common scenario for this type of access would be granting the user the ability to upload files directly to an S3 bucket.

## Considerations

### Amazon Cognito Authorizer Lambda Function

We’ll need to have a lambda authorizer function deployed. This will also require a strategy for deploying the Lambda function and the function must be deployed before provisioning Cognito.

### Migrations

:::caution
**No Easy Migration Path**

If you are already using Cognito and are allowing users to sign into a User Pool with Username and Password, one of Cognito's major limitations is that you cannot migrate the passwords from those User Pools to a new User Pool.

:::

We have seen customers take two approaches to migration:

- Require all users to reset their password through the “forgot password” functionality

- Create application logic that first checks to see if the Username exists in the new User Pool. If the user already exists, then authentication proceeds. Suppose the user does not exist in the new User Pool. In that case, the application validates the password against the old User Pool, and assuming a successful authentication, creates a user in the new User Pool and sets its password to the password it successfully validated against the old User Pool.

### User Pools & Identity Providers

Before implementing Cognito, we need to document the User Pool(s) you would like to provision along with any Identity Providers you would like to use.


