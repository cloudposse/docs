---
title: "Geodesic"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1186988067/Geodesic
sidebar_position: 120
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/fundamentals/tools/geodesic.md
---

import ReactPlayer from 'react-player'

# Geodesic

## Introduction

In the landscape of developing infrastructure, there are dozens of tools that we all need on our personal machines to do our jobs. In SweetOps, instead of having you install each tool individually, we use Docker to package all of these tools into one convenient image that you can use as your infrastructure automation toolbox. We call it Geodesic and we use it as our DevOps automation shell and as the base Docker image for all of our DevOps tooling.

Geodesic is a DevOps Linux Distribution packaged as a Docker image that provides users the ability to utilize `atmos`, `terraform`, `kubectl`, `helmfile`, the AWS CLI, and many other popular tools that compromise the SweetOps methodology without having to invoke a dozen `install` commands to get started. It’s intended to be used as an interactive cloud automation shell, a base image, or in CI/CD workflows to ensure that all systems are running the same set of versioned, easily accessible tools. Most commonly, it is used as a base image for individual user, project, or company Docker images that have additional tools or specific versions of tools pre-installed. For example, Geodesic does not have `atmos` pre-installed, so that you can install the version of `atmos` that you want to use in your project update that version independently of updating Geodesic.

These days, the typical software application is distributed as a docker image and run as a container. Why should infrastructure be any different? Since everything we write is "Infrastructure as Code", we believe that it should be treated the same way. This is the "Geodesic Way". Use containers+envs instead of unconventional wrappers, complicated folder structures, and symlink hacks. Geodesic is the container for all your infrastructure automation needs that enables you to truly achieve SweetOps.

An organization may choose to leverage all of these components or just the parts that make their life easier. We recommend starting by using geodesic as a Docker base image (e.g. `FROM cloudposse/geodesic:...` pinned to a release and base OS) in your projects.

<ReactPlayer
    url='https://www.youtube.com/watch?v=m4t8lMrTJuk'
    width={"800px"}
    height={"450px"}
    controls={true} />

:::info
**Apple Silicon (M1, M2, etc. Chips) Support**

