---
title: "Makefile Best Practices"
description: ""
---
# Avoid using Evals

The use of `$(eval ...)` leads to very confusing execution paths, due to the way `make` evaluates a target. When `make` executes a target, it preprocesses all `$(....)` interpolations and renders the template. After that, it executes, line-by-line each command in the target.

# Namespace targets
Over time, the number of targets in a `Makefile` will grow. We recommend namespacing all targets.

For example:
```
docker/build:
    docker build -t example/test .
```

# Use `/` as a target namespace delimiter

When naming target names, we recommend using `/` as the delimiter rather than `:` or `-`. Further more, we recommend sticking all targets within a namespace into a separate file. E.g. `Makefile.docker` for all targets that begin with `docker/`.

For example, stick this in `Makefile.docker`
```
docker/build:
    docker build -t example/test .
```


# Avoid using `:` in target names

While it's possible to use `:` as the delimiter in target names, there is a big gotcha: it breaks target dependencies.

For example:
```
docker\:deps:
    docker pull example/base-image

docker\:build: docker:deps
    docker build -t example/test
```

In this example, `make` will silently ignore calling the target dependency of `docker:deps`. Escaping the target dependency (e.g. `docker\:deps`) has no effect.

# Use `include`

Avoid sticking every target in the same `Makefile` for the same reason we don't stick all code in the same source file. We typically recommend adding something like this to the top of our `Makefile`:

```
-include tasks/Makefile.*
```


{{% dialog type="info" icon="fa fa-info-circle" title="Note" %}}
> The leading `-` tells `make` not to error if the `tasks/` folder is empty.
{{% /dialog %}}

# Define sane defaults for environment variables

No one likes to pass 20 arguments to `make`. Set sane defaults for all variables using the `?=` operator.

For example:
```
DOCKER_TAG ?= latest
```

#  Pass Environment Variables like Function Arguments

The nice thing about `make` is it will automatically export all arguments in `key=value` notation as environment variables. This let's us call `make` targets like functions.

e.g.
```
make docker/build DOCKER_TAG=dev
```

# Write small targets

Make is an excellent language for gluing together various tools in your toolchain. It's an easy trap to stick an entire `bash` script inside of a target. From experience, these targets become error prone and difficult to maintain for anyone but a seasoned `make` programmer.

Instead, stick complex logic inside of shell scripts and call those shell scripts from a target.

# Use target dependencies

A target can have dependencies called automatically prior to executing the target. If anyone of the dependencies fails, the execution aborts and the target will not be called.

For example:
```
deps:
    @which docker

build: deps
    @docker build -t example/test .
```

# Use standard target names in root `Makefile`

The entry-level `Makefile` should define these standard targets across all projects. This makes it very easy for anyone to get started who is familiar with `make`.

* `deps`
* `build`
* `install`
* `default`
* `all`

# Document targets

# Define `help` target
