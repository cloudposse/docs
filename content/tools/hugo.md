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

1. Our [`terraform-root-module/aws/docs`](https://github.com/cloudposse/terraform-root-modules/tree/master/aws/docs) reference architecture describes how we provision the S3 bucket along with CloudFront CDN.
2. Our [`codefresh.yml`](https://github.com/cloudposse/docs/blob/master/codefresh.yml) shows how we CI/CD our documentation and deploy it to S3 for all tagged releases.
