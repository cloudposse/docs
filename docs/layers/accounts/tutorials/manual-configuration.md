---
title: "Manual Cold Start Implementation"
sidebar_position: 0
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/setup/cold-start/manual-configuration.md
---

# Manual Cold Start Implementation

These steps are part of laying the foundation for your environment and are necessary prerequisites for using Terraform.

:::info Automated Solution as an Alternative

This document includes many advanced and alternate configurations for the Cold Start implementation, including detailed
explanations and manual set up steps. Alternatively we have a simplified
[Automated Cold Start Implementation](/reference-architecture/setup/cold-start/automated-configuration) that includes
the minimum requirements for provisioning a Cold Start. That setup document makes use of
[Atmos Workflows](/reference-architecture/setup/workflows/) to alleviate Click Ops woes but does not account for edge
cases.

Please refer to the below documentation as the source of truth for the Cold Start.

:::

## Manual Preparation Steps

- This first set of steps can be done in any order. The remaining steps need to be done in the order listed.

- Decide on a "namespace" for your organization in consultation with Cloud Posse.
  [Decide on Namespace Abbreviation](/reference-architecture/fundamentals/design-decisions/cold-start/decide-on-namespace-abbreviation)

- Decide on a default AWS Region to deploy the initial set of resources. Optionally, decide on a failover Region for
  backup resources. Decide on the [Region abbreviation scheme](/reference-architecture/reference/aws/aws-region-codes)
  you want to use: `short` or `fixed`. Cloud Posse slightly favors `fixed` to keep IDs and labels shorter.
  [Decide on Primary AWS Region](/reference-architecture/fundamentals/design-decisions/cold-start/decide-on-primary-aws-region)

- Decide on whether or not you are going to use Spot Instances. Decide on your desired default quota for Spot Instance
  and On-Demand Instance vCPUs. Also, decide on default quotas for any special instance types such as GPU-enabled
  instances.

- One of the main drivers for this decision is going to be the EKS Node Pool Architecture. Specifically, whether or not
  to use Spotinst Ocean for managing the EKS Node Pool.

- Create 2 Slack Channels and share them with Cloud Posse (this requires a paid Slack account): one for collaboration
  and discussion and another one to receive automated messages.

- The collaboration Slack channel should be named something like `[organization]-general`.

- The AWS notifications Slack channel should be named something like `[organization]-aws-notifications`. See
  [How to Set Up AWS Email Notifications](/reference-architecture/setup/cold-start/how-to-set-up-aws-email-notifications)
  for more information.

