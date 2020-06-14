---
title: "Code Review Guidelines"
description: ""
slug: "code-reviews"
tags:
  - "Best Practices"
  - "Development"
---

Here are some of our tips for conducting *Code Reviews* the SweetOps way. If you haven't already, become familiar with our [Development Best Practices]({{< relref "development/best-practices.md" >}}) and [Terraform Best Practices]({{< relref "terraform/best-practices.md" >}}).

1. Use the ["Suggest"](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/incorporating-feedback-in-your-pull-request) feature as much as possible. This makes it quick and easy for the contributor to accept or dismiss the recommendations.
2. Use proper markdown in suggestions (e.g. code blocks)
3. Always be polite and appreciative of the contributions!
4. Use emoticons to up-vote other comments (rather than `+1` comments)
5. Use ChatOps commands like `/rebuild-readme` or `/terraform-fmt` to fix common problems
6. Use ChatOps commands like `/test all`, `/test bats`, `/test readme`, `/test terratest` to run integration tests
7. Recommend changes to better conform to our best-practices.
8. Quote comments you're replying to make your responses more clear.