Geodesic is comprised of a large collection of mostly [third-party open-source tools distributed via our packages repository](https://github.com/cloudposse/packages).
As such, **support for Macs with Apple chips (M1, M2, etc.) is fully not under Cloud Posse's control**, rather it
depends on each tool author updating each tool for the Apple chips, referred to as the `arm64` architecture. 
**The Debian-based Geodesic is provided as a multi-architecture Docker image, supporting both Intel chips (`amd64`) and 
Apple chips (`arm64`)**, but the (deprecated) Alpine-based Geodesic is only provided for Intel chips (`amd64`). The image
built for `arm64` does not include a few tools that the maintainers have not yet updated for `linux/arm64`, but those
tools are not widely used anymore, so your experience should be good on Apple silicon. (See the current
list of unsupported tools [here](https://github.com/cloudposse/geodesic/blob/master/packages-amd64-only.txt))

:::

## Use-cases

Since `geodesic` is at its heart just a dockerized toolbox, it can be used anywhere docker images can be run. It supports both headless and interactive terminals.

### Use a Local Development Environment

Running `geodesic` as a local development environment ensures all team members on the team can get up and running quickly using the same versions of the tools. The only requirement is having Docker installed.

:::info
**Pro Tip!**
When Geodesic is started using the wrapper script, it mounts the host’s `$HOME` directory as `/localhost` inside the container and creates a symbolic link from `$HOME` to `/localhost` so that files under `$HOME` on the host can be referenced by the exact same absolute path both on the host computer and inside Geodesic. For example, if the host `$HOME` is `/Users/fred`, then `/Users/fred/src/example.sh` will refer to the same file both on the host and from inside the Geodesic shell. This means you can continue editing files using your favorite IDE (e.g. VSCode, IntelliJ, etc) and interact with your local filesystem within the docker container.

:::

### Use as a Remote Development Environment

Running `geodesic` as a remote development environment is as easy as calling `kubectl run` on the geodesic container. You’ll be able then to remotely interact with the container to debug within a kubenretes cluster.

### Use as a Base Image for Automation

Running `geodesic` as the base image for Spacelift or with GitHub Actions ensures you can use the same exact tooling in an automated fashion.

## How-to Guides

- [How to Upgrade or Install Versions of Terraform](/reference-architecture/how-to-guides/upgrades/how-to-upgrade-or-install-versions-of-terraform)
- [How to Keep Everything Up to Date](/reference-architecture/how-to-guides/upgrades/how-to-keep-everything-up-to-date)
- [How to Switch Versions of Terraform](/reference-architecture/how-to-guides/tutorials/how-to-switch-versions-of-terraform)
- [How to run Docker-in-Docker with Geodesic?](/reference-architecture/how-to-guides/tutorials/how-to-run-docker-in-docker-with-geodesic)
- [How to Customize the Geodesic Shell](/reference-architecture/how-to-guides/tutorials/how-to-customize-the-geodesic-shell)
- [How to use Atmos](/reference-architecture/how-to-guides/tutorials/how-to-use-atmos)

## Debian and Alpine Base Images

Starting with Geodesic version 0.138.0, we distribute 2 versions of Geodesic Docker images, one based on Debian and one based on Alpine, tagged `VERSION-BASE_OS`, e.g. `0.138.0-alpine`.

Prior to this, all Docker images were based on Alpine only and simply tagged `VERSION`. We encourage people to use the Debian version and report any issues by opening a GitHub issue. We will continue to maintain the `latest-alpine` and `latest-debian` Docker tags for those who want to commit to using one base OS or the other but still want automatic updates. However, our primary focus will be on the Debian-based images. The Alpine-based images are deprecated and issues unique to Alpine (i.e. not affecting the Debian version) may not be addressed.

## Packages

<img src="/assets/refarch/image-20211027-025252.png" height="140" width="557" /><br/>

Central to `geodesic` is its rich support for the latest version of [the most popular packages](https://github.com/cloudposse/packages/tree/master/vendor) for DevOps. We maintain hundreds of packages that are graciously hosted by Cloud Smith. Our packages are updated nightly as soon as new releases are made available by vendors. As such, we strongly recommend version pinning packages installed via the `Dockerfile`.

Also unique about our packages is that for `kubectl` and `terraform` we distribute all major versions with `dpkg-alternative` support so they can be concurrently installed without the use of version managers. For example, to install the latest version of `kubectl` v1.28 (to match the version of the cluster it is controlling), you can install package `kubectl-1.28`. 

Package repository hosting is graciously provided by [cloudsmith](https://cloudsmith.io/). Cloudsmith is the only fully hosted, cloud-native, universal package management solution, that enables your organization to create, store and share packages in any format, to any place, with total confidence. We believe there’s a better way to manage software assets and packages, and they’re making it happen!

## Filesystem Layout

Here’s a general filesystem layout for an infrastructure repository leveraging `geodesic` with `atmos` together with stacks and components. Note, individual customer repos will resemble this layout but will not be identical.

```
infrastructure/  # GitHub Repository
├── Dockerfile   # Dockerfile uses `cloudposse/geodesic` as base Image
├── Makefile     # Makefile to build custom Geodestic-based Docker image and install wrapper script for `geodesic`
├── README.md  
├── components  # Location for all re-usable component building blocks
│   └── terraform/  # Location for all terraform (HCL) components
│       └── foobar/                     # Example `foobar` component
│           ├── README.md               # Every component has a well-maintained `README.md` with usage instructions
│           ├── context.tf              # Standard context interface for all cloud posse modules.
│           ├── main.tf                 # Standard `main.tf` based on HashiCorp best-practices
│           ├── modules/                # Example of submodules within a component (aka child modules)
│           │   ├── baz/                # Submodule named `baz/`
│           │   │   ├── context.tf        # Submodules should use the same standard interface with `context.tf`
│           │   │   ├── main.tf           # Submodules should also follow HashiCorp best practices for module layout
│           │   │   ├── outputs.tf        
│           │   │   └── variables.tf      # Submodules should define variables in `variables.tf` and not modify `context.tf`
│           │   └── bar/                # Example of another submodule named `bar/`
│           │       ├── context.tf
│           │       ├── main.tf
│           │       ├── outputs.tf
│           │       └── variables.tf
│           ├── outputs.tf             # Outputs exported by this component in the remote state
│           ├── providers.tf           # Providers used by this component
│           ├── remote-state.tf        # Remote state leveraged by the component using the `remote-state` module
│           ├── variables.tf           # Variables used by the component
│           └── versions.tf            # Version pinning for providers used by the component
│
├── docs/  # Location for documentation specific to this repository
│   ├── adr/  # Home for all Architectural Design Records for your organization
│   │   ├── 0001-namespace-abbreviation.md
│   │   ├── 0002-infrastructure-repository-name.md
│   │   ├── 0003-email-addresses-for-aws-accounts.md
│   │   ├── 0004-secure-channel-secrets-sharing.md
│   │   ├── 0005-primary-aws-region.md
│   │   ├── README.md      # Index of all READMEs
│   │   └── template.md    # Markdown template file to create new ADRs
│   │
│   └── cold-start.md
│
├── rootfs/ # The `rootfs` pattern overlays this filesystem on `/` (slash) inside the docker image (e.g. `ADD /rootfs /`)
│   ├── etc/  # The `/etc/` inside the container
│   │   ├── aws-config/
│   │   │   └── aws-config-teams         # The AWS config used from within Geodesic by setting `AWS_CONFIG_PATH`
│   │   │   └── aws-extend-switch-roles  # The config used by browser plugin AWS Extend Switch Roles
│   │   └── motd  # Message of the Day (MOTD) displayed to `stdout` on interactive shell logins
│   │
│   └── usr/  # The `usr/` tree inside the docker image
│       └── local/
│           ├── bin/  # Stick all scripts in `/usr/local/bin`
│           │   ├── aws-config               # Script used to generate the files in `/rootfs/etc/aws-config`
│           │   ├── eks-update-kubeconfig    # Helper script to export the `kubeconfig` for EKS using the `aws` CLI
│           │   ├── spacelift-git-use-https  # Helper script to configure git to use HTTPS rather than SSH for Spacelift
│           │   ├── spacelift-tf-workspace   # Helper script to configure Spacelift Terraform workspace
│           │   └── spacelift-write-vars     # Helper script to write Terraform variables to a file for Spacelift to use
│           └── etc/
│               └── atmos/
│                   └── atmos.yaml  # Atmos CLI configuration. Instructs where to find stack configs and components.
│
└── stacks/                         # Location of all stack configurations
    ├── catalog/                    # Location where to store catalog imports. See our catalog pattern.
    │   ├── account-map.yaml        # Catalog entry for [account-map](/components/library/aws/account-map/)
    │   ├── account-settings.yaml   # Catalog entry for [account-settings](/components/library/aws/account-settings/)
    │   ├── account.yaml            # ...
    │   ├── aws-team-roles.yaml      
    │   ├── aws-teams.yaml           
    │   ├── cloudtrail.yaml          
    │   ├── dns-delegated.yaml       
    │   ├── dns-primary.yaml         
    │   ├── ecr.yaml                 
    │   ├── eks                      
    │   │   ├── alb-controller.yaml
    │   │   ├── cert-manager.yaml
    │   │   ├── eks.yaml
    │   │   ├── external-dns.yaml
    │   │   ├── metrics-server.yaml
    │   │   └── ocean-controller.yaml
    │   ├── s3
    │   │   ├── alb-access-logs.yaml
    │   │   └── s3-defaults.yaml
    │   ├── sso.yaml
    │   ├── tfstate-backend.yaml
    │   ├── transit-gateway.yaml
    │   └── vpc.yaml
    └── orgs/  # Environment-specific configuration
        └── eg/  # Example organization
            ├── corp/  # Example organizaional unit (OU)
            │   ├── auto/  # Example environment
            │   │   ├── _defaults.yaml        # Default settings for all stacks in this environment
            │   │   ├── global-region.yaml    # Settings for regionless or all-region components (e.g. IAM roles)
            │   │   └── us-west-2.yaml        # Settings for infrastructure deployed in us-west-2 region
            │   ├── identity/
            │   │   ├── _defaults.yaml
            │   │   ├── global-region.yaml
            │   │   └── us-west-2.yaml
            │   ├── root/
            │   │   ├── _defaults.yaml
            │   │   ├── global-region.yaml
            │   │   └── us-west-2.yaml
            └── plat/
                ├── dev/
                │   ├── _defaults.yaml
                │   ├── global-region.yaml
                │   └── us-west-2.yaml
                ├── stage/
                │   ├── _defaults.yaml
                │   ├── global-region.yaml
                │   └── us-west-2.yaml
                └── prod/
                    ├── _defaults.yaml
                    ├── global-region.yaml
                    └── us-west-2.yaml
```

## Build and Run Geodesic

Prerequisites for your host computer:

- Docker installed

- `make` installed, preferably GNU Make

- `git` installed

- Infrastructure Git repo cloned

If all goes well, you should be able to build and run the Infrastructure Docker image from your host by executing `make all` from the command line in the root directory of your Git repo clone. If you have issues at this step, contact Cloud Posse or look for help in the Cloud Posse [Geodesic](https://github.com/cloudposse/geodesic/) or [Reference Architecture](https://github.com/cloudposse/reference-architectures) repos.

At this point (after `make all` concludes successfully) you should be running a `bash` shell inside the Infrastructure Docker container (which we will also call the "Geodesic shell") and your prompt should look something like this:

```
 ⧉  Infrastructure
 ✗ . [none] / ⨠
```

From here forward, any command-line commands are meant to be run from within the Geodesic shell.

## Troubleshooting

### Command-line Prompt Ends with a Unicode Placeholder

If your command-line prompt inside of the `geodesic` shell ends with a funky Unicode placeholder, then chances are the default character we use for the end of the command line prompt ([Unicode Z NOTATION SCHEMA PIPING](https://www.compart.com/en/unicode/U+2A20)) is not present in the font library you are using. On the Mac, Terminal (at least) falls back to some other font when the character is missing, so it's not a problem. On other systems, we recommend installing the freely available Noto font from Google, whose mission is to supply workable characters for every defined Unicode code point. On Ubuntu, it is sufficient to install the Noto core fonts, via

```
apt install fonts-noto-core
```

 Another option is to switch to a different command prompt scheme, by adding

```
export PROMPT_STYLE="fancy" # or "unicode" or "plain"
```

 to your Geodesic customizations. See [How to Customize the Geodesic Shell](/reference-architecture/how-to-guides/tutorials/how-to-customize-the-geodesic-shell) for more detail, and also to see how you can completely customize the prompt decorations.


### Files Written to Mounted Linux Home Directory Owned by Root User

If a user runs the Docker daemon as `root`, files may fail to be written to the mounted Linux home directory.

The recommended solution for Linux users is to run Docker in ["rootless"](https://docs.docker.com/engine/security/rootless/)
mode. In this mode, the Docker daemon runs as the host user (rather than as root) and files created by the root user in Geodesic
are owned by the host user on the host. Not only does this configuration solve this issue, but it provides much better system security overall.
[Ref](https://github.com/cloudposse/geodesic/issues/594).