- Choose, provision, and share with Cloud Posse a mechanism for securely storing and sharing secrets, including MFA TOTP
  keys. Cloud Posse uses [1Password](https://1password.com/) and can provide a 1Password `vault` if needed. In this
  document, we will refer to this storage as 1Password, but you can substitute any other system you want.
  [Decide on 1Password Strategy](/reference-architecture/fundamentals/design-decisions/cold-start/decide-on-1password-strategy)

- Identify a credit card for AWS to bill charges to and provide the details to whomever is going to set up the initial
  AWS account.

- Install [Leapp](https://www.leapp.cloud/) to manage AWS credentials for command-line use (this is a free desktop app
  installed on user's computers).

- If using GSuite or Okta SSO integration, collect IdP metadata files, e.g. `GoogleIDPMetadata-acme.com.xml`. After the
  `git` repository is created and populated, configure `sso.vars.saml_providers` with the names of the files, and commit
  the files into `git` under `components/terraform/sso`

- Set up GitHub (requires a paid account, steps to be completed in this order)

- Create a GitHub organization for the project if you do not already have one.

- Create a `CloudPosse` team and invite designated Cloud Posse personnel to it.

- Create (or have Cloud Posse create) an "infrastructure" Git repository that will host configuration and tools for the
  company.

- Decide on your account, organization names, and organization structure.
  [Decide on AWS Account Flavors and Organizational Units](/reference-architecture/fundamentals/design-decisions/cold-start/decide-on-aws-account-flavors-and-organizational-units)
  [Decide on AWS Organization Strategy](/reference-architecture/fundamentals/design-decisions/cold-start/decide-on-aws-organization-strategy)

- Decide on and set up email addresses for all accounts. We recommend using a single email address/account with "+"
  addressing for each AWS account, and forwarding all emails to a single shared Slack channel. **Ensure that the email
  addresses are set up and forwarded to a shared Slack channel that Cloud Posse has access to before continuing.**
  [Decide on Email Address Format for AWS Accounts](/reference-architecture/fundamentals/design-decisions/cold-start/decide-on-email-address-format-for-aws-accounts)

- [Sign up with AWS](/reference-architecture/setup/cold-start/how-to-register-pristine-aws-root-account), create the
  `root` account (you may want to call it `main`, `master`, `management`, or something else, but we will refer to it in
  this document as `root`) using the email address you decided on. This is often performed by multiple people, so
  coordinate with all involved. If you already have a billing relationship with AWS, then this may be a different
  process than if you do not. The link shows up how to get started if you have no relationship to AWS, and you will need
  to provide valid billing details including a credit card, so sometimes this is best done by someone in the finance
  department.

- **Getting started with "root credentials".** Each person involved in creating and setting up the `root` account should
  work toward ensuring the account is configured as described in this subsection. The configuration must be done with
  "root" credentials, which are the credentials created during the initial signup process or, if already signed up when
  the account is created. **The email address, password, and other information should be stored in 1Password.** If the
  password is unavailable when you need it (for example, if you have an existing relationship with AWS and thus simply
  created a child account, which has an assigned password you are not told), start the login process on the AWS console
  using the "Root user email address" (the email address you assigned to the account) and use the "Forgot password?"
  link to generate an email which will be forwarded to the Slack channel. Click the link in that email to be allowed to
  set a new password and log in. Save the email address, password, and account number in 1Password in a new "login"
  credential.

- As soon as possible, share the AWS account number with your Cloud Posse contact, so Cloud Posse can assist in
  expediting the requests.

- Set up billing, including providing a credit card to charge.

- Activate
  [IAM User and Role Access to Billing Information](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/control-access-billing.html#ControllingAccessWebsite-Activate)
  using the root account root user, navigate to account settings, scroll down, edit IAM User and Role Access, and enable
  it. This is important for non-root access to billing in the future.

- Set your support plan to "Business" level. This is necessary to expedite the quota increase requests we will soon
  make, which otherwise could hold up the cold start process for days.

- **Ensure the account does not belong to an organization** so we can make it the manager of the new organization we are
  going to create. Depending on how the account was created, it may or may not belong to an organization. If you just
  created it via "Create an AWS account" on the AWS website, then it will not belong to an organization. If you had a
  pre-existing relationship with AWS and created the new account from the AWS web console while logged in to an existing
  account, then the account probably _does_ belong to an organization. If it does belong to an organization, contact the
  organization manager (someone in your company responsible for your AWS account management, probably the person who
  actually created the account) and have it removed.

- If you are planning to use an AWS Region that is not enabled by default (such as the Middle East/Bahrain), you need to
  take the following extra steps. Most companies only use the default regions and can skip these steps.

- Navigate to the [Billing home page](https://console.aws.amazon.com/billing/home?#/account). In the "**AWS Regions**"
  section, enable the regions you want to enable.

- Go to the IAM [account settings page](https://console.aws.amazon.com/iam/home?#/account_settings) and edit the **STS
  Global endpoint** to create session tokens valid in all AWS regions. As of this writing, once you enable the regions
  in the prior step, the AWS web console will prompt you to make this change and you can just follow the prompt.

- Secure the root account.

- Verify the securitiy of the `root` account root user password (meets security standards and has not been shared over
  an insecure channel like Slack, email, or SMS) and that it is properly stored in 1Password. If in any doubt, reset the
  "root user" password (change it if you know it, use the "Forgot password?" link to reset it if you do not.) Use
  1Password or [Random.org](https://www.random.org/passwords) to create a password 26-38 characters long, including at
  least 3 of each class of character: lower case, uppercase, digit, and symbol. You may need to manually combine or add
  to the generated password to ensure 3 symbols and digits are present. Save the email address and generated password as
  web login credentials in 1Password, and save the account number as a separate field in the same credential.

- Set up the root user to use a Virtual MFA device, following
  [the instructions in the AWS documentation](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_mfa_enable_virtual.html#enable-virt-mfa-for-root)
  for enabling a virtual MFA device for an AWS account root user. Save the MFA TOTP key in 1Password by using
  1Password's TOTP field and built-in screen scanner to scan the QR code presented on the web page.

- Create a `SuperAdmin` [IAM user](https://console.aws.amazon.com/iamv2/home?#/users) in the `root` account (needed to
  provision initial AWS resources, including member accounts, SSO and IAM roles). Do _not_ enable "console login", do
  set up MFA, and then create a single Access key. Create a Secure Note for the SuperAdmin credentials in 1Password and
  store the Access Key ID, Secret Access Key, Assigned MFA device ARN, and TOTP key in it. See
  [create SuperAdmin user](/reference-architecture/setup/cold-start/how-to-create-superadmin-user) for more details.

- Configure Leapp to use the `SuperAdmin` Access key with the profile `acme-SuperAdmin`, where `acme` is the "namespace"
  you have chosen for your organization, and using the AWS Region you have chosen as default. Refer to the
  [Leapp documentation for setting up an AWS IAM user](https://docs.leapp.cloud/latest/configuring-session/configure-aws-iam-user/)
  for details.

- Generate and check into `git` and GitHub an initial configuration. Include SSO IdP metadata files. Update reference
  configuration (including Dockerfile). For more information, see
  [How to Create an Infrastructure repository](/reference-architecture/setup/cold-start/how-to-create-an-infrastructure-repository)

We are almost done with the manual steps. Unfortunately, we will have to take a few more manual steps later, after we
have some other things provisioned.

## Remaining steps

Here is a summary of the remaining steps, which will be explained in greater detail below. Most of these steps use
`atmos` which uses `terraform` and although they are executed manually, are not considered entirely manual steps because
of the support and automation those tools provide.

- Build and run Geodesic shell

- Provision Terraform state backend (S3 bucket to store state and DynamoDB table for state locking).

- Provision AWS organization

- Perform some manual tasks to finish setting up the organization

- Provision AWS organization units and accounts

- If necessary, enable optional AWS regions.

- Update the Account Map.

- Provision account settings (set the default mode for EBS volumes to be encrypted, provision account aliases and
  password policies).

- Provision
  [IAM SAML Identity Provider](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_create_saml.html).
  The SAML identity provider is used to establish trust between your company IdP (usually Google Workspace or Okta) and
  AWS, allowing you to login to AWS using your existing credentials, also known as Single Sign-On or SSO. If using Okta,
  also provision Okta API users with permissions to list IAM roles in the account (needed for Okta AWS integration).

- Provision primary IAM roles in the `identity` account. These roles have trust policies to allow the SAML provider to
  assume them.

- Provision delegated IAM roles in all other accounts. These roles have trust policies to allow the primary IAM roles in
  the `identity` account to assume them, effectively allowing you to first login to the `identity` account with SSO and
  then assume the delegated roles to access the other accounts (`prd`, `dev`, `stg`, etc.).

- Deactivate the SuperAdmin user.

To add a new account later, follow all the same steps, except you can skip steps that the new account does not affect,
like provisioning the `tfstate-backend` component or enabling resource sharing.

### Build and run the Geodesic shell

Prerequisites for your host computer:

- Docker installed

- `make` installed, preferably GNU Make

- `git` installed

- Infrastructure Git repo cloned

If all goes well, you should be able to build and run the Infrastructure Docker image from your host by executing
`make all` from the command line in the root directory of your Git repo clone. If you have issues at this step, contact
Cloud Posse or look for help in the Cloud Posse [Geodesic](https://github.com/cloudposse/geodesic/) or
[Reference Architecture](https://github.com/cloudposse/reference-architectures) repos.

At this point (after `make all` concludes successfully) you should be running a `bash` shell inside the Infrastructure
Docker container (which we will also call the "Geodesic shell") and your prompt should look something like this:

```
 ⧉  Infrastructure
 ✗ . [none] / ⨠
```

From here forward, any command-line commands are meant to be run from within the Geodesic shell.

For the most part you will be using **Cloud Posse's** `atmos` command, which is quite powerful, but has a non-obvious
limitation: it is sensitive to the current working directory and **must be run from the root of the repository**.

## Use SuperAdmin credentials

After starting Geodesic, use Leapp to activate the SuperAdmin credentials. Then configure Geodesic to use the SuperAdmin
credentials with

```
export AWS_PROFILE=acme-SuperAdmin
```

where `acme` is the namespace you have chosen for your project and `acme-SuperAdmin` matches the profile name you
configured in Leapp for the SuperAdmin user. (Geodesic may complain about not being able to find a profile matching the
role or something like that; this can be safely ignored.) At this point the Geodesic prompt should look something like

```
 ⧉  Infrastructure
 √ . [SuperAdmin] / ⨠
```

Note that the "✗" has changed to "√" to indicate that valid AWS credentials are present, and `[none]` has changed to
`[SuperAdmin]` to indicate what IAM role your credentials are associated with. The `/` indicates the current directory
is `/`, which is correct for running `atmos`.

### Provision `tfstate-backend` component

All Terraform components require a state backend.

In this section, we explain how to provision and use the S3 backend (note that other backends could be used, e.g.
`remote`, `vault` etc.).

The S3 backend normally consists of an AWS S3 bucket and a DynamoDB table provisioned in the `root` account.

The `tfstate-backend` component initializes the backend state, so we have a cart-before-horse scenario to resolve.

To overcome this, initialize the component in the following order:

- Be sure you are running with `SuperAdmin` credentials as explained above in [Use SuperAdmin credentials](#Use
  SuperAdmin credentials)

- In the Geodesic shell, run `cd /localhost/`

- In the Geodesic shell, run `cd "$REPO_ROOT"` where `$REPO_ROOT` is the path on your host computer to the repository.
  Note that Geodesic should have set up mounts and symbolic links such that the host path should resolve and reference
  your host computer's directory if you set it up as instructed above. (Only the part of the host file system under
  `$HOME` is accessible. If you have checked out your repository in a different part of the file system, you will need
  to move it, at least temporarily.) Run `ls` to confirm you are seeing the `Dockerfile` and `Makefile` you expect. The
  Geodesic prompt should include `(HOST)` to indicate the current directory is on the host filesystem, not the
  container's file system.

- Run
  `atmos terraform apply tfstate-backend -var=access_roles_enabled=false --stack core-uw2-root --auto-generate-backend-file=false`

- Verify the plan matches the expected output before approving the plan, or type “no” to the `Enter a value:` prompt if
  something looks wrong.

- Verify the S3 bucket and the DynamoDB table exist within the `root` account

- Note that at this stage the Terraform state will be stored locally

- Run
  `atmos terraform apply tfstate-backend -var=access_roles_enabled=false --stack core-uw2-root --init-run-reconfigure=false`

- This will generate the S3 backend files `backend.tf.json` for the `tfstate-backend` component

- It will prompt you to migrate all workspaces to S3. Type `yes` and it will push the previously created local state to
  S3.

We have now provisioned Terraform state backend and migrated the `tfstate-backend` component's state to the newly
created S3 backend. We will come back later to provision the restricted IAM roles that allow access to the backend, but
for now, SuperAdmin has the needed access.

We'll now provision all other components using the S3 backend.

### Provision AWS Organization using the `account` component

:::caution

Verify and confirm all account settings now. Changing account settings after provisioning accounts can be
highly difficult. In particular, be sure to double and triple check the provided email address. You must have access to
this email address to access, update, or delete the account.

:::

Your AWS Organization is managed by the `account` component, along with accounts and organizational units.

However, because the AWS defaults for an Organization and its accounts are not exactly what we want, and there is no way
to change them via Terraform, we have to first provision the AWS Organization, then take some steps on the AWS console,
and then we can provision the rest.

### Use AWS Console to create and set up the Organization

Unfortunately, there are some tasks that need to be done via the console. Log into the AWS Console with the root (not
SuperAdmin) credentials you have saved in 1Password.

#### Request an increase in the maximum number of accounts allowed

:::caution

Make sure your support plan for the _root_ account was upgraded to the "Business" level (or Higher). This is
necessary to expedite the quota increase requests, which could take several days on a basic support plan. Without it,
AWS support will claim that since we’re not currently utilizing any of the resources, so they do not want to approve the
requests. AWS support is not aware of your other organization. If AWS still gives you problems, please escalate to your
AWS TAM. See [AWS](/reference-architecture/reference/aws).

:::

1. From the region list, select "US East (N. Virginia) us-east-1".

2. From the account dropdown menu, select "My Service Quotas".

3. From the Sidebar, select "AWS Services".

4. Type "org" in the search field under "AWS services"

5. Click on "AWS Organizations" in the "Service" list

6. Click on "Default maximum number of accounts", which should take you to a new view

7. Click on "Request quota increase" on the right side of the view, which should pop us a request form

8. At the bottom of the form, under "Change quota value", enter the number you decided on in the previous step (probably
   "20") and click "Request"

#### (Optional) Create templates to request other quota increases

New accounts start with a low limit on the number of instances you can create. However, as you add accounts, and use
more instances, the numbers automatically adjust up. So you may or may not want to create a template to generate
automatic quota increase requests, depending on how many instances per account you expect to want to provision right
away.

Create a
[Quota request template](https://docs.aws.amazon.com/servicequotas/latest/userguide/organization-templates.html) for the
organization. From the Sidebar, click "Quota request template"

Add each EC2 quota increase request you want to make:

1. Click "Add Quota" on the right side of the view

2. Under "Region", select your default region (repeat with the backup region if you are using one)

3. Under "Service", type "EC2" and select "Amazon Elastic Compute Cloud (Amazon EC2)"

4. Under "Quota", find the quota you want to increase. The likely candidates are:

5. type "stand" and select "Running On-Demand Standard (A, C, D, H, I, M, R, T, Z) Instances"

6. type "stand" and select "All Standard (A, C, D, H, I, M, R, T, Z) Spot Instance Request"

7. type "g i" and select "Running On-Demand G Instances"

8. type "all g" and select "All G Spot Instance Requests"

9. Under "Desired quota value" enter your desired default quota

10. Click "Add"

After you have added all the templates, click "Enable" on the Quota request template screen to enable the templates.

#### Enable resource sharing with AWS Organization

[AWS Resource Access Manager (RAM)](https://docs.aws.amazon.com/ram/latest/userguide/what-is.html) lets you share your
resources with any AWS account or through AWS Organizations.

<img src="/assets/refarch/image-20211116-045412.png" height="780" width="3774" /><br/>

If you have multiple AWS accounts, you can create resources centrally and use AWS RAM to share those resources with
other accounts.

Resource sharing through AWS Organization will be used to share the Transit Gateway deployed in the `network` account
with other accounts to connect their VPCs to the shared Transit Gateway.

This is a one-time manual step in the AWS Resource Access Manager console. When you share resources within your
organization, AWS RAM does not send invitations to principals. Principals in your organization get access to shared
resources without exchanging invitations.

To enable resource sharing with AWS Organization via AWS Management Console

- Open the Settings page of AWS Resource Access Manager console at
  [https://console.aws.amazon.com/ram/home#Settings](https://console.aws.amazon.com/ram/home#Settings)

- Choose "Enable sharing with AWS Organizations"

To enable resource sharing with AWS Organization via AWS CLI

```
 √ . [acme-SuperAdmin] (HOST) infra ⨠ aws ram enable-sharing-with-aws-organization
{
    "returnValue": true
}
```

For more information, see:

- [https://docs.aws.amazon.com/ram/latest/userguide/what-is.html](https://docs.aws.amazon.com/ram/latest/userguide/what-is.html)

- [https://docs.aws.amazon.com/ram/latest/userguide/getting-started-sharing.html](https://docs.aws.amazon.com/ram/latest/userguide/getting-started-sharing.html)

- [https://docs.aws.amazon.com/organizations/latest/userguide/services-that-can-integrate-ram.html](https://docs.aws.amazon.com/organizations/latest/userguide/services-that-can-integrate-ram.html)

### Import the organization into Terraform using the `account` component

After we are done with the above ClickOps and the Service Quota Increase for maximum number of accounts has been
granted, we can then do the rest via Terraform.

In the Geodesic shell, as SuperAdmin, execute the following command to get the AWS Organization ID that will be used to
import the organization:

```
aws organizations describe-organization
```

From the output, identify the _organization-id_:

```
{
    "Organization": {
        "Id": "o-7qcakq6zxw",
        "Arn": "arn:aws:organizations::
        ...
```

Using the example above, the _organization-id_ is o-7qcakq6zxw.

In the Geodesic shell, as SuperAdmin, execute the following command to import the AWS Organization, changing the stack
name `core-gbl-root` if needed, to reflect the stack where the organization management account is defined, and changing
the last argument to reflect the _organization-id_ from the output of the previous command.

```
atmos terraform import account --stack core-gbl-root 'aws_organizations_organization.this[0]' 'o-7qcakq6zxw'
```

### Provision AWS OUs and Accounts using the `account` component

AWS accounts and organizational units are generated dynamically by the `terraform/account` component using the
configuration in the `gbl-root` stack.

:::info Special note

In the rare case where you will need to be enabling non-default AWS Regions,
temporarily comment out the `DenyRootAccountAccess` service control policy setting in `gbl-root.yaml`. You will restore
it later, after enabling the optional Regions. See related:
[Decide on Opting Into Non-default Regions](/reference-architecture/fundamentals/design-decisions/cold-start/decide-on-opting-into-non-default-regions)

:::

:::caution You must wait until your quota increase request has been granted.

If you try to create the accounts
before the quota increase is granted, you can expect to see failures like `ACCOUNT_NUMBER_LIMIT_EXCEEDED`.

:::

In the Geodesic shell, execute the following commands to provision AWS Organizational Units and AWS accounts:

```
atmos terraform apply account --stack gbl-root
```

Review the Terraform plan, _**ensure that no new organization will be created**_ (look for
`aws_organizations_organization.this[0]`), type "yes" to approve and apply. This creates the AWS organizational units
and AWS accounts.

### Configure root account credentials for each account

Note: unless you need to enable non-default AWS regions (see next step), this step can be done later or in parallel with
other steps, for example while waiting for Terraform to create resources.

**For** _**each**_ **new account:**

1. Perform a password reset by attempting to [log in to the AWS console](https://signin.aws.amazon.com/signin) as a
   "root user", using that account's email address, and then clicking the "Forgot password?" link. You will receive a
   password reset link via email, which should be forwarded to the shared Slack channel for automated messages. Click
   the link and enter a new password. (Use 1Password or [Random.org](https://www.random.org/passwords) to create a
   password 26-38 characters long, including at least 3 of each class of character: lower case, uppercase, digit, and
   symbol. You may need to manually combine or add to the generated password to ensure 3 symbols and digits are
   present.) Save the email address and generated password as web login credentials in 1Password. While you are at it,
   save the account number in a separate field.

2. Log in using the new password, choose "My Security Credentials" from the account dropdown menu and set up
   Multi-Factor Authentication (MFA) to use a Virtual MFA device. Save the MFA TOTP key in 1Password by using
   1Password's TOTP field and built-in screen scanner. Also, save the Virtual MFA ARN (sometimes shown as "serial
   number").

3. While logged in, enable optional regions as described in the next step, if needed.

4. (Optional, but highly recommended): [Unsubscribe](https://pages.awscloud.com/communication-preferences.html) the
   account's email address from all marketing emails.

### (Optional) Enable regions

Most AWS regions are enabled by default. If you are using a region that is not enabled by default (such as Middle
East/Bahrain), you need to take extra steps.

1. While logged in using root credentials (see the previous step), in the account dropdown menu, select "My Account" to
   get to the [Billing home page](https://console.aws.amazon.com/billing/home?#/account).

2. In the "AWS Regions" section, enable the regions you want to enable.

3. Go to the IAM [account settings page](https://console.aws.amazon.com/iam/home?#/account_settings) and edit the STS
   Global endpoint to create session tokens valid in all AWS regions.

You will need to wait a few minutes for the regions to be enabled before you can proceed to the next step. Until they
are enabled, you may get what look like AWS authentication or permissions errors.

After enabling the regions in all accounts, re-enable the `DenyRootAccountAccess` service control policy setting in
`gbl-root.yaml` and rerun

```
atmos terraform apply account --stack gbl-root
```

### Update the `account-map`

The `account-map` component collects and publishes information in the form of terraform outputs about the accounts that
is used by other Terraform projects. It needs to be updated whenever accounts are added or removed.

In the Geodesic shell, execute the following commands:

```
atmos terraform deploy account-map --stack gbl-root
```

One of the outputs of `account-map` is `full_account_map`. It lists the name and corresponding account number for each
account. Save that somewhere, you will need it later.

Learn more about the [account-map](/components/library/aws/account-map/) component.

### Provision `account-settings` component

The `account-settings` component sets the default mode for EBS volumes to be encrypted, and provisions account aliases
and password policies.

In the Geodesic shell, execute the following command for each account, replacing `${account}` with the name of the
account, e.g. `root` or `prod`:

```
atmos terraform apply account-settings --stack gbl-${account}
```

The `apply` gives you a chance to review the actions that will be taken before you `apply` them; type “yes” to actually
make the changes or anything else to stop.

If you do not want to review each change, you can use `deploy` instead, which skips the review stage.

If you want to get everything done with a one-liner, you can use this:

```
for stack in ./stacks/gbl*yaml; do \
 atmos terraform deploy account-settings --stack $(basename $stack .yaml); \
done
```

Learn more about the [account-settings](/components/library/aws/account-settings/) component.

### Provision `aws-saml` component

GSuite integration requires collaboration between a GSuite administrator and a DevOps engineer with `root` account
access. You should have previously installed the IdP metadata files and configured the
[https://cloudposse.atlassian.net/wiki/pages/resumedraft.action?draftId=1384546305](https://cloudposse.atlassian.net/wiki/pages/resumedraft.action?draftId=1384546305)
component in `gbl-identity.yaml` .

In the Geodesic shell, execute the following commands:

```
atmos terraform apply aws-saml --stack core-gbl-identity
```

In the output, make note of the SAML provider ARNs, as you will need them when provisioning user access in GSuite or
Okta.

:::info Security Note

The following guidance provides clarity on the security of the metadata files.

[https://security.stackexchange.com/questions/65743/saml-2-0-idp-metadata-security](https://security.stackexchange.com/questions/65743/saml-2-0-idp-metadata-security)

**TL;DR** they are safe to commit to VCS.

:::

### Provision `aws-teams` component

This component is responsible for provisioning all primary user and system roles into the centralized identity account.
This is expected to be used alongside the [aws-team-roles](/components/library/aws/aws-team-roles/) component to provide
fine-grained role delegation across the account hierarchy. This component was previously name `iam-primary-roles`, but
was renamed as part of refactoring to better convey how it should be used.

**NOTE:** [aws-saml](/components/library/aws/aws-saml/) project must be completed so the identity providers exist. If
identity providers are added or deleted,
[https://cloudposse.atlassian.net/wiki/pages/resumedraft.action?draftId=1384382465](https://cloudposse.atlassian.net/wiki/pages/resumedraft.action?draftId=1384382465)
must also be updated.

This component requires `SuperAdmin` role to run. Use `assume-role` (or `assume-role-saml` for SAML auth) to assume the
role.

In the Geodesic shell, execute the following commands to provision the IAM roles in `identity`:

```
atmos terraform apply aws-teams --stack gbl-identity
```

This provisions the primary roles.

If you get an error similar to the following, then either populate the arn for auto, or add an empty list to
stacks/orgs/(namespace)/(tenant)/identity/global-region.yaml as shown further below

```
ata.aws_iam_policy_document.support_access_aggregated[0]: Reading...
data.aws_iam_policy_document.support_access_aggregated[0]: Read complete after 0s [id=224330982]
╷
│ Error: Invalid function argument
│
│   on ../account-map/modules/team-assume-role-policy/main.tf line 4, in locals:
│    4:   allowed_principals = sort(distinct(concat(var.allowed_principal_arns, module.allowed_role_map.principals, module.allowed_role_map.permission_set_arn_like)))
│     ├────────────────
│     │ while calling concat(seqs...)
│     │ var.allowed_principal_arns is null
│
│ Invalid value for "seqs" parameter: argument must not be null.
╵
╷
│ Error: Invalid function argument
│
│   on ../account-map/modules/team-assume-role-policy/main.tf line 24, in data "aws_arn" "allowed":
│   24:   count = local.enabled ? length(var.allowed_principal_arns) : 0
│     ├────────────────
│     │ while calling length(value)
│     │ var.allowed_principal_arns is null
│
│ Invalid value for "value" parameter: argument must not be null.
╵
Releasing state lock. This may take a few moments...
exit status 1
```

If the account-id for auto (or whichever account runs spacelift workers) is known, edit
stacks/orgs/(namespace)/(tenant)/identity/global-region.yaml and add the arn:

```
import:
  - orgs/e98s/gov/iam/_defaults
  - mixins/region/global-region
  #...

components:
  terraform:
    aws-teams:
      vars:
        teams_config:
          spacelift:
            trusted_role_arns:
              -  "arn:aws:iam::(auto_account-id):role/(namespace)-(tenant)-(primary_region)-(auto_account_name)-spacelift-worker-pool-admin"

```

If the auto account id is not known, create an empty list instead:

```
import:
  - orgs/e98s/gov/iam/_defaults
  - mixins/region/global-region
  #...

components:
  terraform:
    aws-teams:
      vars:
        teams_config:
          spacelift:
            trusted_role_arns: []

```

Save the file and re-run the atmos command for aws-teams for the global identity stack.

### Update `tfstate-backend` component

If you provisioned the `tfstate-backend` component with `--var=access_roles_enabled=false`, now the component needs to
be redeployed with the `access_roles` enable. Reapply the component without the extra settings:

```
atmos terraform apply tfstate-backend --stack core-uw2-root
```

Make note of the outputs, specifically the remote_state_backend S3 rw and ro `role_arn`s. These will be needed in a
couple of steps.

### Provision `aws-team-roles` component

The
[https://cloudposse.atlassian.net/wiki/pages/resumedraft.action?draftId=1384480783](https://cloudposse.atlassian.net/wiki/pages/resumedraft.action?draftId=1384480783)
component creates the delegated IAM roles in the member accounts allowing the `identity` account to assume roles into
the member accounts.

**NOTE:** [aws-saml](/components/library/aws/aws-saml/) must be completed so the identity providers exist.
[aws-teams](/components/library/aws/aws-teams/) must be completed to generate the primary roles in the `identity`
account.

In the Geodesic shell, execute the following commands for each account except for `identity`:

```
atmos terraform apply aws-team-roles --stack ${tenant}-gbl-${stage}
```

## Update the repo contents

Our initial `git` check-in was missing some information. Now it is time to update it.

- Update `stacks/globals.yaml`, setting the `backend` and `remote_state_backend` S3 `role_arn` to the read/write and
  read-only Terraform roles from `tfstate-backend` output.

- (Obsolete, now handled automatically by `aws-config`) ~~Update~~ `rootfs/usr/local/bin/aws-accounts` ~~with the list
  of accounts from~~ `full_account_map` ~~above. Note that you not only need to update account names and numbers, you
  also need to update~~ `profile_order`, `region` (~~the default region abbreviation),~~ `role_prefix`, ~~and possibly
  other items.~~

- ~~After making those updates run~~ `aws-accounts gen-saml > aws-config-saml` ~~and, if needed~~
  `aws-accounts gen-sso > aws-config-sso` ~~to create AWS~~ `config` ~~files and check them in under~~
  `rootfs/etc/aws-config/`

- Change directory to `rootfs/etc/aws-config` and update the config files:

- `aws-config saml > aws-config-saml`

- `aws-config spacelift > aws-config-spacelift`

- `aws-config switch-roles > aws-switch-roles`

- If still needed (may be phased out when `helmfile` is phased out), the `account_number` setting for each account,
  currently set in each region's regional stack file.

- If still needed, any hard-coded account numbers or IAM ARNs in the stacks, such as for compliance

If you have added IdP metadata files, add/check those into `git` under the appropriate component.

Add/check into `git` newly created or updated config files under `rootfs/etc/aws-config` and newly created shell files
under `components/terraform/account-map/account-info` and `components/terraform/aws-team-roles/iam-role-info`.
