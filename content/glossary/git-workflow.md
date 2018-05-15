---
title: "Git Workflow"
description: "A form of Change Control that uses Git as the system of record."
terms:
- GitHub Workflow
- Git Workflow
tags:
- software development
- sdlc
---
In the Git Workflow, the `master` branch is often treated as the pristine copy of the code base and considered always safe to deploy to production. Everytime a change is needed, a developer will open up a new branch against `master` and push their changes up to the `origin`. When the developer is ready to merge their changes, they open up a Pull Request and request one of their peers to perform a Code Review. Once the Pull Request is approved, it may be merged into master. 
