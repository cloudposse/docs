---
title: "Packages"
description: "Cloud Posse installer and distribution of native apps."
tags:
- geodesic
- installer
---

"Packages" is the Cloud Posse distribution of native apps. Use this repo to easily install binary releases of popular apps such as all of our [standard tools](/tools/). This is useful for inclusion into a Dockerfile to install dependencies.

## Usage

Clone the repo.
```
git clone git@github.com:cloudposse/packages.git
```

See all available packages:
```
make -C packages/install help
```

Install everything...
```
make -C packages/install all
```

Install specific packages:
```
make -C packages/install aws-vault chamber
```

Install to a specific folder:
```
make -C packages/install aws-vault INSTALL_PATH=/usr/bin
```

Add this to a `Dockerfile` to easily install packages:
```
RUN git clone --depth=1 -b master https://github.com/cloudposse/packages.git /packages && \
    rm -rf /packages/.git && \
    make -C /packages/install kubectl
```

Here's a [real example](https://github.com/cloudposse/geodesic/blob/0.9.17/Dockerfile#L37-L46) of how we use it in `geodesic`.

Uninstall a specific package
```
make -C uninstall yq
```

## Makefile Inclusion

Sometimes it's necessary to install some binary dependencies when building projects. For example, we frequently
rely on `gomplate` or `helm` to build chart packages.

Here's a stub you can include into a `Makefile` to make it easier to install binary dependencies.

```
export PACKAGES_VERSION ?= master
export PACKAGES_PATH ?= packages/
export INSTALL_PATH ?= $(PACKAGES_PATH)/vendor

## Install packages
packages/install:
        @if [ ! -d $(PACKAGES_PATH) ]; then \
          echo "Installing packages $(PACKAGES_VERSION)..."; \
          rm -rf $(PACKAGES_PATH); \
          git clone --depth=1 -b $(PACKAGES_VERSION) https://github.com/cloudposse/packages.git $(PACKAGES_PATH); \
          rm -rf $(PACKAGES_PATH)/.git; \
        fi

## Install package (e.g. helm, helmfile, kubectl)
packages/install/%: packages/install
        @make -C $(PACKAGES_PATH)/install $(subst packages/install/,,$@)

## Uninstall package (e.g. helm, helmfile, kubectl)
packages/uninstall/%:
        @make -C $(PACKAGES_PATH)/uninstall $(subst packages/uninstall/,,$@)
```

Here's a [real example](https://github.com/cloudposse/build-harness/blob/0.5.5/modules/packages/Makefile) of how we use it.
