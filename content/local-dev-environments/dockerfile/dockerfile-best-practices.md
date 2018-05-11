---
title: "Dockerfile Best Practices"
description: ""
---
## Use .dockerignore

Using a `.dockerignore` file will rapidly speed up builds by reducing the amount of data copied to the docker VM. 

Example:

##### .dockerignore
```text
**/.terraform
.git
```
