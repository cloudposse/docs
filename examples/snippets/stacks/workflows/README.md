# Atmos Workflows

 Atmos Workflows are used to automate deployment or destructions steps within the context of Atmos. Workflows
combine multiple commands into one executable unit of work.

## Usage

Run any Workflow from the root of the directory by calling `atmos workflow -f filename`. Some workflow require a stack
parameter, whereas others have the stack predetermined. Add a stack (where applicable) with `-s stack-name`

## Naming Convention

Workflow Jobs can have any name, but in order to maintain consistency, we have chosen to follow a pattern similar to
Terraform commands.

**Note**: Not all Workflows include each of these commands. These are guidelines for naming any Workflow job.

### `vendor`

Use `vendor` to pull all the latest components for a given layer.

Example

```
atmos workflow vendor -f baseline
```

### `init`

Use `atmos workflow init -f {{ filename }}` to run any commands required before deployment.

Example

```
atmos workflow init -f spacelift
```

### `deploy`

Use `atmos workflow deploy -f {{ filename }}` to deploy all components for a given layer.

```
atmos workflow deploy -f baseline
```

Use `atmos workflow deploy/{{ component or group name }} -f {{ filename }}` to deploy a specific component or group of
components

```
atmos workflow deploy/vpc -f network
atmos workflow deploy/tgw -f network
```

### `all`

Use `atmos workflow all -f {{ filename }}` to run all steps together. This will execute all included jobs in the given
Workflow in order.

For example,

```
atmos workflow all -f spacelift
```



## References

- [Atmos Workflows](https://atmos.tools/core-concepts/workflows/)
