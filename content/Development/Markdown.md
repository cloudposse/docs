---
title: "Markdown"
excerpt: ""
---
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/5a735a9-markdown.png",
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
Markdown is a simple way to format plain text that looks great on any device without using any HTML or CSS. It doesn’t permit do anything fancy like changing fonts, color, or typeface — just the bare essentials by using keyboard symbols you already know.

# Standard Formatting
[block:parameters]
{
  "data": {
    "h-0": "Preferred Syntax",
    "h-1": "Alternative Syntax",
    "h-2": "Example",
    "0-0": "```\n*Italic*\n```",
    "0-1": "```\n_Italic_\n```",
    "0-2": "*Italic*",
    "1-0": "```\n**Bold**\n```",
    "1-1": "```\n__Bold__\n```",
    "1-2": "**Bold**",
    "2-0": "```\n# Heading 1\n```",
    "2-1": "```\nHeading 1\n=========\n```",
    "2-2": "# Heading 1",
    "3-0": "```\n## Heading 2\n```",
    "3-1": "```\nHeading 2\n---------\n```",
    "3-2": "## Heading 2",
    "4-0": "```\n~~Strikeout~~\n```",
    "4-1": "```\n~Strikeout~\n```",
    "4-2": "~~Strikeout~~",
    "5-0": "```\n`Inline code` with back-ticks\n```",
    "5-2": "`Inline code` with back-ticks",
    "6-0": "```\n> Blockquote\n```",
    "6-2": "> Blockquote",
    "7-0": "```\n* Item 1\n* Item 2\n* Item 3\n```",
    "7-1": "```\n- Item 1\n- Item 2\n- Item 3\n```",
    "7-2": "* Item 1\n* Item 2\n* Item 3",
    "8-0": "```\n1. Item 1\n2. Item 2\n3. Item 3\n```",
    "8-1": "```\n1) Item 1\n2) Item 2\n3) Item 3\n```",
    "8-2": "1. Item 1\n1. Item 2\n1. Item 3",
    "9-0": "Horizontal Rule\n```\n---\n```",
    "9-1": "Horizontal Rule\n```\n***\n```",
    "9-2": "Horizontal Rule\n\n---"
  },
  "cols": 3,
  "rows": 10
}
[/block]
# Simple Links
[block:code]
{
  "codes": [
    {
      "code": "[Link Example](https://cloudposse.com)",
      "language": "markdown"
    }
  ]
}
[/block]
[Link Example](https://cloudposse.com)

---

# Footnote Links
[block:code]
{
  "codes": [
    {
      "code": "[CloudPosse][1]\n[Google][2]\n\n...other content here...\n\n[1]: https://cloudposse.com\n[2]: https://google.com",
      "language": "markdown",
      "name": "Footnote Links"
    }
  ]
}
[/block]
[CloudPosse][1]
[Google][2]
[1]: https://cloudposse.com
[2]: https://google.com

---

# Standard Images
[block:code]
{
  "codes": [
    {
      "code": "![Image](https://files.readme.io/40ee68a-cloudposse-64x64.png)",
      "language": "markdown",
      "name": "Standard Image"
    }
  ]
}
[/block]
![Image](https://files.readme.io/40ee68a-cloudposse-64x64.png)

---

# Footnote Images
[block:code]
{
  "codes": [
    {
      "code": "![Image][1]\n...other content here...\n[1]: https://files.readme.io/40ee68a-cloudposse-64x64.png",
      "language": "markdown",
      "name": "Footnote Image Example"
    }
  ]
}
[/block]
![Image][1]
...other content here...
[1]: https://files.readme.io/40ee68a-cloudposse-64x64.png

---

# Code Block

[block:code]
{
  "codes": [
    {
      "code": "```\n$i = 0;\n$i++;\n```",
      "language": "markdown",
      "name": "Code Block"
    }
  ]
}
[/block]
```
$i = 0;
$i++;
```

# Tables

* Colons can be used to align columns.
* There must be at least 3 dashes separating each header cell.
* The outer pipes (|) are optional. 
* Columns do not need to be neatly formatted. 
* Supports inline Markdown.
[block:code]
{
  "codes": [
    {
      "code": "\n\n| Animals       | Fruits        | Coins    |\n| ------------- |:-------------:| --------:|\n| Cats          | Apples        | Nickle   |\n| Dogs          | Oranges       | Quarter  |\n| Zebras        | Oranges       | Dime     |\n\n",
      "language": "text"
    }
  ]
}
[/block]
| Animals       | Fruits        | Coins    |
| ------------- |:-------------:| --------:|
| Cats          | Apples        | Nickle   |
| Dogs          | Oranges       | Quarter  |
| Zebras        | Oranges       | Dime     |

# References
* https://guides.github.com/features/mastering-markdown/
* https://help.github.com/articles/basic-writing-and-formatting-syntax/
* https://daringfireball.net/projects/markdown/