---
title: "How to Create SuperAdmin user"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1093959811/How+to+Create+SuperAdmin+user
sidebar_position: 100
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/setup/cold-start/how-to-create-superadmin-user.md
---

# How to Create SuperAdmin user

[REFARCH-73 - Provision SuperAdmin User for Root Level IAM Management](https://cloudposse.atlassian.net/browse/REFARCH-73)

### Prerequisites

1. [REFARCH-31 - Provision 1Password with Shared Vault](https://cloudposse.atlassian.net/browse/REFARCH-31)

2. [REFARCH-60 - Register Pristine AWS Root Account](https://cloudposse.atlassian.net/browse/REFARCH-60)

## Basic Instructions

Login to the AWS `root` account using the root credentials.

In the IAM console, select "Users" on the sidebar.

1. Click "Add users" button.
1. Enter "SuperAdmin" for "User name". Leave "AWS Management Console access unchecked." Click "Next".
1. Under "Set permissions", select "Attach existing policies directly". A list should appear, from which you should
   check "AdministratorAccess". Click "Next".
1. Review and click "Create user".
1. The "Success" page should show you the "Access key ID" and hidden Secret access key" which can be revealed by
   clicking "Show". Copy these to your secure credentials storage as you will need them shortly.
1. Click "Close" to return to the IAM console. Select "Users" on the sidebar if it is not already selected. You should
   see a list of users. Click the user name "SuperAdmin" (which should be a hyperlink) to take you to the Users ->
   SuperAdmin "Summary" page.
1. Click on the "Security credentials" tab. In the 'Multi-Factor Authentication (MFA)' section, click "Assign a virtual
   MFA device".
1. Enter a name that corresponds to how you will store the MFA token (e.g. '1password')
1. Select 'Authenticator App' as the MFA device type and click 'Next'.
1. Follow the instructions to set up the MFA device. Store the TOTP key in your secure credentials storage.
1. You should be taken back to the "Security Credentials" tab, but now the "Assigned MFA device" field should have an
   ARN like `arn:aws:iam::<account-number>:mfa/SuperAdmin`. Copy the ARN and keep it with the Access Key.
1. Now we need to create an Access Key for CLI access. Click on the "Create Access Key" under "Access Keys".
1. Select "Command Line Interface" and click the "I understand..." checkbox then click 'Next'.
1. Enter a description if you like, such as 'SuperAdmin CLI Access' and click 'Create'.

### Storing SuperAdmin credentials in 1Password

The `SuperAdmin` credentials should be properly stored in 1Password. Relative to other potential 1Password item types,
the most appropriate 1Password item type for these credentials is `login`. Since these are programmatic credentials and
not an actual login with an endpoint from which the website favicon can be retrieved, the icon for this item should be
manually set to the [AWS logo](https://github.com/cryptotradev/vymd-infra/blob/main/docs/img/awspng). Additionally, the
password field should be kept empty. For convenience in retrieving the TOTP code when using Leapp, save `com.leapp.app`
as a website URL.

Set the username to `SuperAdmin`, create fields for the `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and the TOTP
(known as One Time Password field type in 1password) via the AWS virtual MFA device's secret.

Finally, leave a note for this item in the following format:

```
This account's Access Key should be made inactive when not needed.

CURRENT STATUS: ACTIVE

Use this account for API/command line access to administrative functions that IAM roles cannot do, such as provision IAM roles.

This account should not be allowed to log in to the AWS console, and therefore does not have a password.

Root account ID: [AWS ACCOUNT ID]

User ARN arn:aws:iam::[AWS ACCOUNT ID]:user/SuperAdmin

MFA Device ARN arn:aws:iam::[AWS ACCOUNT ID]:mfa/SuperAdmin

```

The resulting entry in 1password should appear as follows:

Hit save once you are done. Once the SuperAdmin credentials need to be disabled, do not forget to update the notes in
this item.

<img src="/assets/refarch/image-20211016-220615.png" height="1662" width="2600" /><br/>

### Detailed Instructions

These are just some more detailed step-by-step instructions. These are redundant with the basic instructions and might
be out of date as the AWS web console interface changes.

1. Login to the AWS `root` account using the root credentials from 1Password

2. Navigate to the IAM console page

<img src="/assets/refarch/image-20210720-181056.png" height="201" width="1185" /><br/>

3. In the IAM console, select `Users` on the sidebar

4. <img src="/assets/refarch/image-20210720-181130.png" height="617" width="250" /><br/>

Click `Add users` button

<img src="/assets/refarch/image-20210720-181200.png" height="310" width="1544" /><br/>

5. Enter "SuperAdmin" for `User name` and check `Programmatic access` and leave `AWS Management Console access`
   unchecked. Click `Next: Permissions` at the bottom right corner of the page

<img src="/assets/refarch/image-20210720-181251.png" height="383" width="785" /><br/>

6. Under `Set permissions` , select `Attach existing policies directly` . A list should appear, from which you should
   check `AdministratorAccess` . Click `Next: Tags` at the bottom right corner of the page

<img src="/assets/refarch/image-20210720-181512.png" height="572" width="830" /><br/>

7. Skip the tags, Click `Next: Review` at the bottom right corner of the page

8. Review and click `Create user` at the bottom right corner of the page

9. The Success page should show you the `Access key ID` and hidden `Secret access key` which can be revealed by clicking
   `Show` , copy these to your secure credentials storage as you will need them shortly

<img src="/assets/refarch/image-20210720-181626.png" height="344" width="817" /><br/>

10. Click `Close` at the bottom right corner to return to the IAM console and select `Users` on the sidebar if it is not
    already selected

11. You should a list of users. Click the user name `SuperAdmin` (which should be a hyperlink)

<img src="/assets/refarch/image-20210720-182019.png" height="332" width="1537" /><br/>

12. On the `Users -> SuperAdmin` "Summary" page, click on the `Security credentials` tab

13. In the `Sign-in credentials` section, find: `Assigned MFA device: Not assigned | Manage` and click `Manage`

<img src="/assets/refarch/image-20210720-182257.png" height="207" width="702" /><br/>

14. Choose `Virtual MFA device` and click `Continue`

<img src="/assets/refarch/image-20210720-182421.png" height="330" width="550" /><br/>

15. Press the `Show secret key` button

<img src="/assets/refarch/image-20210721-151123.png" height="602" width="551" /><br/>

16. Copy the key into 1Password as a AWS Credential using the “MFA” field

<img src="/assets/refarch/image-20210721-151429.png" height="725" width="468" /><br/>

17. Use the MFA codes from 1Password to complete the MFA setup process (you will input 2 consecutive codes)

<img src="/assets/refarch/image-20210721-151622.png" height="406" width="418" /><br/>

18. You should be taken back to the `Security Credentials` tab, but now the `Assigned MFA device` field should have an
    ARN like `arn:aws:iam::<account-number>:mfa/SuperAdmin`

<img src="/assets/refarch/image-20210720-182914.png" height="205" width="802" /><br/>

19. Copy the ARN and keep it with the Access Key in 1Password

20. Configure AWS profile with the SuperAdmin user credentials:

21. If it does not already exist on your host computer, create the file `$HOME/.aws/config`

22. Add the following lines to the end of the `$HOME/.aws/config` file:

````ini`

`[profile SuperAdmin]`

`region = us-west-2`

`default_region = us-west-2`

`mfa_serial = arn:aws:iam::<account-number>:mfa/SuperAdmin`

```

  replacing `us-west-2` with the primary region where you will be hosting your company's infrastructure,

  and `arn:aws:iam::<account-number>:mfa/SuperAdmin` with the "Assigned MFA device" ARN from the previous step.

21.

:::tip

Done!

:::

### Related articles

:::note

The content by label feature displays related articles automatically, based on labels you choose. To edit options for this feature, select the placeholder below and tap the pencil icon.

:::

|Related issues | |
| ----- | ----- |

```
