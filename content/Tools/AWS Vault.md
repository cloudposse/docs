---
title: "AWS Vault"
excerpt: ""
---
The [`aws-vault`](https://github.com/99designs/aws-vault) by [99 Designs](https://99designs.com/) is a vault for securely storing and accessing encrypted AWS credentials for use in development environments. This tool makes it extremely easy to work with IAM assumed roles across multiple AWS organizations.
[block:callout]
{
  "type": "warning",
  "title": "IMPORTANT",
  "body": "The `aws-vault` has no relationship to the HashiCorp Vault."
}
[/block]
Features:
* Encrypted vault for IAM credentials (OSX KeyChain or file)
* IAM Metadata server (mocks the [EC2 API](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-metadata.html)) to simulate instance profiles for local development
* Prompts for MFA Token
* Variable-length session TTLs
* Compatible with `~/.aws/config`
* Automatic logins to AWS Web Console
[block:callout]
{
  "type": "info",
  "body": "This has been incorporated into our latest release of [geodesic](https://docs.cloudposse.com/blog/new-major-release-of-geodesic).",
  "title": "NOTE"
}
[/block]
# Installation 
 You can install AWS Vault on local allow you to authorize on aws and preform aws cli requrests from host computer

## OSX Installation
```
brew cask install aws-vault
```

## Linux Installation (binary)

Download the precompiled binary from the GitHub releases page, unless a package exists for your distro.

```
sudo curl -o /usr/local/bin/aws-vault https://github.com/99designs/aws-vault/releases/download/v4.2.0/aws-vault-linux-amd64
sudo chmod 755 /usr/local/bin/aws-vault 
```

## Local Configuration

Setup your `~/.aws/config` by adding a profile entry for each AWS account. 

Here's an example of how we do it:
```
[profile cloudposse-dev-admin]
region=us-west-2
role_arn=arn:aws:iam::29013231371:role/OrganizationAccountAccessRole
mfa_serial = arn:aws:iam::313021614177:mfa/erik@cloudposse.com
source_profile=cloudposse
```
[block:callout]
{
  "type": "info",
  "body": "Do not define the source profile in `~/.aws/credentials`; we're going to use `aws-vault add` for that.",
  "title": "IMPORTANT"
}
[/block]
We recommend using the `file` type backend for `aws-vault` because this is compatible with Linux, which is needed for [Geodesic](doc:geodesic) sessions. 

Add the following to your `~/.bashrc`:
```
export AWS_VAULT_BACKEND="file"
```

Then `source ~/.bashrc` to update your current session.

# Using with Geodesic 
  AWS Vault available in the geodesic shell - just connect to that shell by running
```bash
> $CLUSTER_NAME
```

# Add your profile to AWS Vault

Now we are ready to configure your AWS credentials. To add your AWS credentials to the encrypted vault run the following command. Remember to replace `example` with your source profile name.

```
aws-vault add example
```

# Trouble Shooting

Most problems are related to your environment settings.

* Make sure you do not define a `[default]` profile in `~/.aws/credentials` or `[profile default]` in `~/aws/config`
* Make sure `AWS_SDK_LOAD_CONFIG` is not set
* Make sure `AWS_SHARED_CREDENTIALS_FILE` is not set

If using `--server` mode, make sure you do not have credentials exported: 
* `AWS_ACCESS_KEY_ID`
* `AWS_SECRET_ACCESS_KEY`
* `AWS_SECURITY_TOKEN`
* `AWS_SESSION_TOKEN`
(Use `unset` to delete them from your environment and make sure they aren't expored in your `~/.bashrc` or `~/.profile`)

# References
* https://github.com/FernandoMiguel/aws-vault-quick-guide
* https://github.com/99designs/aws-vault