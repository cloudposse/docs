---
title: "Geodesic Module"
excerpt: ""
---
Geodesic was written to be easily extended by leveraging Docker inheritance. 
We call such docker container - <<glossary:Module>>. 
<<glossary:Module>>  let you add or modify any core functionality, configure geodesic variables and easily upgrade between releases.

You can easily extend the Geodesic shell by creating your own Git repo with a `Dockerfile`. Simply have your `Dockerfile` inherit `FROM geodesic:latest` (or we recommend to pin it to a [release](https://github.com/cloudposse/geodesic/releases) for stability). 

Inside your docker image, you can replace any of our code with your own to make it behave exactly as you wish. We recommend creating one dedicated repo per cluster with configurations tailored specifically for that cluster.