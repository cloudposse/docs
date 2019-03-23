---
title: "tfenv"
description: "Transform environment variables for use with Terraform (e.g. `HOSTNAME` ⇨ `TF_VAR_hostname`)"
tags:
- terraform
- 12factor
- envrc
- direnv
---

This is a command line tool used to manage the environment variables intended
for `terraform` to consume at runtime (e.g. `HOSTNAME` → `TF_VAR_hostname`). It can also intelligently map environment variables to terraform command line arguments (e.g. `TF_CLI_INIT_BACKEND_CONFIG_BUCKET=example` → `TF_CLI_ARGS_init=-backend-config=bucket=example`) so you don't have to pass them by hand.

__NOTE__: `tfenv` is **not** a [terraform version manager](#history). It strictly manages environment variables much like `env` or `direnv`.

## Background

One of the biggest pains with terraform is that it's not totally 12-factor compliant ([**III. Config**](https://12factor.net/config)). That is, terraform doesn't consume environment variables for all settings & parameters. As a result, many users of terraform use wrappers like `terragrunt` to invoke `terraform`.

**Have you ever wanted to set the backend config using strictly environment variables?**

Well, as it turns out _this **is** possible_ - just in an extremely roundabout way. For example, if we want to set the backend-config bucket using an environment variable, we can do the following:

```sh
export TF_CLI_ARGS_init="-backend-config=bucket=my-bucket"
```

(Read more [here](https://www.terraform.io/docs/configuration/environment-variables.html#tf_cli_args-and-tf_cli_args_name))

Then anytime we run `terraform init`, it will automatically pass the backend settings as a parameter to `terraform`. This works for all other settings that terraform supports as well. For example, setting that `TF_CLI_ARGS_init` variable and running `terraform init` is exactly the same as running `terraform init -backend-config=bucket=my-bucket`. Of course, typing that out those arguments by hand gets old very quickly, so typically it gets automated with `make`, `terragrunt` or some kind of custom shell script.  

## The Problem

The problem with `TF_CLI_ARGS_*` is that it is difficult to toggle individual parameters without reconstructing the entire environment variable. It's mostly a problem when we try to set parameters programatically, such as calcualting some setting from our current directory name.

Ideally, we would like to set a variable like `TF_CLI_INIT_BACKEND_CONFIG_BUCKET=my-bucket` and not mess with constructing all the other terraform parameters at the same time. Similarly, we would like to set `TF_CLI_PLAN_REFRESH=true` to automatically add `-refresh=true` when calling `terraform plan`

## The Solution

Using `tfenv`, we have added support for setting `TF_CLI_*` environment settings which will then map automatically to the `TF_CLI_ARGS_*`. This is really powerful when combined with a tool like `direnv` to manage environment settings per directory.

Now, we can do the following (e.g. by adding it to our `.envrc` and using [`direnv`](http://direnv.net)):
```
source <(tfenv)
```

Then I can use vanilla `terraform` without any wrappers and just run `terraform init`, `terraform plan`, `terraform apply`, etc... and they *just work*. In other words, **no wrappers are needed (e.g. `terragrunt`).** Best of all, `tfenv` is entirely compatible with `terragrunt`, precisely because we do not break compatibility with other tools.

## Usage

There are two types of environment variables supported by `terraform`:

1. `TF_VAR_*` variables which are mapped to `variables` inside of terraform
2. `TF_CLI_ARG_*` variables which correspond to command line arguments and flags
 
 `tfenv` interacts with these two classes of variable types.

There are two modes of operation:

1. **Wrapper**: Run `tfenv` as a *wrapper* where the user passes the command to run as arguments to `tfenv` (not recommended)
2. **Exporter**: Use `tfenv` as an *exporter* where it emits the shell commands to `stdout` which set shell variables suitable for shell `eval`

Cloud Posse's predominant usage of `tfenv` is the exporter mode because that insures interoperability with all other tools.

## Debugging

Running `tfenv` will output the bash-style `export` statements that would update the shell's environment. This is the best way to inspect what `tfenv` will do.

## Security


- security considerations:
  - black/white listing of variables that are mapped

## Examples


We can automatically initialize any [terraform-root-module](https://github.com/cloudposse/terraform-root-modules).

For example, if I add the following to my `.envrc`:
```
export TF_CLI_INIT_FROM_MODULE="git::https://github.com/cloudposse/terraform-root-modules.git//aws/vpc-peering?ref=tags/0.29.0"
source <(tfenv)
```

Now, when I run `terraform init`, it will download the remote module and initialize it all in one fell swoop.

What I like about this is we can now manage our environment how we want to and we don't break compatibility with any other commands.

## Outcome

1. **Manage the enviroment the way we want to.** e.g. using [`chamber`](https://github.com/segmentio/chamber) or some other tool like `direnv`, or both!
```
source <(chamber exec $(basename `pwd`) -- bash -c 'export -p')
```

1. **We can use the task runner of our choice** (e.g. `make`, [`variant`](https://github.com/mumoshu/variant)).

2. **...and we can use vanilla terraform without wrappers.** 


## History

### Why is the tool called `tfenv`?

This `tfenv` project borrows it's naming convention from popular tools like [`env`](https://en.wikipedia.org/wiki/Env), [`direnv`](http://direnv.net), and [`autoenv`](https://github.com/kennethreitz/autoenv). These tools provide various ways to export variables in the environment.

The `env` command has been [around since the early 90s](http://pdplab.it.uom.gr/project/sysadm/unix.pdf), while [environment variables](https://en.wikipedia.org/wiki/Environment_variable) were first conceived of in 1979. On the other hand there are tools like `rbenv` Et al., which are ["version managers"](https://en.wikipedia.org/wiki/Ruby_Version_Manager) that were conceived of sometime around 2010.


### Why are wrappers bad?

It's not so much that wrappers are bad, it's that the complicate the ability to pipeline tools together. 

For example, tools like `terragrunt` add vendor extensions to the `.tfvars` files that are not supported by `terraform`. Our job as systems integrators is to find ways to combine multiple tools so that they work well together. Using `terragrunt` forces one execution-path: `terragrunt`. When trying to use `terragrunt` with other tools like `scenery` or `atlantis`, this has *historically* led to problems (even though these tools have since added support). Because wrappers like this lead to vendor lock-in which breaks interoperability with other tools, we try to avoid them as much as possible. The plus side is because we try to avoid them, our methodology works very well with `terragrunt`.

## References
* https://www.reddit.com/r/Terraform/comments/afznb2/terraform_without_wrappers_is_awesome/