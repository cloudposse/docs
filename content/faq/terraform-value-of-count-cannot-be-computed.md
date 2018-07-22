---
title: "Terraform error: `value of 'count' cannot be computed`"
description: "Use of `count` on dynamic variables passed as inputs from other modules is not supported so pass explicit counts instead."
tags:
- terraform
- terraform-module
---

# Question

When running `terraform apply`, we encounter the following error. We're passing a `list` of values from an output of one module as `variable` inputs to another module.

For example, we get the following error:

```
module.ec2_instance.module.label.null_resource.tags_as_list_of_maps: null_resource.tags_as_list_of_maps: value of 'count' cannot be computed
```

# Answer

Terraform has well-known issues with `counts` in `maps`.

Terraform (in the current incarnation) is very sensitive to these two things:

1. Dynamic `counts` across modules -- when you have a dynamic count (calculated by some expression with input params) in one module and then use the module from other modules
2. It does not especially like dynamic `counts` with `maps` and `lists`

Some know issues about that:

> - <https://github.com/hashicorp/terraform/issues/13980>
> - <https://github.com/hashicorp/terraform/issues/10857>
> - <https://github.com/hashicorp/terraform/issues/12570>
> - <https://github.com/hashicorp/terraform/issues/17048>

This issue has come up for us time and again. If a module has a map variable and has interpolation inside this map variable, count inside a module results in value of `count` that cannot be computed. It appears that this error only occurs when running `terraform apply` on a new environment, but not any existing environment! So the problem often goes unnoticed.

Here's an example from one of our modules.

Here the `count` depends on the `map` and the input `var.tags`:

> - <https://github.com/cloudposse/terraform-null-label/blob/0.3.7/main.tf#L23>

And here `var.tags` depends on the `map`, the other inputs and on the `data` provider:

> - <https://github.com/cloudposse/terraform-aws-ec2-instance/blob/0.7.4/main.tf#L68a>

This circular dependency breaks TF.

It’s very difficult to say for sure what’s going on, because it could work in some cases and in some environments, but not in the others (see the complaints in the issues above).

Unfortunately, this is not a good explanation. The Terraform community has been discussing the issue for years and can’t explain it either, probably because nobody fully understands the scope of the problem.

Here are a few ways to address it:

1. Remove dynamic counts (provide explicit counts if possible, e.g. `instance_count`)
2. Or, remove `maps` from `counts`
3. Or, try to remove the `data` source (could work in some cases)
4. Or, run `terraform apply` in multiple stages with `-target` (not a pretty solution)
