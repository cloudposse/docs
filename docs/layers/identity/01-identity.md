# Identity

[Previous layer for bootstrapping this repo](https://docs.cloudposse.com/reference-architecture/setup/cold-start/automated-configuration/)

| Steps                         |                                             |
| ----------------------------- | ------------------------------------------- |
| Install requirements          |                                             |
| Vendor components             | `atmos workflow vendor -f identity`         |
| Prepare AWS SSO               | Click Ops                                   |
| Add your SAML provider        | Click Ops                                   |
| Deploy identity components    | `atmos workflow deploy/all -f identity`     |
| Reconfigure Terraform Backend | `atmos workflow deploy/tfstate -f baseline` |
| Deploy baseline components    | `atmos workflow deploy -f baseline`         |

## Prerequisites

### AWS Identity Center (SSO) ClickOps

#### Click Ops for `aws-sso`

1. Go to the root admin account
2. Select primary region
3. Go to AWS SSO
4. Enable AWS SSO

### Setting up IdP Metadata for SAML

Export an Identity Provider (IdP) metadata file from the chosen provider. You'll need to place this file inside the
`aws-saml` component directory (`components/terraform/aws-saml/`) and commit this to version control. The filename
should match the variable configured in `stacks/catalog/aws-saml.yaml`.

The creation of these metadata files will be different for each IdP. Here are some example setup references:

1. [Google Workspace](https://aws.amazon.com/blogs/desktop-and-application-streaming/setting-up-g-suite-saml-2-0-federation-with-amazon-appstream-2-0/)
   (Note that
   [Workspace can now sync users](https://aws.amazon.com/about-aws/whats-new/2023/06/aws-iam-identity-center-automated-user-provisioning-google-workspace/)
   )
2. [Okta](https://help.okta.com/en-us/Content/Topics/DeploymentGuides/AWS/aws-configure-identity-provider.htm)
3. [JumpCloud](https://support.jumpcloud.com/support/s/article/getting-started-applications-saml-sso2)

#### Supported External Identity Providers

[Follow the AWS documentation for setting up an IdP integration with AWS](https://docs.aws.amazon.com/singlesignon/latest/userguide/supported-idps.html).
This list includes Azure AD, CyberArk, JumpCloud, Okta, OneLogin, and Ping Identity. For other providers, see the next
section.

:::tip Integrating JumpCloud with AWS IAM Identity Center

The official AWS documentation for setting up JumpCloud with AWS IAM Identity Center is not accurate. Instead, please refer to the [JumpCloud official documentation](https://jumpcloud.com/support/integrate-with-aws-iam-identity-center)

:::

#### Other External Identity Providers

For non-explicitly supported Identity Providers, such as GSuite, set up the app integration with a custom external
identity provider. The steps may be different for each IdP, but the goal is ultimately the same.

1. Open the Identity account in the AWS Console
2. On the Dashboard page of the IAM Identity Center console, select Choose your identity source
3. In the Settings, choose the Identity source tab, select the Actions dropdown in the top right, and then select Change
   identity source
4. By default, IAM Identity Center uses its own directory as the IdP. To use another IdP, you have to switch to an
   external identity provider. Select External identity provider from the available identity sources
5. Configure the custom SAML application with the Service provider metadata generated from your IdP. Follow the next
   steps from your IdP, and then complete this AWS configuration afterwards
6. Open your chosen IdP
7. Create a new SSO application
8. Download the new app's IdP metadata and use this to complete step 5 above
9. Fill in the Service provider details using the data from IAM Identity Center, and then choose Continue. The mapping
   for the data is as follows:

```
For ACS URL, enter the IAM Identity Center Assertion Consumer Service (ACS) URL.
For Entity ID, enter the IAM Identity Center issuer URL.
Leave the Start URL field empty.
For Name ID format, select EMAIL.
```

10. If required for the IdP, enable the application for all users
11. Finally, define specific Groups to match the given Group names by the aws-sso component
    (`stacks/catalog/aws-sso.yaml`). In the default catalog, we define four Groups: `DevOps`, `Developers`,
    `BillingAdmin`, and `Everyone`

If set up properly, Users and Groups added to your IdP will automatically populate and update in AWS.

:::caution

GSuite does not automatically sync Users and Groups with AWS Identity Center without additional configuration! If using
GSuite as an IdP, considering deploying the [ssosync](https://github.com/awslabs/ssosync) tool.

:::

Additional IdP specific setup reference can be found here:

1. [GSuite](https://aws.amazon.com/blogs/security/how-to-use-g-suite-as-external-identity-provider-aws-sso/)

### Deploying Identity Components

The following components are designed to provision all primary user and system roles into a centralized identity
account. These components are expected to be used together to provide fine-grained role delegation across the account
hierarchy.

1. The `aws-teams` component defines User Groups to AWS Team mapping in the Identity account, with the `core-identity`
   account serving as the "Identity Hub" for centralized role assumption management across all delegated accounts.

2. The `aws-team-roles` component defines common IAM Roles in all accounts, as well as defines the AWS Team(s) able to
   assume the Role in any account

3. The `aws-sso` component connects AWS IAM Identity Center (Successor to AWS Single Sign-On) Groups to Permission Sets.
   Permission Sets grant access to the Identity account or (optional) access to an individual account for convenience.

4. The `aws-saml` component provides SAML access for Admin users to connect to the Identity account admin role without
   AWS IAM Identity Center (Successor to AWS Single Sign-On).

Deploy these components across all accounts by running `atmos workflow deploy/all -f identity`. Note that if any users
or groups are missing, `aws-sso` will fail.

Once the roles are deployed, the Terraform State Backend should be reconfigured to use the newly provisioned roles.
Apply those changes to Terraform State Backend by running `atmos workflow deploy/tfstate -f baseline`.

### Generate AWS Config

Once the identity components have been deployed, we will need to create local AWS configuration for these new roles and
profiles. Generate those files now by running the following command from within Geodesic.

```bash
atmos workflow update-aws-config -f identity
```

This will generate AWS configuration to the `rootfs` directory locally. In order to apply these updates to your Geodesic
image, exit the image and rerun `make all`.

One of these configuration files will be named `aws-config-teams`. This file holds local configuration for all local
user authentication to AWS. This file will be the same for both SAML and SSO users, as well as for all teams. This file
looks for a specific AWS profile for your namespace, for example `acme-identity `, and
uses that profile as the entry-point for all role assumption. From this profile, all users with proper permission will
be able to execute Terraform or assume other roles across the AWS Organization.

:::info

Anytime that teams or roles are changed, rebuild AWS config

```bash
atmos workflow update-aws-config -f identity
```

:::

For more on role assumption and identity, see the
[IAM, AWS Teams, and Identity Quick Start](https://docs.cloudposse.com/reference-architecture/quickstart/iam-identity/).

## Setting Up Access

Leapp is an AWS credential management tool that will simplify the authentication process. Leapp requires the AWS Session
Manager plugin as well. Install both now.

```bash
brew install --cask leapp
brew install --cask session-manager-plugin
```

Once Leapp is installed, follow these steps to set up local AWS access with AWS Identity Center (SSO).

1. Launch Leapp
2. Create a new Integration
3. Fill out Single Sign-On configuration

```
Alias: acme (This can be whatever you would like to label the Integration in Leapp)
Portal URL: https://d-1111aa1a11.awsapps.com/start/ (Set this to your SSO Launch URL)
AWS Region: us-east-1 (Your primary region)
Auth. Method: In-browser
```

4. Click Integration “dots” and select “Login”. This should launch a tab in your web browser.
5. Log into your IdP for your Organization and “Allow” Authorization request
6. Create a “Chained Session” from the `core-identity` account with the `IdentityDevOpsTeamAccess` Permission Set

:::info

This Permission Set will match the given Team name. For example, Developers will use `IdentityDevelopersTeamAccess` and
DevOps will use `IdentityDevopsTeamAccess`.

:::

7. Fill out the Chained Session configuration for connecting to `acme-identity`

```
Named profile: acme-identity
Session Alias: (whatever you like) core-identity
AWS Region: us-east-1
Role ARN: arn:aws:iam::666666666666:role/acme-core-gbl-identity-devops
Role Session Name: acme-identity
Assumer Session: core-identity
```

:::info

This Team will match the given Team name. For example, Developers will use
`acme-core-gbl-identity-developers` and DevOps will use
`acme-core-gbl-identity-devops`.

:::

8. (Optional) Pin the new `core-identity` IAM Role Chained Session
9. Connect to `core-identity` IAM Role Chained Session
10. Open your terminal of choice, navigate to the `infra-acme` repository, and launch
    Geodesic

```bash
make build run/new
```

11. Done! Confirm that authentication is properly set up by calling the AWS from within Geodesic:

```bash
aws sts get-caller-identity
```

This should return the given Identity role. Geodesic will also show a green tick-mark in the shell prompt to show the
current AWS profile.

### Finalize the Baseline

Now that roles are deployed, we can validate their setup by deploying CloudTrail and ECR. Run the following workflow:
`atmos workflow deploy -f baseline`.

### Setting up Networking

Continue to [the next section](https://docs.cloudposse.com/reference-architecture/setup/network/) to set up networking.
