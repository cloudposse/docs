---
title: "The curl-bash pattern"
description: "This is a common approach to installing various tools via a terminal prompt. You see this commonly done like so: `curl example.com/install.sh | bash`"
terms:
- curl-bash
tags:
- curl-bash
- curl
- bash
- pattern
---
The curl-bash pattern is an approach to installing software on your local machine via your terminal. It utilizes `curl` to download a script which is then piped (i.e. `|` ) into `bash`. This enables the script to execute code on your machine which then does whatever setup or installation steps it needs to do to install the target software. Example:

```
curl -sSL https://get.rvm.io | bash
```