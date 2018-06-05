---
title: Gomplate
description: 'Gomplate is a command-line tool for template rendering that supports many local and remote data-sources.'
tags:
- go-template
---
{{< img src="/assets/gomplate-5869374e.png" title="Gomplate Logo" class="logo" >}}

The Go progamming language supports [native templating](https://golang.org/pkg/text/template/). The problem is that there aren't very many functions supported out-of-the-box and it cannot be called from the command line.

Gomplate is a CLI tool that addresses this need. That is, it can be used as an alternative to [`envsubst`](https://www.gnu.org/software/gettext/manual/html_node/envsubst-Invocation.html), but also supports
additional template data-sources such as: JSON, YAML, and even AWS EC2 metadata.

We love `envsubst` for its super-minimalist template processing, but sometimes more advanced templating with conditions is necessary. In geodesic, we use `gomplate` to parameterize the {{< relref "geodesic/kops/manifest.md" >}}. Gomplate is an alternative to `envsubst` that provides some useful built-in functions to make templates even more expressive.

# References
- [Official Documentation](https://gomplate.hairyhenderson.ca/)
