---
title: "HashiCorp Language (HCL)"
description: "HCL is [HashiCorp's configuration language](https://github.com/hashicorp/hcl) used in multiple products, but most notably in `terraform`."
terms:
- HCL
- HashiCorp Configuration language
- HashiCorp Language
tags:
- terraform
- HCL
---

The HashiCorp Configuration language was designed to be both human readable and machine friendly. It used by most HashiCorp tools such as `terraform`. The nice thing about HCL is also fully JSON compatible, which means that JSON can be used anywhere HCL is expected. By supporting JSON backwards compatibility, HCL remains interoperable with other systems.

Here's an example of HCL:
```hcl
variable "ami" {
    description = "the AMI to use"
}
```
