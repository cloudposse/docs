---
title: "Editor Config"
excerpt: ""
---
# Background

The EditorConfig enables developers to define and maintain consistent coding styles between different editors and IDEs. It consists of a simple file format (`.editorconfig`) for defining coding styles such as tabs vs spaces. Most text editors support the format and adhere to defined styles. The config files are easily readable and they work nicely with version control systems.

# Example

Place this file in the root of your git repository.
[block:code]
{
  "codes": [
    {
      "code": "# top-most EditorConfig file\nroot = true\n\n# Unix-style newlines with a newline ending every file\n[*]\nend_of_line = lf\ninsert_final_newline = true\n\n# Matches multiple files with brace expansion notation\n# Set default charset\n[*.{js,py}]\ncharset = utf-8\n\n# 4 space indentation\n[*.py]\nindent_style = space\nindent_size = 4\n\n# Override for Makefile\n[{Makefile, makefile, GNUmakefile}]\nindent_style = tab\nindent_size = 4\n\n[Makefile.*]\nindent_style = tab\nindent_size = 4\n\n\n# Indentation override for all JS under lib directory\n[lib/**.js]\nindent_style = space\nindent_size = 2\n\n# Matches the exact files either package.json or .travis.yml\n[{package.json,.travis.yml}]\nindent_style = space\nindent_size = 2\n\n[shell]\nindent_style = tab\nindent_size = 4\n\n[*.sh]\nindent_style = tab\nindent_size = 4",
      "language": "text",
      "name": ".editorconfig"
    }
  ]
}
[/block]
# Editor Plugins

Find all plugins here: http://editorconfig.org/#download

* [Vim](https://github.com/editorconfig/editorconfig-vim#readme)
* [Visual Studio](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)

# References
* http://editorconfig.org/