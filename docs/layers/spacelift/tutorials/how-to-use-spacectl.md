---
title: "Spacectl"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1261601332/How+to+use+Spacectl
sidebar_position: 100
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/how-to-guides/integrations/spacelift/how-to-use-spacectl.md
---

# How to use Spacectl

## Problem
You have many stacks that you need to manipulate in some way that the Spacelift Web UI doesn’t support or makes very cumbersome to do one by one. For example, maybe the stacks are pointing to the wrong `HEAD` commit.

You need to get some data out of Spacelift for reporting purposes.

## Solution

:::tip
Use `spaceftl` to automate certain mundane tasks in Spacelift and/or get an overview of Spacelift.

:::

Long explanation for how to solve the problem.

See docs [https://github.com/spaceone-dev/spacectl](https://github.com/spaceone-dev/spacectl)

### Install

```
⨠ apt install -y spacectl -qq
```

### Setup a profile

```
⨠ spacectl profile login acme
Enter Spacelift endpoint (eg. https://unicorn.app.spacelift.io/): https://acme.app.spacelift.io
Select credentials type: 1 for API key, 2 for GitHub access token: 1
Enter API key ID: 01FKN...
Enter API key secret:
```

### Listing stacks

```
spacectl stack list
```

Grab all the stack ids (use the JSON output to avoid bad chars)

```
spacectl stack list --output json | jq -r '.[].id' > stacks.txt
```

### Setting stacks to a specific commit

If the latest commit for each stack is desired, run something like this.

NOTE: remove the `echo` to remove the dry-run functionality

```
cat stacks.txt | while read stack; do
  echo $stack && echo spacectl stack set-current-commit --sha snip --id $stack;
done
```

