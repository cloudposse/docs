---
title: "Authenticate with AWS inside Geodesic using `aws-vault` _(Deprecated)_"
description: "Learn how to authenticate within Geodesic using AWS IAM Credentials and `aws-vault`."
weight: 99
---

## Intro

In this how-to, we'll provide a step-by-step guide on 
how we used to recommend authenticating with AWS inside Geodesic, using `aws-vault`.
This remains for historical reference and for companies who have been using
`aws-vault` for a while and want to train new users. **Cloud Posse no longer
recommends this workflow. See** [Authenticate with AWS using Leapp]({{< relref "howto/geodesic/authenticate-with-leapp.md" >}}) **for the currently recommended procedure.**

## Prerequisites

### System Requirements

You'll need to have an AWS Account with the ability to create credentials and have [Docker installed](https://docs.docker.com/get-docker/) on your local machine. **That's all**.

### SweetOps Know-how

We expect you've gone through the tutorial on ["Getting started with Geodesic"]({{< relref "tutorials/geodesic-getting-started.md" >}}) prior to this How-To since that contains some important understanding of what Geodesic is, how it works, and what it's doing.

## How-To

### 1. Install and start Geodesic

First, at your terminal, let's install Geodesic!

```bash
docker run cloudposse/geodesic:latest-debian | bash
```

This will install Geodesic as a script at `/usr/local/bin/geodesic`, which you can then invoke like so:

```bash
geodesic
```

This small script is just a wrapper around running Geodesic via `docker` with a couple extra options (like mounting `$HOME` to `/localhost`). It should drop you into the Geodesic shell like you would expect.


### 2. Authenticate with AWS + aws-vault

Geodesic ships with [`aws-vault`]({{< relref "reference/tools.md#aws-vault" >}}) to help manage our credentials and retrieve access tokens from AWS to provide us with authenticated sessions. To set up a new profile, first [create a new IAM user and programmatic Access Key ID and Secret Key](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html#id_users_create_console) and be sure to copy those values down somewhere. Now, in your Geodesic shell, let's do the following:

```bash
# Since our Geodesic shell is on Linux, let's use the file backend which Linux supports.
# NOTE: It's not possible to use the OSX Keychain with `aws-vault` running inside of a Docker container.
export AWS_VAULT_BACKEND=file

# Add our new credentials to aws-vault under whatever profile name you would like. i.e. replace $YOUR_PROFILE_NAME
# This will prompt you for the Access Key ID and Secret Key that you copied down earlier, which you should input.
aws-vault add $YOUR_PROFILE_NAME
```

Now we've added our credentials to `aws-vault` and we can easily use `aws-vault exec` to execute an authenticated command on the AWS CLI like so:

```bash
# List all the buckets in your account:
aws-vault exec $YOUR_PROFILE_NAME -- aws s3 ls

# Or get some information on your user:
aws-vault exec luke.skywalker -- aws sts get-caller-identity
```

### 3. Start a AWS Profile Session

That's cool... but what about if you want to start a full blown session as the profile you added so you don't need to keep typing `aws-vault exec`? Well, Geodesic comes bundled with a handy `assume-role` utility that you can use to do that. First though, we need to update our `/localhost/.aws/config` file to support `aws-vault`. To do that, on your local machine, open up `$HOME/.aws/config` with your favorite editor and add the following config entry:

```properties
# ... your existing AWS Config file contents ...

[profile $YOUR_PROFILE_NAME]
credential_process = aws-vault exec $YOUR_PROFILE_NAME --json
```

Great, now that we've set that up, our profile is ready to use with our `assume-role` utility:

```bash
# Now we run `assume-role` with our newly created profile and this will start a new shell session which is authenticated as that profile for us.
assume-role $YOUR_PROFILE_NAME

# We should now see our profile name in our command line prompt and we can now run our AWS CLI
# commands without having to manually invoke `aws-vault exec` each time
aws s3 ls
aws sts get-caller-identity
```

## Conclusion

Here is a simple use-case of setting up a set of AWS credentials within Geodesic, but there is plenty more you can do here since Geodesic also comes bundled with [`saml2aws`](https://github.com/Versent/saml2aws) and [`aws-google-auth`](https://github.com/cevoaustralia/aws-google-auth). Use what works for you and your organization!
