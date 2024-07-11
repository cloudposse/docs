---
title: "Delete AWS Accounts"
---

# How to Delete AWS Accounts

## Problem

Sometimes accounts are provisioned that are no longer needed or were provisioned by accident. AWS provides no easy
programmatic way to destroy accounts. The following ClickOps method is required to destroy the account.

:::caution

Email accounts associated with AWS accounts are globally unique and cannot be re-used even after the account deletion.
If you ever intend to use the email address again with AWS on another account, we strongly recommend that you first
rename the email address on record before proceeding to delete the account.

:::

## Solution

:::caution

We recommend renaming or repurposing accounts rather than deleting them due to the overhead.

:::

### Delete All Account Resources

Closing an account might not automatically terminate all active resources. We might continue to incur charges for some
of the active resources even after closing the account (ref.
[AWS Documentation](https://aws.amazon.com/premiumsupport/knowledge-center/terminate-resources-account-closure/)).
Furthermore, if we rename or repurpose the account rather than deleting them, we want to be sure to avoid unexpected
charges.

To avoid tedious manual steps, we can leverage [cloud-nuke](https://github.com/gruntwork-io/cloud-nuke) to delete all
resources for us.

Install `cloud-nuke`

```
brew install cloud-nuke
```

Dry run

```
cloud-nuke aws --dry-run
```

Delete all resources. **THIS WILL DELETE ALL RESOURCES IN THE GIVEN AWS ACCOUNT**

```
cloud-nuke aws
```

Export required AWS config for running `cloud-nuke`

To make it easier, save the following in `.envrc`

```
# or wherever the configuration file is
export AWS_CONFIG_FILE=rootfs/etc/aws-config/aws-config-saml
# This is necessary for cloud-nuke
export AWS_SDK_LOAD_CONFIG=true
AWS_PROFILE=$NAMESPACE-$TENANT-gbl-$STAGE-admin cloud-nuke aws --dry-run
```

Create a shell script called `nuke-echo.sh` and replace the `aws-config-saml` script with the `AWS_CONFIG_FILE` input

```
#!/usr/bin/env bash
cat rootfs/etc/aws-config/aws-config-saml | grep '\[profile' | cut -d' ' -f2 | cut -d']' -f1 | grep admin | while read profile; do echo AWS_PROFILE=$profile cloud-nuke aws $@; done
```

Gather the list of applicable regions to remove resources or from or `cloud-nuke` will check all 18 which is very slow.

Run the following script with the necessary cloud-nuke inputs to display the commands

```
./nuke-echo.sh --region us-east-2 --region us-west-2 --region eu-west-3 --exclude-resource-type s3 --exclude-resource-type guardduty --exclude-resource-type transit-gateway
```

This will be the full list of commands that are dumped out

```
AWS_PROFILE=namespace-tenant-gbl-audit-admin cloud-nuke aws --region us-east-2 --region us-west-2 --region eu-west-3 --exclude-resource-type s3 --exclude-resource-type guardduty --exclude-resource-type transit-gateway
...
```

I would skip the following until the very end

- `iam` - due to iam roles used to initiate `cloud-nuke`

- `s3` - due to the amount of time it takes to delete s3 objects i.e. vpc flow log s3 bucket

- `guardduty` - due to `security` controlling this resource but the resource is found across all accounts and fails to
  delete

- `asg` - can fail to destroy eks asgs

- `transit-gateway`

- can fail to destroy due to `network` account controlling this resource

- can fail if there is a transit gateway attachment somewhere in some region

I would delete resources in the following order

- security

- audit

- platform accounts (dev, staging, qa, prod, perf, sandbox)

- corp

- auto

- network (due to transit gateway)

It might be good to skip

- dns

- identity

- root

Sometimes the same command may need to be run more than once

### Manual deletions

These are not covered by `cloud-nuke` (might be covered by `aws-nuke`)

- guardduty

- to remove guardduty, you have to navigate to the security account in aws console, go to guardduty settings,
  disassociate all members, then suspend, and disable

- go to root account and then remove security from being the guardduty delegate

- aws-backup (per region)

- mwaa (per region)

- msk (per region)

- elasticache (per region)

- efs (per region)

- ec2-client-vpn (per region)

- transit-gateway-attachments in `network` account

- any other resources that use a EC2 → Network Interfaces (ENI)

### Prepare the Account for Deletion

1. In the root account, remove the `DenyLeavingOrganization` SCP of the account that should be deleted.

1. Comment out the line for the given account in `stacks/catalog/account.yaml`

1. Apply the changes to the `account` component in `root`:
   `assume-role namespace-tenant-gbl-root-admin atmos terraform apply account -s tenant-gbl-root`

1. Look up the soon-to-be deleted account’s root user e-mail address and password in 1Password.

1. If a password for the account doesn’t exist in 1Password, then to get access request a password reset

1. Open the e-mail sent to the email address (also accessible via the `#aws-notifications` channel in Slack) and click
   the provided link.

1. Set a new password and log in with the new password. Make sure to save this in 1Password just in case.

1. (Optional, but highly recommended): Change the email address to something disposable, perhaps by appending “deleted”
   and the date. Use a “plus address” if not already using one, or add to the plus address if already in use. For
   example, if the account email address is [aws+prod@cpco.co](mailto:aws+prod@cpco.co), change it to
   [aws+prod-deleted-2022-01-01@cpco.co](mailto:aws+prod-deleted-2022-01-01@cpco.co).

1. Open the account’s AWS console with the root user. Account Settings > Edit > Edit Email

1. Ensure you can get emails sent to the new address (should be automatic if you are using plus addressing and
   forwarding to Slack).

1. Log out, log back in, and validate the email address from the account dashboard.

1. Set the account contact information (if not inherited from Organizations)

1. Accept the AWS Customer Agreement (if not inherited from Organizations)

### Delete the Account

:::caution

A valid payment method is no longer required to close an account. However, the API does not support this feature yet.
For now, each account must be manually closed.

:::

:::info

You can only close up to 10% of accounts per month.

:::

1. Open the AWS Console, and go to the `root` account for the given Organization. Close the account from Organizations >
   AWS accounts > select account > Close > check all boxes and enter Account ID > Close account

2. Remove the account from the Terraform state for the `account` component

3. Remove the account from `stacks/catalog/account.yaml`. Follow the standard process for opening a pull request and
   updating the code base.

4. Apply the changes to the `account` component in `root`:
   `assume-role namespace-tenant-gbl-root-admin atmos terraform apply account -s tenant-gbl-root`

## References

- [https://aws.amazon.com/premiumsupport/knowledge-center/close-aws-account/](https://aws.amazon.com/premiumsupport/knowledge-center/close-aws-account/)

- [https://aws.amazon.com/premiumsupport/knowledge-center/terminate-resources-account-closure/](https://aws.amazon.com/premiumsupport/knowledge-center/terminate-resources-account-closure/)

- [https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_accounts_remove.html](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_accounts_remove.html)

- [https://onecloudplease.com/blog/automating-aws-account-deletion#deleting-an-aws-account](https://onecloudplease.com/blog/automating-aws-account-deletion#deleting-an-aws-account)
  (including for comedic value) 🤣

- [How to Create and Setup AWS Accounts](/learn/accounts/tutorials/how-to-create-and-setup-aws-accounts)

- [https://github.com/gruntwork-io/cloud-nuke](https://github.com/gruntwork-io/cloud-nuke)
