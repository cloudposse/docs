---
title: "xcrun: error: invalid active developer path"
description: "Reinstall xcode developer tools"
tags:
- osx
- darwin
- git
- faq
---

# Question

When using `git`, I get the following error on OSX:

```
xcrun: error: invalid active developer path (/Library/Developer/CommandLineTools), missing xcrun at: /Library/Developer/CommandLineTools
```

# Answer

This usually happens when upgrading to a new OSX release or on a new workstation.

Try running the following command:

```
xcode-select --install
```

See: <https://stackoverflow.com/questions/32893412/command-line-tools-not-working-os-x-el-capitan-macos-sierra>



