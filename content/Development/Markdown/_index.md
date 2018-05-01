---
title: "Markdown"
excerpt: ""
---
![](/images/5a735a9-markdown.png)
Markdown is a simple way to format plain text that looks great on any device without using any HTML or CSS. It doesn’t permit do anything fancy like changing fonts, color, or typeface — just the bare essentials by using keyboard symbols you already know.

# Standard Formatting

|Preferred Syntax|Alternative Syntax|Example|
|------|------|------|
|```*Italic*
```|```_Italic_
```|*Italic*|
|Horizontal Rule```
---
```|Horizontal Rule```
***
```|Horizontal Rule
---|
|```**Bold**
```|```__Bold__
```|**Bold**|
|```# Heading 1
```|```Heading 1
=========
```|# Heading 1|
|```## Heading 2
```|```Heading 2
---------
```|## Heading 2|
|```~~Strikeout~~
```|```~Strikeout~
```|~~Strikeout~~|
|````Inline code` with back-ticks
```|`Inline code` with back-ticks|
|```> Blockquote
```|> Blockquote|
|```* Item 1
* Item 2
* Item 3
```|```- Item 1
- Item 2
- Item 3
```|* Item 1* Item 2
* Item 3|
|```1. Item 1
2. Item 2
3. Item 3
```|```1) Item 1
2) Item 2
3) Item 3
```|1. Item 11. Item 2
1. Item 3|

# Simple Links

##### 
```markdown
[Link Example](https://cloudposse.com)
```

[Link Example](https://cloudposse.com)

---

# Footnote Links

##### Footnote Links
```markdown
[CloudPosse][1]
[Google][2]

...other content here...

[1]: https://cloudposse.com
[2]: https://google.com
```

[CloudPosse][1]
[Google][2]
[1]: https://cloudposse.com
[2]: https://google.com

---

# Standard Images

##### Standard Image
```markdown
![Image](https://files.readme.io/40ee68a-cloudposse-64x64.png)
```

![Image](https://files.readme.io/40ee68a-cloudposse-64x64.png)

---

# Footnote Images

##### Footnote Image Example
```markdown
![Image][1]
...other content here...
[1]: https://files.readme.io/40ee68a-cloudposse-64x64.png
```

![Image][1]
...other content here...
[1]: https://files.readme.io/40ee68a-cloudposse-64x64.png

---

# Code Block


##### Code Block
```markdown
```
$i = 0;
$i++;
```
```

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

##### 
```text


| Animals       | Fruits        | Coins    |
| ------------- |:-------------:| --------:|
| Cats          | Apples        | Nickle   |
| Dogs          | Oranges       | Quarter  |
| Zebras        | Oranges       | Dime     |


```

| Animals       | Fruits        | Coins    |
| ------------- |:-------------:| --------:|
| Cats          | Apples        | Nickle   |
| Dogs          | Oranges       | Quarter  |
| Zebras        | Oranges       | Dime     |

# References
* https://guides.github.com/features/mastering-markdown/
* https://help.github.com/articles/basic-writing-and-formatting-syntax/
* https://daringfireball.net/projects/markdown/