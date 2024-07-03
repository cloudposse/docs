---
title: "Developing Components"
sidebar_position: 100
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/blob/main/docs/docs/fundamentals/component-development.md
---

# Component Development

# The Problem

While all companies are unique, their infrastructure doesn't need to be. Well-built infrastructure consists of reusable
building blocks that implement all the standard components like servers, clusters, load balancers, etc. Rather than
building everything from scratch “the hard way”, there's an easier way. Using our “reference architecture” and its
service catalog of all the essential pieces of infrastructure, everything a business needs can be composed together as
an architecture using “Stack” configurations. Best of all, it's all native terraform.

import ReactPlayer from 'react-player';

<ReactPlayer controls url='https://docs.cloudposse.com/assets/refarch/handoffs/component-development.mp4' />

# Our Solution

Cloud Posse defines components. Components are opinionated, self-contained building blocks of Infrastructure-as-Code
(IAC) that solve one specific problem or use-case. Components are similar to a Terraform root module and define a set of
resources for any deployment.

- Terraform components live under the `components/terraform` directory.
- Cloud Posse maintains a collection of public components with
  [`terraform-aws-components`](https://github.com/cloudposse/terraform-aws-components)
- The best components are generic enough to be reused in any organization, but there's nothing wrong with writing
  specialized components for your company.
- Detailed documentation for using components with Atmos can be found under
  [atmos.tools Core Concepts](https://atmos.tools/core-concepts/components/)

:::info Pro tip! We recommend that you always check first with Cloud Posse to see if we have an existing component
before writing your own. Sometimes we have work that has not yet been upstreamed to our public repository. :::

## Prerequisites

In order to be able to create a new component, this document assumes the developer has the following requirements:

1. Authentication to AWS, typically with Leapp
1. The infrastructure repository cloned locally
1. Geodesic up and running
1. A basic understanding of Atmos
1. An intermediate understanding of Terraform

## Create the component in Terraform

- Make a new directory in `components/terraform` with the name of the component
- Add the files that should typically be in all components:

```bash
.
├── README.md
├── component.yaml # if vendoring from cloudposse
├── context.tf
├── main.tf
├── outputs.tf
├── providers.tf
├── remote-state.tf
├── variables.tf
└── versions.tf
```

- All the files above should look familiar to Terraform developers, except for a few of the following.
- Cloud Posse uses `context.tf` to consistently set metadata across all resources.
  - `context.tf` is always identical. Copy it exactly from
    [here](https://github.com/cloudposse/terraform-null-label/blob/master/exports/context.tf).

```bash
curl -sL https://raw.githubusercontent.com/cloudposse/terraform-null-label/master/exports/context.tf -o context.tf
```

- For `providers.tf`, if we are just using AWS providers only, copy it from
  [our common files (commonly referred to as mixins) folder](https://github.com/cloudposse/terraform-aws-components/blob/master/mixins/providers.depth-1.tf).
  - If we are using Kubernetes, then you may need an additional providers file for Helm and Kubernetes providers. Also
    copy this file from
    [the mixins folder](https://github.com/cloudposse/terraform-aws-components/blob/master/mixins/provider-helm.tf).
- `remote-state.tf` is used to pull Terraform Output from other components. See
  [the `remote-state` Module](https://github.com/cloudposse/terraform-yaml-stack-config/tree/main/modules/remote-state).
- `component.yaml` is used for vendoring the latest version from Cloud Posse. More on this later.

### Add Terraform Modules or Resources

- In your `main.tf`, or other file names of your choosing, add configurations of Terraform modules and/or resources
  directly.
- When you use a Cloud Posse module, you should **pass the context metadata into the module**, like
  [this](https://github.com/cloudposse/terraform-aws-components/blob/master/modules/s3-bucket/main.tf#L35). All Cloud
  Posse modules have the variable `context`, which you pass `module.this.context`
- You could also use other external modules that are not provided by Cloud Posse.
- Use `module.this.tags` when you want to pass a list of tags to a resources or module not provided by Cloud Posse. Tags
  are already included with `var.context` for any Cloud Posse module.

:::info Cloud Posse has a lot of open source modules, so
[check here first](https://registry.terraform.io/namespaces/cloudposse) to avoid repeating existing effort. :::

- Handle the variable `module.this.enabled`, so that resources are not created when `var.enabled` is set to `false`.
  Cloud Posse modules will do this automatically when passed `var.context`. When adding a resource or using a non-Cloud
  Posse module, then configure enabled with a count, for example `count = module.this.enabled ? 1 : 0`
- Use
  [`remote-state`](https://registry.terraform.io/modules/cloudposse/stack-config/yaml/latest/submodules/remote-state) to
  read Terraform Output from other components.
  [For example the `eks/alb-controller` component](https://github.com/cloudposse/terraform-aws-components/blob/master/modules/eks/alb-controller/remote-state.tf)

## Configure Stacks

### Directory Structure

- All Stack configurations live in the `stacks` directory

```
stacks
├── catalog
├── mixins
├── orgs
└── workflows
```

- Default configurations for a component live in the `catalog` directory, and configurations for deployed accounts live
  in the `orgs` directory.
- All files in the `catalog` and `orgs` directories are **stack configuration files**. Read on for more information.

### `catalog` Stacks

- The Stack Catalog is used to define a component's default configuration for a specific organization. Define variables
  that would not be shared in an Open Source setting here.
- Make a file in `stacks/catalog` with the same name as your component, for example if your component is
  `components/terraform/foobar` then the file should be `stacks/catalog/foobar.yaml`

```yaml
components:
  terraform:
    foobar:
```

- Above, `foobar` is the name of the component.
- Pass variables into Terraform like this:

```yaml
components:
  terraform:
    foobar:
      vars:
        sample_variable_present_in_variables_tf_of_component: "hello-world"
```

### Component Types

- Atmos supports component types with the `metadata.type` parameter
- There are two types of components:
  - `real` - is a "concrete" component instance
  - `abstract` - a component configuration, which cannot be instantiated directly. The concept is borrowed from
    [abstract base classes](https://en.wikipedia.org/wiki/Abstract_type) of Object Oriented Programming.
- By default, all components are `real`
- Define an `abstract` component by setting `metadata.type` to `abstract`. See the following example
- For more details, see [atmos.tools](https://atmos.tools/core-concepts/components/inheritance)

```yaml
components:
  terraform:
    foobar/defaults: # We can name this anything
      metadata:
        type: abstract # This is what makes the component `abstract`
        component: foobar # This needs to match exactly an existing component name
      vars:
        tags:
          team: devops
```

- With an `abstract` component default, we can inherit default settings for any number of derived components. For
  example:

```yaml
components:
  terraform:
    foobar: # Since this component name matches exactly, we do not need to add `metadata.component`
      metadata:
        type: real # This is the default value and is only added for visibility
        inherits:
          - foobar/defaults # The name of the `abstract` component
      vars:
        sample_variable_present_in_variables_tf_of_component: "hello-world"
```

- Now `foobar` will uses the same configuration as `foobar/defaults` but may describe additional variables.

## Add Component Imports

- In a stack configuration file, we can import other stack configuration files with `import`
- When a file is imported, the YAML from that file is deep merged on top of earlier imports. This is the same idea as
  merging two dictionaries together.
- Stack configurations can import each other as needed, and there can be multiple layers or different hierarchies of
  configurations

### Deploy Components with a Stack

- In the directory corresponding to the environment you want to deploy in, for example
  `stacks/orgs/acme/plat/sandbox/us-east-1/`, add a new file (or adding to an existing file) your component by importing
  it from the catalog.

```yaml
import:
  # These two imports add default variables
  - orgs/acme/plat/sandbox/_defaults
  - mixins/region/us-east-1
  # This imports a real component, which will deploy even if we do not
  # inherit from it or override any values.
  - catalog/foobar
```

- In the above example, we have imported the `foobar` catalog configuration into the `plat-use1-sandbox` environment
  into a new YAML file of any name. For example `foobar.yaml`

```yaml
import:
  - orgs/acme/plat/sandbox/_defaults
  - mixins/region/us-east-1
  - catalog/foobar

components:
  terraform:
    foobar:
      vars:
        sample_variable_present_in_variables_tf_of_component: "env-specific-config"
```

## Deploy

Now that the component is [(1) defined in Terraform](#create-the-component-in-terraform),
[(2) created in Atmos](#catalog-stacks), and [(3) imported in the target Stack](#deploy-components-with-a-stack), now
deploy the component with Atmos.

```
atmos terraform apply foobar -s plat-use1-sandbox
```

## Vendoring

Atmos supports component vendoring. We use vendor to pull a specific version of the component from
[the upstream library](https://github.com/cloudposse/terraform-aws-components).

When vendoring a component,

1. Create a branch of your repository
2. Add a `component.yaml` file to the components directory

```yaml
apiVersion: atmos/v1
kind: ComponentVendorConfig
spec:
  source:
    uri: github.com/cloudposse/terraform-aws-components.git//modules/foobar?ref={{ .Version }}
    version: 1.160.0
    included_paths:
      - "**/**"
    excluded_paths: []
```

3. Fill out the `component.yaml` with the latest version from
   [the upstream library](https://github.com/cloudposse/terraform-aws-components)
4. Run the vendor commands: `atmos vendor pull --component foobar`
5. Create a Pull Request to check for changes against any existing component. Keep in mind vendoring will overwrite any
   custom changes to existing files upstream.

## Next Steps

At this point, your component is complete in code, but there is still more to do!

1. Run precommit Terraform docs and linting against the new component
2. Add your new component to your GitOps automation tooling, such as Spacelift
3. Configure `CODEOWNERS` for the new component, if necessary
4. Documentation!

## Exercises

Exercises are a great way to get hands-on with the code. None of these are necessary, but if you would like to take the
initiative, feel free to complete any or all of these exercises. If you have questions or would like Cloud Posse to
review your solution, please reach out!

### Exercise 1: Add a component from Cloud Posse to your library

This exercise is intended to demonstrate how to pull an existing component that is already upstream and supported by
Cloud Posse into your environment. For the sake of this exercise, let's create an SQS Queue component. This component is
supported by Cloud Posse, find and deploy that component into your sandbox environment.

When this component is deployed, you should have a single new Spacelift stack (if you're using Spacelift) and have
created a new SQS queue in your sandbox environment. This queue should be logically named following Cloud Posse naming
standards, and that name should be easily retrievable with Terraform state.

### Exercise 2: Create a new custom component not supported by Cloud Posse

This exercise is intended to practice creating a new component that is not supported by Cloud Posse. Cloud Posse does
not currently have a component for a static website. For this exercise, use the
[`cloudposse/cloudfront-s3-cdn/aws` module](https://github.com/cloudposse/terraform-aws-cloudfront-cdn) to deploy a
basic static website to your sandbox environment.

When this exercise is complete, you should have a new component, a new component catalog, and an import into sandbox.
This component should follow Cloud Posse convention outlined above and be maintained with GitOps (if applicable).

# References

- [Cloud Posse's Library of Terraform Components](https://github.com/cloudposse/terraform-aws-components)
- [Cloud Posse's Library of Terraform Modules](https://github.com/orgs/cloudposse/repositories?q=terraform-aws&type=all&language=&sort=)
- [Atmos Core Concepts](https://atmos.tools/core-concepts/components/#types-of-components)

## FAQ

### When should we write a new component?

Developing a new component may be necessary when:

1. Existing components do not provide the required functionality and the existing component cannot be easily extended.
2. [Cloud Posse's Library of Terraform Components](https://github.com/cloudposse/terraform-aws-components) does not
   already provide the component. We recommend asking Cloud Posse in your shared Slack channel with us if we happen to
   have the component not yet upstreamed.
3. You have some existing Terraform code that you would like to import into the Atmos framework.

### Can components include other components?

Components should not include other components but instead can refer to another component's Terraform Output with
`remote-state`. Components can however refer to any Terraform module

### What is the purpose of context.tf?

Cloud Posse uses [`context.tf`](/reference-architecture/reference/learning-resources/#the-contexttf-pattern) to
consistently set metadata across all modules and resources.

### Where should the context.tf file be copied from?

The `context.tf` file should be copied exactly from
https://raw.githubusercontent.com/cloudposse/terraform-null-label/master/exports/context.tf.

### How can Terraform modules or resources be added to a component?

Terraform modules or resources can be added directly to the `main.tf` file or other files of your choosing.

**Please be advised** that modifying any of the vendored components may break the ability to pull down upstream changes.
If modifying an existing component to preserve vendoring capabilities, name your files something like
`customizations.extended.tf`, so that it won't collide with upstream files (e.g. using `.extended.tf` as the extension).
Similarly, if needing to modify core functionality, consider using
[Terraform overrides](https://developer.hashicorp.com/terraform/language/files/override).

### What is an abstract component?

An [abstract component](https://atmos.tools/core-concepts/components#types-of-components) is a component configuration
that cannot be instantiated directly.

### Does Cloud Posse have automated testing for components?

We do not have automated testing for our components per se at this time. However, GitOps pipelines with Spacelift can
automate component deployment into lower environments, so that we can validate any code changes in each stage before
reaching production.

Also, we do have automated tested for all Terraform modules the components built off of
([rds-cluster example](https://github.com/cloudposse/terraform-aws-rds-cluster/tree/master/test)) and static code
linting for Terraform and Atmos (with a local `.github/workflows/pre-commit.yml`).
