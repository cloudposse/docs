---
title: AWS Vault
description: "The `aws-vault` command line tool is a utility for securely storing and accessing encrypted AWS credentials for local development environments. It makes it extremely easy to work with IAM assumed roles across multiple AWS organizations."
tags:
- tools
---

The [`aws-vault`](https://github.com/99designs/aws-vault) command line tool by [99 Designs](https://99designs.com/) is a utility for securely storing and accessing encrypted AWS credentials for use in development environments. This tool makes it extremely easy to work with IAM assumed roles across multiple AWS organizations.

{{% dialog type="info" icon="fa-info-circle" title="Info" %}}
`aws-vault` has no relationship to the HashiCorp Vault.
{{% /dialog %}}

Features:

- Encrypted vault for IAM credentials (OSX KeyChain or file)
- IAM Metadata server (mocks the [EC2 API](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-metadata.html)) to simulate instance profiles for local development
- Prompts for MFA Token
- Variable-length session TTLs
- Compatible with `~/.aws/config`
- Automatic logins to AWS Web Console

{{% dialog type="info" icon="fa-info-circle" title="Note" %}}
This has been incorporated into our latest release of [geodesic]({{< relref "announcements/new-major-release-of-geodesic.md" >}}).
{{% /dialog %}}

# Installation

You can install `aws-vault` locally, allowing you to authorize to AWS and perform AWS cli actions.

## OSX Installation

```
brew cask install aws-vault
```

## Linux Installation (binary)

Download the precompiled binary from the GitHub releases page, unless a package exists for your distro.

```
sudo curl -L -o /usr/local/bin/aws-vault https://github.com/99designs/aws-vault/releases/download/v4.2.0/aws-vault-linux-amd64
sudo chmod 755 /usr/local/bin/aws-vault
```

## Local Configuration
We recommend using the `file` type backend for `aws-vault` because this is compatible with Linux, which is needed for [Geodesic](/geodesic) sessions.

Add the following to your `~/.bashrc`:

```
export AWS_VAULT_BACKEND="file"
```

Then `source ~/.bashrc` to update your current session.

1. Generate IAM Access Key ID/Secret on your AWS root account via IAM management page in the AWS Console.

{{% dialog type="important" icon="fa fa-exclamation-triangle" title="Important" %}}
Do not define the source profile in `~/.aws/credentials`; we're going to use `aws-vault add` for that.
{{% /dialog %}}

2. Using the IAM Access Key ID/Secret generated in Step 1, add the `source_profile`:
```bash
$ aws-vault add example
```

3. Add the `source_profile` created in Step 2 to your `~/.aws/config`.
```
[profile example]
region=us-west-2
```

4. Setup your `~/.aws/config` by adding a profile entry for each AWS account:
{{% dialog type="important" icon="fa fa-exclamation-triangle" title="Important" %}}
Remember to replace the `$aws_account_id`s with your account ids and `user@example.com` with your IAM username below. We recommend using email addresses for all IAM user accounts associated with human users.
{{% /dialog %}}
```
[profile example-staging-admin]
region=us-west-2
role_arn=arn:aws:iam::$aws_account_id_for_staging:role/OrganizationAccountAccessRole
mfa_serial=arn:aws:iam::$aws_account_id_for_root:mfa/user@example.com
source_profile=example
```

5. Test that it is all set up properly:
```
$ aws-vault login example-staging-admin
```

This should open a browser and log you into the AWS console as the assumed role `example-staging-admin`.

# Using with Geodesic

`aws-vault` is available in the geodesic shell. To start the shell, run:

```bash
$CLUSTER_NAME
```

# Add your profile to AWS Vault

Now we are ready to configure your AWS credentials. To add your AWS credentials to the encrypted vault run the following command. Remember to replace `example` with your source profile name.

```
aws-vault add example
```

# Troubleshooting

Most problems stem from misconfiguration.

- **Do not** define a `[default]` profile in `~/.aws/credentials` or `[profile default]` in `~/aws/config`
- **Do not** set `AWS_SDK_LOAD_CONFIG`
- **Do not** set `AWS_SHARED_CREDENTIALS_FILE`

If using `--server` mode, ensure the following credentials are not exported:
{{% dialog type="important" icon="fa fa-exclamation-triangle" title="Important" %}}
Since running `aws-vault` using `--server` binds to the `169.254.169.254` local ip address to mock the AWS metadata server, you can run only one process per host machine. More info can be found [here]({{< relref "/faq/aws-vault-error-failed-to-start-credential-server" >}}).
{{% /dialog %}}

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_SECURITY_TOKEN`
- `AWS_SESSION_TOKEN`

Use `unset` to delete each of the above variables from your environment and ensure they aren't exported in your `~/.bashrc` or `~/.profile`.

# References

- <https://github.com/FernandoMiguel/aws-vault-quick-guide>
- <https://github.com/99designs/aws-vault>
