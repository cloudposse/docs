---
title: "Vagrant"
description: "Vagrant by HashiCorp is responsbile for setting up development environments under VirtualBox. Vagrant handles all configuration management and makes it easy to share development environments by developers."
---
![HashiCorp Vagrant](/assets/6e84876-vagrant.png)

{{% dialog type="info" icon="fa fa-info-circle" title="Important" %}}
> Vagrant is no longer recommended as a means of provisioning local development environments. We recommend using [Docker Compose]({{< relref "local-dev-environments/docker-compose.md" >}}) instead.
{{% /dialog %}}

VirtualBox by Oracle is responsible for running Linux Virtual Machines.

Both packages are free and Open Source.

# Setup

Download and install *Vagrant* for your OS here: https://www.vagrantup.com/downloads.html

As of this writing, the current version is 1.9.7. You can find out what version of Vagrant you have by running `vagrant --version` on the command line. Older versions might have problems.

Vagrant depends on VirtualBox. Make sure you install that first.

# Dependencies

- *Vagrant v1.9.7+*  <https://www.vagrantup.com/downloads.html>
- *VirtualBox v5.1+* <https://www.virtualbox.org/wiki/Downloads>
