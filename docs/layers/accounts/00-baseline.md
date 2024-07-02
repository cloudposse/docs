# Automated Cold Start Implementation

The Baseline tier is commonly referred to as the Cold Start.

## Quick Start

The Cold Start is the most manually involved tier. Read through the following steps and see
[the detailed documentation](https://docs.cloudposse.com/reference-architecture/setup/cold-start/manual-configuration)
for edge cases.

In short,

| Steps                     |                                                      |
| ------------------------- | ---------------------------------------------------- |
| Install requirements      |                                                      |
| Build Geodesic            | `make all`                                           |
| Vendor components         | `atmos workflow vendor -f baseline`                  |
| Configure root SuperAdmin | Click Ops                                            |
| Configure Terraform state | `atmos workflow init/tfstate -f baseline`            |
| Deploy AWS Organization   | `atmos workflow deploy/organization -f accounts`     |
| Prepare accounts creation | Click Ops                                            |
| Deploy accounts           | `atmos workflow deploy/accounts -f accounts`         |
| Deploy accounts settings  | `atmos workflow deploy/account-settings -f accounts` |
| Finalize account setup    | Click Ops                                            |

## Prerequisites

Follow the
[prerequisites steps in the How-to Get Started guide](https://docs.cloudposse.com/reference-architecture/fundamentals/#prerequisites).

Ensure Geodesic is fully up and running before continuing.

### Before Running Terraform (ClickOps)

First, you'll need to perform some ClickOps to ensure things are set up before we use Terraform to manage AWS accounts.

From the root account:

1. Enable
   [business support](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_support.html) in
   the `root` account (in order to expedite requests to raise the AWS member account limits)
1. Set up the root IAM user account with a Virtual MFA device, following
   [the instructions in the AWS documentation](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_mfa_enable_virtual.html#enable-virt-mfa-for-root)
   for enabling a virtual MFA device for an AWS account root user. Save the MFA TOTP key in 1Password by using
   1Password's TOTP field and built-in screen scanner to scan the QR code presented on the web page.
1. [Create a `SuperAdmin` IAM User](https://docs.cloudposse.com/reference-architecture/setup/cold-start/how-to-create-superadmin-user/).
   Do not enable "console login", do set up MFA, and then create a single Access key. Create an API Credential for the
   `SuperAdmin` credentials in 1Password and store the Access Key ID, Secret Access Key, Assigned MFA device ARN, and
   TOTP key. This is the user we will use until AWS Team Roles (`aws-team-roles` component) are provisioned.
1. For billing users, you need to enable IAM access. As the root user
   [open up the account settings for AWS Billing](https://us-east-1.console.aws.amazon.com/billing/home?region=us-east-1#/Account),
   then scroll to the section "IAM user and role access to Billing information" and enable it.

For more details, see
[the detailed documentation](https://docs.cloudposse.com/reference-architecture/setup/cold-start/#provision-account-settings-component).

### (Optional) Enable Regions

The 17 original AWS regions are enabled by default. If you are using a region that is not enabled by default (such as
Middle East/Bahrain), you need to take extra steps. For details, see
[the detailed documentation](https://docs.cloudposse.com/reference-architecture/setup/cold-start/#optional-enable-regions)

## Initializing

### The Toolbox Image

Build the toolbox image locally before continuing. Follow the
[toolbox image setup steps in the How-to Get Started guide](https://docs.cloudposse.com/reference-architecture/fundamentals/#building-the-toolbox-image).
In short, run `make all`.

The container will have the given local home mapped, so you should be able to use aws normally inside it once you set a
profile that has valid credentials. For instance, if I log in to the profile `acme` with
[leapp](https://github.com/Noovolari/leapp), I can run `aws --profile acme sts get-caller-identity` and get a response.

Once you've verified that the infra container has access to aws resources, we can move on to the next step.

### Setting up the Terraform State Backend

This is where we configure and run Atmos. Atmos is a workflow automation tool that we will use to call Terraform which
will provision all the accounts and resources you need to create and manage infrastructure. The Atmos configuration can
be found in the `atmos.yaml`.

If you're unfamiliar with atmos, you can read more about it [here](https://atmos.tools).

If you look at `components/terraform/`, you'll see a bunch of directories. These contain Terraform "root modules" that
are provisioned with Atmos. At first they'll only have their vendor files, such as
`components/terraform/tfstate-backend/component.yaml`.

You can use `atmos workflow vendor -f baseline` to vendor all the `baseline` modules, if the Terraform files are not
present. You'll want to at least see Terraform files in `tfstate-backend` and `account-map`.

Once you've done that, you can run `atmos workflow init/tfstate -f baseline` to deploy the Terraform Backend.

Note that it can take a minute for the S3 buckets you created to become available. The workflow will attempt to wait
until the bucket is created and available, with a 5-second delay between each check. Eventually, you should see this
prompt:

```
Initializing the backend...
Do you want to migrate all workspaces to "s3"?
```

Type `yes` to continue. This will migrate the state from the local backend to the s3 backend.


:::info Granting SuperAdmin Access to TFState

The IAM User for SuperAdmin will be granted access to Terraform State by principal ARN. This ARN is passed to the `tfstate-backend` stack catalog under `allowed_principal_arns`. Verify that this ARN is correct now. You may need to update the root account ID.

:::

## Deploying

### Prepare Account Deployment

Review the "account" configuration in the stack catalog. **This is the hardest part to change/fix once the accounts are
provisioned**. If you aren't confident about the email configuration, account names, or anything else, now is the time
to make changes or ask for help.

You should double-check the following:

1. `stacks/catalog/account.yaml`
2. Run `atmos describe component account -s core-gbl-root` to inspect the final component configuration (e.g. _after_
   all the mixins have been imported)
3. Plan the run with `atmos terraform plan account -s core-gbl-root`

Now deploy the AWS Organization. To deploy all accounts, we need to request an increase of the Account Quota from AWS
support, which requires an AWS Organization to be created first. This process also enables
[AWS RAM for Organizations](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_enable-ram.html)
via a CLI command, which is required for connecting the Organization.

Deploy the AWS Organization:

```bash
atmos workflow deploy/organization -f accounts
```

### Requirements for Deploying Accounts

Before performing the "Deploying Accounts" step, the root account needs to be configured as an AWS Organization. Once
updated, complete the root account setup with the following ClickOps steps.

From the `root` account (not `SuperAdmin`):

1. Increase the
   [account quota to 20+](https://us-east-1.console.aws.amazon.com/servicequotas/home/services/organizations/quotas) for
   the Cloud Posse reference architecture, or more depending on your business use-case

### Deploying Accounts

:::info

With the addition of support for dynamic Terraform roles, our `baseline` cold start refarch layer now depends
on/requires that we have `aws-teams` and `aws-team-roles` stacks configured. This is because `account-map` uses those
stacks to determine which IAM role to assume when performing Terraform in the account, and almost every other component
uses `account-map` (indirectly) to chose the role to assume.

:::

Again verify the "account" configuration in `stacks/catalog/account.yaml`.

Once confident, begin the accounts deployment:

```bash
atmos workflow deploy/accounts -f accounts
```

These deployments will create all AWS member accounts and store relevant account metadata as "mappings" in the Terraform
outputs of the `account-map` component. Rather than querying this `account` component each time we need an Account ID or
role, we provision a static component `account-map`. **IMPORTANT:** Always run
`atmos terraform apply account-map -s core-gbl-root` after provisioning accounts.

Once you've created the accounts, you'll need to provision the baseline configuration within the accounts themselves.
This is accomplished by running `atmos workflow deploy/account-settings -f accounts`.

The workflows will kick off several sequential Terraform runs to provision all the AWS member account settings for
member accounts in the Organization.

#### ClickOps to Complete Account Setup

For each new account:

1. Perform a password reset by attempting to log in to the AWS console as a "root user", using that account's email
   address, and then clicking the "Forgot password?" link. You will receive a password reset link via email, which
   should be forwarded to the shared Slack channel for automated messages. Click the link and enter a new password. (Use
   1Password or Random.org to create a password 26-38 characters long, including at least 3 of each class of character:
   lower case, uppercase, digit, and symbol. You may need to manually combine or add to the generated password to ensure
   3 symbols and digits are present.) Save the email address and generated password as web login credentials in
   1Password. While you are at it, save the account number in a separate field.
1. Log in using the new password, choose "My Security Credentials" from the account dropdown menu and set up
   Multi-Factor Authentication (MFA) to use a Virtual MFA device. Save the MFA TOTP key in 1Password by using
   1Password's TOTP field and built-in screen scanner. Also, save the Virtual MFA ARN (sometimes shown as "serial
   number").
1. While logged in, enable optional regions as described in the next step, if needed.
1. (Optional, but highly recommended): Unsubscribe the account's email address from all marketing emails.

For more details, review
[the detailed "AWS Cold Start" documentation](https://docs.cloudposse.com/reference-architecture/setup/cold-start/#configure-root-account-credentials-for-each-account).

Now that the accounts are bootstrapped, you can start setting up AWS Team Roles and Identities.
[Continue to the Identity Setup](https://docs.cloudposse.com/reference-architecture/setup/identity/)

# Related Topics

## Mixins and Imports with Atmos

As infrastructure grows, we end up with hundreds or thousands of settings for components and stack configurations. If we
copy and paste these settings everywhere, it’s error-prone and not DRY. What we really want to do is to define a sane
set of defaults and override those defaults when we need them to change.

We accomplish this with Mixins. Mixins are imported into all stacks and each follow a set of rules. We use the
`mixins/region` and `mixins/account` configurations to define common **variables** for all stacks. For example,
`mixins/region/us-east-1.yaml` will define the variable `region: us-east-1`.

**Note.** Do not import components into the account or region mixins. These are imported multiple times to define common
variables, so any component imports would be duplicated and cause an Atmos error such as this:

```
Executing command:
/usr/bin/atmos terraform deploy account-settings -s core-gbl-artifacts

Found duplicate config for the component 'account-settings' for the stack 'core-gbl-artifacts' in the files: orgs/cch/core/artifacts/global-region/baseline, orgs/cch/core/artifacts/global-region/monitoring, orgs/cch/core/artifacts/global-region/identity.
Check that all context variables in the stack name pattern '{tenant}-{environment}-{stage}' are correctly defined in the files and not duplicated.
Check that all imports are valid.

exit status 1
```
