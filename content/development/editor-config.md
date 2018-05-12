---
title: Editor Config
description: "The EditorConfig enables developers to define and maintain consistent coding styles between different editors and IDEs. It consists of a simple file format (`.editorconfig`) for defining coding styles such as tabs vs spaces. Most text editors support the format and adhere to defined styles. The config files are easily readable and they work nicely with version control systems."
tags:
  - code style
  - formatting
  - .editorconfig
---

# Background

The EditorConfig enables developers to define and maintain consistent coding styles between different editors and IDEs. It consists of a simple file format (`.editorconfig`) for defining coding styles such as tabs vs spaces. Most text editors support the format and adhere to defined styles. The config files are easily readable and they work nicely with version control systems.

# Example

Place this file in the root of your git repository.

## .editorconfig

```ini
# top-most EditorConfig file
root = true

# Unix-style newlines with a newline ending every file
[*]
end_of_line = lf
insert_final_newline = true

# Matches multiple files with brace expansion notation
# Set default charset
[*.{js,py}]
charset = utf-8

# 4 space indentation
[*.py]
indent_style = space
indent_size = 4

# Override for Makefile
[{Makefile, makefile, GNUmakefile}]
indent_style = tab
indent_size = 4

[Makefile.*]
indent_style = tab
indent_size = 4


# Indentation override for all JS under lib directory
[lib/**.js]
indent_style = space
indent_size = 2

# Matches the exact files either package.json or .travis.yml
[{package.json,.travis.yml}]
indent_style = space
indent_size = 2

[shell]
indent_style = tab
indent_size = 4

[*.sh]
indent_style = tab
indent_size = 4
```

# Editor Plugins

Find all plugins here: <http://editorconfig.org/#download>

- [Vim](https://github.com/editorconfig/editorconfig-vim#readme)
- [Visual Studio](https://marketplace.visualstudio.com/items?itemName=EditorConfigTeam.EditorConfig)

# References

- <http://editorconfig.org/>
