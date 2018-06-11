---
title: "Executable Documentation"
description: "Executable Documentation is documentation that is so actionable you can just execute it directly or run it manually if you so choose."
terms:
- executable documentation
---

We treat `Makefiles` as executable documentation. That is, for every target we add a meaningful annotations (e.g. `## Build docker container`). The end-user can then choose to run the target (e.g. `make build`) or run the command described in the target (e.g. `docker build -t example/image .`).
