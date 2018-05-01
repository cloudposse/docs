---
title: "Docker Tips & Tricks"
excerpt: ""
---
Here's a collection of some nice little hacks for docker. A lot of them are related to house keeping. 

# Docker Stats

Produce console stats for all running containers (e.g. like `top`):
```
docker stats $(docker ps --format='{{.Names}}'
```

# Remove all stopped containers
```
docker rm $(docker ps -a -q)
```

# Remove all untagged images
```
docker images -q --filter "dangling=true" | xargs docker rmi
```

# Prune everything

The docker system prune command is a shortcut that prunes images, containers, and networks. 

##### :information_source: NOTE
> * In Docker `17.06.0` and earlier, volumes are also pruned. 
 >* In Docker `17.06.1` and higher, you must specify the `--volumes` flag for docker system prune to prune volumes.


```
$ docker system prune

WARNING! This will remove:
        - all stopped containers
        - all networks not used by at least one container
        - all dangling images
        - all build cache
Are you sure you want to continue? [y/N] y
```

If you are on Docker `17.06.1` or higher and want to also prune volumes, add the `--volumes` flag:

```
$ docker system prune --volumes

WARNING! This will remove:
        - all stopped containers
        - all networks not used by at least one container
        - all volumes not used by at least one container
        - all dangling images
        - all build cache
Are you sure you want to continue? [y/N] y
```

By default, you are prompted to continue which can be bypassed by adding the `-f` or `--force` flag.