---
title: security-group
sidebar_label: security-group
sidebar_class_name: command
description: |-
  Terraform module to create AWS Security Group and rules.
tags:
  - aws
  - security-group
  - terraform
  - terraform-modules

custom_edit_url: https://github.com/cloudposse/terraform-aws-security-group/blob/main/README.yaml
---

# Module: `security-group`
Terraform module to create AWS Security Group and rules.






## Usage

This module is primarily for setting security group rules on a security group. You can provide the
ID of an existing security group to modify, or, by default, this module will create a new security
group and apply the given rules to it.

This module can be used very simply, but it is actually quite complex because it is attempting to handle
numerous interrelationships, restrictions, and a few bugs in ways that offer a choice between zero
service interruption for updates to a security group not referenced by other security groups
(by replacing the security group with a new one) versus brief service interruptions for security groups that must be preserved.

### Avoiding Service Interruptions

It is desirable to avoid having service interruptions when updating a security group. This is not always
possible due to the way Terraform organizes its activities and the fact that AWS will reject an attempt
to create a duplicate of an existing security group rule. There is also the issue that while most AWS
resources can be associated with and disassociated from security groups at any time, there remain some
that may not have their security group association changed, and an attempt to change their security group
will cause Terraform to delete and recreate the resource.

#### The 2 Ways Security Group Changes Cause Service Interruptions

Changes to a security group can cause service interruptions in 2 ways:

1. Changing rules may be implemented as deleting existing rules and creating new ones. During the
   period between deleting the old rules and creating the new rules, the security group will block
   traffic intended to be allowed by the new rules.
2. Changing rules may alternately be implemented as creating a new security group with the new rules
   and replacing the existing security group with the new one (then deleting the old one).
   This usually works with no service interruption in the case where all resources that reference the
   security group are part of the same Terraform plan.
   However, if, for example, the security group ID is referenced in a security group
   rule in a security group that is not part of the same Terraform plan, then AWS will not allow the
   existing (referenced) security group to be deleted, and even if it did, Terraform would not know
   to update the rule to reference the new security group.

The key question you need to answer to decide which configuration to use is "will anything break
if the security group ID changes". If not, then use the defaults `create_before_destroy = true` and
`preserve_security_group_id = false` and do not worry about providing "keys" for
security group rules. This is the default because it is the easiest and safest solution when
the way the security group is being used allows it.

