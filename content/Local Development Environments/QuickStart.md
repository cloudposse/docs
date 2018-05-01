---
title: "QuickStart"
excerpt: ""
---
# OSX Dependencies

## Install Developer Tools

The "Developer Tools" package is needed for tools like `make` and `git` used throughout our projects.

```
xcode-select --install
```


[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/f111fb9-image_4.png",
        "image (4).png",
        593,
        372,
        "#d8d8d9"
      ]
    }
  ]
}
[/block]
## Install Homebrew

[Homebrew](https://brew.sh/) is arguably the most popular package manager for OSX. Unlike most *NIX operating systems, Darwin does not ship with a package management system. This gap is filled by Homebrew. While other package management systems exist for OSX (e.g. MacPorts), all of our instructions will assume `brew` is installed.

To install Homebrew, simply run the following command:
```
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

## Install Docker for Mac (with Docker Compose)

Docker for Mac is a Docker Community Edition (CE) version which is completely FREE. It includes everything you need to run Docker on a Mac and installed using the standard DMG/installer process. 

Visit the [Docker for Mac](https://docs.docker.com/docker-for-mac/install/) site or just go ahead and directly download the [`Docker.dmg`](https://download.docker.com/mac/stable/Docker.dmg)

* https://download.docker.com/mac/stable/Docker.dmg
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/840d66e-docker-app-drag.png",
        "docker-app-drag.png",
        832,
        452,
        "#bcd7de"
      ]
    }
  ]
}
[/block]
After installing, you'll now see a new docker icon in your task bar.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/dbe7dad-whale-in-menu-bar.png",
        "whale-in-menu-bar.png",
        394,
        43,
        "#c3bfbe"
      ]
    }
  ]
}
[/block]
**IMPORTANT:** Docker for Mac requires OS X El Capitan 10.11 or newer macOS release running on a 2010 or newer Mac, with Intel’s hardware support for MMU virtualization.

## Configure AWS Vault

Now set up your AWS credentials so you can interact with AWS on the command line.

Follow the instructions for configuring [AWS Vault](doc:aws-vault).