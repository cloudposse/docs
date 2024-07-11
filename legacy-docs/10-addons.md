# Addons

## Setup

To get started simply run the workflows in `stacks/workflows/addons.yaml`.

The vendor workflow will vendor in components.

While `deploy/<addon>` will deploy a singular addon.

To customize an addon, first add a catalog entry to the stack you wish, such as
`plat-us-east-1/addons.yaml`, importing the addon you wish to deploy.

The easiest way to get started is to vendor and deploy, which can be run as a single command or individually (below):

```shell
atmos workflow all -f addons
```

### Vendor

This will vendor in all of your addon components.

```shell
atmos workflow vendor -f addons
```

### Deploy

To deploy an individual addon, run:

```shell
atmos workflow deploy/<addon> -f addons
```

To deploy all:

```shell
atmos workflow deploy/all -f addons
```
