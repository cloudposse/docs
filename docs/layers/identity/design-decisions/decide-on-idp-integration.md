# Decide on Identity Provider (IdP) Integration Method

## Problem

After [deciding on which IdP](reference-architecture/fundamentals/design-decisions/cold-start/decide-on-idp/) will be used, companies need to decide on how they will authenticate with AWS using that IdP. Organizations require efficient and streamlined methods to authenticate and manage access to their AWS resources.  Without a centralized or user-friendly system, managing access across multiple AWS organizations or accounts becomes cumbersome and prone to errors. Multiple SSO authentication options exist within AWS. Choosing between AWS Identity Center (SSO) and SAML requires organizations to determine which method aligns best with their operational structure and goals. This choice can be daunting without clear guidance.

Each authentication method comes with its own set of advantages and limitations. AWS SAML offers centralized access across multiple organizations but may be overkill for entities with a single AWS Organization. On the other hand, AWS Identity Center provides a user-friendly interface for single organizations but may not be as efficient for those managing multiple AWS accounts or organizations. Implementing both methods simultaneously can lead to potential overlaps, confusion, and inefficiencies unless managed correctly.

Organizations need clarity on which method to adopt and an understanding of the trade-offs involved to ensure efficient and secure access to AWS resources. The best option depends on your unique organizational structures and user preferences.

## Solution

Cloud Posse supports both AWS SAML and AWS Identity Center (AWS SSO) for authenticating with AWS. Choose one or both options.

**[AWS SAML 2.0 based federation](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_saml.html)** is provisioned in the centralized identity account and then permits roles to assume access roles in other accounts across the organization. It works well with multiple IdPs, enabling roles to be programmatically associated with specific providers. Aside from the obvious benefit of using AWS SAML to provide a single authentication page for users, is that the benefit that the AWS SAML approach enables granular control over all the mechanics, giving administrators ultimate control over how it works.  Internally, Cloud Posse uses AWS SAML to authenticate with all customers to access many AWS Organizations easily.

**[AWS Identity Center (AWS SSO)](https://aws.amazon.com/iam/identity-center/)**, alternatively, is deployed for a single AWS Organization. With AWS Identity Center, we have a single access page for all accounts in the Organization and can connect directly to a given account. **AWS Identity Center is the recommended choice for customers**, given that most customers manage a single AWS Organization, and the single login page is the most user-friendly option. It's also ideal for business users, requiring no additional software configuration like Leapp to access resources through the AWS web console. However, it is limited to a single IdP, so companies that depend on multiple IdP's should consider other options.

Both options can be deployed simultaneously. You can choose to have both or either option deployed.

:::info Cloud Posse Access

Since AWS Identity Center does not support multiple identity providers, we always deploy AWS SAML for Cloud Posse's access for the duration of our engagement. We do that to control access in our own team and to make it easier for the customer to cut off all of Cloud Posse's access at any time. For more on offboarding, see [Offboarding Cloud Posse](/reference-architecture/reference/offboarding-cloud-posse/)

:::


## Consequences

### AWS Identity Center (AWS SSO)

In order connect your chosen IdP to AWS SSO, we will to configure your provider and create a metadata file. Please follow the relevant linked guide and follow the steps for the Identity Provider. All steps in AWS will be handled by Cloud Posse.

Please also provision a single test user in your IdP for Cloud Posse to use for testing and add those user credentials to 1Password.

- [GSuite](https://aws.amazon.com/blogs/security/how-to-use-g-suite-as-external-identity-provider-aws-sso/): Follow the "Google Workspace SAML application setup" steps only. Cloud Posse will handle the rest.
- [Office 365](/reference-architecture/how-to-guides/integrations/how-to-setup-office-365-aws-sso/)
- [AWS supported IdPs: Azure AD, CyberArk, JumpCloud, Okta, OneLogin, Ping Identity](https://docs.aws.amazon.com/singlesignon/latest/userguide/supported-idps.html)

### AWS SAML

If deploying AWS SAML as an alternative to AWS SSO, we will need a separate configuration and metadata file. Again, please refer to the relevant linked guide.

- [GSuite](https://aws.amazon.com/blogs/desktop-and-application-streaming/setting-up-g-suite-saml-2-0-federation-with-amazon-appstream-2-0/): Follow Steps 1 through 7. This document refers to Appstream, but the process will be the same for AWS.
- [Office 365](/reference-architecture/how-to-guides/integrations/how-to-setup-saml-login-to-aws-from-office-365/)
- [JumpCloud](https://support.jumpcloud.com/support/s/article/getting-started-applications-saml-sso2)
- [Okta](https://help.okta.com/en-us/Content/Topics/DeploymentGuides/AWS/aws-configure-identity-provider.htm)
