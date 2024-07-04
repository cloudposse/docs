---
title: "Cold Start"
sidebar_position: 0
refarch_id: REFARCH-313
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/setup/cold-start/cold-start.md
---

# Implement AWS Cold Start

These documents explain the complete cold-start process required to initialize a net-new AWS Organization using the
SweetOps process by Cloud Posse.

## Problem

<img src="/assets/refarch/image-20211116-050009.png" height="120" width="120" /><br/>

AWS provides poor documentation for all the steps required for setting up a new AWS Organization. Once the Organization
is set up, there’s _a lot_ of manual steps and remediations required to bootstrap all the tooling and configurations
before we can start to do anything meaningful.

## Solution

The purpose of the cold-start process is to provision the initial set of AWS accounts and IAM roles so that users can
log in to AWS with existing credentials and build the rest of the infrastructure. Many of the same steps need to be
repeated in order to later add a new AWS account or organizational unit, so these documents also implicitly provide
guidance for that task.

## Layout

- [Manual Cold Start Implementation](/reference-architecture/setup/cold-start/manual-configuration)
- [Automated Cold Start Implementation](/reference-architecture/setup/cold-start/automated-configuration)
- [How to Set Up AWS Email Notifications](/reference-architecture/setup/cold-start/how-to-set-up-aws-email-notifications)
- [How to Register Pristine AWS Root Account](/reference-architecture/setup/cold-start/how-to-register-pristine-aws-root-account)
- [How to Create SuperAdmin user](/reference-architecture/setup/cold-start/how-to-create-superadmin-user)
- [How to Create an Infrastructure repository](/reference-architecture/setup/cold-start/how-to-create-an-infrastructure-repository)
- [Deprecated Cold Start Components](/reference-architecture/setup/cold-start/deprecated-cold-start-components)

## Conventions

There are a few things that are required but that change from project to project. To avoid excessive use of generic
placeholders in the text, we use the following values as placeholders, and you should change them as needed:

- `acme` is the placeholder for the project's _namespace_. Each project needs to have a project namespace, preferably 3
  or 4 letters, that is unique in the Cloud Posse architecture. It is part of every identifier and is what makes it
  possible to generate globally unique names for things like S3 buckets.

- `uw2` is the placeholder for the chosen abbreviation style of the default AWS Region. If you are using the “tenant”
  feature, you need to replace `uw2` with `<tenant>-<environment>` where `<tenant>` is the tenant abbreviation for the
  tenant holding the root AWS organization and `<environment>` is the abbreviated default AWS region.

- "1Password" is the placeholder for the application or system used to store and share secrets like AWS credentials.

## Prerequisites

This document assumes as a baseline that DevOps and developer personnel who need AWS access have a working computing
environment that:

- Docker installed
- Has a host file system that containers can access (when properly configured)
- Can install and run GUI applications (E.g. Leapp)
- Has `bash` v3 or newer installed
- Has `git` installed
- Has a GNU Make-compatible version of `make` installed (e.g. `brew install make`). NOTE: make version 4.4+ has been
  known to have issues with our build-harness. If the command times out, please try make 4.3 or earlier.

Typically our recommendation is Docker Desktop running on a local, dedicated (to the user) macOS or Windows computer. If
the user cannot install new applications due to administrative restrictions, then all of the above components, plus
[Leapp](https://leapp.cloud/), should be pre-installed for them.

:::caution **Apple M1 Support**

Geodesic works on the M1 running as `amd64` (not `arm64`). Docker auto-detects this by default, but otherwise it’s
possible to pass `--platform linux/amd64` to `docker` to force the platform.

Geodesic bundles [dozens (hundreds?) of executable binaries](https://github.com/cloudposse/packages), of which most do
not yet have M1 `arm64` versions available to install. In order to support M1, we would need to build (compile and link)
Python3 for M1.

:::