---
title: "Vagrant"
excerpt: ""
---
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/6e84876-vagrant.png",
        "vagrant.png",
        1096,
        418,
        "#083269"
      ]
    }
  ]
}
[/block]
# Background

Vagrant by HashiCorp is responsbile for setting up development environments under VirtualBox. Vagrant handles all configuration management and makes it easy to share development environments by developers. 
[block:callout]
{
  "type": "info",
  "title": "IMPORTANT",
  "body": "Vagrant is no longer recommended as a means of provisioning local development environments. We recommend using [Docker Compose](doc:docker-compose) instead."
}
[/block]
VirtualBox by Oracle is responsible for running Linux Virtual Machines. 

Both packages are free and Open Source.

# Setup

Download and install *Vagrant* for your OS here: https://www.vagrantup.com/downloads.html

As of this writing, the current version is 1.9.7. You can find out what version of Vagrant you have by running `vagrant --version` on the command line. Older versions might have problems.

Vagrant depends on VirtualBox. Make sure you install that first.

# Dependencies
[block:parameters]
{
  "data": {
    "0-0": "*Vagrant v1.9.7+*",
    "0-2": "",
    "0-1": "https://www.vagrantup.com/downloads.html",
    "1-0": "*VirtualBox v5.1*+",
    "1-2": "",
    "1-1": "https://www.virtualbox.org/wiki/Downloads"
  },
  "cols": 2,
  "rows": 2
}
[/block]