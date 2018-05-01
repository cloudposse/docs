---
title: "Fancy Shell Prompts"
excerpt: ""
---
Fancy shell prompts are not just pretty, they're also incredibly practical. With the powerline prompt, you'll always know what `branch` your working on, if there are any uncommitted changes and the exit code of the last command.

# Powerline Shell (bash)


This is how to get a fancy shell prompt like the one below for the `bash` shell. 
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/500c4b8-Screen_Shot_2018-04-02_at_7.54.13_PM.png",
        "Screen Shot 2018-04-02 at 7.54.13 PM.png",
        578,
        200,
        "#4f4b4b"
      ]
    }
  ]
}
[/block]

## Install powerline

We'll use the [powerline](https://github.com/milkbikis/powerline-shell) port for `bash`.
[block:code]
{
  "codes": [
    {
      "code": "git clone git@github.com:milkbikis/powerline-shell.git powerline-shell \ncd powerline-shell/\n./install.py",
      "language": "shell",
      "name": "install-powerline.sh"
    }
  ]
}
[/block]
## Configure Bashrc

Add the following to your `~/.bashrc` file. Somewhere near the bottom will be perfect.
[block:code]
{
  "codes": [
    {
      "code": "function _update_ps1() {\n  PS1=\"$(~/powerline-shell/powerline-shell.py  --cwd-mode fancy --shell bash $? 2> /dev/null)\"\n}\n\nif [ \"$TERM\" != \"linux\" ]; then\n  PROMPT_COMMAND=\"_update_ps1; $PROMPT_COMMAND\"\nfi",
      "language": "shell",
      "name": "~/.bashrc"
    }
  ]
}
[/block]
## Install iTerm2

Go here: https://www.iterm2.com/downloads.html

Download & Install

## Install font package
[block:code]
{
  "codes": [
    {
      "code": "git clone git@github.com:powerline/fonts.git powerline-fonts\ncd powerline-fonts/\n./install.sh",
      "language": "shell",
      "name": "install-fonts.sh"
    }
  ]
}
[/block]