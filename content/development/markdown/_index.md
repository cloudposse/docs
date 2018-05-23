---
title: Markdown
description: "Markdown is a simple way to format plain text that looks great on any device without using any HTML or CSS. It doesn't permit anything fancy like changing fonts, color, or typeface -- just the bare essentials that can be expressed using keyboard symbols you already know."
---

![Markdown Logo](/assets/5a735a9-markdown.png) 

# Standard Formatting

| Preferred Syntax              | Alternative Syntax       | Example                       |
|:------------------------------|:-------------------------|:------------------------------|
| `*Italic*`                    | `_Italic_`               | *Italic*                      |
| `**Bold**`                    | `__Bold__`               | **Bold**                      |
| `# Heading 1`                 | `Heading 1<br>=========` | # Heading 1                   |
| `## Heading 2`                | `Heading 1<br>---------` | ## Heading 2                  |
| `~~Strikeout~~`               | `~Strikeout~`            | `~~Strikeout~~`               |
| `Inline code` with back-ticks |                          | `Inline code` with back-ticks |
| `> Blockquote`                |                          | > Blockquote                  |
| `---`                         | `***`                    | ---                           |


# Bulleted Lists

## Preferred Syntax
```
* Item 1
* Item 2
* Item 3
```

## Alternative Syntax
```
- Item 1
- Item 2
- Item 3
```

## Example

* Item 1
* Item 2
* Item 3

# Numbered lists

## Preferred Syntax
```
1. Item 1
2. Item 2
3. Item 3
```

## Alternative Syntax
```
1) Item 1
2) Item 2
3) Item 3
```

## Example

1. Item 1
2. Item 2
3. Item 3

# Simple Links

#####
```markdown
[Link Example](https://cloudposse.com)
```

[Link Example](https://cloudposse.com)

--------------------------------------------------------------------------------

# Footnote Links

## Footnote Links

```markdown
[Cloud Posse][1]
[Google][2]

...other content here...

[1]: https://cloudposse.com
[2]: https://google.com
```

[Cloud Posse][1] [Google][2]

--------------------------------------------------------------------------------

# Standard Images

## Standard Image

```markdown
![Image](/assets/40ee68a-cloudposse-64x64.png)
```

![Image][1]

--------------------------------------------------------------------------------

# Footnote Images

## Footnote Image Example

```markdown
![Image][1]
...other content here...
[1]: /assets/40ee68a-cloudposse-64x64.png
```

![Image][1] ...other content here...

--------------------------------------------------------------------------------

# Code Block

## Code Block Examples

~~~~
```
$i = 0;
$i++;
```
~~~~

```
$i = 0;
$i++;
```

# Tables

- Colons can be used to align columns.
- There must be at least 3 dashes separating each header cell.
- The outer pipes (|) are optional.
- Columns do not need to be neatly formatted.
- Supports inline Markdown.

## Table Examples

```markdown
| Animals | Fruits  |   Coins |
|:--------|:-------:|--------:|
| Cats    | Apples  |  Nickle |
| Dogs    | Oranges | Quarter |
| Zebras  | Oranges |    Dime |
`
```

| Animals | Fruits  |   Coins |
|:--------|:-------:|--------:|
| Cats    | Apples  |  Nickle |
| Dogs    | Oranges | Quarter |
| Zebras  | Oranges |    Dime |

# References

- <https://guides.github.com/features/mastering-markdown/>
- <https://help.github.com/articles/basic-writing-and-formatting-syntax/>
- <https://daringfireball.net/projects/markdown/>

[1]: /assets/40ee68a-cloudposse-64x64.png
[2]: https://google.com
