---
title: snowflake-account
sidebar_label: snowflake-account
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/snowflake-account/README.md
tags: [terraform, aws, snowflake-account]
---

# Component: `snowflake-account`

This component sets up the requirements for all other Snowflake components, including creating the Terraform service
user. Before running this component, follow the manual, Click-Ops steps below to create a Snowflake subscription.

## Deployment Steps

1. Open the AWS Console for the given stack.
2. Go to AWS Marketplace Subscriptions.
3. Click "Manage Subscriptions", click "Discover products", type "Snowflake" in the search bar.
4. Select "Snowflake Data Cloud"
5. Click "Continue to Subscribe"

6. Fill out the information steps using the following as an example. Note, the provided email cannot use labels such as
   `mdev+sbx01@example.com`.

```
  First Name: John
  Last Name: Smith
  Email: aws@example.com
  Company: Example
  Country: United States
```

7. Select "Standard" and the current region. In this example, we chose "US East (Ohio)" which is the same as
   `us-east-1`.
8. Continue and wait for Sign Up to complete. Note the Snowflake account ID; you can find this in the newly accessible
   Snowflake console in the top right of the window.
9. Check for the Account Activation email. Note, this may be collected in a Slack notifications channel for easy access.
10. Follow the given link to create the Admin user with username `admin` and a strong password. Be sure to save that
    password somewhere secure.
11. Upload that password to AWS Parameter Store under `/snowflake/$ACCOUNT/users/admin/password`, where `ACCOUNT` is the
    value given during the subscription process. This password will only be used to create a private key, and all other
    authentication will be done with said key. Below is an example of how to do that with a
    [chamber](https://github.com/segmentio/chamber) command:

```
AWS_PROFILE=$NAMESPACE-$TENANT-gbl-sbx01-admin chamber write /snowflake/$ACCOUNT/users/admin/ admin $PASSWORD
```

11. Finally, use atmos to deploy this component:

```
atmos terraform deploy snowflake/account --stack $TENANT-use2-sbx01
```

## Usage

**Stack Level**: Regional

Here's an example snippet for how to use this component:

```yaml
components:
  terraform:
    snowflake-account:
      settings:
        spacelift:
          workspace_enabled: false
      vars:
        enabled: true
        snowflake_account: "AB12345"
        snowflake_account_region: "us-east-2"
        snowflake_user_email_format: "aws.dev+%s@example.com"
        tags:
          Team: data
          Service: snowflake
```

<!-- prettier-ignore-start -->
<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- hello terraform-docs -->
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- prettier-ignore-end -->



