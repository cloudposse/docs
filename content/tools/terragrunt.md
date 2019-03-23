---
title: "terragrunt"
description: "Terragrunt is a thin wrapper for Terraform that provides extra tools for working with multiple Terraform modules."
tags:
- terraform
- task-runner
- wrapper
---

Terragrunt is a well-built tool that offers a lot of functionality making terraform easier. Like all well-built tools, it's opinionated and consistent. Perhaps, one of the best things about `terragrunt` is the community around it. The community (and gruntworks) provides the documentation, best practices, and the framework for terraform operations that it pioneered. Because of terragrunt, people have taken terraform beyond its limits and taught us a lot. If a company can rely solely on the capabilities of terraform, then terragrunt is aptly suited for the task at hand.

One way to think about `terragrunt` is as a purpose-built task runner (e.g. `make`) for terraform.  It supports standard capabilties of task-runners like hooks, dynamic functions, dependencies, dynamic variables and more. These are all essential for operating terraform at scale.

## Problem

Our problem with `terragrunt` which led us to seek out alternative solutions is a byproduct of our experience as advanced systems integrators. This is not a criticism of `terragrunt`, but an expression of our solution to a complex problem.

We don't just do `terraform`. We rely on `helm`, `helmfile`, `kops`, `chamber`, `kubectl` and more than a [*few dozen* other tools](https://github.com/cloudposse/packages). Our job ([cloudposse](https://cloudposse.com)) as system integrators is to get all these tools to work together in concert. Terragrunt is not that tool. Our charter is "automate everything".

We do a lot of terraforming. In fact, with over [140 open source terraform modules](https://github.com/cloudposse/?utf8=%E2%9C%93&q=terraform-&type=&language=) at last count, we write more terraform modules than most. We operate at a quite large scale architecturally and have been able to get by without `terragrunt`. Originally, we considered using terragrunt to (a) avoid manually mapping environment variables to terraform variables (b) help with automatic state configuration (c) and initializing remote terraform modules.

But the other things like "dynamic variables" are trivially satisfied by shell (e.g. `bash`). Our dependencies are covered by using more advanced and better understood task runners (e.g. `make` or `variant`). Our terraform remote state/locking is all handled using a [`terraform module`](https://github.com/cloudposse/terraform-aws-tfstate-backend) which makes more sense than using an out-of-band tool to provision the very same resources that `terraform` was designed to manage. Incidentally, most `terragrunt` users in the end use `bash` and `make` as well, so in the end there's no escaping it; the last mile of delivery will always need scripts.

The "UNIX Philosophy" is to "do one thing well" which is another way of saying to build small, purpose-built tools. Both these terms are arbitrary. What works well for one, doesn't for another. What's small for one is large for another.

Let's apply this concept to `terragrunt`. It can be strongly argued that it is a purpose-built tool that truly does one thing well: ✓ complex terraform automation. The number of companies using it is proof of that.

**It can also be argued that it's heavy.**

1. It does a lot, so it's scope is larger. For example, terragrunt can do simple retries, but even retrying can be a product in and of itself: https://github.com/kamilsk/retry
2. It can map environment variables to `TF_VAR_*`, but it's tedious and far from DRY. This is why we *first* wrote `tfenv` to automate environment variables for terraform (an extremely small, purpose-built tool that extends the concept of [`env`](https://en.wikipedia.org/wiki/Env) to terraform).
3. Then we realized that terraform could *natively* clone remote modules and initialize them using `terraform init -from-module=...`. And since that's a parameter, it can be passed as environment variables (e.g. `TF_CLI_ARGS_init=-from-module=...`).
4. It can call "hooks", but any task runner can do that too; that's basically the definition of a task runner.

---

So here's the dilemma. If we anyway need to use `make` and `bash` to *automate* with `terragrunt`, is the primary driver still there? Or instead, do we keep building very small, purpose-built tools that can be chained together in symphony like `chamber`, `aws-vault`, `make`, `cloudposse/tfenv`, `scenery`, `direnv`? There's no right or wrong answer. Just different business drivers. Also, we are not saying these tools don't work with terragrunt; they 100% do work with `terragrunt`. What we are saying is we can decompose `terragrunt` into its various pieces (or capabilities). That way we can use the best "micro cli" for the job. to achieve even more.

We publish [our complete toolchain](https://github.com/cloudposse/packages/tree/master/vendor) as Alpine packages. What terragrunt solves for *us* is but an extremely small piece of the puzzle. It doesn't help us orchestrate the automation between kops, helm, helmfile. It doesn't help us manage secrets with chamber or eliminate aws-vault. Our goal is to instead stick with "generalizable" conventions which are moderately less opinionated.

1. Use `make` (or similar) tool to run tasks across tools. Trigger dependencies (e.g. "hooks").
2. Use `bash` (or similar) to dynamically calculate environment variables
3. Use `terraform` for managing as many resources as possible (including terraform's state bucket and lock tables)
4. Use `direnv` to manage environment variables

If we stick to these tenants, the same patterns are repeatable across toolchains and technologies.  

Then we ship all these tools & conventions in our docker image(s) (e.g. [geodesic](https://github.com/cloudposse/geodesic)).

---
We are also very fond of a new tool as an alternative to `make` (or something that calls `make`): https://github.com/mumoshu/variant

This is a "universal cli" tool that allows us to define a common, modern "cli" interface across all tools, clis, scripts, commands, etc. Here's an elaborate [example of how to use it](https://github.com/cloudposse/geodesic/blob/master/rootfs/usr/local/bin/kopsctl).