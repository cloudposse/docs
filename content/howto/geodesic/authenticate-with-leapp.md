---
title: "Authenticate with AWS using Leapp"
description: "Learn how to use Leapp to supply AWS credentials to tools used within Geodesic."
weight: 1
---
## Intro

In this how-to, we will help you get started using Geodesic to work with AWS
resources by helping you set up and use [Leapp](https://leapp.cloud).

## Prerequisites

### SweetOps Know-how

We expect you've gone through the tutorial on ["Getting started with Geodesic"]({{< relref "tutorials/geodesic-getting-started.md" >}}) prior to this How-To since that contains some important understanding of what Geodesic is, how it works, and what it's doing.

### AWS Region and Credentials

#### Region

It will be helpful to know which AWS Region you will be primarily working in.
This should be fairly common knowledge among people with AWS access at your
company. If you are doing this on your own, choose the region closest to
you geographically. If you are still in doubt, pick
- `ca-central-1` if in Canada,
- `us-east-2` if in the United States east of the Mississippi,
- `us-west-2` if anywhere else in the North America or anywhere in Central America,
- `sa-east-1` if in South America,
- `eu-north-1` if in Europe,
- `af-south-1` if in Africa,
- `ap-south-1` if in Asia, or
- `ap-southeast-2` if in Australia or Antarctica.

#### Credentials

You will have to have some way of authenticating to AWS already set up, and you
need to know the nature of your credentials. Whoever gave you access to AWS
should be able to tell you what kind of access you have. It should be one of the following:

- **Federated Role** (recommended). This means you log into something you use to
identify yourself to a lot of places (usually refered to as Single Sign-On
or SSO), and it is set up to log you into AWS with a specific IAM Role as well. 
At a company, this is usually Google Workspaces (formerly GSuite),
Okta, or Active Directory. This is also known as a SAML IdP.
- **AWS SSO**. This means your company has configured AWS as a Single Sign-On
provider. This is AWS _as_ a Single Sign-On provider, allowing you to access
multiple _permission sets_ within AWS, not using some
other Single Sign-On provider to sign in to AWS as a single IAM Role. 
Sadly this is made even
more confusing by the fact that even though your company has set up 
AWS _as_ a Single Sign-On provider, you still may be using your company's
primary SSO provider to authenticate to AWS SSO. 
- **AWS IAM User**. This is the older way of authenticating to AWS, with a basic
username (actually an email address) and password to log into the AWS console,
and a long-lived "Access Key" for API access. If you are going to use this
method, we strongly recommend you enable multi-factor authentication (MFA).

Based on which kind of credentials you have, you will need to gather different
information with which to configure Leapp. Whoever is in charge of setting up
your access to AWS should be able to give you the information you need.

##### Federated Role

If using Federated Login, you will need
- Your IdP Single Sign-On URL. 
  - For Google Workspaces, it looks something like
    `https://accounts.google.com/o/saml2/initsso?idpid=C0asdfasdfal&spid=12344321`.
  - For Okta, it looks something like `https://company.okta.com/app/company_samlidp_1/Hka1abcke6h4P1WQr5d7/sso/saml`. 
  - Most importantly,it should not be confused with the AWS Single Sign-On URLs
  like these (**do not use these**)
    - `https://signin.aws.amazon.com/saml` (this is used by your IdP admin)
    - `https://my-sso-portal.awsapps.com/start` (this means you are using AWS SSO)
- The AWS Identity Provider ARN assigned by AWS to your IdP. Something like
  - `arn:aws:iam::123434211234:saml-provider/company-name`
- Your assigned/authorized AWS IAM Role ARN. Something like
  - `arn:aws:iam::123434211234:role/role-name`

##### AWS SSO

If using AWS SSO, you will need:

- Your AWS SSO "start URL", also known as your "portal URL". It should be 
very close to:
  - `https://something.awsapps.com/start`

##### AWS IAM User

If you are a regular IAM User who can log into the AWS Console, you should
log into the AWS Console while setting up Leapp. Choose "My Security Credentials" 
from the Account drop-down menu:
- Copy and paste your MFA ARN or Serial Number from "Assigned MFA device" 
- Click on "Create access key" to create a new access key and copy the
Access Key ID and Secret Access Key from the console and paste directly into 
the appropriate fields in Leapp. 

## How-To

### Start Geodesic

If you are a Cloud Posse client, you will have a customized version of Geodesic
that sets an initial value for the environment variable `AWS_PROFILE`. Alternatively,
you may have customized it yourself, or you may want to. In any case, we will 
go with what you have. So start Geodesic, and at the command prompt, type

```bash
echo $AWS_PROFILE
```

This is the value you will give to the profile in Leapp when you configure it.
If the output of `echo` is blank, use "default" for the profile name.

### Install and Configure Leapp

We are not going to duplicate (and try to keep in sync with updates to) Leapp's
own documentation on how to install and configure Leapp. We will just give 
you the big picture steps.

- Visit the [Leapp website](https://leapp.cloud)
- Download and install Leapp as instructed by the website
- Follow the instructions (under "Docs") for configuring AWS

Below is some guidance to the Leapp documentation that applies as of the
time of this writing. By the time you read this it may be out of date, but
hopefully will still be of help in guiding you through the Leapp site.

##### Key Points

- The "AWS Profile" setting in Leapp must match _exactly_ the value of
`$AWS_PROFILE` you found in Geodesic in the earlier step.
- The "AWS Region" you set in Leapp should be the AWS Region you most often
use, as discussed [above](#aws-region-and-credentials).
- The "Session Alias" is completely up to you: it is the name for this
set of credentials that you will see in the UI.

As of this writing, the Leapp documentation is at [https://docs.leapp.cloud/](https://docs.leapp.cloud/) and the best set of instructions to follow are the ones under a sub-menu on the left 
side of the page: **Tutorials > AWS**

- If you have a **Federated Login**, pick "AWS IAM Federated Role". Most of the 
tutorial is about how to configure Federated Login itself, and you can skip
all that. Just follow the last step: "Setup in Leapp". 
- Otherwise, pick "AWS SSO" or "AWS IAM User" and follow the steps.


### Log in using Leapp

Leapp provides 2 UIs for logging into or out of a session. There is a system-wide menu item
in the taskbar on Windows systems or as a "status menu" on the Mac menu bar. Click on it
and a menu will appear with all your configured session names and their corresponding
profile names. An icon for each session will appear either in gray if logged out
or orange if logged in (at least those are the current defaults for the "Light" color
scheme on macOS). Just select the menu item to toggle the state.

Alternately, you an select "Show" from the menu and be shown a richer UI where
you can do more, but still the main thing is that you click on a session name
to change its state and the indicator shows gray for logged out and orange for logged in.

When logging in, you may be shown a miniature web browser screen and asked to
log in to your IdP (e.g. Okta, Google). You may be prompted for your MFA token.
If you are using MFA, you should enable Leapp notifications so you can receive prompts
when your session expires and you need to enter a new MFA token.

### It should just work

Once you log in to AWS using Leapp, go back into Geodesic and simply hit return
at the prompt. The prompt should change from having a red ✗ and `[none]` to
having a green √ and `[default]` or whatever your profile name is. This is 
Geodesic's way of letting you know you are authorized with AWS, and what
profile you have active. 

You can always confirm your current authentication status with

```bash
aws sts get-caller-identity
```

When you are properly authenticated, it will output your IAM role and other
information. When you are logged out, it will print some kind of error message,
usually:
```text
Unable to locate credentials. You can configure credentials by running "aws configure".
```