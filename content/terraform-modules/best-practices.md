---
title: Terraform Module Best Practices
description: ''
weight: -1
---

# Follow Official Conventions

Following official conventions is especially important if the module will ever be published to the [terraform module registry](https://registry.terraform.io). Either way, we suggest following these conventions to create more standardized/portable modules.

1. **Use GitHub.** For public modules that you intend to publish to the [public registry](https://registry.terraform.io/), the module repos must be hosted on GitHub as a public repo.

2. **User Proper Naming.** Module repository names must follow the `terraform-$PROVIDER-$NAME` naming convention, where `$NAME` is a descriptive label for the kind of infrastructure that is provisioned, and `$PROVIDER` is the primary provider provisioning the infrastructure (e.g. `aws`). Use hyphens (`-`) to separate all fields. Do not use underscores (`_`).

3. **Repository description.** The GitHub repository description is used to populate the short description of the module. This should be a simple one sentence description of the module.

4. **Standard Module Structure.** The module must follow the [standard module structure](https://www.terraform.io/docs/modules/create.html#standard-module-structure). This makes it easier for others to jump in and contribute, but is also a requirement for publishing modules to the registry. The registry will inspect the module and generate documentation automatically from `description` fields in `variable` and `output` declarations, track resource usage, parse submodules and examples, and more.

5. **Use Semantic Versioning.** Every release should have a tag in the `x.y.z` format. The registry will use the repository's tags to identify module versions. Use [semantic versions]({{< relref "development/semver.md" >}}) for tagged releases. Tags may be optionally prefixed with a `v` (e.g. `v1.0.1` or `1.0.1`).

{{% dialog type="info" icon="fa fa-book" title="Read More" %}}
- <https://www.terraform.io/docs/registry/modules/publish.html>
{{% /dialog %}}


# Root Module Pattern

This refers to the "root" or top-level invocation of terraform modules. We provide examples of these on our [`github.com/cloudposse/terraform-root-modules`](https://github.com/cloudposse/terraform-root-modules) repo.

This is a DRY pattern that allows module invocations to be easily versioned and copied between geodesic modules by leveraging docker's multi-stage-builds (e.g. `COPY --from=terraform-root-modules`).
