---
title: "Tmate"
description: "Tmate is a way to share a console window or set of console windows. It’s basically a fork of `tmux` that makes sessions network enabled. It doesn’t matter where the participants are located - inbound firewall rules don’t interfere since it’s all outbound connections."
---
# Peer Console Development (tmate)

{{< img src="https://cloudposse.com/wp-content/uploads/sites/29/2018/01/tmate-linuxdescomplicado.gif" title="Screencast" >}}

## Install tmate

```
brew tap nviennot/tmate
brew install tmate
```

## Start the SSH Server

```
tmate -S /tmp/tmate.sock new-session -d
```

## Wait for a connection

```
tmate -S /tmp/tmate.sock wait tmate-ready
```

## Get the SSH Command
```
tmate -S /tmp/tmate.sock display -p '#{tmate_ssh}'
```

Share the output of the above command with someone you want to share the terminal window with. You should both run the command. The person who runs the SSH Server is the host of the session.

```
# Example session: (now expired)
ssh q9YsisZyUNtI3rvJcDbG1pAHu@sf1.tmate.io
```

## Interacting with Tmate

`^b + c` create a new window
`^b + n` move to next window
`^b + p` move to previous window
