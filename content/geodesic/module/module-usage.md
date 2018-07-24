---
title: "Geodesic Module Usage"
description: ""
weight: 2
---
# Prerequisites

* Follow the "Quick Start" for [Quick start]({{< relref "geodesic/module/quickstart.md" >}})

{{% dialog type="info" icon="fa fa-info-circle" title="Examples" %}}
All examples are based on use cases provided in [Agenda]({{< relref "learn-by-example/agenda.md" >}})
{{% /dialog %}}

# Start the Geodesic Shell

A Geodesic Module is docker container that extends Geodesic and used as a shell.

Each Geodesic Module will have a unique name. The shell can be easily started any time by simply running that name in a terminal.
The name is a shell script in `/usr/local/bin`. Make sure this path is in your `PATH` environment variable.

# Development Iterations

After you [create a Geodesic Module]({{< relref "geodesic/module/quickstart.md" >}}), there will be `/conf` directory in the image.

The '/conf' dir used to store definitions of all [Backing Services]({{< relref "learn-by-example/kubernetes-cluster/add-platform-backing-services.md" >}}).

During development, it would be very painful to have to rebuild the container everytime you make or test a change. Therefore, we recommend that you use `/localhost` path in the Geodesic Shell so that you can work on your local copy. Your native `$HOME` directory is mounted to `/localhost` in the container.

Finally, once you have everything working, we recommend that you rebuild the Geodesic Module container to incorporate your changes in the container and do one more final test.

# Build new version

To build Geodesic Module just run `make build` in the module directory

# Start the Shell

Run the wrapper script to start a new shell. The first thing you will need to do is to login to AWS by assuming a correct role (e.g. run `assume-role`) before you can work with many of the tools in the Geodesic Module.

{{% dialog type="code-block" icon="fa fa-code" title="Example" %}}
```shell
staging.example.com
# Mounting /home/goruha into container
# Starting new staging.example.com session from cloudposse/staging.example.com:dev
# Exposing port 48934
* Started EC2 metadata service at http://169.254.169.254/latest
         _              _                                              _
     ___| |_ __ _  __ _(_)_ __   __ _    _____  ____ _ _ __ ___  _ __ | | ___
    / __| __/ _` |/ _` | | '_ \ / _` |  / _ \ \/ / _` | '_ ` _ \| '_ \| |/ _ \
    \__ \ || (_| | (_| | | | | | (_| | |  __/>  < (_| | | | | | | |_) | |  __/
    |___/\__\__,_|\__, |_|_| |_|\__, |  \___/_/\_\__,_|_| |_| |_| .__/|_|\___|
                  |___/         |___/                           |_|

IMPORTANT:
* Your $HOME directory has been mounted to `/localhost`
* Use `aws-vault` to manage your sessions
* Run `assume-role` to start a session


-> Run 'assume-role' to login to AWS
⧉  staging example
❌   (none) ~ ➤  assume-role
Enter passphrase to unlock /conf/.awsvault/keys/:
Enter token for arn:aws:iam::xxxxxxx:mfa/goruha: 365322
* Assumed role arn:aws:iam::xxxxxxx:role/OrganizationAccountAccessRole
⧉  staging example
✅   (example-staging-admin) ~ ➤
```
{{% /dialog %}}
