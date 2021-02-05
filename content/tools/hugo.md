---
title: "Hugo Static Site Generator"
description: "Hugo is one of the most popular open-source static site generators."
tags:
- tools
---

{{< img src="/assets/hugo-7303d89d.png" title="Hugo Static Site Generator" class="logo" >}}

[Hugo](https://gohugo.io/) is one of the most popular open-source static site generators. It also happens to be a rediculously fast framework for building static websites. We use it to build [our documentation](https://github.com/cloudposse/docs/).

What we like about it is that it's written in Go, speaks "markdown" and uses Go-templates for rendering all pages.

Want to host your own static site? Here's how we do it.

1. Our [`GitHub Actions workflow`](https://github.com/cloudposse/docs/tree/master/.github) shows how we CI/CD our documentation and deploy it to S3 for all tagged releases.
