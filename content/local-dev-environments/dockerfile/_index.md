---
title: "Dockerfile"
description: ""
---
A `Dockerfile` provides a lightweight Domain Specific Langauge (“DSL”) for installing and configuring a Linux OS. It's a simple way of documenting-as-code the necessary steps to set up software with all dependencies. 

## Infrastructure as Code


## Easy to Learn

If you've even written a shell script, then you'll learn how to write a `Dockerfile` in less than an hour. This avoids the need to learn a more complex configuration management language such as Ansible, Chef or Puppet.

If you are not comfortable writing shell scripts, then this is a great time to learn since this is not going away and is an essential skill of DevOps.

# Reproducible  

* Ensure that you can build an OS capable of running your software everytime
* If you can build it, then I or anyone else on the team can build it; no more of this “works on my machine” scapegoating
   
# Linux Distribution Agnostic
* You can use any Linux distribution (e.g. Debian, Ubuntu, Centos, Alpine, BusyBox, etc) or none at all
* Legacy applications don't need to be ported to newer distributions
* Every app gets to pick the best distribution & version

# Lives alongside the application code
* When application requirements change, the developer can ensure those are captured; no more “we forgot to upgrade `libssl` in production, so that's why the application crashed”
* CI/CD compatibility
