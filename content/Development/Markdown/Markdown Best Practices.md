---
title: "Markdown Best Practices"
excerpt: ""
---
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/13f56b6-markdown.png",
        "markdown.png",
        1664,
        1024,
        "#000000"
      ],
      "sizing": "80"
    }
  ]
}
[/block]

Using Markdown is essential for clear communication on mediums such as GitHub, Slack or just plain text. Here are some of our recommendations on when to use certain conventions.


[block:callout]
{
  "type": "info",
  "body": "If you're new to Markdown or need a refresher, check out our [Markdown cheatsheet](doc:markdown).",
  "title": "Markdown Cheatsheet"
}
[/block]
# Code Blocks

Use code blocks for anything more than 1 line. Use `code` for inline code, filenames, commands, etc.
[block:code]
{
  "codes": [
    {
      "code": "```\n# This is a code block\n```",
      "language": "markdown",
      "name": "Code Block"
    }
  ]
}
[/block]

## Table of Options

Use tables to communicate lists of options. 
 
Here's an example:
[block:code]
{
  "codes": [
    {
      "code": "|  Name       |  Default |  Description                                  | Required |\n|:------------|:--------:|:----------------------------------------------|:--------:|\n| namespace   | ``       | Namespace (e.g. `cp` or `cloudposse`)         | Yes      |\n| stage       | ``       | Stage (e.g. `prod`, `dev`, `staging`)         | Yes      |\n| name        | ``       | Name  (e.g. `bastion` or `db`)                | Yes      | \n| attributes  | []       | Additional attributes (e.g. `policy`)         | No       | \n| tags        | {}       | Additional tags  (e.g. `map(\"Foo\",\"XYZ\")`)    | No       |\n\n* `:--------:` should be used for “Default” and “Required” values\n* `:---------` should be used for all other columns\n* Use `` for empty defaults\n* Use `value` for all values",
      "language": "markdown",
      "name": "Table of Options"
    }
  ]
}
[/block]

Which will render to something like this:
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/8d8cdf3-image_23.png",
        "image (23).png",
        771,
        290,
        "#f3f4f5"
      ]
    }
  ]
}
[/block]

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/a2761a9-image_22.png",
        "image (22).png",
        771,
        290,
        "#f3f4f5"
      ]
    }
  ]
}
[/block]
# Feature List Formatting

Use this format describe the features & benefits.
[block:code]
{
  "codes": [
    {
      "code": "1. **Feature 1** - Explanation of benefits\n2. **Feature 2** - Explanation of benefits",
      "language": "markdown",
      "name": "Feature List Example"
    }
  ]
}
[/block]
# Use Block Quotes

Reference copyrighted text, quotes, and other unoriginal copy using `>`
[block:code]
{
  "codes": [
    {
      "code": "> Amazon Simple Storage Service (Amazon S3) makes it simple and practical to collect, store, and analyze data - regardless of format – all at massive scale.",
      "language": "markdown",
      "name": "Block Quote Example"
    }
  ]
}
[/block]