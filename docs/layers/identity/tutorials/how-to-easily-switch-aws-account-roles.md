---
title: "Easily Switch AWS Account Roles"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1186693440/How+to+Easily+Switch+AWS+Account+Roles
sidebar_position: 100
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/how-to-guides/tutorials/how-to-easily-switch-aws-account-roles.md
---

# How to Easily Switch AWS Account Roles

## Problem

Your company uses a dozen or more AWS accounts with multiple roles. The AWS Web Console only remembers the last 5 roles
you used. This gets old really quick and you want a better UX switching roles into AWS accounts.

## Solution

:::tip The [aws-extend-switch-roles](https://github.com/tilfinltd/aws-extend-switch-roles) browser extension can be used
to switch roles across many accounts easily from the browser.

:::

1. Refer to the [aws-extend-switch-roles documentation](https://github.com/tilfinltd/aws-extend-switch-roles#install) to
   install the extension on the browser of your choice.

2. Follow the
   [AWS CLI Access](https://github.com/BrightDotAi/infrastructure/blob/main/docs/authentication/onboarding.md#aws-cli-access)
   procedure to set up your local workstation and access the Geodesic shell.

3. From within Geodesic Shell

4. If the option is available, run the `aws-accounts gen-switch-roles` command to save the `aws-extend-switch-roles`
   configuration to your home directory.

```
⨠ aws-accounts gen-switch-roles > /localhost/aws-extend-profiles
```

2. If not, use this workaround

```
⨠ aws-accounts gen-saml | grep -v source_profile | grep admin -C 1 | grep -v '\-\-' > /localhost/aws-extend-profiles
```

3. If no `aws-accounts` use this `aws-gen-config`

```
⨠ aws-gen-config | grep -v source_profile | grep admin -C 1 | grep -v '\-\-' > /localhost/aws-extend-profiles
```

4. In your browser, left-click the `aws-extend-switch-roles` extension (light-blue icon with a key) and click on the
   `Configuration` option.

5. Open `~/aws-extend-profiles` in your home directory, copy its contents, and paste it into the form, then click
   `Save`.

6. Follow the
   [AWS Sign-In Procedure](https://github.com/BrightDotAi/infrastructure/blob/main/docs/authentication/onboarding.md#aws-console-sign-in-via-okta-apps-dashboard)
   to open the AWS Console.

You should now be able to switch IAM roles across accounts by clicking the extension in your browser and selecting the
desired IAM role.

:::info See the [official extension docs](https://github.com/tilfinltd/aws-extend-switch-roles#configuration) for more
configuration options.

:::
