---
title: aws-ssosync
sidebar_label: aws-ssosync
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/aws-ssosync/README.md
tags: [terraform, aws, aws-ssosync]
---

# Component: `aws-ssosync`

Deploys [AWS ssosync](https://github.com/awslabs/ssosync) to sync Google Groups with AWS SSO.

AWS `ssosync` is a Lambda application that regularly manages Identity Store users.

This component requires manual deployment by a privileged user because it deploys a role in the root or identity
management account.

## Usage

You should be able to deploy the `aws-ssosync` component to the same account as `aws-sso`. Typically that is the
`core-gbl-root` or `gbl-root` stack.

**Stack Level**: Global **Deployment**: Must be deployed by `managers` or SuperAdmin using `atmos` CLI

The following is an example snippet for how to use this component:

(`stacks/catalog/aws-ssosync.yaml`)

```yaml
components:
  terraform:
    aws-ssosync:
      vars:
        enabled: true
        name: aws-ssosync
        google_admin_email: an-actual-admin@acme.com
        ssosync_url_prefix: "https://github.com/Benbentwo/ssosync/releases/download"
        ssosync_version: "2.0.2"
        google_credentials_ssm_path: "/ssosync"
        log_format: text
        log_level: debug
        schedule_expression: "rate(15 minutes)"
```

We recommend following a similar process to what the [AWS ssosync](https://github.com/awslabs/ssosync) documentation
recommends.

### Deployment

Overview of steps:

1. Configure AWS IAM Identity Center
1. Configure Google Cloud console
1. Configure Google Admin console
1. Deploy the `aws-ssosync` component
1. Deploy the `aws-sso` component

#### 1. Configure AWS IAM Identity Center (AWS SSO)

Follow
[AWS documentation to configure SAML and SCIM with Google Workspace and IAM Identity Center](https://docs.aws.amazon.com/singlesignon/latest/userguide/gs-gwp.html).

As part of this process, save the SCIM endpoint token and URL. Then in AWS SSM Parameter Store, create two
`SecureString` parameters in the same account used for AWS SSO. This is usually the root account in the primary region.

```
/ssosync/scim_endpoint_access_token
/ssosync/scim_endpoint_url
```

One more parameter you'll need is your Identity Store ID. To obtain your Identity Store ID, go to the AWS Identity
Center console and select `Settings`. Under the `Identity Source` section, copy the Identity Store ID. In the same
account used for AWS SSO, create the following parameter:

```
/ssosync/identity_store_id
```

#### 2. Configure Google Cloud console

Within the Google Cloud console, we need to create a new Google Project and Service Account and enable the Admin SDK
API. Follow these steps:

1. Open the Google Cloud
console: https://console.cloud.google.com
2. Create a new project. Give the project a descriptive name such as `AWS SSO Sync`
3. Enable Admin SDK in APIs: `APIs & Services > Enabled APIs & Services > + ENABLE APIS AND SERVICES`

![Enable Admin SDK](https://raw.githubusercontent.com/cloudposse/terraform-aws-components/main/modules/aws-ssosync/docs/img/admin_sdk.png) #
use raw URL so that this works in both GitHub and docusaurus

4. Create Service Account: `IAM & Admin > Service Accounts > Create Service Account`
   [(ref)](https://cloud.google.com/iam/docs/service-accounts-create).

![Create Service Account](https://raw.githubusercontent.com/cloudposse/terraform-aws-components/main/modules/aws-ssosync/docs/img/create_service_account.png) #
use raw URL so that this works in both GitHub and docusaurus

5. Download credentials for the new Service Account:
   `IAM & Admin > Service Accounts > select Service Account > Keys > ADD KEY > Create new key > JSON`

![Download Credentials](https://raw.githubusercontent.com/cloudposse/terraform-aws-components/main/modules/aws-ssosync/docs/img/dl_service_account_creds.png) #
use raw URL so that this works in both GitHub and docusaurus

6. Save the JSON credentials as a new `SecureString` AWS SSM parameter in the same account used for AWS SSO. Use the
   full JSON string as the value for the parameter.

```
/ssosync/google_credentials
```

#### 3. Configure Google Admin console

- Open the Google Admin console
- From your domain’s Admin console, go to `Main menu menu > Security > Access and data control > API controls`
  [(ref)](https://developers.google.com/cloud-search/docs/guides/delegation)
- In the Domain wide delegation pane, select `Manage Domain Wide Delegation`.
- Click `Add new`.
- In the Client ID field, enter the client ID obtained from the service account creation steps above.
- In the OAuth Scopes field, enter a comma-delimited list of the scopes required for your application. Use the scope
  `https://www.googleapis.com/auth/cloud_search.query` for search applications using the Query API.
- Add the following permission: [(ref)](https://github.com/awslabs/ssosync?tab=readme-ov-file#google)

```console
https://www.googleapis.com/auth/admin.directory.group.readonly
https://www.googleapis.com/auth/admin.directory.group.member.readonly
https://www.googleapis.com/auth/admin.directory.user.readonly
```

#### 4. Deploy the `aws-ssosync` component

Make sure that all four of the following SSM parameters exist in the target account and region:

- `/ssosync/scim_endpoint_url`
- `/ssosync/scim_endpoint_access_token`
- `/ssosync/identity_store_id`
- `/ssosync/google_credentials`

If deployed successfully, Groups and Users should be programmatically copied from the Google Workspace into AWS IAM
Identity Center on the given schedule.

If these Groups are not showing up, check the CloudWatch logs for the new Lambda function and refer the [FAQs](#FAQ)
included below.

#### 5. Deploy the `aws-sso` component

Use the names of the Groups now provisioned programmatically in the `aws-sso` component catalog. Follow the
[aws-sso](../aws-sso/) component documentation to deploy the `aws-sso` component.

### FAQ

#### Why is the tool forked by `Benbentwo`?

The `awslabs` tool requires AWS Secrets Managers for the Google Credentials. However, we would prefer to use AWS SSM to
store all credentials consistency and not require AWS Secrets Manager. Therefore we've created a Pull Request and will
point to a fork until the PR is merged.

Ref:

- https://github.com/awslabs/ssosync/pull/133
- https://github.com/awslabs/ssosync/issues/93

#### What should I use for the Google Admin Email Address?

The Service Account created will assume the User given by `--google-admin` / `SSOSYNC_GOOGLE_ADMIN` /
`var.google_admin_email`. Therefore, this user email must be a valid Google admin user in your organization.

This is not the same email as the Service Account.

If Google fails to query Groups, you may see the following error:

```console
Notifying Lambda and mark this execution as Failure: googleapi: Error 404: Domain not found., notFound
```

#### Common Group Name Query Error

If filtering group names using query strings, make sure the provided string is valid. For example,
`google_group_match: "name:aws*"` is incorrect. Instead use `google_group_match: "Name:aws*"`

If not, you may again see the same error message:

```console
Notifying Lambda and mark this execution as Failure: googleapi: Error 404: Domain not found., notFound
```

Ref:

> The specific error you are seeing is because the google api doesn't like the query string you provided for the -g
> parameter. try -g "Name:Fuel\*"

https://github.com/awslabs/ssosync/issues/91

<!-- prettier-ignore-start -->
<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- hello terraform-docs -->
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- prettier-ignore-end -->

## References

- [cloudposse/terraform-aws-components](https://github.com/cloudposse/terraform-aws-components/tree/main/modules/aws-ssosync) -
  Cloud Posse's upstream component



