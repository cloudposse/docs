---
title: "How to Register Pristine AWS Root Account"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/931037265/How+to+Register+Pristine+AWS+Root+Account
sidebar_position: 100
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/setup/cold-start/how-to-register-pristine-aws-root-account.md
---

# How to Register Pristine AWS Root Account
[REFARCH-60 - Register Pristine AWS Root Account](https://cloudposse.atlassian.net/browse/REFARCH-60)

### Prerequisites

1. [REFARCH-51 - Decide on Email Address Format for AWS Accounts](https://cloudposse.atlassian.net/browse/REFARCH-51)

2. [REFARCH-31 - Provision 1Password with Shared Vault](https://cloudposse.atlassian.net/browse/REFARCH-31)

3. [REFARCH-471 - Decide on AWS Organization Strategy](https://cloudposse.atlassian.net/browse/REFARCH-471)

4. Company primary contact information

5. Company credit card and billing information

6. Company business mobile phone number you have access to use for SMS

7. Email address that supports [plus addressing](https://en.wikipedia.org/wiki/Email_address#Sub-addressing) (e.g. aws+root@example.com)

### Instructions

:::info
See the official AWS Documentation for the most up to date instructions.
[https://aws.amazon.com/premiumsupport/knowledge-center/create-and-activate-aws-account/](https://aws.amazon.com/premiumsupport/knowledge-center/create-and-activate-aws-account/)

:::

1. Navigate to this link to create an AWS account: [https://portal.aws.amazon.com/billing/signup#/start](https://portal.aws.amazon.com/billing/signup#/start)

2. Specify the email address defined in the design decision and append `+root` before the `@`sign (e.g. `ops+root@ourcompany.com`)

1. In AWS, every AWS account needs a unique email address. We use `+` addressing for each account for disambiguation. Since this is the `root` account, we’re appending `+root`

2. `+` addressing is not universally supported. E.g. Gsuite supports it but Microsoft Exchange does not.

3. Generate a strong password and add it to the appropriate 1Password vault. Make sure it’s the vault you’ve shared with Cloud Posse.

4. AWS account name will be `root`

5. Click `Continue (step 1 of 5)`

6. Select “How do you plan to use AWS?” radio button: `Business - for your work, school or organization`

7. Add the primary contact’s full name

8. Enter your company’s name as it appears on legal documentation

9. Enter the primary contact’s business phone number

10. Enter the company’s legal address

11. Click the link provided to read the terms `AWS Customer Agreement` and check the box

12. Click `Continue (step 2 of 5)`

13. Enter billing information

14. Click `Verify and Continue (step 3 of 5)`

15. Select “How should we send you the verification code?” radio button: `Text message (SMS)`

16. Enter a business mobile phone number that you have access to use. Ideally, this is a number that can forward text messages to your team (e.g. Google Voice or Twillio).

17. Complete the Security check

18. Click `Send SMS (step 4 of 5)`

19. Enter the verification code that was sent as an SMS message to the mobile phone number provided in step 16

20. Click `Continue (step 4 of 5)`

21. Select `Business support - From $100/month`

1. We recommend this support plan so we can use it to expedite account limit increases for the organization. This will be useful throughout the engagement.

22. Click “Complete sign up”

23. Click on the button `Go to the AWS Management Console`

24. Select the radio button `Root user`

25. Enter the Root user email address and click `Next`

1. This is the same address we set up in step 2 (`ops+root@ourcompany.com`)

26. Complete the Security check and click `Submit`

27. Enter the password that was stored in 1Password for this account in step 3 and click `Sign in`

:::tip
Congratulations! You are now able to proceed with the rest of the cold start process.

:::

### Related articles

- [Decide on AWS Organization Strategy](/reference-architecture/fundamentals/design-decisions/cold-start/decide-on-aws-organization-strategy)

- [AWS Documentation: How do I create and activate a new AWS account?](https://aws.amazon.com/premiumsupport/knowledge-center/create-and-activate-aws-account/)

|Related issues | |
| ----- | ----- |

