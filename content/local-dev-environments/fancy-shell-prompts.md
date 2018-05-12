---
title: "Fancy Shell Prompts"
description: "Fancy shell prompts are not just pretty, they're also incredibly practical. With the powerline prompt, you'll always know what `branch` your working on, if there are any uncommitted changes and the exit code of the last command."
---

# Powerline Shell (bash)


This is how to get a fancy shell prompt like the one below for the `bash` shell.
{{< img src="/assets/500c4b8-Screen_Shot_2018-04-02_at_7.54.13_PM.png" title="Example of Powerline Shell Prompt" >}}

## Install powerline

We'll use the [powerline](https://github.com/milkbikis/powerline-shell) port for `bash`.

##### install-powerline.sh
```shell
git clone git@github.com:milkbikis/powerline-shell.git powerline-shell
cd powerline-shell/
./install.py
```

## Configure Bashrc

Add the following to your `~/.bashrc` file. Somewhere near the bottom will be perfect.

##### ~/.bashrc
```shell
function _update_ps1() {
  PS1="$(~/powerline-shell/powerline-shell.py  --cwd-mode fancy --shell bash $? 2> /dev/null)"
}

if [ "$TERM" != "linux" ]; then
  PROMPT_COMMAND="_update_ps1; $PROMPT_COMMAND"
fi
```

## Install iTerm2

Go here: https://www.iterm2.com/downloads.html

Download & Install

## Install font package

##### install-fonts.sh
```shell
git clone git@github.com:powerline/fonts.git powerline-fonts
cd powerline-fonts/
./install.sh
```