If things will break when the security group ID changes, then set `preserve_security_group_id`
to `true`. Also read and follow the guidance below about [keys](#the-importance-of-keys) and
[limiting Terraform security group rules to a single AWS security group rule](#terraform-rules-vs-aws-rules)
if you want to mitigate against service interruptions caused by rule changes.
Note that even in this case, you probably want to keep `create_before_destroy = true` because otherwise,
if some change requires the security group to be replaced, Terraform will likely succeed
in deleting all the security group rules but fail to delete the security group itself,
leaving the associated resources completely inaccessible. At least with `create_before_destroy = true`,
the new security group will be created and used where Terraform can make the changes,
even though the old security group will still fail to be deleted.

#### The 3 Ways to Mitigate Against Service Interruptions

##### Security Group `create_before_destroy = true`

The most important option is `create_before_destroy` which, when set to `true` (the default),
ensures that a new replacement security group is created before an existing one is destroyed.
This is particularly important because a security group cannot be destroyed while it is associated with
a resource (e.g. a load balancer), but "destroy before create" behavior causes Terraform
to try to destroy the security group before disassociating it from associated resources,
so plans fail to apply with the error

```
Error deleting security group: DependencyViolation: resource sg-XXX has a dependent object
```

With "create before destroy" and any resources dependent on the security group as part of the
same Terraform plan, replacement happens successfully:

1. New security group is created
2. Resource is associated with the new security group and disassociated from the old one
3. Old security group is deleted successfully because there is no longer anything associated with it

(If there is a resource dependent on the security group that is also outside the scope of
the Terraform plan, the old security group will fail to be deleted and you will have to
address the dependency manually.)

Note that the module's default configuration of `create_before_destroy = true` and
`preserve_security_group_id = false` will force "create before destroy" behavior on the target security
group, even if the module did not create it and instead you provided a `target_security_group_id`.

Unfortunately, just creating the new security group first is not enough to prevent a service interruption. Keep reading.

##### Setting Rule Changes to Force Replacement of the Security Group

A security group by itself is just a container for rules. It only functions as desired when all the rules are in place.
If using the Terraform default "destroy before create" behavior for rules, even when using `create_before_destroy` for the
security group itself, an outage occurs when updating the rules or security group, because the order of operations is:

1. Delete existing security group rules (triggering a service interruption)
2. Create the new security group
3. Associate the new security group with resources and disassociate the old one (which can take a substantial
   amount of time for a resource like a NAT Gateway)
4. Create the new security group rules (restoring service)
5. Delete the old security group

To resolve this issue, the module's default configuration of `create_before_destroy = true` and
`preserve_security_group_id = false` causes any change in the security group rules
to trigger the creation of a new security group. With that, a rule change causes operations to occur in this order:

1. Create the new security group
2. Create the new security group rules
3. Associate the new security group with resources and disassociate the old one
4. Delete the old security group rules
5. Delete the old security group

##### Preserving the Security Group

There can be a downside to creating a new security group with every rule change.
If you want to prevent the security group ID from changing unless absolutely necessary, perhaps because the associated
resource does not allow the security group to be changed or because the ID is referenced somewhere (like in
another security group's rules) outside of this Terraform plan, then you need to set `preserve_security_group_id` to `true`.

The main drawback of this configuration is that there will normally be
a service outage during an update, because existing rules will be deleted before replacement
rules are created. Using keys to identify rules can help limit the impact, but even with keys, simply adding a
CIDR to the list of allowed CIDRs will cause that entire rule to be deleted and recreated, causing a temporary
access denial for all of the CIDRs in the rule. (For more on this and how to mitigate against it, see [The Importance
of Keys](#the-importance-of-keys) below.)

Also note that setting `preserve_security_group_id` to `true` does not prevent Terraform from replacing the
security group when modifying it is not an option, such as when its name or description changes.
However, if you can control the configuration adequately, you can maintain the security group ID and eliminate
impact on other security groups by setting `preserve_security_group_id` to `true`. We still recommend
leaving `create_before_destroy` set to `true` for the times when the security group must be replaced,
to avoid the `DependencyViolation` described above.

### Defining Security Group Rules

We provide a number of different ways to define rules for the security group for a few reasons:
- Terraform type constraints make it difficult to create collections of objects with optional members
- Terraform resource addressing can cause resources that did not actually change to nevertheless be replaced
  (deleted and recreated), which, in the case of security group rules, then causes a brief service interruption
- Terraform resource addresses must be known at `plan` time, making it challenging to create rules that
  depend on resources being created during `apply` and at the same time are not replaced needlessly when something else changes
- When Terraform rules can be successfully created before being destroyed, there is no service interruption for the resources
  associated with that security group (unless the security group ID is used in other security group rules outside
  of the scope of the Terraform plan)

#### The Importance of Keys

If you are using "create before destroy" behavior for the security group and security group rules, then
you can skip this section and much of the discussion about keys in the later sections, because keys do not matter
in this configuration. However, if you are using "destroy before create" behavior, then a full understanding of keys
as applied to security group rules will help you minimize service interruptions due to changing rules.

When creating a collection of resources, Terraform requires each resource to be identified by a key,
so that each resource has a unique "address", and changes to resources are tracked by that key.
Every security group rule input to this module accepts optional identifying keys (arbitrary strings) for each rule.
If you do not supply keys, then the rules are treated as a list,
and the index of the rule in the list will be used as its key. This has the unwelcome behavior that removing a rule
from the list will cause all the rules later in the list to be destroyed and recreated. For example, changing
`[A, B, C, D]` to `[A, C, D]` causes rules 1(`B`), 2(`C`), and 3(`D`) to be deleted and new rules 1(`C`) and
2(`D`) to be created.

To mitigate against this problem, we allow you to specify keys (arbitrary strings) for each rule. (Exactly how you specify
the key is explained in the next sections.) Going back to our example, if the
initial set of rules were specified with keys, e.g. `[{A: A}, {B: B}, {C: C}, {D: D}]`, then removing `B` from the list
would only cause `B` to be deleted, leaving `C` and `D` intact.

Note, however, two cautions. First, the keys must be known at `terraform plan` time and therefore cannot depend
on resources that will be created during `apply`. Second, in order to be helpful, the keys must remain consistently
attached to the same rules. For example, if you did

```hcl
rule_map = { for i, v in rule_list : i => v }
```

then you will have merely recreated the initial problem with using a plain list. If you cannot attach
meaningful keys to the rules, there is no advantage to specifying keys at all.

#### Terraform Rules vs AWS Rules

A single security group rule input can actually specify multiple AWS security group rules. For example,
`ipv6_cidr_blocks` takes a list of CIDRs. However, AWS security group rules do not allow for a list
of CIDRs, so the AWS Terraform provider converts that list of CIDRs into a list of AWS security group rules,
one for each CIDR. (This is the underlying cause of several AWS Terraform provider bugs,
such as [#25173](https://github.com/hashicorp/terraform-provider-aws/issues/25173).)
As of this writing, any change to any element of such a rule will cause
all the AWS rules specified by the Terraform rule to be deleted and recreated, causing the same kind of
service interruption we sought to avoid by providing keys for the rules, or, when create_before_destroy = true,
causing a complete failure as Terraform tries to create duplicate rules which AWS rejects. To guard against this issue,
when not using the default behavior, you should avoid the convenience of specifying multiple AWS rules
in a single Terraform rule and instead create a separate Terraform rule for each source or destination specification.

##### `rules` and `rules_map` inputs
This module provides 3 ways to set security group rules. You can use any or all of them at the same time.

The easy way to specify rules is via the `rules` input. It takes a list of rules. (We will define
a rule [a bit later](#definition-of-a-rule).) The problem is that a Terraform list must be composed
of elements that are all the exact same type, and rules can be any of several
different Terraform types. So to get around this restriction, the second
way to specify rules is via the `rules_map` input, which is more complex.

<details><summary>Why the input is so complex (click to reveal)</summary>

- Terraform has 3 basic simple types: bool, number, string
- Terraform then has 3 collections of simple types: list, map, and set
- Terraform then has 2 structural types: object and tuple. However, these are not really single
types. They are catch-all labels for values that are themselves combination of other values.
(This will become a bit clearer after we define `maps` and contrast them with `objects`)

One [rule of the collection types](https://www.terraform.io/docs/language/expressions/type-constraints.html#collection-types)
is that the values in the collections must all be the exact same type.
For example, you cannot have a list where some values are boolean and some are string. Maps require
that all keys be strings, but the map values can be any type, except again all the values in a map
must be the same type. In other words, the values of a map must form a valid list.

Objects look just like maps. The difference between an object and a map is that the values in an
object do not all have to be the same type.

The "type" of an object is itself an object: the keys are the same, and the values are the types of the values in the object.

So although `{ foo = "bar", baz = {} }` and `{ foo = "bar", baz = [] }` are both objects,
they are not of the same type, and you can get error messages like

```
Error: Inconsistent conditional result types
The true and false result expressions must have consistent types. The given
expressions are object and object, respectively.
```

This means you cannot put them both in the same list or the same map,
even though you can put them in a single tuple or object.
Similarly, and closer to the problem at hand,

```hcl
cidr_rule = {
  type        = "ingress"
  cidr_blocks = ["0.0.0.0/0"]
}
```
is not the same type as

```hcl
self_rule = {
  type        = "ingress"
  self        = true
}
```

This means you cannot put both of those in the same list.

```hcl
rules = tolist([local.cidr_rule, local.self_rule])
```

Generates the error

```text
Invalid value for "v" parameter: cannot convert tuple to list of any single type.
```

You could make them the same type and put them in a list,
like this:

```hcl
rules = tolist([{
  type        = "ingress"
  cidr_blocks = ["0.0.0.0/0"]
  self        = null
},
{
  type        = "ingress"
  cidr_blocks = []
  self        = true
}])
```

That remains an option for you when generating the rules, and is probably better when you have full control over all the rules.
However, what if some of the rules are coming from a source outside of your control? You cannot simply add those rules
to your list. So, what to do? Create an object whose attributes' values can be of different types.

```hcl
{ mine = local.my_rules, theirs = var.their_rules }
```

That is why the `rules_map` input is available. It will accept a structure like that, an object whose
attribute values are lists of rules, where the lists themselves can be different types.

</details>

The `rules_map` input takes an object.
- The attribute names (keys) of the object can be anything you want, but need to be known during `terraform plan`,
which means they cannot depend on any resources created or changed by Terraform.
- The values of the attributes are lists of rule objects, each object representing one Security Group Rule. As explained
  above in "Why the input is so complex", each object in the list must be exactly the same type. To use multiple types,
  you must put them in separate lists and put the lists in a map with distinct keys.

Example:

```hcl
rules_map = {
  ingress = [{
    key         = "ingress"
    type        = "ingress"
    from_port   = 0
    to_port     = 2222
    protocol    = "tcp"
    cidr_blocks = module.subnets.nat_gateway_public_ips
    self        = null
    description = "2222"
  }],
  egress = [{
    key         = "egress"
    type        = "egress"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    self        = null
    description = "All output traffic"
  }]
}
```

###### Definition of a Rule

For this module, a rule is defined as an object.
- The attributes and values of the rule objects are fully compatible (have the same keys and accept the same values) as the
Terraform [aws_security_group_rule resource](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group_rule),
except:
   - The `security_group_id` will be ignored, if present
   - You can include an optional `key` attribute. If present, its value must be unique among all security group rules in the
     security group, and it must be known in the Terraform "plan" phase, meaning it cannot depend on anything being
     generated or created by Terraform.

The `key` attribute value, if provided, will be used to identify the Security Group Rule to Terraform in order to
prevent Terraform from modifying it unnecessarily. If the `key` is not provided, Terraform will assign an identifier
based on the rule's position in its list, which can cause a ripple effect of rules being deleted and recreated if
a rule gets deleted from start of a list, causing all the other rules to shift position.
See ["Unexpected changes..."](#unexpected-changes-during-plan-and-apply) below for more details.


##### `rule_matrix` Input

The other way to set rules is via the `rule_matrix` input. This splits the attributes of the `aws_security_group_rule`
resource into two sets: one set defines the rule and description, the other set defines the subjects of the rule.
Again, optional "key" values can provide stability, but cannot contain derived values. This input is an attempt
at convenience, and should not be used unless you are using the default settings of `create_before_destroy = true` and
`preserve_security_group_id = false`, or else a number of failure modes or service interruptions are possible: use
`rules_map` instead.

As with `rules` and explained above in "Why the input is so complex", all elements of the list must be the exact same type.
This also holds for all the elements of the `rules_matrix.rules` list. Because `rule_matrix` is already
so complex, we do not provide the ability to mix types by packing object within more objects.
All of the elements of the `rule_matrix` list must be exactly the same type. You can make them all the same
type by following a few rules:

- Every object in a list must have the exact same set of attributes. Most attributes are optional and can be omitted,
  but any attribute appearing in one object must appear in all the objects.
- Any attribute that takes a list value in any object must contain a list in all objects.
  Use an empty list rather than `null` to indicate "no value". Passing in `null` instead of a list
  may cause Terraform to crash or emit confusing error messages (e.g. "number is required").
- Any attribute that takes a value of type other than list can be set to `null` in objects where no value is needed.

The schema for `rule_matrix` is:

```hcl
{
  # these top level lists define all the subjects to which rule_matrix rules will be applied
  key                       = an optional unique key to keep these rules from being affected when other rules change
  source_security_group_ids = list of source security group IDs to apply all rules to
  cidr_blocks               = list of ipv4 CIDR blocks to apply all rules to
  ipv6_cidr_blocks          = list of ipv6 CIDR blocks to apply all rules to
  prefix_list_ids           = list of prefix list IDs to apply all rules to

  self = boolean value; set it to "true" to apply the rules to the created or existing security group, null otherwise

  # each rule in the rules list will be applied to every subject defined above
  rules = [{
    key       = an optional unique key to keep this rule from being affected when other rules change
    type      = type of rule, either "ingress" or "egress"
    from_port = start range of protocol port
    to_port   = end range of protocol port, max is 65535
    protocol  = IP protocol name or number, or "-1" for all protocols and ports

    description = free form text description of the rule
  }]
}
```

### Important Notes

##### Unexpected changes during plan and apply

When configuring this module for "create before destroy" behavior, any change to
a security group rule will cause an entire new security group to be created with
all new rules. This can make a small change look like a big one, but is intentional
and should not cause concern.

As explained above under [The Importance of Keys](#the-importance-of-keys),
when using "destroy before create" behavior, security group rules without keys
are identified by their indices in the input lists. If a rule is deleted and the other rules therefore move
closer to the start of the list, those rules will be deleted and recreated. This
can make a small change look like a big one when viewing the output of Terraform plan,
and will likely cause a brief (seconds) service interruption.

You can avoid this for the most part by providing the optional keys, and [limiting each rule
to a single source or destination](#terraform-rules-vs-aws-rules). Rules with keys will not be
changed if their keys do not change and the rules themselves do not change, except in the case of
`rule_matrix`, where the rules are still dependent on the order of the security groups in
`source_security_group_ids`. You can avoid this by using `rules` or `rules_map` instead of `rule_matrix` when you have
more than one security group in the list. You cannot avoid this by sorting the
`source_security_group_ids`, because that leads to the "Invalid `for_each` argument" error
because of [terraform#31035](https://github.com/hashicorp/terraform/issues/31035).

##### Invalid for_each argument

You can supply a number of rules as inputs to this module, and they (usually) get transformed into
`aws_security_group_rule` resources. However, Terraform works in 2 steps: a `plan` step where it
calculates the changes to be made, and an `apply` step where it makes the changes. This is so you
can review and approve the plan before changing anything. One big limitation of this approach is
that it requires that Terraform be able to count the number of resources to create without the
benefit of any data generated during the `apply` phase. So if you try to generate a rule based
on something you are creating at the same time, you can get an error like

```
Error: Invalid for_each argument
The "for_each" value depends on resource attributes that cannot be determined until apply,
so Terraform cannot predict how many instances will be created.
```

This module uses lists to minimize the chance of that happening, as all it needs to know
is the length of the list, not the values in it, but this error still can
happen for subtle reasons. Most commonly, using a function like `compact` on a list
will cause the length to become unknown (since the values have to be checked and `null`s removed).
In the case of `source_security_group_ids`, just sorting the list using `sort`
will cause this error. (See [terraform#31035](https://github.com/hashicorp/terraform/issues/31035).)
If you run into this error, check for functions like `compact` somewhere
in the chain that produces the list and remove them if you find them.


##### WARNINGS and Caveats

**_Setting `inline_rules_enabled` is not recommended and NOT SUPPORTED_**: Any issues arising from setting
`inlne_rules_enabled = true` (including issues about setting it to `false` after setting it to `true`) will
not be addressed, because they flow from [fundamental problems](https://github.com/hashicorp/terraform-provider-aws/issues/20046)
with the underlying `aws_security_group` resource. The setting is provided for people who know and accept the
limitations and trade-offs and want to use it anyway. The main advantage is that when using inline rules,
Terraform will perform "drift detection" and attempt to remove any rules it finds in place but not
specified inline. See [this post](https://github.com/hashicorp/terraform-provider-aws/pull/9032#issuecomment-639545250)
for a discussion of the difference between inline and resource rules,
and some of the reasons inline rules are not satisfactory.

**_KNOWN ISSUE_** ([#20046](https://github.com/hashicorp/terraform-provider-aws/issues/20046)):
If you set `inline_rules_enabled = true`, you cannot later set it to `false`. If you try,
Terraform will [complain](https://github.com/hashicorp/terraform/pull/2376) and fail.
You will either have to delete and recreate the security group or manually delete all
the security group rules via the AWS console or CLI before applying `inline_rules_enabled = false`.

**_Objects not of the same type_**: Any time you provide a list of objects, Terraform requires that all objects in the list
must be [the exact same type](https://www.terraform.io/docs/language/expressions/type-constraints.html#dynamic-types-the-quot-any-quot-constraint).
This means that all objects in the list have exactly the same set of attributes and that each attribute has the same type
of value in every object. So while some attributes are optional for this module, if you include an attribute in any one of the objects in a list, then you
have to include that same attribute in all of them.  In rules where the key would othewise be omitted, include the key with value of `null`,
unless the value is a list type, in which case set the value to `[]` (an empty list), due to [#28137](https://github.com/hashicorp/terraform/issues/28137).




## Examples


See [examples/complete/main.tf](https://github.com/cloudposse/terraform-aws-security-group/blob/master/examples/complete/main.tf) for
even more examples.

```hcl
module "label" {
  source = "cloudposse/label/null"
  # Cloud Posse recommends pinning every module to a specific version
  # version = "x.x.x"
  namespace  = "eg"
  stage      = "prod"
  name       = "bastion"
  attributes = ["public"]
  delimiter  = "-"

  tags = {
    "BusinessUnit" = "XYZ",
    "Snapshot"     = "true"
  }
}

module "vpc" {
  source = "cloudposse/vpc/aws"
  # Cloud Posse recommends pinning every module to a specific version
  # version = "x.x.x"
  cidr_block = "10.0.0.0/16"

  context = module.label.context
}

module "sg" {
  source = "cloudposse/security-group/aws"
  # Cloud Posse recommends pinning every module to a specific version
  # version = "x.x.x"

  # Security Group names must be unique within a VPC.
  # This module follows Cloud Posse naming conventions and generates the name
  # based on the inputs to the null-label module, which means you cannot
  # reuse the label as-is for more than one security group in the VPC.
  #
  # Here we add an attribute to give the security group a unique name.
  attributes = ["primary"]

  # Allow unlimited egress
  allow_all_egress = true

  rules = [
    {
      key         = "ssh"
      type        = "ingress"
      from_port   = 22
      to_port     = 22
      protocol    = "tcp"
      cidr_blocks = ["0.0.0.0/0"]
      self        = null  # preferable to self = false
      description = "Allow SSH from anywhere"
    },
    {
      key         = "HTTP"
      type        = "ingress"
      from_port   = 80
      to_port     = 80
      protocol    = "tcp"
      cidr_blocks = []
      self        = true
      description = "Allow HTTP from inside the security group"
    }
  ]

  vpc_id  = module.vpc.vpc_id

  context = module.label.context
}

module "sg_mysql" {
  source = "cloudposse/security-group/aws"
  # Cloud Posse recommends pinning every module to a specific version
  # version = "x.x.x"

  # Add an attribute to give the Security Group a unique name
  attributes = ["mysql"]

  # Allow unlimited egress
  allow_all_egress = true

  rule_matrix =[
    # Allow any of these security groups or the specified prefixes to access MySQL
    {
      source_security_group_ids = [var.dev_sg, var.uat_sg, var.staging_sg]
      prefix_list_ids = [var.mysql_client_prefix_list_id]
      rules = [
        {
          key         = "mysql"
          type        = "ingress"
          from_port   = 3306
          to_port     = 3306
          protocol    = "tcp"
          description = "Allow MySQL access from trusted security groups"
        }
      ]
    }
  ]

  vpc_id  = module.vpc.vpc_id

  context = module.label.context
}

```



<!-- markdownlint-disable -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 1.0.0 |
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | >= 3.0 |
| <a name="requirement_null"></a> [null](#requirement\_null) | >= 3.0 |
| <a name="requirement_random"></a> [random](#requirement\_random) | >= 3.0 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | >= 3.0 |
| <a name="provider_null"></a> [null](#provider\_null) | >= 3.0 |
| <a name="provider_random"></a> [random](#provider\_random) | >= 3.0 |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_this"></a> [this](#module\_this) | cloudposse/label/null | 0.25.0 |

## Resources

| Name | Type |
|------|------|
| [aws_security_group.cbd](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group) | resource |
| [aws_security_group.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group) | resource |
| [aws_security_group_rule.dbc](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group_rule) | resource |
| [aws_security_group_rule.keyed](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group_rule) | resource |
| [null_resource.sync_rules_and_sg_lifecycles](https://registry.terraform.io/providers/hashicorp/null/latest/docs/resources/resource) | resource |
| [random_id.rule_change_forces_new_security_group](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/id) | resource |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_additional_tag_map"></a> [additional\_tag\_map](#input\_additional\_tag\_map) | Additional key-value pairs to add to each map in `tags_as_list_of_maps`. Not added to `tags` or `id`.<br/>This is for some rare cases where resources want additional configuration of tags<br/>and therefore take a list of maps with tag key, value, and additional configuration. | `map(string)` | `{}` | no |
| <a name="input_allow_all_egress"></a> [allow\_all\_egress](#input\_allow\_all\_egress) | A convenience that adds to the rules specified elsewhere a rule that allows all egress.<br/>If this is false and no egress rules are specified via `rules` or `rule-matrix`, then no egress will be allowed. | `bool` | `true` | no |
| <a name="input_attributes"></a> [attributes](#input\_attributes) | ID element. Additional attributes (e.g. `workers` or `cluster`) to add to `id`,<br/>in the order they appear in the list. New attributes are appended to the<br/>end of the list. The elements of the list are joined by the `delimiter`<br/>and treated as a single ID element. | `list(string)` | `[]` | no |
| <a name="input_context"></a> [context](#input\_context) | Single object for setting entire context at once.<br/>See description of individual variables for details.<br/>Leave string and numeric variables as `null` to use default value.<br/>Individual variable settings (non-null) override settings in context object,<br/>except for attributes, tags, and additional\_tag\_map, which are merged. | `any` | <pre>{<br/>  "additional_tag_map": {},<br/>  "attributes": [],<br/>  "delimiter": null,<br/>  "descriptor_formats": {},<br/>  "enabled": true,<br/>  "environment": null,<br/>  "id_length_limit": null,<br/>  "label_key_case": null,<br/>  "label_order": [],<br/>  "label_value_case": null,<br/>  "labels_as_tags": [<br/>    "unset"<br/>  ],<br/>  "name": null,<br/>  "namespace": null,<br/>  "regex_replace_chars": null,<br/>  "stage": null,<br/>  "tags": {},<br/>  "tenant": null<br/>}</pre> | no |
| <a name="input_create_before_destroy"></a> [create\_before\_destroy](#input\_create\_before\_destroy) | Set `true` to enable terraform `create_before_destroy` behavior on the created security group.<br/>We only recommend setting this `false` if you are importing an existing security group<br/>that you do not want replaced and therefore need full control over its name.<br/>Note that changing this value will always cause the security group to be replaced. | `bool` | `true` | no |
| <a name="input_delimiter"></a> [delimiter](#input\_delimiter) | Delimiter to be used between ID elements.<br/>Defaults to `-` (hyphen). Set to `""` to use no delimiter at all. | `string` | `null` | no |
| <a name="input_descriptor_formats"></a> [descriptor\_formats](#input\_descriptor\_formats) | Describe additional descriptors to be output in the `descriptors` output map.<br/>Map of maps. Keys are names of descriptors. Values are maps of the form<br/>`{<br/>   format = string<br/>   labels = list(string)<br/>}`<br/>(Type is `any` so the map values can later be enhanced to provide additional options.)<br/>`format` is a Terraform format string to be passed to the `format()` function.<br/>`labels` is a list of labels, in order, to pass to `format()` function.<br/>Label values will be normalized before being passed to `format()` so they will be<br/>identical to how they appear in `id`.<br/>Default is `{}` (`descriptors` output will be empty). | `any` | `{}` | no |
| <a name="input_enabled"></a> [enabled](#input\_enabled) | Set to false to prevent the module from creating any resources | `bool` | `null` | no |
| <a name="input_environment"></a> [environment](#input\_environment) | ID element. Usually used for region e.g. 'uw2', 'us-west-2', OR role 'prod', 'staging', 'dev', 'UAT' | `string` | `null` | no |
| <a name="input_id_length_limit"></a> [id\_length\_limit](#input\_id\_length\_limit) | Limit `id` to this many characters (minimum 6).<br/>Set to `0` for unlimited length.<br/>Set to `null` for keep the existing setting, which defaults to `0`.<br/>Does not affect `id_full`. | `number` | `null` | no |
| <a name="input_inline_rules_enabled"></a> [inline\_rules\_enabled](#input\_inline\_rules\_enabled) | NOT RECOMMENDED. Create rules "inline" instead of as separate `aws_security_group_rule` resources.<br/>See [#20046](https://github.com/hashicorp/terraform-provider-aws/issues/20046) for one of several issues with inline rules.<br/>See [this post](https://github.com/hashicorp/terraform-provider-aws/pull/9032#issuecomment-639545250) for details on the difference between inline rules and rule resources. | `bool` | `false` | no |
| <a name="input_label_key_case"></a> [label\_key\_case](#input\_label\_key\_case) | Controls the letter case of the `tags` keys (label names) for tags generated by this module.<br/>Does not affect keys of tags passed in via the `tags` input.<br/>Possible values: `lower`, `title`, `upper`.<br/>Default value: `title`. | `string` | `null` | no |
| <a name="input_label_order"></a> [label\_order](#input\_label\_order) | The order in which the labels (ID elements) appear in the `id`.<br/>Defaults to ["namespace", "environment", "stage", "name", "attributes"].<br/>You can omit any of the 6 labels ("tenant" is the 6th), but at least one must be present. | `list(string)` | `null` | no |
| <a name="input_label_value_case"></a> [label\_value\_case](#input\_label\_value\_case) | Controls the letter case of ID elements (labels) as included in `id`,<br/>set as tag values, and output by this module individually.<br/>Does not affect values of tags passed in via the `tags` input.<br/>Possible values: `lower`, `title`, `upper` and `none` (no transformation).<br/>Set this to `title` and set `delimiter` to `""` to yield Pascal Case IDs.<br/>Default value: `lower`. | `string` | `null` | no |
| <a name="input_labels_as_tags"></a> [labels\_as\_tags](#input\_labels\_as\_tags) | Set of labels (ID elements) to include as tags in the `tags` output.<br/>Default is to include all labels.<br/>Tags with empty values will not be included in the `tags` output.<br/>Set to `[]` to suppress all generated tags.<br/>**Notes:**<br/>  The value of the `name` tag, if included, will be the `id`, not the `name`.<br/>  Unlike other `null-label` inputs, the initial setting of `labels_as_tags` cannot be<br/>  changed in later chained modules. Attempts to change it will be silently ignored. | `set(string)` | <pre>[<br/>  "default"<br/>]</pre> | no |
| <a name="input_name"></a> [name](#input\_name) | ID element. Usually the component or solution name, e.g. 'app' or 'jenkins'.<br/>This is the only ID element not also included as a `tag`.<br/>The "name" tag is set to the full `id` string. There is no tag with the value of the `name` input. | `string` | `null` | no |
| <a name="input_namespace"></a> [namespace](#input\_namespace) | ID element. Usually an abbreviation of your organization name, e.g. 'eg' or 'cp', to help ensure generated IDs are globally unique | `string` | `null` | no |
| <a name="input_preserve_security_group_id"></a> [preserve\_security\_group\_id](#input\_preserve\_security\_group\_id) | When `false` and `create_before_destroy` is `true`, changes to security group rules<br/>cause a new security group to be created with the new rules, and the existing security group is then<br/>replaced with the new one, eliminating any service interruption.<br/>When `true` or when changing the value (from `false` to `true` or from `true` to `false`),<br/>existing security group rules will be deleted before new ones are created, resulting in a service interruption,<br/>but preserving the security group itself.<br/>**NOTE:** Setting this to `true` does not guarantee the security group will never be replaced,<br/>it only keeps changes to the security group rules from triggering a replacement.<br/>See the README for further discussion. | `bool` | `false` | no |
| <a name="input_regex_replace_chars"></a> [regex\_replace\_chars](#input\_regex\_replace\_chars) | Terraform regular expression (regex) string.<br/>Characters matching the regex will be removed from the ID elements.<br/>If not set, `"/[^a-zA-Z0-9-]/"` is used to remove all characters other than hyphens, letters and digits. | `string` | `null` | no |
| <a name="input_revoke_rules_on_delete"></a> [revoke\_rules\_on\_delete](#input\_revoke\_rules\_on\_delete) | Instruct Terraform to revoke all of the Security Group's attached ingress and egress rules before deleting<br/>the security group itself. This is normally not needed. | `bool` | `false` | no |
| <a name="input_rule_matrix"></a> [rule\_matrix](#input\_rule\_matrix) | A convenient way to apply the same set of rules to a set of subjects. See README for details. | `any` | `[]` | no |
| <a name="input_rules"></a> [rules](#input\_rules) | A list of Security Group rule objects. All elements of a list must be exactly the same type;<br/>use `rules_map` if you want to supply multiple lists of different types.<br/>The keys and values of the Security Group rule objects are fully compatible with the `aws_security_group_rule` resource,<br/>except for `security_group_id` which will be ignored, and the optional "key" which, if provided, must be unique<br/>and known at "plan" time.<br/>To get more info see the `security_group_rule` [documentation](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group_rule).<br/>\_\_\_Note:\_\_\_ The length of the list must be known at plan time.<br/>This means you cannot use functions like `compact` or `sort` when computing the list. | `list(any)` | `[]` | no |
| <a name="input_rules_map"></a> [rules\_map](#input\_rules\_map) | A map-like object of lists of Security Group rule objects. All elements of a list must be exactly the same type,<br/>so this input accepts an object with keys (attributes) whose values are lists so you can separate different<br/>types into different lists and still pass them into one input. Keys must be known at "plan" time.<br/>The keys and values of the Security Group rule objects are fully compatible with the `aws_security_group_rule` resource,<br/>except for `security_group_id` which will be ignored, and the optional "key" which, if provided, must be unique<br/>and known at "plan" time.<br/>To get more info see the `security_group_rule` [documentation](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group_rule). | `any` | `{}` | no |
| <a name="input_security_group_create_timeout"></a> [security\_group\_create\_timeout](#input\_security\_group\_create\_timeout) | How long to wait for the security group to be created. | `string` | `"10m"` | no |
| <a name="input_security_group_delete_timeout"></a> [security\_group\_delete\_timeout](#input\_security\_group\_delete\_timeout) | How long to retry on `DependencyViolation` errors during security group deletion from<br/>lingering ENIs left by certain AWS services such as Elastic Load Balancing. | `string` | `"15m"` | no |
| <a name="input_security_group_description"></a> [security\_group\_description](#input\_security\_group\_description) | The description to assign to the created Security Group.<br/>Warning: Changing the description causes the security group to be replaced. | `string` | `"Managed by Terraform"` | no |
| <a name="input_security_group_name"></a> [security\_group\_name](#input\_security\_group\_name) | The name to assign to the security group. Must be unique within the VPC.<br/>If not provided, will be derived from the `null-label.context` passed in.<br/>If `create_before_destroy` is true, will be used as a name prefix. | `list(string)` | `[]` | no |
| <a name="input_stage"></a> [stage](#input\_stage) | ID element. Usually used to indicate role, e.g. 'prod', 'staging', 'source', 'build', 'test', 'deploy', 'release' | `string` | `null` | no |
| <a name="input_tags"></a> [tags](#input\_tags) | Additional tags (e.g. `{'BusinessUnit': 'XYZ'}`).<br/>Neither the tag keys nor the tag values will be modified by this module. | `map(string)` | `{}` | no |
| <a name="input_target_security_group_id"></a> [target\_security\_group\_id](#input\_target\_security\_group\_id) | The ID of an existing Security Group to which Security Group rules will be assigned.<br/>The Security Group's name and description will not be changed.<br/>Not compatible with `inline_rules_enabled` or `revoke_rules_on_delete`.<br/>If not provided (the default), this module will create a security group. | `list(string)` | `[]` | no |
| <a name="input_tenant"></a> [tenant](#input\_tenant) | ID element \_(Rarely used, not included by default)\_. A customer identifier, indicating who this instance of a resource is for | `string` | `null` | no |
| <a name="input_vpc_id"></a> [vpc\_id](#input\_vpc\_id) | The ID of the VPC where the Security Group will be created. | `string` | n/a | yes |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_arn"></a> [arn](#output\_arn) | The created Security Group ARN (null if using existing security group) |
| <a name="output_id"></a> [id](#output\_id) | The created or target Security Group ID |
| <a name="output_name"></a> [name](#output\_name) | The created Security Group Name (null if using existing security group) |
| <a name="output_rules_terraform_ids"></a> [rules\_terraform\_ids](#output\_rules\_terraform\_ids) | List of Terraform IDs of created `security_group_rule` resources, primarily provided to enable `depends_on` |
<!-- markdownlint-restore -->

