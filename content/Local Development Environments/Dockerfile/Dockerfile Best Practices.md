---
title: "Dockerfile Best Practices"
excerpt: ""
---
## Use .dockerignore

Using a `.dockerignore` file will rapidly speed up builds by reducing the amount of data copied to the docker VM. 

Example:
[block:code]
{
  "codes": [
    {
      "code": "**/.terraform\n.git",
      "language": "text",
      "name": ".dockerignore"
    }
  ]
}
[/block]