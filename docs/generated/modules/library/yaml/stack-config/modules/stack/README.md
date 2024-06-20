---
title: stack
sidebar_label: stack
sidebar_class_name: command
description: stack
custom_edit_url: https://github.com/cloudposse/terraform-yaml-stack-config/blob/main/modules/stack/README.md
---

# stack

Terraform module that constructs stack names.

If `var.stack` is specified, will be returned as is. 

If not specified, the output will be calculated using the provided `context`.

