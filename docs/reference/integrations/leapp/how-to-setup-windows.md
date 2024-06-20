---
title: "Windows (WSL)"
sidebar_position: 100
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/how-to-guides/integrations/office365/how-to-setup-windows.md
tags:
  - leapp
  - windows
  - aws_sso
  - identity
---

# How to Setup Leapp on Windows with WSL

## Problem

You want to set up local AWS credentials but the primary documentation refers to MacOS and Homebrew. Leapp and Geodesic
are supported in Windows using WSL. Please see the [Solution](#solution) below.

## Solution

1. Install latest version of Docker Desktop, Leapp, AWS CLI, WSL (Ubuntu 22)

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Leapp](https://docs.leapp.cloud/latest/installation/install-leapp/)
- [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
- [WSL](https://learn.microsoft.com/en-us/windows/wsl/install)

2. Optional but useful to debug, install the AWS CLI in WSL

3. Start Docker Desktop

4. Launch Leapp UI and connect to Chained Role session

Please see [How to Log into AWS](/reference-architecture/setup/how-to-log-into-aws/#setup), skipping all requirement
steps. After you've connected to your identity profile via the Chained Role session, continue with the remaining steps
here.

5. Find your home directory for Windows.

Most likely this is `C:\Users\YOUR_NAME`. Open WSL and run the following:

```powershell
explorer.exe .
```

6. Copy `.aws` from Windows Home to WSL home

In Powershell copy `.\.aws\` to the your local WSL home path found above.

For example:

```powershell
PS C:\Users\dan> cp -r .\.aws\ \\wsl.localhost\Ubuntu-22.04\home\dan
```

7. Open WSL and verify your identity

```bash
dan@WSL:~$ aws sts get-caller-identity --profile acme-identity
{
    "UserId": "xyz:acme-identity",
    "Account": "123",
    "Arn": "arn:aws:sts::111111111111:assumed-role/acme-core-gbl-identity-devops/acme-identity"
}
```

8. Clone and navigate to `infrastructure` directory

9. Build your Geodesic image:

```powershell
make all
```

10. Done!

In Geodesic you should see the green checkmark next to your profile. You can also verify with `aws sts`:

```bash
 ⧉  acme
 √ : [acme-identity] (HOST) infrastructure ⨠ aws sts get-caller-identity
{
    "UserId": "AROAXYKJQXXXXXXXXXXXX:acme-identity",
    "Account": "111111111111",
    "Arn": "arn:aws:sts::111111111111:assumed-role/acme-core-gbl-identity-devops/acme-identity"
}
```

## FAQ

### Can we configure Leapp to write credentials to the WSL home directory?

No, Leapp does not support changing the `~/.aws` directory path.
[Please see this issue](https://github.com/Noovolari/leapp/issues/153).

However
[thanks to the Leapp open source community](https://github.com/Noovolari/leapp/issues/153#issuecomment-1199014972), we
have a workaround!

One way to do it:

1. Install Leapp in Windows
2. Open WSL
3. In WSL backup your `~/.aws`
4. In WSL create symlink from `/mnt/c/Users/<username>/.aws` to `~/.aws`

Example:

```
# It is ok, if the command returns cp: cannot stat '.aws': No such file or directory
cp -av ~/.aws ~/.aws.bak

ln -s /mnt/c/Users/<username>/.aws ~/.aws
```

Then WSL will follow chosen session in Windows Leapp. One caveat is that Leapp CLI doesn't work in WSL.

### Leapp fails to launch with AWS CLI Error

After I downloaded Leapp, I see this error when trying to start the app:

```powershell
Error: An error occurred getting AWS CLI..
```

You must first install the AWS CLI. See
[AWS CLI - Getting Started](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) or run this
command in PowerShell:

```powershell
msiexec.exe /i https://awscli.amazonaws.com/AWSCLIV2.msi
```

Restart PowerShell and then verify that the AWS CLI installed successfully:

```powershell
PS C:\Users\dan> aws --version
aws-cli/2.15.31 Python/3.11.8 Windows/10 exe/AMD64 prompt/off
```

Now restart Leapp.

### Initializing Docker API Proxy Failed

When trying to start Docker Desktop I am getting this error:

```powershell
Something went wrong.
Starting services: initializing Docker API Proxy: open \.\pipe\docker_engine: Access is denied.
```

See this issue: [docker/for-win/issues/13663](https://github.com/docker/for-win/issues/13663).

Run `wsl --update` and restart Docker Desktop.

### `.local/bin` is not in my `PATH`

When I try to run `make all`, I get this error:

```powershell
Inadequate permissions to install to /usr/local/bin. Installing to /home/dan/.local/bin.
# Installing acme from acme/infrastructure:latest...
# Installed acme to /home/dan/.local/bin/acme
hash
# WARNING: It appears /home/dan/.local/bin is not on your PATH. Please add it.
make: *** [Makefile:56: install] Error 1
```

Add your `.local/bin` to your `PATH`

```powershell
export PATH=$PATH:/home/<YOUR USERNAME>/.local/bin
```

Now try to run `make all` again
